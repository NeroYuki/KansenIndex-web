import { Box, Center, Flex, Heading, Icon, Input, InputGroup, InputLeftAddon, SlideFade } from "@chakra-ui/react"
import { FaSearch } from 'react-icons/fa'
import { SiteFooter, SiteHeader } from "../../Component"

export const Home = () => {
    return (
        <Flex direction={'column'} height={'100%'}>
            <SiteHeader />
            <SlideFade in={true} offsetY='-80px'>
                <Box bg='gray.300' className='home-content' p='20px' display={'flex'} flexDirection={'column'}>
                    <Heading as='h3' size='2xl' style={{fontWeight: '100'}} p='40px'>Welcome to the KansenIndex</Heading>
                    <p style={{fontSize: 18}}>The all-in-one index of (almost) all franchise involving anthropomorphic warships</p>
                    <Center>
                        <InputGroup width='600px' p='40px' size='lg'>
                            <InputLeftAddon children={<Icon as={FaSearch} />} />
                            <Input placeholder={'Enter a ship\'s name'} variant={'outline'} />
                        </InputGroup>
                    </Center>
                </Box>
                <Box bg='gray.400' className='home-content' p='20px' display={'flex'} flexDirection={'column'}>
                    <Heading as='h4' size='lg' style={{fontWeight: '100'}} p='40px'>Current Database contains...</Heading>
                    <Box display={'flex'} flexDirection={'row'} justifyContent={'space-evenly'} p='40px' className="apply-shadow" >
                        <Box display={'flex'} flexDirection={'column'}>
                            <p>Number of Illustration</p>
                            <p style={{paddingTop: 20, fontSize: 24, fontWeight: 400}}>9775</p>
                        </Box>
                        <Box display={'flex'} flexDirection={'column'}>
                            <p>Number of Ships</p>
                            <p style={{paddingTop: 20, fontSize: 24, fontWeight: 400}}>2800</p>
                        </Box>
                        <Box display={'flex'} flexDirection={'column'}>
                            <p>Number of Franchise</p>
                            <p style={{paddingTop: 20, fontSize: 24, fontWeight: 400}}>21</p>
                        </Box>
                    </Box>
                </Box>
                <Box bg='gray.300' className='home-content' p='20px' display={'flex'} flexDirection={'column'}>
                </Box>
            </SlideFade>
            <SiteFooter></SiteFooter>
        </Flex>
    )
}