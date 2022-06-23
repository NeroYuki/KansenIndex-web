import { Divider, Box, Text, Tag, TagLabel, TagLeftIcon, Button} from "@chakra-ui/react"
import { MdCheck, MdArrowRightAlt } from 'react-icons/md'
import {
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
} from '@chakra-ui/react'

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
    return (
        <AccordionItem>
            <AccordionButton>
                <Box flex='1' textAlign='left'>
                    <Text fontSize={16} fontWeight={500} marginY='12px'>{props.title || "Placeholder"}</Text>
                </Box>
                <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
                {props.content || "Placeholder"}
            </AccordionPanel>
        </AccordionItem>
    )
}

export const FranchiseDetailView = (props) => {
    const mock_info = [
        {name: "China", value: new Date().toLocaleDateString('vi-VN')},
        {name: "Japan", value: new Date().toLocaleDateString('vi-VN')},
        {name: "Global", value: new Date().toLocaleDateString('vi-VN')},
    ]

    const mock_info2 = [
        {name: "Genre", value: "Gacha, Bullet-Hell, Action"},
        {name: "Platform", value: "Android, iOS"},
        {name: "Publisher", value: "A Publisher"},
        {name: "Developer", value: "Definitely a Game Studio"},
    ]

    return (
        <div style={{padding: "16px 0 16px 0"}}>
            <div style={{height: 160, display: 'flex'}}>
                <div style={{flex: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 10}}>
                    {props.image_link ? <img src={props.image_link} alt="title logo"></img>  : 'Insert logo here'}
                </div>
                <Divider orientation="vertical"></Divider>
                <div style={{flex: 6, padding: '12px', paddingLeft: '32px'}}>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <Text fontSize={20} fontWeight={500} marginY='12px' paddingRight='20px' display={"inline"}>{"Game Title"}</Text> 
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
                <InfoSectionList title="General Info" data={mock_info2}/>
                <InfoSectionList title="Release Date" data={mock_info}/>
                <InfoSectionDesc title="Extra Info"/>
                <InfoSectionDesc title="Screenshot"/>
            </Accordion>
            <Divider />
            
        </div>
    )
}