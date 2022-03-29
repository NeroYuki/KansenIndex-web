import { Box, Flex, Heading, HStack, SlideFade, Stack, Wrap } from "@chakra-ui/react"
import { FranchiseCardView, NavigationTop, SiteHeader, SiteFooter } from "../../Component"

export const WrapCardView = (props, ...rest) => {
    return (
        <div style={{margin: '20px'}}>
            <FranchiseCardView {...rest}></FranchiseCardView>
        </div>
    )
}

export const GameIndex = () => {
    return (
        <Flex direction={'column'} height={'100%'}>
            <SiteHeader />
            <SlideFade in={true} offsetY='-80px'>
                <Flex bg='yellow.200' direction={'row'} wrap={'wrap'} justify={'space-evenly'}>
                    <WrapCardView></WrapCardView>
                    <WrapCardView></WrapCardView>
                    <WrapCardView></WrapCardView>
                    <WrapCardView></WrapCardView>
                    <WrapCardView></WrapCardView>
                    <WrapCardView></WrapCardView>
                </Flex>
            </SlideFade>
            <SiteFooter></SiteFooter>
        </Flex>
    )
}