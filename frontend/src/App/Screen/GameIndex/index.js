import { Box, Flex, Heading, HStack, SlideFade, Stack, Wrap, Modal, 
    ModalHeader, ModalBody, ModalFooter, ModalOverlay, ModalContent, ModalCloseButton, useDisclosure, Button} from "@chakra-ui/react"
import { useState } from "react"
import { FranchiseCardView, NavigationTop, SiteHeader, SiteFooter, FranchiseDetailView } from "../../Component"

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
    const [gameInfo, setGameInfo] = useState({
        title: "",
        desc: "",
    })

    const onExplore = (id) => {
        onOpen()
    }

    return (
        <Flex direction={'column'} height={'100%'}>

            <SiteHeader />

            <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={true} size={'6xl'}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Game Detail</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FranchiseDetailView image_link={`${process.env.PUBLIC_URL}/assets/shipgirls/Franchise logo/Azur Lane.png`}/>
                    </ModalBody>
                </ModalContent>
            </Modal>

            <SlideFade in={true} offsetY='-80px'>
                <Flex bg='yellow.200' direction={'row'} wrap={'wrap'} justify={'space-evenly'}>
                    <WrapCardView title="Abyss Horizon" onExplore={onExplore} image_link={`${process.env.PUBLIC_URL}/assets/shipgirls/Franchise logo/Abyss Horizon.webp`}></WrapCardView>
                    <WrapCardView title="Akushizu Senki" onExplore={onExplore} image_link={`${process.env.PUBLIC_URL}/assets/shipgirls/Franchise logo/Akizuki Senki.jpg`}></WrapCardView>
                    <WrapCardView title="Arpeggio of Blue Steel" onExplore={onExplore} image_link={`${process.env.PUBLIC_URL}/assets/shipgirls/Franchise logo/Aoki_Hagane.webp`}></WrapCardView>
                    <WrapCardView title="Azur Lane" onExplore={onExplore} image_link={`${process.env.PUBLIC_URL}/assets/shipgirls/Franchise logo/Azur Lane.png`}></WrapCardView>
                    <WrapCardView title="Battleship Bishoujo Puzzle" onExplore={onExplore} image_link={`${process.env.PUBLIC_URL}/assets/shipgirls/Franchise logo/Puzzle girls.png`}></WrapCardView>
                    <WrapCardView title="Battleship Girl -鋼鉄少女-" onExplore={onExplore} image_link={`${process.env.PUBLIC_URL}/assets/shipgirls/Franchise logo/Battleship Girls.png`}></WrapCardView>
                    <WrapCardView title="Battleship War Girl" onExplore={onExplore} ></WrapCardView>
                    <WrapCardView title="Black Surgenights" onExplore={onExplore} image_link={`${process.env.PUBLIC_URL}/assets/shipgirls/Franchise logo/Black surgenight_dark.png`}></WrapCardView>
                    <WrapCardView title="Blue Oath" onExplore={onExplore} image_link={`${process.env.PUBLIC_URL}/assets/shipgirls/Franchise logo/Blue oath.webp`}></WrapCardView>
                    <WrapCardView title="Codename: Coastline" onExplore={onExplore} ></WrapCardView>
                    <WrapCardView title="Counter Arms" onExplore={onExplore} ></WrapCardView>
                    <WrapCardView title="Deep Sea Desire" onExplore={onExplore} image_link={`${process.env.PUBLIC_URL}/assets/shipgirls/Franchise logo/Deep Sea Desire.jpg`}></WrapCardView>
                    <WrapCardView title="Guardian Project" onExplore={onExplore} image_link={`${process.env.PUBLIC_URL}/assets/shipgirls/Franchise logo/Guardian Project.png`}></WrapCardView>
                    <WrapCardView title="Kantai Collection" onExplore={onExplore} image_link={`${process.env.PUBLIC_URL}/assets/shipgirls/Franchise logo/Kantai Collection.png`}></WrapCardView>
                    <WrapCardView title="Lane Girls" onExplore={onExplore} image_link={`${process.env.PUBLIC_URL}/assets/shipgirls/Franchise logo/Lane Girl.png`}></WrapCardView>
                    <WrapCardView title="Moe Moe World War II" onExplore={onExplore} image_link={`${process.env.PUBLIC_URL}/assets/shipgirls/Franchise logo/Moe moe ww2 3.jpg`}></WrapCardView>
                    <WrapCardView title="Shipgirl Collection"onExplore={onExplore} ></WrapCardView>
                    <WrapCardView title="Velvet Code" onExplore={onExplore} image_link={`${process.env.PUBLIC_URL}/assets/shipgirls/Franchise logo/Velvet Code.jpg`}></WrapCardView>
                    <WrapCardView title="Victory Belles" onExplore={onExplore} image_link={`${process.env.PUBLIC_URL}/assets/shipgirls/Franchise logo/Victory Belles.webp`}></WrapCardView>
                    <WrapCardView title="Warship Collection"onExplore={onExplore} ></WrapCardView>
                    <WrapCardView title="Warship Girls R" onExplore={onExplore} image_link={`${process.env.PUBLIC_URL}/assets/shipgirls/Franchise logo/Warship Girl R.jpg`}></WrapCardView>
                </Flex>
            </SlideFade>
            <SiteFooter></SiteFooter>
        </Flex>
    )
}