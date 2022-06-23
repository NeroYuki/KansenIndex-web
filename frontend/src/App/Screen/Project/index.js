import { Box, Flex, Heading, Skeleton, SlideFade, Text} from "@chakra-ui/react"
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
} from '@chakra-ui/react'
import { NavigationTop, SiteFooter, SiteHeader } from "../../Component"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import data_source from "./datasource.md";
import changelog from "./changelog.md"
import { useEffect, useState } from "react"

export const Project = () => {

    const [data_source_md, setDataSource] = useState("")
    const [changelog_md, setChangelog] = useState("") 

    useEffect(() => {
        fetch(data_source).then((res) => res.text()).then((text) => setDataSource(text))
        fetch(changelog).then((res) => res.text()).then((text) => setChangelog(text))
    }, [])

    return (
        <Flex direction={'column'} height={'100%'}>
            <SiteHeader />
            <SlideFade in={true} offsetY='-80px'>
                <Box bg='orange.100' p='40px'>
                    <Box bg='gray.300' p='32px' className="apply-shadow">
                        <Accordion allowToggle>
                            <AccordionItem>
                                <AccordionButton>
                                    <Box flex='1' textAlign='left'>
                                        <Text fontSize={18} fontWeight={500} marginY='20px'>Introduction</Text>
                                    </Box>
                                    <AccordionIcon />
                                </AccordionButton>
                                <AccordionPanel pb={4} p='20px' className="markdown-content">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                                    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                                    veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                                    commodo consequat.
                                </AccordionPanel>
                            </AccordionItem>

                            <AccordionItem>
                                <AccordionButton>
                                    <Box flex='1' textAlign='left'>
                                        <Text fontSize={18} fontWeight={500} marginY='20px'>Data Source</Text>
                                    </Box>
                                    <AccordionIcon />
                                </AccordionButton>
                                <AccordionPanel pb={4} p='20px' className="markdown-content">
                                    {data_source_md ? <ReactMarkdown children={data_source_md} remarkPlugins={[remarkGfm]} /> : <Skeleton height={'50px'} />}
                                </AccordionPanel>
                            </AccordionItem>

                            <AccordionItem>
                                <AccordionButton>
                                    <Box flex='1' textAlign='left'>
                                        <Text fontSize={18} fontWeight={500} marginY='20px'>Changelog</Text>
                                    </Box>
                                    <AccordionIcon />
                                </AccordionButton>
                                <AccordionPanel pb={4} p='20px' className="markdown-content">
                                    {changelog_md ? <ReactMarkdown children={changelog_md} remarkPlugins={[remarkGfm]} /> : <Skeleton height={'50px'} />}
                                </AccordionPanel>
                            </AccordionItem>

                            <AccordionItem>
                                <AccordionButton>
                                    <Box flex='1' textAlign='left'>
                                        <Text fontSize={18} fontWeight={500} marginY='20px'>Special thanks to</Text>
                                    </Box>
                                    <AccordionIcon />
                                </AccordionButton>
                                <AccordionPanel pb={4} p='20px' className="markdown-content">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                                    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                                    veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                                    commodo consequat.
                                </AccordionPanel>
                            </AccordionItem>

                            <AccordionItem>
                                <AccordionButton>
                                    <Box flex='1' textAlign='left'>
                                        <Text fontSize={18} fontWeight={500} marginY='20px'>Disclaimer</Text>
                                    </Box>
                                    <AccordionIcon />
                                </AccordionButton>
                                <AccordionPanel pb={4} p='20px' className="markdown-content">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                                    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                                    veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                                    commodo consequat.
                                </AccordionPanel>
                            </AccordionItem>
                        </Accordion>
                    </Box>
                </Box>
            </SlideFade>
            <SiteFooter></SiteFooter>
        </Flex>
    )
}