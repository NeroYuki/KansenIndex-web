import { Box, Flex, Heading } from "@chakra-ui/react"
import { NavigationTop, SiteHeader } from "../../Component"

export const ShipIndex = () => {
    return (
        <Flex direction={'column'} height={'100%'}>
            <SiteHeader />
            <Box bg='tomato' h='200px'></Box>
        </Flex>
    )
}