import { Box, Flex, Heading, SlideFade, Text} from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { SiteFooter, SiteHeader, CensoredImage } from "../../Component"
import { GET_getTopFav } from "../../Service/shipgirl"

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

const SimpleCharCard = (props) => {
    const { char, folder, image_link, fav_count, pos, rating} = props

    let thumb_dir = (image_link) ? image_link.replace('./data/assets/', './data/thumbs/') : ''
    thumb_dir = thumb_dir.slice(0, thumb_dir.lastIndexOf('.')) + '.png'

    return (
        <Box position={'relative'} bg='card' minW='332px' minH='332px' borderRadius='10px' boxShadow='md' m='10px'>
            <CensoredImage 
                src={thumb_dir} 
                alt={char} 
                rating={rating}
                style={{objectFit: 'contain', margin: 16, height: '300px', width: '300px'}} 
                buttonText="Reveal image"
                warningText={`This ${rating || 'content'} rated image is hidden`}
            />
            <Flex position={'absolute'} top={0} left={0} direction={'column'} height={'100%'} justify={'space-between'} >
                <Flex direction={'row'} justify={'space-between'} width={'332px'}>
                    <Flex direction={'column'} justify={'space-between'}  p='10px' >
                        <Heading size={'md'}>{char}</Heading>
                        <Text mt={1}>{folder}</Text>
                    </Flex>
                    <Flex p='10px' style={{backgroundColor: '#44FF4422', borderRadius: '0px 10px 0px 0px'}} justifyContent="center" alignItems="center">
                        <Text fontWeight="bold" float={'right'}>{ordinal_suffix_of(pos)}</Text>
                    </Flex>
                </Flex>
                <Box p='10px' width={'332px'} >
                    <Text fontWeight="bold" float={'right'}>❤️ {fav_count}</Text>
                </Box>
            </Flex>
        </Box>
    )
}

export const BoteLB = () => {
    const [topBoteList, setTopBoteList] = useState([])
    const [isReady, setIsReady] = useState(false)

    useEffect(() => {
        GET_getTopFav().then(res => {
            setTopBoteList(res)
            setIsReady(true)
        })
    }, [])

    const cardList = topBoteList.map((val, index) => {
        return (
            <SimpleCharCard key={val._id} char={val.char} folder={val.folder} image_link={val.base_cg} fav_count={val.fav} pos={index + 1} rating={val.rating}/>
        )
    })

    return (
        <Flex direction={'column'} height={'100%'}>
            <SiteHeader />
            <SlideFade in={isReady} offsetY='-80px'>
                <Box bg='backdrop' className="general-backdrop">
                    <Flex direction={'row'} wrap={'wrap'} justify={'space-evenly'}>
                        {cardList}
                    </Flex>
                </Box>
            </SlideFade>
            <SiteFooter></SiteFooter>
        </Flex>
    )
}