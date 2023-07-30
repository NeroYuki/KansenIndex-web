import { Box, Flex, SlideFade, HStack, Tag, Text, Center, Button, IconButton, Icon, useToast,Tabs, TabList, TabPanels, Tab, TabPanel, VStack } from "@chakra-ui/react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { FaCopy, FaPlay, FaSearch, FaSpinner } from "react-icons/fa"
import { useLocation, useNavigate } from "react-router-dom"
import { SiteFooter, SiteHeader } from "../../Component"
import { debounce } from "lodash"
import { GET_cgById, POST_getFav, POST_toggleFav } from "../../Service/shipgirl"
import { MdFavorite, MdFavoriteBorder } from "react-icons/md"
import { Live2DModel } from 'pixi-live2d-display/cubism4';
import * as PIXI from 'pixi.js';
import {Spine} from 'pixi-spine';

function useQuery() {
    const { search } = useLocation();
  
    return useMemo(() => new URLSearchParams(search), [search]);
}

const SoundCard = (props) => {
    // make a card component for playing the sound effect with a play button and the sound filename
    return (
        <Box width={'30%'} style={{ margin: '12px' }}>
            <Button onClick={() => props.onClick(props.filename)} isLoading={props.isLoading} leftIcon={<Icon as={FaPlay} />} width={'100%'} colorScheme='blue' variant='outline' size='lg' mr='2'>{props.filename.slice(props.filename.lastIndexOf('/'))}</Button>
        </Box>
    )
}

