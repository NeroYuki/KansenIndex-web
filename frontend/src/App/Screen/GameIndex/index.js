import { Box, Flex, Heading, SlideFade } from "@chakra-ui/react"
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
} from '@chakra-ui/react'
import { NavigationTop, SiteHeader } from "../../Component"

export const GameIndex = () => {
    return (
        <Flex direction={'column'} height={'100%'}>
            <SiteHeader />
            <SlideFade in={true} offsetY='-80px'>
                <Box bg='yellow.200' h='200px'>
                    
                </Box>
            </SlideFade>
        </Flex>
    )
}