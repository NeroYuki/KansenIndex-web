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
from ultralytics import YOLO
import cv2

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


class BodyPartDetector:
    def __init__(self, models_folder="models", confidence_threshold=0.25):
        """
        Initialize the body part detector with multiple YOLO models.
        
        Args:
            models_folder (str): Path to folder containing YOLO model files (.pt)
            confidence_threshold (float): Confidence threshold for detections
        """
        self.models_folder = models_folder
        self.confidence_threshold = confidence_threshold
        self.models = []
        self.model_names = []
        
        print(f"Loading YOLO models from folder: {models_folder}")
        self.load_models()
    
    def load_models(self):
        """Load all YOLO models from the models folder."""
        try:
            if not os.path.exists(self.models_folder):
                print(f"Error: Models folder '{self.models_folder}' does not exist!")
                return
            
            # Find all .pt files in the models folder
            model_files = []
            for file in os.listdir(self.models_folder):
                if file.endswith('.pt'):
                    model_files.append(os.path.join(self.models_folder, file))
            
            if not model_files:
                print(f"No .pt model files found in '{self.models_folder}'")
                return
            
            print(f"Found {len(model_files)} model files")
            
            # Load each model
            for model_path in model_files:
                try:
                    model = YOLO(model_path)
                    self.models.append(model)
                    model_name = os.path.splitext(os.path.basename(model_path))[0]
                    self.model_names.append(model_name)
                    print(f"  ✓ Loaded: {model_name}")
                except Exception as e:
                    print(f"  ✗ Failed to load {model_path}: {e}")
            
            print(f"Successfully loaded {len(self.models)} YOLO models!")
            
        except Exception as e:
            print(f"Error loading YOLO models: {e}")
            print("Body part detection will be disabled.")
            self.models = []
    
    def detect_body_parts(self, image_path):
        """
        Detect body parts in an image using all loaded models.
        
        Args:
            image_path (str): Path to the image file
            
        Returns:
            list: List of detection dictionaries with class names, bounding boxes, and model info
        """
        if not self.models:
            return []
        
        try:
            # Load image once
            image = cv2.imread(image_path)
            if image is None:
                return []
            
            all_detections = []
            
            # Run inference with each model
            for model_idx, model in enumerate(self.models):
                model_name = self.model_names[model_idx]
                
                try:
                    # Run inference
                    results = model(image, conf=self.confidence_threshold, verbose=False)
                    
                    for result in results:
                        boxes = result.boxes
                        if boxes is not None:
                            for i in range(len(boxes)):
                                # Get bounding box coordinates
                                xyxy = boxes.xyxy[i].cpu().numpy()
                                conf = float(boxes.conf[i].cpu().numpy())
                                cls = int(boxes.cls[i].cpu().numpy())
                                
                                # Get class name
                                class_name = model.names[cls] if cls < len(model.names) else f"class_{cls}"
                                
                                # Format bounding box as [x1, y1, x2, y2]
                                bbox = [int(coord) for coord in xyxy]
                                
                                all_detections.append({
                                    'class': class_name,
                                    'confidence': conf,
                                    'bbox': bbox,
                                    'model': model_name
                                })
                
                except Exception as e:
                    print(f"Error running model {model_name} on {image_path}: {e}")
                    continue
            
            # Post-process detections
            filtered_detections = self.post_process_detections(all_detections)
            
            return filtered_detections
            
        except Exception as e:
            print(f"Error detecting body parts in {image_path}: {e}")
            return []
    
    def is_eye_outside_face(self, eye_bbox, face_bbox):
        """
        Check if an eye bounding box is completely outside a face bounding box.
        
        Args:
            eye_bbox (list): Eye bounding box [x1, y1, x2, y2]
            face_bbox (list): Face bounding box [x1, y1, x2, y2]
            
        Returns:
            bool: True if eye is completely outside face
        """
        ex1, ey1, ex2, ey2 = eye_bbox
        fx1, fy1, fx2, fy2 = face_bbox
        
        # Check if completely outside
        return (ex2 < fx1 or ex1 > fx2 or ey2 < fy1 or ey1 > fy2)
    
    def post_process_detections(self, detections):
        """
        Post-process detections: filter eyes based on faces and keep only highest confidence per class.
        
        Args:
            detections (list): Raw detection results
            
        Returns:
            list: Filtered and processed detections
        """
        if not detections:
            return []
        
        # Separate face and eye detections
        face_detections = [d for d in detections if 'face' in d['class'].lower()]
        eye_detections = [d for d in detections if 'eye' in d['class'].lower()]
        other_detections = [d for d in detections if 'face' not in d['class'].lower() and 'eye' not in d['class'].lower()]
        
        # Filter eyes based on faces
        valid_eye_detections = []
        if eye_detections and face_detections:
            # Only keep eyes if faces are detected
            for eye_det in eye_detections:
                # Check if this eye is inside any face
                is_valid = False
                for face_det in face_detections:
                    if not self.is_eye_outside_face(eye_det['bbox'], face_det['bbox']):
                        is_valid = True
                        break
                
                if is_valid:
                    valid_eye_detections.append(eye_det)
            
            # Keep only top 2 highest confidence eye detections
            if valid_eye_detections:
                valid_eye_detections.sort(key=lambda x: x['confidence'], reverse=True)
                valid_eye_detections = valid_eye_detections[:2]
        elif eye_detections and not face_detections:
            # If no faces detected, discard all eye detections
            valid_eye_detections = []
        
        # Combine all detections (excluding eyes since they are handled separately)
        all_valid_detections = face_detections + valid_eye_detections + other_detections
        
        # Group by class and keep only highest confidence per class (except for eyes which we already limited to 2)
        class_groups = {}
        for detection in all_valid_detections:
            class_name = detection['class']
            if class_name not in class_groups:
                class_groups[class_name] = []
            class_groups[class_name].append(detection)
        
        # Keep only highest confidence detection per class (except eyes)
        final_detections = []
        for class_name, class_detections in class_groups.items():
            if 'eye' in class_name.lower():
                # Eyes are already filtered to max 2, keep all valid ones
                final_detections.extend(class_detections)
            else:
                # For other classes, keep only the highest confidence
                best_detection = max(class_detections, key=lambda x: x['confidence'])
                final_detections.append(best_detection)
        
        # Sort final results by confidence (highest first)
        final_detections.sort(key=lambda x: x['confidence'], reverse=True)
        
        return final_detections
    
    def format_detections(self, detections, include_confidence=False, include_model=False):
        """
        Format detections for output - each detection on a new line.
        
        Args:
            detections (list): List of detection dictionaries
            include_confidence (bool): Whether to include confidence scores
            include_model (bool): Whether to include model names
            
        Returns:
            str: Formatted detection string with each detection on a new line
        """
        if not detections:
            return ""
        
        formatted_lines = []
        for detection in detections:
            bbox_str = f"[{','.join(map(str, detection['bbox']))}]"
            
            # Use the new format: @<detector>: <bounding box coord>
            line = f"@{detection['class']}: {bbox_str}"
            
            if include_confidence:
                line += f" ({detection['confidence']:.3f})"
            
            if include_model:
                line += f" [{detection['model']}]"
            
            formatted_lines.append(line)
        
        return '\n'.join(formatted_lines)


