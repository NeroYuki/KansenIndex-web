import { Box, FormControl, Input, FormHelperText, FormLabel, Select, Button, useToast} from "@chakra-ui/react"
import { useRef, useState } from "react"
import { POST_submission } from "../../Service/shipgirl";

const MAX_FILE_SIZE = 100 * 1024 * 1024
const MAX_FILE_SIZE_LABEL = '100 MiB (about 100 MB)'
const MAX_FILE_SIZE_MESSAGE = `The selected file is too large. Maximum allowed size is ${MAX_FILE_SIZE_LABEL}.`
const ALLOWED_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'avif', 'tif', 'tiff']
const ALLOWED_IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif', 'image/tiff']
const ACCEPTED_IMAGE_TYPES = [
    ...ALLOWED_IMAGE_MIME_TYPES,
    ...ALLOWED_IMAGE_EXTENSIONS.map(extension => `.${extension}`)
].join(',')

function getFileExtension(filename) {
    const parts = (filename || '').split('.')
    return parts.length > 1 ? parts.pop().toLowerCase() : ''
}

function validateImageFile(file) {
    if (!file) return 'Please choose an illustration file.'
    if (file.size > MAX_FILE_SIZE) return MAX_FILE_SIZE_MESSAGE

    const mimeType = (file.type || '').split(';')[0].trim().toLowerCase()
    const extension = getFileExtension(file.name)
    const isAllowedExtension = ALLOWED_IMAGE_EXTENSIONS.includes(extension)
    const isAllowedMimeType = !mimeType || ALLOWED_IMAGE_MIME_TYPES.includes(mimeType)

    if (!isAllowedExtension || !isAllowedMimeType) {
        return 'Unsupported file type. Please upload a JPEG, PNG, GIF, WebP, AVIF, or TIFF image.'
    }

    return ''
}

function getErrorMessage(e) {
    if (typeof e === 'string' && e.trim()) return e
    if (e && typeof e.message === 'string' && e.message.trim()) return e.message
    return 'Submission failed. Please try again.'
}


function getData(form) {
    let formData = new FormData(form);
    let formDataRes = new FormData()
    for (let key of formData.keys()) {
        if (key === "file") {
            formDataRes.append(key, formData.get(key), formData.get(key).name)
            continue
        }
        formDataRes.append(key, formData.get(key))
    }

    return formDataRes
}

export const SubmissionPanel = (props) => {

    const [nation, setNation] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const isSubmittingRef = useRef(false)

    const toast = useToast()
    
    function showErrorToast(e) {
        toast({
            title: 'Error',
            description: getErrorMessage(e),
            status: 'error',
            duration: 5000,
            isClosable: true,
        })
    }


    function showSuccessToast(msg) {
        toast({
            title: 'Success',
            description: msg,
            status: 'success',
            duration: 5000,
            isClosable: true,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (isSubmittingRef.current) return

        const file = e.target.elements.file?.files?.[0]
        const fileError = validateImageFile(file)
        if (fileError) {
            showErrorToast(fileError)
            return
        }

        isSubmittingRef.current = true
        setIsSubmitting(true)

        try {
            const data = getData(e.target)
            const submissionResult = await POST_submission(data)
            if (!submissionResult) return
            showSuccessToast("Submission successful!")
        }
        catch (e) {
            showErrorToast(e)
        }
        finally {
            isSubmittingRef.current = false
            setIsSubmitting(false)
        }
    }

    return (
        <Box display={'flex'} flexDirection={'column'}>
            <form onSubmit={handleSubmit}>
                <div className="separator" style={{paddingBottom: '20px'}}>Info section</div>
                <FormControl isRequired paddingBottom={'10px'}>
                    <FormLabel htmlFor='ship_name'>Ship name</FormLabel>
                    <Input id='ship_name' type='text' name="ship_name" />
                    <FormHelperText color={'red.500'}>Required</FormHelperText>
                </FormControl>
                <FormControl isRequired paddingBottom={'10px'}>
                    <FormLabel htmlFor='country'>Ship nationality</FormLabel>
                    <Select id='country' name="country" placeholder='Select nation of active service' onChange={(e) => {setNation(e.target.value)}}>
                        <option>United States</option>
                        <option>Japan</option>
                        <option>Other</option>
                        <option>Fictional</option>
                    </Select>
                    <FormHelperText color={'red.500'}>Required</FormHelperText>
                </FormControl>
                {(nation === "Other" || nation === "Fictional") ? 
                    <FormControl paddingBottom={'10px'}>
                        <FormLabel htmlFor='country_extra'>Ship nationality - Specify</FormLabel>
                        <Input id='country_extra' name="country_extra" type='text' />
                        <FormHelperText color={'red.300'}>Required if you pick "Other" or "Fictional" as nationality</FormHelperText>
                    </FormControl> 
                    :
                    <div></div>    
                }
                <FormControl isRequired paddingBottom={'10px'}>
                    <FormLabel htmlFor='source'>Source</FormLabel>
                    <Input id='source' type='text' name="source" />
                    <FormHelperText>Optional - Specify which franchise does this character originated from</FormHelperText>
                </FormControl>
                <FormControl isRequired paddingBottom={'10px'}>
                    <FormLabel htmlFor='creator'>Illustrator</FormLabel>
                    <Input id='creator' type='text' name="creator" />
                    <FormHelperText>Optional - Accessible url to artist's creation sharing platform (i.e: Pixiv, Twitter, DevianArt, etc.)</FormHelperText>
                </FormControl>
                
                <div className="separator" style={{paddingBottom: '20px'}}>Content section</div>
                <FormControl isRequired paddingBottom={'10px'}>
                    <FormLabel htmlFor='illust'>Illustration File</FormLabel>
                    <Input id='illust' type='file' accept={ACCEPTED_IMAGE_TYPES} name="file"/>
                    <FormHelperText color={'red.500'}>Required - Please read our CG quality assessment to know how we grade them</FormHelperText>
                    <FormHelperText>Supported formats: JPEG, PNG, GIF, WebP, AVIF, or TIFF (SVG is not supported). Maximum file size: {MAX_FILE_SIZE_LABEL}.</FormHelperText>
                </FormControl>
                <div className="separator" style={{padding: '20px 0 20px 0'}}>Contact section</div>
                <FormControl paddingBottom={'10px'}>
                    <FormLabel htmlFor='email'>Email address</FormLabel>
                    <Input id='email' type='email' name="email" />
                    <FormHelperText>Optional - So we can send you update on your submission status</FormHelperText>
                </FormControl>
                
                <Button bgColor='blue.200' type="submit" isLoading={isSubmitting} loadingText="Submitting" disabled={isSubmitting}>Submit</Button>
            </form>
        </Box>
    )
}