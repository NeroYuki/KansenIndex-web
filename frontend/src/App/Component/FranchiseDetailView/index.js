import { Divider, Box, Text, Tag, TagLabel, TagLeftIcon, Button, Skeleton} from "@chakra-ui/react"
import { MdCheck, MdArrowRightAlt } from 'react-icons/md'
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
} from '@chakra-ui/react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const InfoSectionList = (props) => {
    const data = props.data

    const render_info = data.map(val => {
        return (
            <div style={{display: 'flex', padding: 8}}>
                <div style={{flex: 2, padding: 8}}>{val.name}</div>
                <Divider orientation="vertical" style={{height: '30px'}}></Divider>
                <div style={{flex: 6, padding: 8}}>{val.value}</div>
            </div>
        )
    })

    return (
        <AccordionItem>
            <AccordionButton>
                <Box flex='1' textAlign='left'>
                    <Text fontSize={16} fontWeight={500} marginY='12px'>{props.title || "Placeholder"}</Text>
                </Box>
                <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
                {render_info}
            </AccordionPanel>
        </AccordionItem>
    )
}

const InfoSectionDesc = (props) => {
    const data = props.data ? props.data.replace(/\\n/g, '\n\n') : ""
    return (
        <AccordionItem>
            <AccordionButton>
                <Box flex='1' textAlign='left'>
                    <Text fontSize={16} fontWeight={500} marginY='12px'>{props.title || "Placeholder"}</Text>
                </Box>
                <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
                {data ? <ReactMarkdown children={data} remarkPlugins={[remarkGfm]} /> : <Skeleton height={'50px'} />}
            </AccordionPanel>
        </AccordionItem>
    )
}

const InfoSectionGallery = (props) => {

    const imageList = (props.data) ? props.data.map((val) => {
        return <img src={val} alt="gallery screenshot"></img> 
    }) : <Skeleton height={'50px'} />
    return (
        <AccordionItem>
            <AccordionButton>
                <Box flex='1' textAlign='left'>
                    <Text fontSize={16} fontWeight={500} marginY='12px'>{props.title || "Placeholder"}</Text>
                </Box>
                <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
                {imageList}
            </AccordionPanel>
        </AccordionItem>
    )
}

export const FranchiseDetailView = (props) => {

    const general_info = props.data.general_info || []
    const release_date = (props.data.release_date || []).map((val) => {
        return {name: val.region, value: new Date(Date.parse(val.date)).toLocaleDateString()}
    })
    const title = props.data.display_name
    const icon_image = props.data.icon_image
    const extra_info = props.data.extra_info
    const screenshot = props.data.screenshot

    return (
        <div style={{padding: "16px 0 16px 0"}}>
            <div style={{height: 160, display: 'flex'}}>
                <div style={{flex: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 10}}>
                    {icon_image ? <img src={icon_image} alt="title logo"></img>  : 'Insert logo here'}
                </div>
                <Divider orientation="vertical"></Divider>
                <div style={{flex: 6, padding: '12px', paddingLeft: '32px'}}>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <Text fontSize={20} fontWeight={500} marginY='12px' paddingRight='20px' display={"inline"}>{title || "Placeholder"}</Text> 
                        <Tag colorScheme='green'>
                            <TagLabel>Active</TagLabel>
                            <TagLeftIcon as={MdCheck} />
                        </Tag>
                    </div>
                    <Button leftIcon={<MdArrowRightAlt />} colorScheme='blue' variant='solid'>
                        Go to Ship Index
                    </Button>
                </div>
            </div>
            <Accordion allowToggle allowMultiple>
                <InfoSectionList title="General Info" data={general_info}/>
                <InfoSectionList title="Release Date" data={release_date}/>
                <InfoSectionDesc title="Extra Info" data={extra_info}/>
                <InfoSectionGallery title="Screenshot" data={screenshot}/>
            </Accordion>
            <Divider />
            
        </div>
    )
}