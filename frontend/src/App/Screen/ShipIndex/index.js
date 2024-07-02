import { Box, Flex, Text, Input, SlideFade, CheckboxGroup, Checkbox, Stack, Select, 
    Button, Accordion, AccordionItem, AccordionButton, AccordionIcon, AccordionPanel, useToast, Wrap, WrapItem } from "@chakra-ui/react"
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableCaption,
} from '@chakra-ui/react'
import { useCallback, useEffect, useState } from "react"
import { FaSearch } from "react-icons/fa"
import { useLocation, useNavigate } from "react-router-dom"
import { SiteHeader, SiteFooter } from "../../Component"
import { GET_query } from "../../Service/shipgirl"
import { SimpleCharCard } from "../../Component/SimpleCGCard"

export const ShipIndex = () => {

    const [keyword, setKeyword] = useState("")
    const [page, setPage] = useState(1)
    const [shiplist, setShipList] = useState([])
    const [blocked, setBlocked] = useState(false)
    const [keywordMod, setKeywordMod] = useState(0)
    const [constructMod, setConstructMod] = useState(0)
    const [altOutfitMod, setAltOutfitMod] = useState(0)
    const [loadedDefault, setLoadedDefault] = useState(false)
    const [resultView, setResultView] = useState('card')
    const [franchiseSelection, setFranchiseSelection] = useState([
        "Abyss Horizon",
        "Axis Senki",
        "Arms Armory",
        "Arpeggio of Blue Steel",
        "Artist Original Content",
        "Azur Lane",
        "Battleship Bishoujo Puzzle",
        "Battleship Girl",
        "Battleship War Girl",
        "Black Surgenights",
        "Blue Oath",
        "Codename Coastline",
        "Counter Arms",
        "Deep Sea Desire",
        "Goddess Fleet",
        "Guardian Project",
        "Kantai Collection",
        "Lane Girls",
        "Maiden Fleet",
        "Mirage of Steelblue",
        "Moe Moe World War II",
        "Monster Strike",
        "Shipgirls Collection",
        "Shipgirls GO",
        "Shoujo Heiki",
        "Tales of Abyss",
        "The Cute Warship",
        "Velvet Code",
        "Victory Belles",
        "Warship Collection",
        "Warship Girls R"
    ])
    const [selectedFranchise, setSelectedFranchise] = useState("")
    const toast = useToast()
    const location = useLocation()
    const navigate = useNavigate()

    function showErrorToast(e) {
        toast({
            title: 'Error',
            description: e,
            status: 'error',
            duration: 5000,
            isClosable: true,
        })
    }

    async function reloadData(overrideQuery = null) {
        let query = {
            keyword: keyword,
            keywordMod: keywordMod,
            page: page,
            constructMod: constructMod,
            altOutfitMod: altOutfitMod,
            selectedFranchise: selectedFranchise
        }

        if (overrideQuery) {
            query = overrideQuery
        }
        // console.log(query)

        setBlocked(true)
        let res = await GET_query(query).catch(e => showErrorToast(e))
        setBlocked(false)
        if (!res) return
        //console.log(res)
        setShipList(res)
    }

    useEffect(() => {
        // decode query string if available
        if (location.search && !loadedDefault) {
            const query = new URLSearchParams(location.search)
            setKeyword(query.get('keyword') || "")
            setKeywordMod(query.get('keywordMod') || 0)
            setConstructMod(query.get('constructMod') || 0)
            setAltOutfitMod(query.get('altOutfitMod') || 0)
            setSelectedFranchise(query.get('selectedFranchise') || "")
            setPage(parseInt(query.get('page')) || 1)

            reloadData()
            setLoadedDefault(true)
        }
        else if (location.state?.searchData && !loadedDefault) {
            // console.log(location.state.searchData)
            setKeyword(location.state.searchData.keyword || "")
            setKeywordMod(location.state.searchData.keywordMod || 0)
            setConstructMod(location.state.searchData.constructMod || 0)
            setAltOutfitMod(location.state.searchData.altOutfitMod || 0)
            setSelectedFranchise(location.state.searchData.selectedFranchise || "")

            const query = {
                keyword: "",
                keywordMod: 0,
                page: 1,
                constructMod: 0,
                altOutfitMod: 0,
                selectedFranchise: "",
                ...location.state.searchData
            } 

            reloadData(query)
            setLoadedDefault(true)
        }
        else {
            reloadData()
        }
    }, [page])

    function onSearch() {
        if (blocked) return
        setPage(1)
        reloadData()
    }

    function handleKeywordChange(e) {
        setKeyword(e.target.value)
    }

    function listenForEnter(e) {
        if (e.key === "Enter") {
            onSearch()
        }
    }

    const navigateToCG = useCallback((val) => {
        navigate('/cg_info', {state: {
            data: val
        }})
    }, [navigate])

    const tableRows = shiplist.map(val => {
        let thumb_dir = val.full_dir.replace('./data/assets/', './data/thumbs/')
        thumb_dir = thumb_dir.slice(0, thumb_dir.lastIndexOf('.')) + '.png'
        return (
            <Tr key={val.filename}>
                <Td><Text onClick={() => navigateToCG(val)} bg="card" style={{padding: '4px 8px 4px 8px', borderRadius: 4}}>{val.char}</Text></Td>
                <Td>{val.folder}</Td>
                <Td>{val.filename}</Td>
                <Td><Checkbox isChecked={val.is_base} isDisabled></Checkbox></Td>
                <Td><a href={val.full_dir} className="tooltip">View here
                    <span className="tooltiptext"><img style={{height: 300, margin: 'auto', objectFit: 'scale-down'}} src={thumb_dir} alt="hover_img"></img></span>
                </a></Td>
            </Tr>
        )
    })

    const cardList = shiplist.map((val, index) => {
        return (
            <SimpleCharCard style={{margin: '10px'}} key={val._id} data={val} onCardClick={navigateToCG} />
        )
    })

    const franchiseOption = franchiseSelection.map(val => {
        return (
            <option key={val} value={val}>{val}</option>
        )
    })

    function toggleModifierValue(value, key) {
        const mod_val = 1 << key
        return value ^ mod_val
    }

    function getModifierValue(value, key) {
        const mod_val = 1 << key
        // console.log((value & mod_val) === mod_val)
        return (value & mod_val) === mod_val
    }

    function onResultViewChange(e) {
        setResultView(e.target.value)
    }

    return (
        <Flex direction={'column'}>
            <SiteHeader />
            <SlideFade in={true} offsetY='-80px'>
                <Box bg='backdrop' p="40px" marginTop={140}>
                    {/* filter box here */}
                    <Box bg="muted" p='32px' className="apply-shadow" height='auto'>
                        <Text fontSize={14} marginBottom='10px' fontWeight={500}>Ship Index Search</Text>
                        <Box display={'flex'} flexDirection={'row'} alignItems="center" marginBottom='10px' >
                            <FaSearch scale={2}/>
                            <Input value={keyword} marginLeft='10px' placeholder="Enter keyword" size='lg' variant='flushed' paddingX='20px' onChange={handleKeywordChange} onKeyDown={listenForEnter}></Input>
                        </Box>
                        <Stack direction={'row'} spacing='10px' marginBottom='10px'>
                            <Text fontWeight={500}>Keyword in:</Text>
                            <CheckboxGroup>
                                <Checkbox isChecked={getModifierValue(keywordMod, 0)} onChange={(e) => setKeywordMod(toggleModifierValue(keywordMod, 0))}>Ship name only</Checkbox>
                                <Checkbox isChecked={getModifierValue(keywordMod, 1)} onChange={(e) => setKeywordMod(toggleModifierValue(keywordMod, 1))}>Modifier name only</Checkbox>
                            </CheckboxGroup>
                        </Stack>
                        <Wrap direction={'row'} justifyContent={'space-between'} wrap="wrap" spacing={5} marginBottom={5}>
                            <WrapItem  marginBottom='20px' flex={'1 0 250px'}> 
                                <Select size={'lg'} placeholder="Select ship nationality"></Select>
                            </WrapItem>
                            <WrapItem  marginBottom='20px' flex={'1 0 250px'}>
                                <Select size={'lg'} placeholder="Select ship hull type"></Select>
                            </WrapItem>
                            <WrapItem  marginBottom='20px' flex={'1 0 250px'}>
                            <Select size={'lg'} placeholder="Select franchise" value={selectedFranchise} onChange={(e) => setSelectedFranchise(e.target.value)}>
                                <option key="All" value="">All Franchise</option>
                                {franchiseOption}
                            </Select>
                            </WrapItem>
                        </Wrap >

                        <Accordion allowToggle marginBottom='20px'>
                            <AccordionItem>
                                <AccordionButton>
                                    <Box flex='1' textAlign='left'>
                                        Advance Filter
                                    </Box>
                                    <AccordionIcon />
                                </AccordionButton>
                                <AccordionPanel pb={4}>
                                <Stack direction={'row'} spacing='10px' marginBottom='10px' wrap={'wrap'}>
                                    <Text fontWeight={500}>Construction Status: </Text>
                                    <CheckboxGroup>
                                        <Checkbox isChecked={getModifierValue(constructMod, 0)} isDisabled onChange={(e) => setConstructMod(toggleModifierValue(constructMod, 0))}>Fictional</Checkbox>
                                        <Checkbox isChecked={getModifierValue(constructMod, 1)} isDisabled onChange={(e) => setConstructMod(toggleModifierValue(constructMod, 1))}>Planned</Checkbox>
                                        <Checkbox isChecked={getModifierValue(constructMod, 2)} isDisabled onChange={(e) => setConstructMod(toggleModifierValue(constructMod, 2))}>Blueprint Completed</Checkbox>
                                        <Checkbox isChecked={getModifierValue(constructMod, 3)} isDisabled onChange={(e) => setConstructMod(toggleModifierValue(constructMod, 3))}>Partially Constructed</Checkbox>
                                        <Checkbox isChecked={getModifierValue(constructMod, 4)} isDisabled onChange={(e) => setConstructMod(toggleModifierValue(constructMod, 4))}>Constructed</Checkbox>
                                    </CheckboxGroup>
                                </Stack>
                                <Stack direction={'row'} spacing='10px' marginBottom='10px' wrap={'wrap'}>
                                    <Text fontWeight={500}>Alternative Outfit: </Text>
                                    <CheckboxGroup>
                                        <Checkbox isChecked={getModifierValue(altOutfitMod, 0)} onChange={(e) => setAltOutfitMod(toggleModifierValue(altOutfitMod, 0))}>Base only</Checkbox>
                                        <Checkbox isChecked={getModifierValue(altOutfitMod, 1)} onChange={(e) => setAltOutfitMod(toggleModifierValue(altOutfitMod, 1))}>Oath</Checkbox>
                                        <Checkbox isChecked={getModifierValue(altOutfitMod, 2)} onChange={(e) => setAltOutfitMod(toggleModifierValue(altOutfitMod, 2))}>Retrofit</Checkbox>
                                        <Checkbox isChecked={getModifierValue(altOutfitMod, 3)} onChange={(e) => setAltOutfitMod(toggleModifierValue(altOutfitMod, 3))}>Damage</Checkbox>
                                        <Checkbox isChecked={getModifierValue(altOutfitMod, 4)} onChange={(e) => setAltOutfitMod(toggleModifierValue(altOutfitMod, 4))}>Themed</Checkbox>
                                        <Checkbox isChecked={getModifierValue(altOutfitMod, 6)} onChange={(e) => setAltOutfitMod(toggleModifierValue(altOutfitMod, 6))}>Censored</Checkbox>
                                        <Checkbox isChecked={getModifierValue(altOutfitMod, 5)} onChange={(e) => setAltOutfitMod(toggleModifierValue(altOutfitMod, 5))}>Others</Checkbox>
                                    </CheckboxGroup>
                                </Stack>
                                </AccordionPanel>
                            </AccordionItem>
                        </Accordion>

                        <Button bg={'primary'} size={'lg'} justifySelf='right' onClick={onSearch}>Search</Button>

                    </Box>
                    {/* result here as a table? */}
                    <Select defaultValue={'card'} size='md' mt={'40px'} width={'300px'} bgColor={'muted'} onChange={onResultViewChange}>
                        <option key='table' value='table'>Table</option>
                        <option key='card' value='card'>Cards</option>
                    </Select>

                    <Box bg="muted" p='32px' marginTop='40px' className="apply-shadow" height='auto' display='flex' flexDirection='column' alignItems='center'>
                        <Box bg="muted" marginBottom={10} height='auto' display='flex' flexDirection='row' alignItems='center' justifyContent={'left'}>
                            <Button disabled={page <= 1 || blocked} onClick={() => {setPage(page - 1)}}>Prev. Page</Button>
                            <p style={{marginLeft: 20, marginRight: 20}}>{`Page ${page}`}</p>
                            <Button disabled={shiplist.length === 0 || blocked} onClick={() => {setPage(page + 1)}}>Next Page</Button>
                        </Box>
                        {resultView === 'card' ? 
                            <Flex direction={'row'} wrap={'wrap'} justify={'space-evenly'}>
                                {cardList}
                            </Flex>
                            :
                            <div style={{zIndex: 0, width: "100%", overflowX: 'scroll' }}>
                                <Table variant='simple' width={"100%"}>
                                    <TableCaption>{`Displaying ${shiplist.length} entries`}</TableCaption>
                                    <Thead>
                                        <Tr>
                                            <Th>Character</Th>
                                            <Th>Franchise</Th>
                                            <Th>Filename</Th>
                                            <Th>Base Variant</Th>
                                            <Th>Image Link</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {tableRows}
                                    </Tbody>
                                </Table>
                            </div>
                        }
                    </Box>
                </Box>
            </SlideFade>
            <SiteFooter></SiteFooter>
        </Flex>
    )
}