import { Box, Flex, Heading, SlideFade, Text, Tooltip} from "@chakra-ui/react"
import { FaSearchPlus } from "react-icons/fa";

// function to turn number to ordinal string
function ordinal_suffix_of(i) {
    let j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}

export const SimpleCharCard = (props) => {
    const { data, style } = props

    const modifierName = data.filename.slice(0, data.filename.lastIndexOf('.')).split('_').slice(1).join(', ')

    let thumb_dir = (data.full_dir) ? data.full_dir.replace('./data/assets/', './data/thumbs/') : ''
    thumb_dir = thumb_dir.slice(0, thumb_dir.lastIndexOf('.')) + '.png'

    let extra_content_desc = (((data.voice) ? 'Voice - ' : '') + ((data.m3d) ? '3D Model - ' : '') + ((data.l2d) ? 'Live2D - ' : '') + ((data.chibi) ? 'Chibi - ' : '') + ((data.spine) ? 'Dynamic' : '')).replace(/ - $/, '')

    return (
        <Box style={{...style}} position={'relative'} bg='card' minW='332px' minH='332px' borderRadius='10px' boxShadow='md' onClick={() => {if (props.onCardClick) props.onCardClick(data)}}>
            <img src={thumb_dir} alt={data.filename} style={{objectFit: 'contain', margin: 16, height: '300px', width: '300px'}} />
            <Flex position={'absolute'} top={0} left={0} direction={'column'} height={'100%'} justify={'space-between'} >
                <Flex direction={'row'} justify={'space-between'} width={'332px'}>
                    <Flex direction={'column'} justify={'space-between'}  p='10px' >
                        <Heading size={'md'}>{data.char}</Heading>
                        <Text mt={1}>{data.folder}</Text>
                    </Flex>
                </Flex>
                <Flex p='10px' width={'332px'} justifyContent={"space-between"} alignItems={'center'}>
                    {(data.voice || data.m3d || data.l2d || data.chibi || data.spine) ? <Tooltip label={extra_content_desc} placement="right">
                        <span><FaSearchPlus /></span>
                    </Tooltip> : <Box></Box>}
                    <Text float={'right'}>{modifierName}</Text>
                </Flex>
            </Flex>
        </Box>
    )
}