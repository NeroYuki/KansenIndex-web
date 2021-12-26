import { Box, Center, Flex, Heading, Icon, Input, InputGroup, InputLeftAddon } from "@chakra-ui/react"
import { FaSearch } from 'react-icons/fa'
import { SiteHeader } from "../../Component"

export const Home = () => {
    return (
        <Flex direction={'column'} height={'100%'}>
            <SiteHeader />
            <Box bg='gray.300' className='home-content' p='20px' display={'flex'} flexDirection={'column'}>
                <Heading as='h3'>Welcome to the KansenIndex</Heading>
                <p>The all-in-one index of (almost) all franchise involving anthropomorphic warships</p>
                <Center>
                    <InputGroup width={'480px'} p='20px'>
                        <InputLeftAddon children={<Icon as={FaSearch} />} />
                        <Input placeholder={'Enter a ship\'s name'} variant={'outline'} />
                    </InputGroup>
                </Center>
            </Box>
            <Box flex='1' bg='gray.200' display='flex' justifyContent={'space-between'} flexDirection={'row'} p='20px'>
                <p flex='1'>Site Footer</p>
                <p flex='1'>2021, made by NeroYuki</p>
            </Box>
        </Flex>
    )
}