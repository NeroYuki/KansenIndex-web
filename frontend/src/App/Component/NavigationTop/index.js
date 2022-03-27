import { Box, Stack, Icon } from '@chakra-ui/react';
import { FaClipboard, FaGamepad, FaHome, FaInfo, FaRegPlusSquare, FaShip } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const NavigationEntry = (props) => {
    return (
        <Link to={props.to || "#"} onClick={props.onClick ? props.onClick : () => {}}>
            <Box as='button' _hover={{ bg: 'blue.100' }} minWidth='150px' p='20px' display='flex' flexDirection='row' justifyContent='space-evenly'>
                <Icon as={props.icon} mr='10px' boxSize='20px' /> <p>{props.title}</p>
            </Box>
        </Link>
    )
}

export const NavigationTop = (props) => {
    return (
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <Stack direction={['row']} spacing={'0'}>
                <NavigationEntry icon={FaHome} title='Home' to="/" />
                <NavigationEntry icon={FaShip} title='Ship Index' to="/ship_list" />
                <NavigationEntry icon={FaGamepad} title='Game Index' to="/game_list" />
                <NavigationEntry icon={FaInfo} title='About' to="/about" />
                <NavigationEntry icon={FaClipboard} title='Project' to="/project" />
            </Stack>
            <NavigationEntry icon={FaRegPlusSquare} title='Submission' isRight={true} onClick={props.onSubmissionOpen ? props.onSubmissionOpen : () => {}}/>
        </div>
    )
}