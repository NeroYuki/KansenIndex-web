import { Box, Stack, Icon, SlideFade, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';
import { FaClipboard, FaGamepad, FaHome, FaInfo, FaRegPlusSquare, FaShip, FaBars, FaHeart} from 'react-icons/fa'
import { Link } from 'react-router-dom'

const NavigationEntry = (props) => {
    return (
        <Link to={props.to || "#"} onClick={props.onClick ? props.onClick : () => {}} className="nav-button-container">
            <Box as='button' _hover={{ bg: 'secondary_active' }} minWidth='150px' width='100%' p='20px' display='flex' flexDirection='row' className='nav-button'>
                <Icon as={props.icon} mr='20px' boxSize='20px' /> <p>{props.title}</p>
            </Box>
        </Link>
    )
}

const ExpandedNavigationEntry = (props) => {
    return (
        <Link to={props.to || "#"} onClick={props.onClick ? props.onClick : () => {}}>
            <Box as='button' _hover={{ bg: 'secondary_active' }} minWidth='150px' width='100%' p='20px' display='flex' flexDirection='row'>
                <Icon as={props.icon} mr='20px' boxSize='20px' /> <p>{props.title}</p>
            </Box>
        </Link>
    )
}

export const NavigationTop = (props) => {
    const { isOpen, onToggle } = useDisclosure()

    return (
        <div style={{display: 'flex', flexDirection: 'column'}}>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <Stack direction={['row']} spacing={'0'} wrap={'wrap'}>
                    <NavigationEntry icon={FaHome} title='Home' to="/" />
                    <NavigationEntry icon={FaShip} title='Ship Index' to="/ship_list" />
                    <NavigationEntry icon={FaGamepad} title='Game Index' to="/game_list" />
                    <NavigationEntry icon={FaHeart} title='Top Favorite' to="/top_fav" />
                    <NavigationEntry icon={FaClipboard} title='Project' to="/project" />
                </Stack>
                <NavigationEntry icon={FaRegPlusSquare} title='Submission' onClick={props.onSubmissionOpen ? props.onSubmissionOpen : () => {}}/>
                <Box as='button' _hover={{ bg: 'blue.100' }} p='20px' flexDirection='row' justifyContent='space-evenly' className="expand-button" onClick={onToggle}>
                    <Icon as={FaBars} boxSize='20px' />
                </Box>
            </div>
            {/* TODO: I want this to collapse when expand */}
            <SlideFade in={isOpen} offsetY='-80px'>
            <div className='expanded-nav-container expand' style={{height: (isOpen)? 'auto' : 0}}>
                
                <ExpandedNavigationEntry icon={FaShip} title='Ship Index' to="/ship_list" />
                <ExpandedNavigationEntry icon={FaGamepad} title='Game Index' to="/game_list" />
                <ExpandedNavigationEntry icon={FaHeart} title='Top Favorite' to="/top_fav"  />
                <ExpandedNavigationEntry icon={FaClipboard} title='Project' to="/project" />
                <ExpandedNavigationEntry icon={FaRegPlusSquare} title='Submission' onClick={props.onSubmissionOpen ? props.onSubmissionOpen : () => {}}/>
            </div>
            </SlideFade>
        </div>
    )
}