export const CGInfo = (props) => {

    const location = useLocation()
    const query = useQuery()
    const toast = useToast()

    function showSuccessToast(msg) {
        toast({
            title: 'Success',
            description: msg,
            status: 'success',
            duration: 5000,
            isClosable: true,
        })
    }

    const [cgInfoState, setCgInfoState] = useState({
        char: 'Placeholder Character',
        filename: 'Placeholder Filename.png',
        folder: 'Placeholder Folder',
        is_base: true,
        is_damage: true,
        is_oath: true,
        is_retrofit: true,
        l2d: null,
        _id: '0'
    })
    
    useEffect(() => {
        if (location.state && location.state.data) {
            console.log(location.state.data)
            setCgInfoState(location.state.data)
        }
        else if (query.get("id")) {
            GET_cgById(query.get("id")).then((res) => {
                setCgInfoState(res)
            })
        }
    }, [location])


    const navigate = useNavigate()
    const [favCount, setFavCount] = useState(0)
    const [isFav, setIsFav] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const data = cgInfoState

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

    useEffect(async () => {
        // get fav count
        if (data.char === 'Placeholder Character' || data.folder === 'Placeholder Folder') return
        setIsLoading(true)
        POST_getFav(data.char, data.folder).then((res) => {
            setFavCount(res.count)
            setIsFav(res.is_fav)
            setIsLoading(false)
        })

        if (data.spine) {
            const spine_app = new PIXI.Application({
                view: document.getElementById('spine-canvas-full'),
            });

            spine_app.loader
                .add('spineCharacter', data.spine.dir)
                .load(function (loader, resources) {
                    const animation = new Spine(resources.spineCharacter.spineData);
                    const orig_size = [animation.width, animation.height]

                    //scale to 500
                    if (orig_size[0] > 500 || orig_size[1] > 500) {
                        const target_width = Math.min(500, 500 * (orig_size[0] / orig_size[1]))
                        const target_height = Math.min(500, 500 * (orig_size[1] / orig_size[0]))
                        
                        animation.height = target_height;
                        animation.width = target_width;
                    }

                    animation.x = (spine_app.screen.width) /2;
                    animation.y = (spine_app.screen.height) /2;

                    // add the animation to the scene and render...
                    spine_app.stage.addChild(animation);

                    // full_normal_loop for normal spine
                    if (animation.state.hasAnimation("fullBg_normal_loop")) {
                        animation.state.setAnimation(0, "fullBg_normal_loop", true);
                    }
                    else if (animation.state.hasAnimation("full_normal_loop")) {
                        animation.state.setAnimation(0, "full_normal_loop", true);
                    }
                    else {
                        const anim_names = animation.spineData.animations.map((anim) => anim.name)
                        const random_anim = anim_names[Math.floor(Math.random() * anim_names.length)]
                        animation.state.setAnimation(0, random_anim, true);
                    }
                    // dont run too fast
                    animation.state.timeScale = 1;
                    
                    spine_app.start();
                });
        }

        if (data.chibi) {
            const chibi_spine_app = new PIXI.Application({
                view: document.getElementById('spine-canvas'),
            });

            chibi_spine_app.loader
                .add('chibiSpineCharacter', data.chibi.dir)
                .load(function (loader, resources) {
                    const animation = new Spine(resources.chibiSpineCharacter.spineData);

                    const orig_size = [animation.width, animation.height]

                    //scale to 500
                    if (orig_size[0] > 500 || orig_size[1] > 500) {
                        const target_width = Math.min(500, 500 * (orig_size[0] / orig_size[1]))
                        const target_height = Math.min(500, 500 * (orig_size[1] / orig_size[0]))
                        
                        animation.height = target_height;
                        animation.width = target_width;
                    }

                    animation.x = (chibi_spine_app.screen.width) /2;
                    animation.y = (chibi_spine_app.screen.height + animation.height) /2;

                    // add the animation to the scene and render...
                    chibi_spine_app.stage.addChild(animation);

                    // full_normal_loop for normal spine
                    if (animation.state.hasAnimation("idle")) {
                        animation.state.setAnimation(0, "idle", true);
                    }
                    else {
                        const anim_names = animation.spineData.animations.map((anim) => anim.name)
                        const random_anim = anim_names[Math.floor(Math.random() * anim_names.length)]
                        animation.state.setAnimation(0, random_anim, true);
                    }
                    // dont run too fast
                    animation.state.timeScale = 1;
                    
                    chibi_spine_app.start();
                });
        }

        if (data.l2d) {
            window.PIXI = PIXI;
            // init PIXI
            const app = new PIXI.Application({
                view: document.getElementById('l2d-canvas'),
            });

            const model = await Live2DModel.from(data.l2d.dir, { autoInteract: false });
            
        
            app.stage.addChild(model);

            const orig_size = [model.width, model.height]

            //scale to 500
            const target_width = Math.min(500, 500 * (orig_size[0] / orig_size[1]))
            const target_height = Math.min(500, 500 * (orig_size[1] / orig_size[0]))

            // transforms
            model.rotation = Math.PI;
            model.skew.x = Math.PI;
            const scale_mul = (data.folder == "Azur Lane") ? 1.4 : 1
            model.scale.set(target_width / model.width * scale_mul, target_height / model.height * scale_mul);
            model.anchor.set(0.5, 0.5);
            model.x = (app.screen.width) / 2;
            model.y = (app.screen.height) / 2 ;

            model.internalModel.motionManager.startRandomMotion('');

            setInterval(() => {
                if (!model.internalModel.motionManager.playing) {
                    model.internalModel.motionManager.startRandomMotion('');
                }
            }, 66)
        }
        
    }, [data])   

    // unload the model and remove PIXI app when unmount
    useEffect(() => {
        return () => {
            if (data.l2d) {
                PIXI.Application.destroy()
            }
        }
    }, [])

    const onToggleFavoriteDebounce = useRef(debounce((char, folder) => {
        setIsLoading(true)
        POST_toggleFav(char, folder).then((res) => {
            setFavCount(res.count)
            setIsFav(res.is_fav)
            setIsLoading(false)
        })
    }, 1000)).current

    const onToggleFavorite = () => {
        onToggleFavoriteDebounce(data.char, data.folder)
    }

    const onCopyLink = () => {
        navigator.clipboard.writeText('https://kansenindex.dev/cg_info?id=' + data._id)
        showSuccessToast('Link copied to clipboard')
    }

    const onSoundPlay = (sound) => {
        const audio = new Audio(sound)
        audio.play()
    }

    const soundCardList = (data.voice?.files || []).map((sound, index) => {
        return (
            <SoundCard key={index} onClick={onSoundPlay} isLoading={false} filename={sound} />
        )
    })

    return (
        <Flex direction={'column'}>
            <SiteHeader />
            <SlideFade in={true} offsetY='-80px'>
                <Flex direction={'row'} wrap={'wrap'}>
                    <Box p='16px' flex='1' minW={'360px'}>
                        <Tabs>
                            <TabList>
                                <Tab>Image</Tab>
                                {data.l2d && <Tab>Live2D <Tag ml={3} size={'md'} bg={'green.200'}>New</Tag></Tab>}
                                {data.chibi && <Tab>Spine (Chibi)<Tag ml={3} size={'md'} bg={'green.200'}>New</Tag></Tab>}
                                {data.spine && <Tab>Spine <Tag ml={3} size={'md'} bg={'green.200'}>New</Tag></Tab>}
                                {data.m3d && <Tab>3D <Tag ml={3} size={'md'} bg={'red.200'}>Soon</Tag></Tab>}
                                {data.voice && <Tab>Sound <Tag ml={3} size={'md'} bg={'green.200'}>New</Tag></Tab>}
                            </TabList>
                            <TabPanels>
                                <TabPanel>
                                    <Center >
                                        {/* Image */}
                                        <img style={{height: 500, margin: 'auto', objectFit: 'scale-down'}} src={data.full_dir} alt="hover_img"></img>
                                    </Center>
                                </TabPanel>
                                {data.l2d && <TabPanel>
                                    <Center>
                                        {/* Live2D */}
                                        <canvas id="l2d-canvas" height={500}></canvas>
                                    </Center>
                                </TabPanel>}
                                {data.chibi && <TabPanel>
                                    <Center>
                                        {/* Spine (Chibi) */}
                                        <canvas id="spine-canvas" height={500}></canvas>
                                    </Center>
                                </TabPanel>}
                                {data.spine && <TabPanel>
                                    <Center>
                                        {/* Spine */}
                                        <canvas id="spine-canvas-full" height={500}></canvas>
                                    </Center>
                                </TabPanel>}
                                {data.m3d && <TabPanel>
                                    <Center>
                                        {/* 3D */}
                                        <div></div>
                                    </Center>
                                </TabPanel>}
                                {data.voice && <TabPanel>
                                    <Center>
                                        {/* Sound */}
                                        <Flex direction={'row'} wrap={'wrap'} justify={'space-evenly'}>
                                            {soundCardList}
                                        </Flex>
                                    </Center>
                                </TabPanel>}
                            </TabPanels>
                        </Tabs>
                        
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

                        <Flex direction={'row'} justifyContent={'space-between'}>
                            <Button mt={2} onClick={onToggleFavorite} disabled={isLoading} bgColor={isFav ? 'pink' : 'lightgray'} color={isFav ? 'purple' : 'black'}>
                                <Icon as={isLoading ? FaSpinner : isFav ? MdFavorite : MdFavoriteBorder} />
                                <Text ml={2}>{isLoading ? '...' : favCount}</Text>
                            </Button>
                            <Button mt={2}  onClick={onCopyLink}>
                                <Icon as={FaCopy} />
                                <Text ml={2}>Copy Link</Text>
                            </Button>
                        </Flex>
                    </Box>
                </Flex>
            </SlideFade>
            <SiteFooter />
        </Flex>
    )
}