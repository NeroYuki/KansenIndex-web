import { Box, Button, Divider, Flex, Text } from "@chakra-ui/react"

export const FranchiseCardView = (props) => {
    return (
        <Box className="apply-shadow" h='180px' w='400px' bg='yellow.100' style={{borderRadius: '10px'}}>
            <Flex direction={"row"}>
                <div style={{flex: 4}}> Insert logo here</div>
                <Flex height='180px'>
                    <Divider orientation="vertical"></Divider>
                </Flex>
                <div style={{flex: 5, padding: '12px'}}>
                    <Text fontSize={16} fontWeight={500}>Placeholder</Text>
                    <Divider my={'10px'}></Divider>
                    <Text>Content</Text>
                    <Button mt={'10px'}>Explore</Button>
                </div>
            </Flex>
        </Box>
    )
}