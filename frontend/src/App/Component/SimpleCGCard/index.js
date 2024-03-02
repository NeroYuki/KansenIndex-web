import { Box, Flex, Heading, SlideFade, Text} from "@chakra-ui/react"

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
                <Box p='10px' width={'332px'} >
                    <Text float={'right'}>{modifierName}</Text>
                </Box>
            </Flex>
        </Box>
    )
}