import { Box } from "@chakra-ui/react"

export const SiteFooter = () => {
    return (
        <Box flex='1' bg='gray.200' display='flex' justifyContent={'space-between'} flexDirection={'row'} p='20px'>
            <p flex='1'>KansenIndex</p>
            <p flex='1'>2023, made by NeroYuki</p>
        </Box>
    )
}