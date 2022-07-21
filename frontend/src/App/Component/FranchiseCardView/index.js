import { Box, Button, Divider, Flex, Text } from "@chakra-ui/react"

export const FranchiseCardView = (props) => {
    return (
        <Box className="apply-shadow" h='180px' w='400px' bg='yellow.100' style={{borderRadius: '10px'}}>
            <Flex direction={"row"}>
                <div style={{flex: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 10}}>{props.image_link ? <img src={props.image_link} alt="title logo"></img>  : 'Insert logo here'}</div>
                <Flex height='180px'>
                    <Divider orientation="vertical"></Divider>
                </Flex>
                <div style={{flex: 5, padding: '12px'}}>
                    <Text fontSize={16} fontWeight={500}>{props.title ? props.title : 'Placeholder'}</Text>
                    <Divider my={'10px'}></Divider>
                    <Text>{props.content ? props.content : 'Content'}</Text>
                    <Button mt={'10px'} onClick={() => {props.onExplore ? props.onExplore(props.id) : console.log("FranchiseCardView:Button: default")}} >Explore</Button>
                </div>
            </Flex>
        </Box>
    )
}