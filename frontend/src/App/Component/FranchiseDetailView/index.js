import { Divider, Box, Text, Tag, TagLabel, TagLeftIcon, Button, Skeleton} from "@chakra-ui/react"
import { MdCheck, MdArrowRightAlt, MdClose } from 'react-icons/md'
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
} from '@chakra-ui/react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import './styles.css'
import { useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { FaQuestion } from "react-icons/fa"

const InfoSectionList = (props) => {
    const data = props.data

    const render_info = data.map(val => {
        const lineBreak = (
            <Text style={{flex: 6, padding: 8}}>
                {val.value.split('\\n').map(line => (<p>{line}</p>))}
            </Text>
        )
        return (
            <div style={{display: 'flex', padding: 8}}>
                <div style={{flex: 2, padding: 8}}>{val.name}</div>
                <Divider orientation="vertical" style={{height: '30px'}}></Divider>
                {lineBreak}
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
                <div style={{textAlign: 'justify'}} >
                    {data ? <ReactMarkdown className='react-md-container' children={data} remarkPlugins={[remarkGfm]} /> : <Skeleton height={'50px'} />}
                </div>
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

const StatusIconMapping = {
    "Active": MdCheck,
    "End of Service": MdClose,
    "Unknown": FaQuestion,
    "Released": MdCheck,
    "Unreleased": MdClose,
    "Work in Progress": MdArrowRightAlt,
}

const StatusColorMapping = {
    "Active": "green",
    "End of Service": "red",
    "Unknown": "gray",
    "Released": "green",
    "Unreleased": "red",
    "Work in Progress": "orange",
}

export const FranchiseDetailView = (props) => {

    const general_info = props.data.general_info || []
    const release_date = (props.data.release_date || []).map((val) => {
        return {name: val.region, value: `${new Date(Date.parse(val.date)).toLocaleDateString()} ${val.end_date ? ` - ${new Date(Date.parse(val.end_date)).toLocaleDateString()}` : ''}`}
    })
    const title = props.data.display_name
    const icon_image = props.data.icon_image
    const extra_info = props.data.extra_info
    const screenshot = props.data.screenshot
    const status = props.data.status || "Unknown"

    const navigate = useNavigate()

    const navigateToShipIndex = useCallback(() => {
        navigate('/ship_list', {state: {
            searchData: {
                selectedFranchise: [props.data.name]
            }
        }})
    }, [navigate, props.data.name])

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
                        <Tag colorScheme={StatusColorMapping[status] || "gray"}>
                            <TagLabel margin={"4px 4px 4px 8px"}>{status}</TagLabel>
                            <TagLeftIcon as={StatusIconMapping[status] || FaQuestion} />
                        </Tag>
                    </div>
                    <Button leftIcon={<MdArrowRightAlt />} colorScheme='blue' variant='solid' onClick={navigateToShipIndex}>
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