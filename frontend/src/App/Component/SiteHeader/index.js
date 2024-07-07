import { Box, Heading, Flex, Switch, Text, useColorMode, Icon } from '@chakra-ui/react'
import { NavigationTop } from '..'
import { FaMoon, FaSun } from 'react-icons/fa'
import {
	Drawer,
	DrawerBody,
	DrawerHeader,
	DrawerOverlay,
	DrawerContent,
} from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/react'
import { SubmissionPanel } from '../SubmissionPanel'
import { Link } from 'react-router-dom'

export const SiteHeader = (props) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { colorMode, toggleColorMode } = useColorMode()
    return (
        <Flex direction={'column'} style={{position: 'fixed', zIndex: 4, width: '100%', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'}}>
            <Box flex='1' 
                bg="primary" 
                p='20px'>
                <Flex direction={'row'} alignItems={'center'} justify={'space-between'}> 
                    <Box flex='3'>
                        <Link to="/">
                            <Heading as='h6'>KansenIndex</Heading>
                        </Link>
                    </Box>
                    <Flex flex='1' direction={'row'} justifyContent={'right'}>
                        <Icon color={'yellow.400'} as={FaSun} boxSize='20px' mr="12px"/>
                        <Switch size='md' onChange={toggleColorMode} isChecked={colorMode !== 'light'}/>
                        <Icon color={'yellow.100'} as={FaMoon} boxSize='20px' ml="12px"/>
                    </Flex>
                </Flex>
            </Box>
            <Box flex='1' bg='secondary'>
                <NavigationTop onSubmissionOpen={onOpen}/>
            </Box>
            <Drawer
				isOpen={isOpen}
				placement='right'
                onClose={onClose}
                size='md'
			>
                <DrawerOverlay />
                <DrawerContent>
                <DrawerHeader borderBottomWidth='1px'>Submit your creation here</DrawerHeader>
                    <DrawerBody>
                        <SubmissionPanel></SubmissionPanel>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </Flex>
    )
}