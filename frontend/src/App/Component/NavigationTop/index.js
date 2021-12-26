import { Box, Stack, Icon } from '@chakra-ui/react';
import { FaGamepad, FaHome, FaInfo, FaRegPlusSquare, FaShip } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const NavigationEntry = (props) => {
    return (
        <Link to={props.to || "#"}>
            <Box as='button' _hover={{ bg: 'blue.100' }} p='20px' display='flex' flexDirection='row' justifyContent='space-between'>
                <Icon as={props.icon} mr='10px' boxSize='20px' /> <p>{props.title}</p>
            </Box>
        </Link>
    )
}

export const NavigationTop = (props) => {
    return (
        <Stack direction={['row']} spacing={'0'}>
            <NavigationEntry icon={FaHome} title='Home' to="/" />
            <NavigationEntry icon={FaShip} title='Ship Index' to="/ship_list" />
            <NavigationEntry icon={FaGamepad} title='Game Index' />
            <NavigationEntry icon={FaRegPlusSquare} title='Submission' />
            <NavigationEntry icon={FaInfo} title='About' />
        </Stack>
    )
}