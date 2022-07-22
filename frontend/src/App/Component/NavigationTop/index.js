import { Box, Stack, Icon } from '@chakra-ui/react';
import { useState } from 'react';
import { FaClipboard, FaGamepad, FaHome, FaInfo, FaRegPlusSquare, FaShip, FaBars} from 'react-icons/fa'
import { Link } from 'react-router-dom'

const NavigationEntry = (props) => {
    return (
        <Link to={props.to || "#"} onClick={props.onClick ? props.onClick : () => {}} className="nav-button-container">
            <Box as='button' _hover={{ bg: 'blue.100' }} minWidth='150px' width='100%' p='20px' display='flex' flexDirection='row' className='nav-button'>
                <Icon as={props.icon} mr='20px' boxSize='20px' /> <p>{props.title}</p>
            </Box>
        </Link>
    )
}

const ExpandedNavigationEntry = (props) => {
    return (
        <Link to={props.to || "#"} onClick={props.onClick ? props.onClick : () => {}}>
            <Box as='button' _hover={{ bg: 'blue.100' }} minWidth='150px' width='100%' p='20px' display='flex' flexDirection='row'>
                <Icon as={props.icon} mr='20px' boxSize='20px' /> <p>{props.title}</p>
            </Box>
        </Link>
    )
}

export const NavigationTop = (props) => {
    const [expand, setExpand] = useState(false)

    function expandMenu() {
        setExpand(!expand)
    }

    return (
        <div style={{display: 'flex', flexDirection: 'column'}}>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <Stack direction={['row']} spacing={'0'} wrap={'wrap'}>
                    <NavigationEntry icon={FaHome} title='Home' to="/" />
                    <NavigationEntry icon={FaShip} title='Ship Index' to="/ship_list" />
                    <NavigationEntry icon={FaGamepad} title='Game Index' to="/game_list" />
                    <NavigationEntry icon={FaInfo} title='About' to="/about" />
                    <NavigationEntry icon={FaClipboard} title='Project' to="/project" />
                </Stack>
                <NavigationEntry icon={FaRegPlusSquare} title='Submission' onClick={props.onSubmissionOpen ? props.onSubmissionOpen : () => {}}/>
                <Box as='button' _hover={{ bg: 'blue.100' }} p='20px' flexDirection='row' justifyContent='space-evenly' className="expand-button" onClick={expandMenu}>
                    <Icon as={FaBars} boxSize='20px' />
                </Box>
            </div>
            {/* TODO: I want this to collapse when expand */}
            <div className='expanded-nav-container expand' style={{height: (expand)? 'auto' : 0}}>
                <ExpandedNavigationEntry icon={FaShip} title='Ship Index' to="/ship_list" />
                <ExpandedNavigationEntry icon={FaGamepad} title='Game Index' to="/game_list" />
                <ExpandedNavigationEntry icon={FaInfo} title='About' to="/about" />
                <ExpandedNavigationEntry icon={FaClipboard} title='Project' to="/project" />
                <ExpandedNavigationEntry icon={FaRegPlusSquare} title='Submission' onClick={props.onSubmissionOpen ? props.onSubmissionOpen : () => {}}/>
            </div>
        </div>
    )
}