class ImageTagger:
    def __init__(self, model_name="SmilingWolf/wd-eva02-large-tagger-v3", threshold=0.35, enable_body_detection=True, models_folder="models"):
        """
        Initialize the image tagger with the specified model.
        
        Args:
            model_name (str): HuggingFace model name for tagging
            threshold (float): Confidence threshold for tags
            enable_body_detection (bool): Whether to enable body part detection
            models_folder (str): Path to folder containing YOLO model files
        """
        self.model_name = model_name
        self.threshold = threshold
        self.enable_body_detection = enable_body_detection
        self.transform = None
        self.model = None
        self.labels = None
        self.body_detector = None
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        
        print(f"Using device: {self.device}")
        self.load_model()
        
        # Initialize body part detector if enabled
        if self.enable_body_detection:
            self.body_detector = BodyPartDetector(models_folder=models_folder)
    
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
            tuple: (general_tags, rating_tag, body_detections) where general_tags is a list, rating_tag is a single tag or None, and body_detections is a list
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
            general_tags, rating_tag = self.get_tags(probs, self.threshold)
            
            # Detect body parts if enabled
            body_detections = []
            if self.enable_body_detection and self.body_detector:
                body_detections = self.body_detector.detect_body_parts(image_path)
            
            return general_tags, rating_tag, body_detections
            
        except Exception as e:
            print(f"Error processing image {image_path}: {e}")
            return [], None, []
    
    def get_tags(self, probs: Tensor, gen_threshold: float, rating_threshold: float = 0.35):
        """Extract tags from model predictions."""
        # Convert indices+probs to labels
        probs_list = list(zip(self.labels.names, probs.numpy()))

        # General labels, pick any where prediction confidence > threshold
        gen_labels = [probs_list[i] for i in self.labels.general]
        gen_labels = [x for x in gen_labels if x[1] > gen_threshold]
        gen_labels = sorted(gen_labels, key=lambda x: x[1], reverse=True)

        # Rating labels, pick the highest confidence one above threshold
        rating_labels = [probs_list[i] for i in self.labels.rating]
        rating_labels = [x for x in rating_labels if x[1] > rating_threshold]
        rating_labels = sorted(rating_labels, key=lambda x: x[1], reverse=True)
        
        # Only take the highest confidence rating tag
        best_rating = rating_labels[0] if rating_labels else None

        return gen_labels, best_rating
    
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
                       help="HuggingFace model name for tagging")
    parser.add_argument("--force", "-f", action="store_true",
                       help="Force re-processing of existing tag files")
    parser.add_argument("--disable-body-detection", action="store_true",
                       help="Disable body part detection")
    parser.add_argument("--models-folder", default="models",
                       help="Path to folder containing YOLO model files (.pt)")
    parser.add_argument("--body-confidence", type=float, default=0.25,
                       help="Confidence threshold for body part detection (default: 0.25)")
    parser.add_argument("--include-model-names", action="store_true",
                       help="Include model names in body part detection output")
    
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
    print(f"Body detection: {not args.disable_body_detection}")
    if not args.disable_body_detection:
        print(f"Models folder: {args.models_folder}")
        print(f"Body confidence: {args.body_confidence}")
        print(f"Include model names: {args.include_model_names}")
    
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
    enable_body_detection = not args.disable_body_detection
    tagger = ImageTagger(
        model_name=args.model, 
        threshold=args.threshold,
        enable_body_detection=enable_body_detection,
        models_folder=args.models_folder
    )
    
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
            general_tags, rating_tag, body_detections = tagger.predict_tags(image_path)
            
            if not general_tags and not rating_tag and not body_detections:
                print(f"\nNo tags or detections found for: {image_path}")
                continue
            
            # Format tags
            remove_underscores = not args.keep_underscores
            
            # Create output content
            output_lines = []
            
            # Add general tags
            if general_tags:
                formatted_general = tagger.format_tags(general_tags, args.include_scores, remove_underscores)
                output_lines.append(formatted_general)
            
            # Add rating tag on separate line
            if rating_tag:
                formatted_rating = tagger.format_tags([rating_tag], args.include_scores, remove_underscores)
                output_lines.append(formatted_rating)
            
            # Add body part detections on separate line
            if body_detections and tagger.body_detector:
                formatted_detections = tagger.body_detector.format_detections(
                    body_detections, 
                    include_confidence=args.include_scores,
                    include_model=args.include_model_names
                )
                if formatted_detections:
                    output_lines.append(formatted_detections)
            
            # Join with newlines
            formatted_output = '\n'.join(output_lines)
            
            # Save to file
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(formatted_output)
            
            processed += 1
            
            # Print progress for first few files or if verbose
            if processed <= 5:
                print(f"\nProcessed: {os.path.basename(image_path)}")
                if general_tags:
                    print(f"General tags: {tagger.format_tags(general_tags[:5], False, remove_underscores)}")  # Show first 5 tags
                if rating_tag:
                    print(f"Rating: {tagger.format_tags([rating_tag], False, remove_underscores)}")
                if body_detections:
                    print(f"Body parts detected: {len(body_detections)} from {len(tagger.body_detector.models)} models")
                    # Group by model for display
                    models_used = set(d['model'] for d in body_detections)
                    for model in sorted(models_used):
                        model_dets = [d for d in body_detections if d['model'] == model]
                        print(f"  {model}: {len(model_dets)} detections")
                        for detection in model_dets[:2]:  # Show first 2 per model
                            print(f"    {detection['class']}: {detection['bbox']} (conf: {detection['confidence']:.3f})")
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
