import { Box } from "@chakra-ui/react"

export const SiteFooter = () => {
    return (
        <Box flex='1' bg='primary' display='flex' justifyContent={'space-between'} flexDirection={'row'} p='20px'>
            <p flex='1'>KansenIndex</p>
            <p flex='1'>2024, made by NeroYuki</p>
        </Box>
    )
}