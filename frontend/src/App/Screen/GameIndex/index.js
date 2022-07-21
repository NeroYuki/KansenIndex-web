import { Box, Flex, Heading, HStack, SlideFade, Stack, Wrap, Modal, 
    ModalHeader, ModalBody, ModalFooter, ModalOverlay, ModalContent, ModalCloseButton, useDisclosure, Button, useToast} from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { FranchiseCardView, NavigationTop, SiteHeader, SiteFooter, FranchiseDetailView } from "../../Component"
import { GET_info, GET_list_all } from "../../Service/game"

export const WrapCardView = (props) => {
    const { ...rest } = props
    return (
        <div style={{ margin: '20px' }}>
            <FranchiseCardView {...rest}></FranchiseCardView>
        </div>
    )
}

export const GameIndex = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast()
    const [gameList, setGameList] = useState([])
    const [gameInfo, setGameInfo] = useState({})

    function showErrorToast(e) {
        toast({
            title: 'Error',
            description: e,
            status: 'error',
            duration: 5000,
            isClosable: true,
        })
    }

    useEffect(() => {
        async function fetchData() {
            let res = await GET_list_all().catch(e => showErrorToast(e))
            if (!res) return
            setGameList(res)
        }
        fetchData()
    }, [])

    const onExplore = (id) => {
        onOpen()
        //console.log(id)
        if (gameInfo.id && gameInfo.id === id) return
        async function fetchData(id) {
            let res = await GET_info(id).catch(e => showErrorToast(e))
            if (!res) return
            console.log(res)
            setGameInfo(res)
        }
        fetchData(id)
    }

    const cardList = gameList.map((val) => {
        return (
            <WrapCardView key={val.id} id={val.id} title={val.name} content={val.desc} onExplore={onExplore} image_link={val.icon_image}></WrapCardView>
        )
    })

    return (
        <Flex direction={'column'} height={'100%'}>
            <SiteHeader />
            <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={true} size={'6xl'}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Game Detail</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FranchiseDetailView data={gameInfo}/>
                    </ModalBody>
                </ModalContent>
            </Modal>

            <SlideFade in={true} offsetY='-80px'>
                <Flex bg='yellow.200' direction={'row'} wrap={'wrap'} justify={'space-evenly'}>
                    {cardList}
                </Flex>
            </SlideFade>
            <SiteFooter></SiteFooter>
        </Flex>
    )
}