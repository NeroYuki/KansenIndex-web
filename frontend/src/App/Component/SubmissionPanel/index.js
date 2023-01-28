import { Box, Divider, Stack, Text, FormControl, Input, FormHelperText, FormLabel, Select, Button, useToast} from "@chakra-ui/react"
import { useState } from "react"
import { POST_submission } from "../../Service/shipgirl";


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

    const toast = useToast()
    
    function showErrorToast(e) {
        toast({
            title: 'Error',
            description: e,
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
        const data = getData(e.target)

        const submissionResult = await POST_submission(data).catch(e => showErrorToast(e))
        if (!submissionResult) return
        showSuccessToast("Submission successful!")
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
                    <Input id='illust' type='file' accept="image/*" name="file"/>
                    <FormHelperText color={'red.500'}>Required - Please read our CG quality assessment to know how we grade them</FormHelperText>
                </FormControl>
                <div className="separator" style={{padding: '20px 0 20px 0'}}>Contact section</div>
                <FormControl paddingBottom={'10px'}>
                    <FormLabel htmlFor='email'>Email address</FormLabel>
                    <Input id='email' type='email' name="email" />
                    <FormHelperText>Optional - So we can send you update on your submission status</FormHelperText>
                </FormControl>
                
                <Button bgColor='blue.200' type="submit">Submit</Button>
            </form>
        </Box>
    )
}