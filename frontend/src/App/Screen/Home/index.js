import { Avatar, Box, Button, Center, Flex, Heading, Icon, IconButton, Input, InputGroup, InputLeftAddon, SlideFade, Text, toast } from "@chakra-ui/react"
import { useCallback, useRef, useState } from "react"
import { FaDice, FaDiscord, FaRandom, FaSearch } from 'react-icons/fa'
import { Link, useNavigate } from "react-router-dom"
import { SiteFooter, SiteHeader } from "../../Component"
import { GET_query, GET_random } from "../../Service/shipgirl"
import {
    AutoComplete,
    AutoCompleteInput,
    AutoCompleteItem,
    AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";

export const Home = () => {

    const navigate = useNavigate()
    let searchTimeout = useRef(null)
    const [searchResult, setSearchResult] = useState([])

    function showErrorToast(e) {
        toast({
            title: 'Error',
            description: e,
            status: 'error',
            duration: 5000,
            isClosable: true,
        })
    }

    const navigateToRandomCG = useCallback(async () => {
        let random_res = await GET_random().catch(e => showErrorToast(e))

        navigate('/cg_info', {state: {
            data: random_res[0]
        }})
    }, [navigate])

    const navigateToCG = useCallback((data) => {
        navigate('/cg_info', {state: {
            data: data
        }})
    }, [navigate])

    const getSearchResult = useCallback(async (keyword) => {
        let search_res = await GET_query({keyword: keyword, limit: 5}).catch(e => showErrorToast(e))
        return search_res
    }, [])

    const onSearchInputChange = useCallback(async (e) => {
        let keyword = e.target.value
        // skip if keyword length is less than 3
        if (keyword.length < 3) {
            setSearchResult([])
            return
        }
        // debounce search
        if (searchTimeout.current) clearTimeout(searchTimeout.current)
        searchTimeout.current = setTimeout(async () => {
            let search_res = await getSearchResult(keyword)
            setSearchResult(search_res)
        }, 1000)
    }, [getSearchResult])

    return (
        <Flex direction={'column'} height={'100%'}>
            <SiteHeader />
            <SlideFade in={true} offsetY='-80px'>
                <Box bg='gray.300' className='home-content' p='20px' display={'flex'} flexDirection={'column'}>
                    <Heading as='h3' size='2xl' style={{fontWeight: '100'}} p='40px'>Welcome to the KansenIndex</Heading>
                    <p style={{fontSize: 18}}>The all-in-one index of (almost) all franchise involving anthropomorphic warships</p>
                    <AutoComplete onSelectOption={(res) => navigateToCG(res.item.originalValue)} 
                        disableFilter
                    >
                        <Center>
                            <InputGroup width='600px' p='40px' size='lg'>
                                <InputLeftAddon children={<Icon as={FaSearch} />} />
                                <Input as={AutoCompleteInput} placeholder={'Enter a ship\'s name'} variant={'outline'} onChange={onSearchInputChange}/>
                            </InputGroup>
                            <AutoCompleteList style={{display: searchResult.length !== 0 ? 'block' : 'none'}} position="absolute" left="calc(50% - 260px + 38px)" mt={"24px"}>
                                {searchResult.map((item, index) => {
                                    const modifierName = item.filename.slice(0, item.filename.lastIndexOf('.')).split('_').slice(1).join(', ')
                                    return (<AutoCompleteItem
                                        key={`option-${index}`}
                                        value={item}
                                        _selected={{ bg: "blue.50" }}
                                        _focus={{ bg: "blue.100" }}
                                    >
                                    <Flex w="100%" direction={'row'} justifyContent="space-between">
                                        <Text flex={1} textAlign="left">{item.char + (modifierName ? ` (${modifierName})` : '')}</Text>
                                        <Text flex={1} textAlign="right">{item.folder}</Text>
                                    </Flex>
                                    </AutoCompleteItem>)
                            })}
                            </AutoCompleteList>
                        </Center>
                    </AutoComplete>
                    <Center mt={"-16px"} mb={"16px"}>
                        <Button p="16px" onClick={navigateToRandomCG}>
                            <Icon boxSize={8} as={FaDice} />
                            <Text fontSize={"xl"} ml={"16px"}>Go to Random CG </Text>
                        </Button>
                    </Center>
                </Box>
                <Box bg='gray.400' className='home-content' p='20px' display={'flex'} flexDirection={'column'}>
                    <Heading as='h4' size='lg' style={{fontWeight: '100'}} p='40px'>Current Database contains...</Heading>
                    <Box display={'flex'} flexDirection={'row'} justifyContent={'space-evenly'} p='40px' className="apply-shadow" >
                        <Box display={'flex'} flexDirection={'column'}>
                            <p>Number of Illustration</p>
                            <p style={{paddingTop: 20, fontSize: 24, fontWeight: 400}}>10910</p>
                        </Box>
                        <Box display={'flex'} flexDirection={'column'}>
                            <p>Number of Ships</p>
                            <p style={{paddingTop: 20, fontSize: 24, fontWeight: 400}}>1487</p>
                        </Box>
                        <Box display={'flex'} flexDirection={'column'}>
                            <p>Number of Franchise</p>
                            <p style={{paddingTop: 20, fontSize: 24, fontWeight: 400}}>29</p>
                        </Box>
                    </Box>
                </Box>
                <Box bg='gray.300' className='home-content' p='20px' display={'flex'} flexDirection={'column'}>
                    <Heading as='h4' size='lg' style={{fontWeight: '100'}} p='40px'>Reach out to us at</Heading>
                    <Box display={'flex'} flexDirection={'row'} justifyContent={'space-evenly'} p='40px' className="apply-shadow" flexWrap={'wrap'} >
                        <Box display={'flex'} flexDirection={'column'} minW={'300px'}>
                            <Text mb="16px" fontSize={"20px"} fontWeight={"semibold"}>Discord</Text>
                            <a href="https://discord.gg/km7PvVFXyv" target="_blank" rel="noreferrer">
                                <img src="https://discord.com/api/guilds/947526480081072158/widget.png?style=banner2" alt="Discord Banner"/>
                            </a>
                            <Text fontSize={"16px"} mt="16px">@neroyuki</Text>
                        </Box>
                        <Box display={'flex'} flexDirection={'column'} minW={'300px'}>
                            <Text mb="16px" fontSize={"20px"} fontWeight={"semibold"}>Twitter</Text>
                            <Center>
                                <Avatar size={'xl'} src="https://pbs.twimg.com/profile_images/1477702926013399042/N5sRzoq0_400x400.jpg"></Avatar>
                            </Center>
                            <Text fontSize={"16px"} mt="16px">@neroyuki241</Text>
                        </Box>
                    </Box>
                </Box>
            </SlideFade>
            <SiteFooter></SiteFooter>
        </Flex>
    )
}