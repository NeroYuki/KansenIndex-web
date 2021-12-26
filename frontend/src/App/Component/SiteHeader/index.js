import { Box, Heading, Flex } from '@chakra-ui/react'
import { NavigationTop } from '..'

export const SiteHeader = (props) => {
    return (
        <Flex direction={'column'} >
            <Box flex='1' bg='blue.200' p='20px'>
                <Heading as='h3'>Test Site</Heading>
            </Box>
            <Box flex='1' bg='gray.200'>
                <NavigationTop />
            </Box>
        </Flex>
    )
}