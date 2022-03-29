import { Box, Flex, Text, Icon, Input, InputGroup, InputLeftAddon, SlideFade, CheckboxGroup, Checkbox, Stack, Select, Button, Accordion, AccordionItem, AccordionButton, AccordionIcon, AccordionPanel } from "@chakra-ui/react"
import { FaSearch, FaSpinner } from "react-icons/fa"
import { NavigationTop, SiteHeader, SiteFooter } from "../../Component"

export const ShipIndex = () => {
    return (
        <Flex direction={'column'}>
            <SiteHeader />
            <SlideFade in={true} offsetY='-80px'>
                <Box bg='blue.100' p="40px">
                    {/* filter box here */}
                    <Box bg="gray.300" p='32px' className="apply-shadow" height='auto'>
                        <Text fontSize={14} marginBottom='10px' fontWeight={500}>Ship Index Search</Text>
                        <Box display={'flex'} flexDirection={'row'} alignItems="center" marginBottom='10px' >
                            <FaSearch scale={2} />
                            <Input marginLeft='10px' placeholder="Enter keyword" color='black' size='lg' variant='flushed' pX='20px'></Input>
                        </Box>
                        <Stack direction={'row'} spacing='10px' marginBottom='10px'>
                            <Text fontWeight={500}>Keyword in:</Text>
                            <CheckboxGroup>
                                <Checkbox>Ship name</Checkbox>
                                <Checkbox>Ship hull number</Checkbox>
                                <Checkbox>Illustrator</Checkbox>
                            </CheckboxGroup>
                        </Stack>
                        <Stack direction={'row'} spacing='10px' marginBottom='20px'>
                            <Select size={'lg'} placeholder="Select ship nationality"></Select>
                            <Select size={'lg'} placeholder="Select ship hull type"></Select>
                            <Select size={'lg'} placeholder="Select franchise"></Select>
                        </Stack>

                        <Accordion allowToggle  marginBottom='20px'>
                            <AccordionItem>
                                <AccordionButton>
                                    <Box flex='1' textAlign='left'>
                                        Advance Filter
                                    </Box>
                                    <AccordionIcon />
                                </AccordionButton>
                                <AccordionPanel pb={4}>
                                <Stack direction={'row'} spacing='10px' marginBottom='10px'>
                                    <Text fontWeight={500}>Construction Status: </Text>
                                    <CheckboxGroup>
                                        <Checkbox>Fictional</Checkbox>
                                        <Checkbox>Planned</Checkbox>
                                        <Checkbox>Blueprint Completed</Checkbox>
                                        <Checkbox>Partially Constructed</Checkbox>
                                        <Checkbox>Constructed</Checkbox>
                                    </CheckboxGroup>
                                </Stack>
                                </AccordionPanel>
                            </AccordionItem>
                        </Accordion>

                        <Button bg="blue.200" size={'lg'} justifySelf='right'>Search</Button>

                    </Box>
                    {/* result here as a table? */}
                    <Box bg="gray.300" p='32px' marginTop='40px' className="apply-shadow" height='auto' display='flex' flexDirection='row' alignItems='center'>
                        <FaSpinner></FaSpinner>
                        <Text marginLeft='20px' fontSize={16}>There is no data available, coming soon</Text>
                    </Box>
                </Box>
            </SlideFade>
            <SiteFooter></SiteFooter>
        </Flex>
    )
}