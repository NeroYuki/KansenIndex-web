import { Box, Flex, Text, Input, SlideFade, CheckboxGroup, Checkbox, Stack, Select, 
    Button, Accordion, AccordionItem, AccordionButton, AccordionIcon, AccordionPanel, useToast, Wrap, WrapItem, Avatar,
    Badge, IconButton, Menu, MenuButton, MenuList, MenuItem, HStack, VStack, SimpleGrid, Alert, AlertIcon } from "@chakra-ui/react"
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
import { FaPencilAlt, FaSearch, FaPlus, FaTimes, FaArrowUp, FaArrowDown, FaDice } from "react-icons/fa"
import { useLocation, useNavigate, useBeforeUnload } from "react-router-dom"
import { SiteHeader, SiteFooter } from "../../Component"
import { GET_query } from "../../Service/shipgirl"
import { SimpleCharCard } from "../../Component/SimpleCGCard"
import { nation_name_to_twemoji_flag, type_name_to_icon } from "../../Utils/data_mapping"

export const ShipIndex = () => {

    const [keyword, setKeyword] = useState("")
    const [keywordIllust, setKeywordIllust] = useState("")
    const [page, setPage] = useState(1)
    const [limitPerPage, setLimitPerPage] = useState(20)
    const [shiplist, setShipList] = useState([])
    const [blocked, setBlocked] = useState(false)
    const [keywordMod, setKeywordMod] = useState(0)
    const [strictMode, setStrictMode] = useState(false)
    const [includeExtrapolate, setIncludeExtrapolate] = useState(true)
    const [constructMod, setConstructMod] = useState(0)
    const [altOutfitMod, setAltOutfitMod] = useState(0)
    const [extraContentMod, setExtraContentMod] = useState(0)
    const [loadedDefault, setLoadedDefault] = useState(false)
    const [resultView, setResultView] = useState('card')
    const [sortBy, setSortBy] = useState([]) // Array of sort strings like ["achar", "dfolder"]
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
    const [countrySelection, setCountrySelection] = useState([
        "United Kingdom",
        "United States",
        "Japan",
        "Germany",
        "Soviet Union",
        "Italy",
        "France",
        "China",
        "Netherlands",
        "Russian Empire",
        "Spain",
        "Australia",
        "Thailand",
        "Turkey",
        "Poland",
        "Sweden",
        "Canada",
        "Mongolia",
        "Chile",
        "Iceland",
        "Greece",
        "Austria-Hungary",
        "Finland",
        "Yugoslavia",
        "South Korea",
        "Argentina",
        "Norway",
        "Fictional",
        "Unknown"
    ])
    const [shipTypeSelection, setShipTypeSelection] = useState([
        "Destroyer",
        "Light Cruiser",
        "Heavy Cruiser",
        "Battlecruiser",
        "Battleship",
        "Light Carrier",
        "Aircraft Carrier",
        "Submarine",
        "Aviation Battleship",
        "Repair Ship",
        "Monitor",
        "Aviation Submarine",
        "Large Cruiser",
        "Munition Ship",
        "Guided Missile Cruiser",
        "Sailing Frigate",
        "Aviation Cruiser",
        "Amphibious Assault Ship",
        "Coastal Defense Ship",
        "Unknown",
    ])

    const [selectedFranchise, setSelectedFranchise] = useState([])
    const [selectedCountry, setSelectedCountry] = useState([])
    const [selectedShipType, setSelectedShipType] = useState([])
    const toast = useToast()
    const location = useLocation()
    const navigate = useNavigate()

    // Sort options configuration
    const sortOptions = [
        { value: 'char', label: 'Character name' },
        { value: 'modifier', label: 'Modifier' },
        { value: 'folder', label: 'Franchise' },
        { value: 'file_size', label: 'Image size' },
        { value: 'file_modified_date', label: 'Updated Date' },
        { value: 'random', label: 'Random' }
    ]

    function showErrorToast(e) {
        toast({
            title: 'Error',
            description: e,
            status: 'error',
            duration: 5000,
            isClosable: true,
        })
    }

    // Utility functions for multi-select management
    const addToSelection = (setterFunction, currentArray, item) => {
        if (!currentArray.includes(item)) {
            setterFunction([...currentArray, item])
        }
    }

    const removeFromSelection = (setterFunction, currentArray, item) => {
        setterFunction(currentArray.filter(i => i !== item))
    }

    const toggleSelection = (setterFunction, currentArray, item) => {
        if (currentArray.includes(item)) {
            removeFromSelection(setterFunction, currentArray, item)
        } else {
            addToSelection(setterFunction, currentArray, item)
        }
    }

    async function reloadData(overrideQuery = null) {
        let query = {
            keyword: keyword,
            keywordMod: keywordMod,
            keywordIllust: keywordIllust,
            page: page,
            constructMod: constructMod,
            altOutfitMod: altOutfitMod,
            extraContentMod: extraContentMod,
            selectedFranchise: selectedFranchise.length > 0 ? selectedFranchise : [],
            selectedCountry: selectedCountry.length > 0 ? selectedCountry : [],
            selectedType: selectedShipType.length > 0 ? selectedShipType : [],
            limit: limitPerPage,
            strict: strictMode,
            includeExtrapolate: includeExtrapolate,
            sortBy: sortBy,
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
            setKeywordIllust(query.get('keywordIllust') || "")
            setConstructMod(query.get('constructMod') || 0)
            setAltOutfitMod(query.get('altOutfitMod') || 0)
            setExtraContentMod(query.get('extraContentMod') || 0)
            setSelectedFranchise(query.get('selectedFranchise') ? query.get('selectedFranchise').split(',') : [])
            setSelectedCountry(query.get('selectedCountry') ? query.get('selectedCountry').split(',') : [])
            setSelectedShipType(query.get('selectedType') ? query.get('selectedType').split(',') : [])
            setPage(parseInt(query.get('page')) || 1)
            setStrictMode(query.get('strict') === 'true' || false)
            setIncludeExtrapolate(query.get('includeExtrapolate') === 'true' ?? true)
            setSortBy(query.get('sortBy') ? query.get('sortBy').split(',') : [])

            reloadData()
            setLoadedDefault(true)
        }
        else if (location.state?.searchData && !loadedDefault) {
            // console.log(location.state.searchData)
            setKeyword(location.state.searchData.keyword || "")
            setKeywordMod(location.state.searchData.keywordMod || 0)
            setKeywordIllust(location.state.searchData.keywordIllust || "")
            setConstructMod(location.state.searchData.constructMod || 0)
            setAltOutfitMod(location.state.searchData.altOutfitMod || 0)
            setExtraContentMod(location.state.searchData.extraContentMod || 0)
            setSelectedFranchise(Array.isArray(location.state.searchData.selectedFranchise) ? location.state.searchData.selectedFranchise : (location.state.searchData.selectedFranchise ? [location.state.searchData.selectedFranchise] : []))
            setSelectedCountry(Array.isArray(location.state.searchData.selectedCountry) ? location.state.searchData.selectedCountry : (location.state.searchData.selectedCountry ? [location.state.searchData.selectedCountry] : []))
            setSelectedShipType(Array.isArray(location.state.searchData.selectedType) ? location.state.searchData.selectedType : (location.state.searchData.selectedType ? [location.state.searchData.selectedType] : []))
            setStrictMode(location.state.searchData.strict || false)
            setIncludeExtrapolate(location.state.searchData.includeExtrapolate ?? true)
            setSortBy(location.state.searchData.sortBy || [])

            const query = {
                keyword: "",
                keywordMod: 0,
                keywordIllust: "",
                page: 1,
                constructMod: 0,
                altOutfitMod: 0,
                extraContentMod: 0,
                selectedFranchise: "",
                selectedCountry: "",
                selectedType: "",
                strict: false,
                includeExtrapolate: true,
                sortBy: [],
                ...location.state.searchData
            } 

            reloadData(query)
            setLoadedDefault(true)
        }
        else if (localStorage.getItem('searchState') && !loadedDefault) {
            const searchState = JSON.parse(localStorage.getItem('searchState'))
            setKeyword(searchState.keyword || "")
            setKeywordMod(searchState.keywordMod || 0)
            setKeywordIllust(searchState.keywordIllust || "")
            setConstructMod(searchState.constructMod || 0)
            setAltOutfitMod(searchState.altOutfitMod || 0)
            setExtraContentMod(searchState.extraContentMod || 0)
            setSelectedFranchise(searchState.selectedFranchise || "")
            setSelectedCountry(searchState.selectedCountry || "")
            setSelectedShipType(searchState.selectedType || "")
            setPage(searchState.page || 1)
            setStrictMode(searchState.strict || false)
            setIncludeExtrapolate(searchState.includeExtrapolate ?? true)
            setLimitPerPage(searchState.limit || 20)
            setSortBy(searchState.sortBy || [])

            if (localStorage.getItem('searchData')) {
                setShipList(JSON.parse(localStorage.getItem('searchData')))
            }

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

    function handleKeywordIllustChange(e) {
        setKeywordIllust(e.target.value)
    }

    function listenForEnter(e) {
        if (e.key === "Enter") {
            onSearch()
        }
    }

    // save search state before unmount or page change to local storage
    useEffect(() => {
        return () => {
            localStorage.setItem('searchState', JSON.stringify({
                keyword: keyword,
                keywordMod: keywordMod,
                keywordIllust: keywordIllust,
                page: page,
                constructMod: constructMod,
                altOutfitMod: altOutfitMod,
                extraContentMod: extraContentMod,
                selectedFranchise: selectedFranchise,
                selectedCountry: selectedCountry,
                selectedType: selectedShipType,
                strict: strictMode,
                includeExtrapolate: includeExtrapolate,
                limit: limitPerPage,
                sortBy: sortBy,
            }))

            localStorage.setItem('searchData', JSON.stringify(shiplist))
        }
    }, [keyword, keywordMod, keywordIllust, page, constructMod, altOutfitMod, extraContentMod, selectedFranchise, selectedCountry, selectedShipType, strictMode, includeExtrapolate, limitPerPage, shiplist, sortBy])

    const navigateToCG = useCallback((val) => {
        navigate('/cg_info', {state: {
                data: val
            }
        })
    }, [navigate])

    const tableRows = (shiplist && shiplist.length > 0) ? shiplist.map(val => {
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
    }) : <Tr><Td colSpan={5}><Text>No result found</Text></Td></Tr>

    const cardList = (shiplist && shiplist.length > 0) ? shiplist.map((val, index) => {
        return (
            <SimpleCharCard style={{margin: '10px'}} key={val._id} data={val} onCardClick={navigateToCG} />
        )
    }) : <Text>No result found</Text>

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

    function onStrictModeChange(e) {
        setStrictMode(e.target.checked)
    }

    function onIncludeExtrapolateChange(e) {
        setIncludeExtrapolate(e.target.checked)
    }

    // Sort management functions
    function addSortOption(sortField) {
        if (!sortBy.some(sort => sort.slice(1) === sortField)) {
            setSortBy([...sortBy, 'a' + sortField]) // Default to ascending
        }
    }

    function toggleSortDirection(index) {
        const newSortBy = [...sortBy]
        const currentSort = newSortBy[index]
        const direction = currentSort[0]
        const field = currentSort.slice(1)
        newSortBy[index] = (direction === 'a' ? 'd' : 'a') + field
        setSortBy(newSortBy)
    }

    function removeSortOption(index) {
        const newSortBy = [...sortBy]
        newSortBy.splice(index, 1)
        setSortBy(newSortBy)
    }

    function getSortLabel(sortField) {
        const option = sortOptions.find(opt => opt.value === sortField)
        return option ? option.label : sortField
    }

    function onLimitPerPageChange(e) {
        setLimitPerPage(e.target.value)
        reloadData({
            keyword: keyword,
            keywordMod: keywordMod,
            keywordIllust: keywordIllust,
            page: page,
            constructMod: constructMod,
            altOutfitMod: altOutfitMod,
            extraContentMod: extraContentMod,
            selectedFranchise: selectedFranchise,
            selectedCountry: selectedCountry,
            selectedType: selectedShipType,
            strict: strictMode,
            includeExtrapolate: includeExtrapolate,
            limit: e.target.value,
            sortBy: sortBy,
        })
    }

    return (
        <Flex direction={'column'}>
            <SiteHeader />
            <SlideFade in={true} offsetY='-80px'>
                <Box bg='backdrop' className="general-backdrop">
                    {/* filter box here */}
                    <Box bg="muted" p='32px' className="apply-shadow" height='auto'>
                        <Text fontSize={14} marginBottom='10px' fontWeight={500}>Ship Index Search</Text>
                        <Box display={'flex'} flexDirection={'row'} alignItems="center" marginBottom='10px' flexWrap={'wrap'}>
                            <Box display={'flex'} flexDirection={'row'} flex={5} minW={240} alignItems={'center'} mr={4}>
                                <FaSearch scale={2} mr={4}/>
                                <Input value={keyword} marginLeft='10px' placeholder="Enter keyword" size='lg' variant='flushed' paddingX='20px' onChange={handleKeywordChange} onKeyDown={listenForEnter}></Input>
                            </Box>
                            <Box display={'flex'} flexDirection={'row'} flex={3} minW={240} alignItems={'center'} mr={4}>
                                <FaPencilAlt scale={2} mr={4}/>
                                <Input value={keywordIllust} marginLeft='10px' placeholder="Enter illustrator" size='lg' variant='flushed' paddingX='20px' onChange={handleKeywordIllustChange} onKeyDown={listenForEnter}></Input>
                            </Box>
                        </Box>
                        <Stack direction={'row'} marginBottom='16px' marginTop='8px' wrap={'wrap'}>
                            <Text fontWeight={500} minW={120}>Keyword in:</Text>
                            <CheckboxGroup>
                                <Checkbox minW={200} isChecked={getModifierValue(keywordMod, 0)} onChange={(e) => setKeywordMod(toggleModifierValue(keywordMod, 0))}>Ship name only</Checkbox>
                                <Checkbox minW={200} isChecked={getModifierValue(keywordMod, 1)} onChange={(e) => setKeywordMod(toggleModifierValue(keywordMod, 1))}>Modifier name only</Checkbox>
                            </CheckboxGroup>
                            <Checkbox minW={200} isChecked={strictMode} onChange={onStrictModeChange}>Strict Search</Checkbox>
                            <Checkbox minW={200} isChecked={includeExtrapolate} onChange={onIncludeExtrapolateChange}>Include Extrapolated Data</Checkbox>
                        </Stack>
                        
                        {/* Responsive Filter and Sort Grid */}
                        <SimpleGrid 
                            columns={{ base: 1, md: 2 }} 
                            spacing={2} 
                            marginBottom={5}
                        >
                            {/* Country Filter Section */}
                            <Box p={2}>
                                <Wrap spacing={2} align="center">
                                    <WrapItem>
                                        <Text fontWeight={500} fontSize="sm" minW="80px">Country:</Text>
                                    </WrapItem>
                                    
                                    {/* Country badges */}
                                    {selectedCountry.map((country, index) => (
                                        <WrapItem key={index}>
                                            <Badge
                                                variant="solid"
                                                colorScheme="blue"
                                                display="flex"
                                                alignItems="center"
                                                gap={1}
                                                px={2}
                                                py={1}
                                                borderRadius="md"
                                                height="32px"
                                            >
                                                <Avatar
                                                    src={nation_name_to_twemoji_flag(country)}
                                                    bg={'transparent'}
                                                    name={country}
                                                    size='xs'
                                                    mr={1}
                                                />
                                                <Text fontSize="xs" mx={1} color="white">{country}</Text>
                                                <Box
                                                    cursor="pointer"
                                                    onClick={() => removeFromSelection(setSelectedCountry, selectedCountry, country)}
                                                    display="flex"
                                                    alignItems="center"
                                                    color="white"
                                                    _hover={{ color: "gray.200" }}
                                                >
                                                    <FaTimes size="10px" />
                                                </Box>
                                            </Badge>
                                        </WrapItem>
                                    ))}
                                    
                                    {/* Add country menu */}
                                    <WrapItem>
                                        <Menu>
                                            <MenuButton
                                                as={IconButton}
                                                icon={<FaPlus />}
                                                size="sm"
                                                variant="outline"
                                                height="32px"
                                                aria-label="Add country filter"
                                            />
                                            <MenuList maxHeight="300px" overflowY="auto">
                                                {countrySelection.map((country) => (
                                                    <MenuItem
                                                        key={country}
                                                        onClick={() => addToSelection(setSelectedCountry, selectedCountry, country)}
                                                        isDisabled={selectedCountry.includes(country)}
                                                    >
                                                        <HStack>
                                                            <Avatar
                                                                src={nation_name_to_twemoji_flag(country)}
                                                                bg={'transparent'}
                                                                name={country}
                                                                size='xs'
                                                            />
                                                            <Text>{country}</Text>
                                                        </HStack>
                                                    </MenuItem>
                                                ))}
                                            </MenuList>
                                        </Menu>
                                    </WrapItem>
                                </Wrap>
                            </Box>

                            {/* Ship Type Filter Section */}
                            <Box p={2}>
                                <Wrap spacing={2} align="center">
                                    <WrapItem>
                                        <Text fontWeight={500} fontSize="sm" minW="80px">Ship Type:</Text>
                                    </WrapItem>
                                    
                                    {/* Ship Type badges */}
                                    {selectedShipType.map((type, index) => (
                                        <WrapItem key={index}>
                                            <Badge
                                                variant="solid"
                                                colorScheme="green"
                                                display="flex"
                                                alignItems="center"
                                                gap={1}
                                                px={2}
                                                py={1}
                                                borderRadius="md"
                                                height="32px"
                                            >
                                                <Avatar
                                                    src={type_name_to_icon(type)}
                                                    bg={'transparent'}
                                                    name={type}
                                                    size='xs'
                                                    mr={1}
                                                />
                                                <Text fontSize="xs" mx={1} color="white">{type}</Text>
                                                <Box
                                                    cursor="pointer"
                                                    onClick={() => removeFromSelection(setSelectedShipType, selectedShipType, type)}
                                                    display="flex"
                                                    alignItems="center"
                                                    color="white"
                                                    _hover={{ color: "gray.200" }}
                                                >
                                                    <FaTimes size="10px" />
                                                </Box>
                                            </Badge>
                                        </WrapItem>
                                    ))}
                                    
                                    {/* Add ship type menu */}
                                    <WrapItem>
                                        <Menu>
                                            <MenuButton
                                                as={IconButton}
                                                icon={<FaPlus />}
                                                size="sm"
                                                variant="outline"
                                                height="32px"
                                                aria-label="Add ship type filter"
                                            />
                                            <MenuList maxHeight="300px" overflowY="auto">
                                                {shipTypeSelection.map((type) => (
                                                    <MenuItem
                                                        key={type}
                                                        onClick={() => addToSelection(setSelectedShipType, selectedShipType, type)}
                                                        isDisabled={selectedShipType.includes(type)}
                                                    >
                                                        <HStack>
                                                            <Avatar
                                                                src={type_name_to_icon(type)}
                                                                bg={'transparent'}
                                                                name={type}
                                                                size='xs'
                                                            />
                                                            <Text>{type}</Text>
                                                        </HStack>
                                                    </MenuItem>
                                                ))}
                                            </MenuList>
                                        </Menu>
                                    </WrapItem>
                                </Wrap>
                            </Box>

                            {/* Franchise Filter Section */}
                            <Box p={2}>
                                <Wrap spacing={2} align="center">
                                    <WrapItem>
                                        <Text fontWeight={500} fontSize="sm" minW="80px">Franchise:</Text>
                                    </WrapItem>
                                    
                                    {/* Franchise badges */}
                                    {selectedFranchise.map((franchise, index) => (
                                        <WrapItem key={index}>
                                            <Badge
                                                variant="solid"
                                                colorScheme="purple"
                                                display="flex"
                                                alignItems="center"
                                                gap={1}
                                                px={2}
                                                py={1}
                                                borderRadius="md"
                                                height="32px"
                                            >
                                                <Text fontSize="xs" mx={1} color="white">{franchise}</Text>
                                                <Box
                                                    cursor="pointer"
                                                    onClick={() => removeFromSelection(setSelectedFranchise, selectedFranchise, franchise)}
                                                    display="flex"
                                                    alignItems="center"
                                                    color="white"
                                                    _hover={{ color: "gray.200" }}
                                                >
                                                    <FaTimes size="10px" />
                                                </Box>
                                            </Badge>
                                        </WrapItem>
                                    ))}
                                    
                                    {/* Add franchise menu */}
                                    <WrapItem>
                                        <Menu>
                                            <MenuButton
                                                as={IconButton}
                                                icon={<FaPlus />}
                                                size="sm"
                                                variant="outline"
                                                height="32px"
                                                aria-label="Add franchise filter"
                                            />
                                            <MenuList maxHeight="300px" overflowY="auto">
                                                {franchiseSelection.map((franchise) => (
                                                    <MenuItem
                                                        key={franchise}
                                                        onClick={() => addToSelection(setSelectedFranchise, selectedFranchise, franchise)}
                                                        isDisabled={selectedFranchise.includes(franchise)}
                                                    >
                                                        <Text>{franchise}</Text>
                                                    </MenuItem>
                                                ))}
                                            </MenuList>
                                        </Menu>
                                    </WrapItem>
                                </Wrap>
                            </Box>

                            {/* Sort By Section */}
                            <Box
                                border="1px"
                                borderColor="gray.600"
                                borderRadius="lg"
                                p={2}
                                bg="transparent"
                            >
                                <Wrap spacing={2} align="center">
                                    <WrapItem>
                                        <Text fontWeight={500} fontSize="sm" minW="80px">Sort by:</Text>
                                    </WrapItem>
                                    
                                    {/* Sort badges */}
                                    {sortBy.map((sort, index) => {
                                        const direction = sort[0]
                                        const field = sort.slice(1)
                                        const label = getSortLabel(field)
                                        const isRandom = field === 'random'
                                        
                                        return (
                                            <WrapItem key={index}>
                                                <Badge
                                                    variant="solid"
                                                    colorScheme={isRandom ? "gray" : (direction === 'a' ? 'blue' : 'red')}
                                                    display="flex"
                                                    alignItems="center"
                                                    gap={1}
                                                    px={2}
                                                    py={1}
                                                    borderRadius="md"
                                                    height="32px"
                                                >
                                                    {!isRandom && (
                                                        <IconButton
                                                            size="xs"
                                                            minW="auto"
                                                            h="auto"
                                                            p={1}
                                                            cursor="pointer"
                                                            onClick={() => toggleSortDirection(index)}
                                                            icon={direction === 'a' ? <FaArrowUp size="10px" /> : <FaArrowDown size="10px" />}
                                                            colorScheme="whiteAlpha"
                                                            variant="ghost"
                                                            color="white"
                                                            aria-label={direction === 'a' ? 'Sort ascending' : 'Sort descending'}
                                                        />
                                                    )}
                                                    {isRandom && (
                                                        <Box
                                                            display="flex"
                                                            alignItems="center"
                                                            color="white"
                                                        >
                                                            <FaDice size="10px" />
                                                        </Box>
                                                    )}
                                                    <Text fontSize="xs" mx={1} color="white">{label}</Text>
                                                    <Box
                                                        cursor="pointer"
                                                        onClick={() => removeSortOption(index)}
                                                        display="flex"
                                                        alignItems="center"
                                                        color="white"
                                                        _hover={{ color: "gray.200" }}
                                                    >
                                                        <FaTimes size="10px" />
                                                    </Box>
                                                </Badge>
                                            </WrapItem>
                                        )
                                    })}
                                    
                                    {/* Add sort option menu */}
                                    <WrapItem>
                                        <Menu>
                                            <MenuButton
                                                as={IconButton}
                                                icon={<FaPlus />}
                                                size="sm"
                                                variant="outline"
                                                height="32px"
                                                aria-label="Add sort option"
                                            />
                                            <MenuList>
                                                {sortOptions.map((option) => (
                                                    <MenuItem
                                                        key={option.value}
                                                        onClick={() => addSortOption(option.value)}
                                                        isDisabled={sortBy.some(sort => sort.slice(1) === option.value)}
                                                    >
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </MenuList>
                                        </Menu>
                                    </WrapItem>
                                </Wrap>
                            </Box>
                        </SimpleGrid>

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
                                <Stack direction={'row'} spacing='10px' marginBottom='10px' wrap={'wrap'}>
                                    <Text fontWeight={500}>Available Extra Content: </Text>
                                    <CheckboxGroup>
                                        <Checkbox isChecked={getModifierValue(extraContentMod, 0)} onChange={(e) => setExtraContentMod(toggleModifierValue(extraContentMod, 0))}>Voiceline</Checkbox>
                                        <Checkbox isChecked={getModifierValue(extraContentMod, 1)} onChange={(e) => setExtraContentMod(toggleModifierValue(extraContentMod, 1))}>Live2D</Checkbox>
                                        <Checkbox isChecked={getModifierValue(extraContentMod, 2)} onChange={(e) => setExtraContentMod(toggleModifierValue(extraContentMod, 2))}>Chibi</Checkbox>
                                        <Checkbox isChecked={getModifierValue(extraContentMod, 3)} onChange={(e) => setExtraContentMod(toggleModifierValue(extraContentMod, 3))}>Dynamic</Checkbox>
                                        <Checkbox isChecked={getModifierValue(extraContentMod, 4)} onChange={(e) => setExtraContentMod(toggleModifierValue(extraContentMod, 4))}>3D Model</Checkbox>
                                    </CheckboxGroup>
                                </Stack>
                                </AccordionPanel>
                            </AccordionItem>
                        </Accordion>

                        <Flex direction={'row'} alignItems={'center'} gap={4}>
                            <Button bg={'primary'} size={'lg'} onClick={onSearch}>Search</Button>
                            
                            {/* Random sort warning */}
                            {sortBy.some(sort => sort.slice(1) === 'random') && (
                                <Alert status="info" size="sm" borderRadius="md" maxW="500px">
                                    <AlertIcon />
                                    <Text fontSize="xs">
                                        Random sort is active and will override all other sorting options.
                                    </Text>
                                </Alert>
                            )}
                        </Flex>

                    </Box>
                    {/* result here as a table? */}
                    <Flex direction={'row'} wrap={'wrap'} justify={'space-between'} alignItems={'center'}>
                        <Select defaultValue={'card'} size='md' mt={'40px'} width={'300px'} bgColor={'muted'} onChange={onResultViewChange}>
                            <option key='table' value='table'>Table</option>
                            <option key='card' value='card'>Cards</option>
                        </Select>
                        <Select size='md' mt={'40px'} width={'300px'} value={limitPerPage} bgColor={'muted'} onChange={onLimitPerPageChange}>
                            <option key='20' value={20}>20 Entries</option>
                            <option key='40' value={40}>40 Entries</option>
                            <option key='100' value={100}>100 Entries</option>
                        </Select>
                    </Flex>

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