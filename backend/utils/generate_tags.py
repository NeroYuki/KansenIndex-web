import os
import sys
from pathlib import Path
from PIL import Image
import torch
import timm
import pandas as pd
import numpy as np
import argparse
from tqdm import tqdm
from dataclasses import dataclass
from typing import Optional
from huggingface_hub import hf_hub_download
from huggingface_hub.utils import HfHubHTTPError
from timm.data import create_transform, resolve_data_config
from torch import Tensor
from torch.nn import functional as F

@dataclass
class LabelData:
    names: list[str]
    rating: list[np.int64]
    general: list[np.int64]
    character: list[np.int64]


def pil_ensure_rgb(image: Image.Image) -> Image.Image:
    """Convert to RGB/RGBA if not already, then convert RGBA to RGB with white background."""
    if image.mode not in ["RGB", "RGBA"]:
        image = image.convert("RGBA") if "transparency" in image.info else image.convert("RGB")
    if image.mode == "RGBA":
        canvas = Image.new("RGBA", image.size, (255, 255, 255))
        canvas.alpha_composite(image)
        image = canvas.convert("RGB")
    return image


def pil_pad_square(image: Image.Image) -> Image.Image:
    """Pad image to square with white background."""
    w, h = image.size
    px = max(image.size)
    canvas = Image.new("RGB", (px, px), (255, 255, 255))
    canvas.paste(image, ((px - w) // 2, (px - h) // 2))
    return canvas


def load_labels_hf(repo_id: str, revision: Optional[str] = None, token: Optional[str] = None) -> LabelData:
    """Load labels from HuggingFace repository."""
    try:
        csv_path = hf_hub_download(
            repo_id=repo_id, filename="selected_tags.csv", revision=revision, token=token
        )
        csv_path = Path(csv_path).resolve()
    except HfHubHTTPError as e:
        raise FileNotFoundError(f"selected_tags.csv failed to download from {repo_id}") from e

    df: pd.DataFrame = pd.read_csv(csv_path, usecols=["name", "category"])
    tag_data = LabelData(
        names=df["name"].tolist(),
        rating=list(np.where(df["category"] == 9)[0]),
        general=list(np.where(df["category"] == 0)[0]),
        character=list(np.where(df["category"] == 4)[0]),
    )

    return tag_data


class ImageTagger:
    def __init__(self, model_name="SmilingWolf/wd-eva02-large-tagger-v3", threshold=0.35):
        """
        Initialize the image tagger with the specified model.
        
        Args:
            model_name (str): HuggingFace model name
            threshold (float): Confidence threshold for tags
        """
        self.model_name = model_name
        self.threshold = threshold
        self.transform = None
        self.model = None
        self.labels = None
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        
        print(f"Using device: {self.device}")
        self.load_model()
    
    def load_model(self):
        """Load the model using timm and create transforms."""
        try:
            print(f"Loading model: {self.model_name}")
            # Load model using timm
            self.model = timm.create_model("hf-hub:" + self.model_name, pretrained=True)
            self.model.eval()
            
            # Load state dict from HuggingFace
            state_dict = timm.models.load_state_dict_from_hf(self.model_name)
            self.model.load_state_dict(state_dict)
            self.model = self.model.to(self.device)
            
            # Load labels
            print("Loading tag list...")
            self.labels = load_labels_hf(repo_id=self.model_name)
            
            # Create transform using timm
            print("Creating data transform...")
            self.transform = create_transform(**resolve_data_config(self.model.pretrained_cfg, model=self.model))
            
            print("Model loaded successfully!")
        except Exception as e:
            print(f"Error loading model: {e}")
            sys.exit(1)
    
    def predict_tags(self, image_path):
        """
        Predict tags for a single image using the WD v3 model.
        
        Args:
            image_path (str): Path to the image file
            
        Returns:
            list: List of predicted tags with confidence scores
        """
        try:
            # Load and preprocess the image using WD v3 method
            img_input: Image.Image = Image.open(image_path)
            img_input = pil_ensure_rgb(img_input)
            img_input = pil_pad_square(img_input)
            img_input = img_input.convert("RGB")
            
            # Apply transform and add batch dimension
            inputs: Tensor = self.transform(img_input).unsqueeze(0)
            # Channel swap for WD models (BGR to RGB)
            inputs = inputs[:, [2, 1, 0]]
            
            # Make prediction
            with torch.inference_mode():
                inputs = inputs.to(self.device)
                outputs = self.model(inputs)
                outputs = F.sigmoid(outputs)
                probs = outputs.cpu().squeeze(0)
            
            # Get tags using WD v3 method
            return self.get_tags(probs, self.threshold)
            
        except Exception as e:
            print(f"Error processing image {image_path}: {e}")
            return []
    
    def get_tags(self, probs: Tensor, gen_threshold: float, char_threshold: float = 0.75):
        """Extract tags from model predictions."""
        # Convert indices+probs to labels
        probs_list = list(zip(self.labels.names, probs.numpy()))

        # General labels, pick any where prediction confidence > threshold
        gen_labels = [probs_list[i] for i in self.labels.general]
        gen_labels = [x for x in gen_labels if x[1] > gen_threshold]
        gen_labels = sorted(gen_labels, key=lambda x: x[1], reverse=True)

        # Character labels, pick any where prediction confidence > char_threshold
        char_labels = [probs_list[i] for i in self.labels.character]
        char_labels = [x for x in char_labels if x[1] > char_threshold]
        char_labels = sorted(char_labels, key=lambda x: x[1], reverse=True)

        # Combine general and character labels
        combined_tags = gen_labels + char_labels
        
        return combined_tags
    
    def format_tags(self, tags_with_scores, include_scores=False, remove_underscores=True):
        """
        Format tags for output.
        
        Args:
            tags_with_scores (list): List of tuples (tag, score)
            include_scores (bool): Whether to include confidence scores
            remove_underscores (bool): Whether to remove underscores from tag names
            
        Returns:
            str: Formatted tags string
        """
        if include_scores:
            formatted_tags = []
            for tag, score in tags_with_scores:
                clean_tag = tag.replace('_', ' ') if remove_underscores else tag
                formatted_tags.append(f"{clean_tag}: {score:.3f}")
            return "\n".join(formatted_tags)
        else:
            formatted_tags = []
            for tag, score in tags_with_scores:
                clean_tag = tag.replace('_', ' ') if remove_underscores else tag
                formatted_tags.append(clean_tag)
            return ", ".join(formatted_tags)

def get_image_files(directory):
    """
    Get all image files from game directories (one level deep only).
    Structure: data/assets/shipgirls/<game_name>/*.{image_ext}
    
    Args:
        directory (str): Directory path to scan (should be shipgirls folder)
        
    Returns:
        list: List of image file paths from game directories only
    """
    image_extensions = {'.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.tiff', '.tif'}
    image_files = []
    
    print(f"Scanning shipgirls directory: {directory}")
    
    # Only scan one level deep (game directories)
    try:
        for item in os.listdir(directory):
            item_path = os.path.join(directory, item)
            
            # Only process directories (game folders)
            if os.path.isdir(item_path):
                print(f"  Scanning game directory: {item}")
                
                # Scan files in this game directory only (no deeper recursion)
                for file in os.listdir(item_path):
                    file_path = os.path.join(item_path, file)
                    
                    # Only process files (not subdirectories)
                    if os.path.isfile(file_path):
                        file_ext = Path(file).suffix.lower()
                        
                        if file_ext in image_extensions:
                            image_files.append(file_path)
                            # Show first few files found for verification
                            if len(image_files) <= 10:
                                rel_file_path = os.path.relpath(file_path, directory)
                                print(f"    Found image: {rel_file_path}")
    except OSError as e:
        print(f"Error accessing directory {directory}: {e}")
    
    return image_files

def create_output_path(input_path, source_dir, output_dir):
    """
    Create output file path by mirroring the input structure.
    
    Args:
        input_path (str): Original file path
        source_dir (str): Source directory
        output_dir (str): Output directory
        
    Returns:
        str: Output file path with .txt extension
    """
    # Get relative path from source directory
    rel_path = os.path.relpath(input_path, source_dir)
    
    # Change extension to .txt
    rel_path_no_ext = os.path.splitext(rel_path)[0]
    output_rel_path = f"{rel_path_no_ext}.txt"
    
    # Join with output directory
    output_path = os.path.join(output_dir, output_rel_path)
    
    return output_path

def ensure_directory_exists(file_path):
    """Ensure the directory for a file exists."""
    directory = os.path.dirname(file_path)
    if directory:
        os.makedirs(directory, exist_ok=True)

def main():
    parser = argparse.ArgumentParser(description="Generate tags for images using HuggingFace model")
    parser.add_argument("--source", "-s", default="../data/assets/shipgirls", 
                       help="Source directory containing images")
    parser.add_argument("--output", "-o", default="../data/assets/shipgirls_tag", 
                       help="Output directory for tag files")
    parser.add_argument("--threshold", "-t", type=float, default=0.35,
                       help="Confidence threshold for tags (default: 0.35)")
    parser.add_argument("--include-scores", action="store_true",
                       help="Include confidence scores in output files")
    parser.add_argument("--keep-underscores", action="store_true",
                       help="Keep underscores in tag names (default: remove underscores)")
    parser.add_argument("--model", "-m", default="SmilingWolf/wd-eva02-large-tagger-v3",
                       help="HuggingFace model name")
    parser.add_argument("--force", "-f", action="store_true",
                       help="Force re-processing of existing tag files")
    
    args = parser.parse_args()
    
    # Convert to absolute paths
    script_dir = os.path.dirname(os.path.abspath(__file__))
    source_dir = os.path.abspath(os.path.join(script_dir, args.source))
    output_dir = os.path.abspath(os.path.join(script_dir, args.output))
    
    print(f"Source directory: {source_dir}")
    print(f"Output directory: {output_dir}")
    print(f"Confidence threshold: {args.threshold}")
    print(f"Model: {args.model}")
    print(f"Remove underscores: {not args.keep_underscores}")
    print(f"Include scores: {args.include_scores}")
    
    # Check if source directory exists
    if not os.path.exists(source_dir):
        print(f"Error: Source directory '{source_dir}' does not exist!")
        sys.exit(1)
    
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Get all image files from game directories only
    print("Scanning for image files in game directories...")
    image_files = get_image_files(source_dir)
    
    if not image_files:
        print(f"No image files found in game directories within '{source_dir}'")
        return
    
    print(f"Found {len(image_files)} image files across game directories")
    
    # Initialize the tagger
    tagger = ImageTagger(model_name=args.model, threshold=args.threshold)
    
    # Process each image
    processed = 0
    skipped = 0
    errors = 0
    
    for image_path in tqdm(image_files, desc="Processing images"):
        try:
            # Create output path
            output_path = create_output_path(image_path, source_dir, output_dir)
            
            # Skip if output file exists and force is not specified
            if os.path.exists(output_path) and not args.force:
                skipped += 1
                continue
            
            # Ensure output directory exists
            ensure_directory_exists(output_path)
            
            # Generate tags
            tags_with_scores = tagger.predict_tags(image_path)
            
            if not tags_with_scores:
                print(f"\nNo tags found for: {image_path}")
                continue
            
            # Format tags
            remove_underscores = not args.keep_underscores
            formatted_tags = tagger.format_tags(tags_with_scores, args.include_scores, remove_underscores)
            
            # Save to file
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(formatted_tags)
            
            processed += 1
            
            # Print progress for first few files or if verbose
            if processed <= 5:
                print(f"\nProcessed: {os.path.basename(image_path)}")
                print(f"Tags: {tagger.format_tags(tags_with_scores[:5], False, remove_underscores)}")  # Show first 5 tags
                print(f"Saved to: {output_path}")
            
        except Exception as e:
            print(f"\nError processing {image_path}: {e}")
            errors += 1
    
    print(f"\n=== Summary ===")
    print(f"Total files: {len(image_files)}")
    print(f"Processed: {processed}")
    print(f"Skipped: {skipped}")
    print(f"Errors: {errors}")
    print(f"Output directory: {output_dir}")

if __name__ == "__main__":
    main()
