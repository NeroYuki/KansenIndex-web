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
import disclaimer from "./disclaimer.md"
import overall from "./overall.md"
import special_thanks from "./specialthanks.md"
import fulldata from "./fulldata.md"
import { useEffect, useState } from "react"

export const Project = () => {

    const [data_source_md, setDataSource] = useState("")
    const [changelog_md, setChangelog] = useState("") 
    const [disclaimer_md, setDisclaimer] = useState("")
    const [overall_md, setOverall] = useState("")
    const [special_thanks_md, setSpecialThanks] = useState("")
    const [fulldata_md, setFullData] = useState("")

    useEffect(() => {
        fetch(data_source).then((res) => res.text()).then((text) => setDataSource(text))
        fetch(changelog).then((res) => res.text()).then((text) => setChangelog(text))
        fetch(disclaimer).then((res) => res.text()).then((text) => setDisclaimer(text))
        fetch(overall).then((res) => res.text()).then((text) => setOverall(text))
        fetch(special_thanks).then((res) => res.text()).then((text) => setSpecialThanks(text))
        fetch(fulldata).then((res) => res.text()).then((text) => setFullData(text))
    }, [])

    return (
        <Flex direction={'column'} height={'100%'}>
            <SiteHeader />
            <SlideFade in={true} offsetY='-80px'>
                <Box bg='backdrop' className="general-backdrop">
                    <Box bg='muted' p='32px' className="apply-shadow">
                        <Accordion allowToggle>
                            <AccordionItem>
                                <AccordionButton>
                                    <Box flex='1' textAlign='left'>
                                        <Text fontSize={18} fontWeight={500} marginY='20px'>Introduction</Text>
                                    </Box>
                                    <AccordionIcon />
                                </AccordionButton>
                                <AccordionPanel pb={4} p='20px' className="markdown-content">
                                    {overall_md ? <ReactMarkdown children={overall_md} remarkPlugins={[remarkGfm]} /> : <Skeleton height={'50px'} />}
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
                                    {special_thanks_md ? <ReactMarkdown children={special_thanks_md} remarkPlugins={[remarkGfm]} /> : <Skeleton height={'50px'} />}
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
                                    {disclaimer_md ? <ReactMarkdown children={disclaimer_md} remarkPlugins={[remarkGfm]} /> : <Skeleton height={'50px'} />}
                                </AccordionPanel>
                            </AccordionItem>
                            <AccordionItem>
                                <AccordionButton>
                                    <Box flex='1' textAlign='left'>
                                        <Text fontSize={18} fontWeight={500} marginY='20px'>Full Data Download</Text>
                                    </Box>
                                    <AccordionIcon />
                                </AccordionButton>
                                <AccordionPanel pb={4} p='20px' className="markdown-content">
                                    {fulldata_md ? <ReactMarkdown children={fulldata_md} remarkPlugins={[remarkGfm]} /> : <Skeleton height={'50px'} />}
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