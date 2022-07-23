import { Box, Flex, Text, Icon, Input, InputGroup, InputLeftAddon, SlideFade, CheckboxGroup, Checkbox, Stack, Select, 
    Button, Accordion, AccordionItem, AccordionButton, AccordionIcon, AccordionPanel, useToast } from "@chakra-ui/react"
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
} from '@chakra-ui/react'
import { useEffect, useState } from "react"
import { FaSearch, FaSpinner } from "react-icons/fa"
import { NavigationTop, SiteHeader, SiteFooter } from "../../Component"
import { GET_query } from "../../Service/shipgirl"

export const ShipIndex = () => {

    const [keyword, setKeyword] = useState("")
    const [page, setPage] = useState(1)
    const [shiplist, setShipList] = useState([])
    const [blocked, setBlocked] = useState(false)
    const [keywordMod, setKeywordMod] = useState(0)
    const [constructMod, setConstructMod] = useState(0)
    const [altOutfitMod, setAltOutfitMod] = useState(0)
    const [franchiseSelection, setFranchiseSelection] = useState([
        "Abyss Horizon",
        "Akushizu Senki",
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

    function showErrorToast(e) {
        toast({
            title: 'Error',
            description: e,
            status: 'error',
            duration: 5000,
            isClosable: true,
        })
    }

    async function reloadData() {
        let query = {
            keyword: keyword,
            keywordMod: keywordMod,
            page: page,
            constructMod: constructMod,
            altOutfitMod: altOutfitMod,
            selectedFranchise: selectedFranchise
        }

        setBlocked(true)
        let res = await GET_query(query).catch(e => showErrorToast(e))
        setBlocked(false)
        if (!res) return
        //console.log(res)
        setShipList(res)
    }

    useEffect(() => {
        reloadData()
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

    const tableRows = shiplist.map(val => {
        let thumb_dir = val.full_dir.replace('./data/assets/', './data/thumbs/')
        thumb_dir = thumb_dir.slice(0, thumb_dir.lastIndexOf('.')) + '.png'
        return (
            <Tr>
                <Td>{val.char}</Td>
                <Td>{val.folder}</Td>
                <Td>{val.filename}</Td>
                <Td><Checkbox isChecked={val.is_base} isDisabled></Checkbox></Td>
                <Td><a href={val.full_dir} className="tooltip">View here
                    <span className="tooltiptext"><img style={{height: 300, margin: 'auto', objectFit: 'scale-down'}} src={thumb_dir} alt="hover_img"></img></span>
                </a></Td>
            </Tr>
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

    return (
        <Flex direction={'column'}>
            <SiteHeader />
            <SlideFade in={true} offsetY='-80px'>
                <Box bg='blue.100' p="40px">
                    {/* filter box here */}
                    <Box bg="gray.300" p='32px' className="apply-shadow" height='auto'>
                        <Text fontSize={14} marginBottom='10px' fontWeight={500}>Ship Index Search</Text>
                        <Box display={'flex'} flexDirection={'row'} alignItems="center" marginBottom='10px' >
                            <FaSearch scale={2}/>
                            <Input marginLeft='10px' placeholder="Enter keyword" color='black' size='lg' variant='flushed' paddingX='20px' onChange={handleKeywordChange} onKeyDown={listenForEnter}></Input>
                        </Box>
                        <Stack direction={'row'} spacing='10px' marginBottom='10px'>
                            <Text fontWeight={500}>Keyword in:</Text>
                            <CheckboxGroup>
                                <Checkbox onChange={(e) => setKeywordMod(toggleModifierValue(keywordMod, 0))}>Ship name only</Checkbox>
                                <Checkbox onChange={(e) => setKeywordMod(toggleModifierValue(keywordMod, 1))}>Modifier name only</Checkbox>
                            </CheckboxGroup>
                        </Stack>
                        <Stack direction={'row'} spacing='10px' marginBottom='20px'>
                            <Select size={'lg'} placeholder="Select ship nationality"></Select>
                            <Select size={'lg'} placeholder="Select ship hull type"></Select>
                            <Select size={'lg'} placeholder="Select franchise" value={selectedFranchise} onChange={(e) => setSelectedFranchise(e.target.value)}>
                                <option key="All" value="">All Franchise</option>
                                {franchiseOption}
                            </Select>
                        </Stack>

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
                                        <Checkbox isDisabled onChange={(e) => setConstructMod(toggleModifierValue(constructMod, 0))}>Fictional</Checkbox>
                                        <Checkbox isDisabled onChange={(e) => setConstructMod(toggleModifierValue(constructMod, 1))}>Planned</Checkbox>
                                        <Checkbox isDisabled onChange={(e) => setConstructMod(toggleModifierValue(constructMod, 2))}>Blueprint Completed</Checkbox>
                                        <Checkbox isDisabled onChange={(e) => setConstructMod(toggleModifierValue(constructMod, 3))}>Partially Constructed</Checkbox>
                                        <Checkbox isDisabled onChange={(e) => setConstructMod(toggleModifierValue(constructMod, 4))}>Constructed</Checkbox>
                                    </CheckboxGroup>
                                </Stack>
                                <Stack direction={'row'} spacing='10px' marginBottom='10px' wrap={'wrap'}>
                                    <Text fontWeight={500}>Alternative Outfit: </Text>
                                    <CheckboxGroup>
                                        <Checkbox onChange={(e) => setAltOutfitMod(toggleModifierValue(altOutfitMod, 0))}>Base only</Checkbox>
                                        <Checkbox isDisabled onChange={(e) => setAltOutfitMod(toggleModifierValue(altOutfitMod, 1))}>Oath</Checkbox>
                                        <Checkbox isDisabled onChange={(e) => setAltOutfitMod(toggleModifierValue(altOutfitMod, 2))}>Retrofit</Checkbox>
                                        <Checkbox isDisabled onChange={(e) => setAltOutfitMod(toggleModifierValue(altOutfitMod, 3))}>Damage</Checkbox>
                                        <Checkbox isDisabled onChange={(e) => setAltOutfitMod(toggleModifierValue(altOutfitMod, 4))}>Themed</Checkbox>
                                        <Checkbox onChange={(e) => setAltOutfitMod(toggleModifierValue(altOutfitMod, 5))}>Others</Checkbox>
                                    </CheckboxGroup>
                                </Stack>
                                </AccordionPanel>
                            </AccordionItem>
                        </Accordion>

                        <Button bg="blue.200" size={'lg'} justifySelf='right' onClick={onSearch}>Search</Button>

                    </Box>
                    {/* result here as a table? */}
                    <Box bg="gray.300" p='32px' marginTop='40px' className="apply-shadow" height='auto' display='flex' flexDirection='column' alignItems='center'>
                        <Box bg="gray.300" marginBottom={10} height='auto' display='flex' flexDirection='row' alignItems='center' justifyContent={'left'}>
                            <Button disabled={page <= 1 || blocked} onClick={() => {setPage(page - 1)}}>Prev. Page</Button>
                            <p style={{marginLeft: 20, marginRight: 20}}>{`Page ${page}`}</p>
                            <Button disabled={shiplist.length === 0 || blocked} onClick={() => {setPage(page + 1)}}>Next Page</Button>
                        </Box>
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
                    </Box>
                </Box>
            </SlideFade>
            <SiteFooter></SiteFooter>
        </Flex>
    )
}