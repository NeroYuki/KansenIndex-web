import { Box, Flex, SlideFade, HStack, Tag, Text, Center, Button, IconButton } from "@chakra-ui/react"
import { useCallback } from "react"
import { FaSearch } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { SiteFooter, SiteHeader } from "../../Component"

export const CGInfo = (props) => {

    const data = props.data
    const navigate = useNavigate()

    const modifierName = data.filename.slice(0, data.filename.lastIndexOf('.')).split('_').slice(1).join(', ')

    const onCharacterSearch = useCallback(() => {
        navigate('/ship_list', {state: {
            searchData: {
                keyword: data.char,
                keywordMod: 1,
            }
        }})
    }, [navigate, data.char])

    const onFranchiseSearch = useCallback(() => {
        navigate('/ship_list', {state: {
            searchData: {
                selectedFranchise: data.folder
            }
        }})
    }, [navigate, data.folder])


    return (
        <Flex direction={'column'}>
            <SiteHeader />
            <SlideFade in={true} offsetY='-80px'>
                <Flex direction={'row'} wrap={'wrap'}>
                <Box p='16px' flex='1' minW={'360px'}>
                    <Center >
                        <img style={{height: 500, margin: 'auto', objectFit: 'scale-down'}} src={data.full_dir} alt="hover_img"></img>
                    </Center>
                </Box>
                <Box bg='blue.100' p="32px" flex='1' minW={'360px'}>
                    <Flex bg='blue.200' p='16px' direction={'row'} alignItems={'center'} flexWrap={'wrap'}>
                        <Text flex='1' fontSize="lg" fontWeight={"semibold"}>Character Name</Text>
                        <Flex flex='3' bg='whiteAlpha.500' p='8px' borderRadius={'8px'} direction={'row'} alignItems={'center'} justifyContent={'space-between'} flexWrap={'wrap'}>
                            <Text flex="1" fontSize="xl" fontWeight={"semibold"} >
                                {data.char}
                            </Text>
                            <IconButton aria-label="search character" icon={<FaSearch />} onClick={onCharacterSearch} />
                        </Flex>
                    </Flex>
                    <Flex bg='blue.200' mt='-8px' p='16px' direction={'row'} alignItems={'center'} flexWrap={'wrap'}>
                        <Text flex="1" fontSize="md">Modifier Name</Text>
                        <Flex flex="3" bg='whiteAlpha.500' p='8px' borderRadius={'8px'} direction={'row'} alignItems={'center'} flexWrap={'wrap'}>
                            <Text flex="1" fontSize="md">
                                {modifierName}
                            </Text>
                            <HStack spacing={'6px'}>
                                {data.is_base && <Tag size={'lg'} bg={'green.200'}>Base</Tag>}
                                {data.is_damage && <Tag bg={'red.200'}>Damaged</Tag>}
                                {(!data.is_base && !data.is_retrofit && !data.is_damage) && <Tag bg={'orange.200'}>Outfit</Tag>}
                                {data.is_retrofit && <Tag bg={'yellow.200'}>Retrofit</Tag>}
                                {data.is_oath && <Tag bg={'pink.200'}>Oath</Tag>}
                            </HStack>
                        </Flex>
                    </Flex>
                    <Flex bg='blue.200' mt='-8px' p='16px' direction={'row'} alignItems={'center'} flexWrap={'wrap'}>
                        <Text flex='1' fontSize="md">Source</Text>
                        <Flex flex='3' bg='whiteAlpha.500' p='8px' borderRadius={'8px'} direction={'row'} alignItems={'center'} justifyContent={'space-between'} flexWrap={'wrap'}>
                            <Text flex="1" fontSize="md" >
                                {data.folder}
                            </Text>
                            <IconButton size={'sm'} aria-label="search source" icon={<FaSearch />} onClick={onFranchiseSearch}/>
                        </Flex>
                    </Flex>
                </Box>
                </Flex>
            </SlideFade>
            <SiteFooter />
        </Flex>
    )
}