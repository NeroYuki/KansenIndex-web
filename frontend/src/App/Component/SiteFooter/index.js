import { Box } from "@chakra-ui/react"

export const SiteFooter = () => {
    return (
        <Box flex='1' bg='gray.200' display='flex' justifyContent={'space-between'} flexDirection={'row'} p='20px'>
            <p flex='1'>Site Footer</p>
            <p flex='1'>2021, made by NeroYuki</p>
        </Box>
    )
}