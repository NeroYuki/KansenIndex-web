import { Box, Heading, Flex } from '@chakra-ui/react'
import { NavigationTop } from '..'

import {
	Drawer,
	DrawerBody,
	DrawerFooter,
	DrawerHeader,
	DrawerOverlay,
	DrawerContent,
	DrawerCloseButton,
} from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/react'
import { SubmissionPanel } from '../SubmissionPanel'

export const SiteHeader = (props) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <Flex direction={'column'} >
            <Box flex='1' bg='blue.200' p='20px'>
                <Heading as='h3'>KansenIndex</Heading>
            </Box>
            <Box flex='1' bg='gray.200'>
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