// 1. import `extendTheme` function
import { extendTheme } from '@chakra-ui/react'

// 2. Add your color mode config
const config = {
    initialColorMode: 'system',
    useSystemColorMode: false,
}

const style = {
    semanticTokens: {
        colors: {
            primary: {
                default: "blue.200",
                _dark: "blue.800",
                _light: "blue.200"
            },
            secondary: {
                _dark: "blue.600",
                _light: "blue.100"
            },
            secondary_active: {
                _dark: "blue.400",
                _light: "blue.200"
            },
            muted: {
                _dark: "gray.800",
                _light: "gray.300"
            },
            card: {
                _dark: "gray.700",
                _light: "white"
            },
            backdrop: {
                _dark: "gray.500",
                _light: "gray.200"
            },
            green: {
                _dark: "green.600",
                _light: "green.200"
            },
            red: {
                _dark: "red.600",
                _light: "red.200"
            },
            yellow: {
                _dark: "yellow.600",
                _light: "yellow.200"
            },
            orange: {
                _dark: "orange.600",
                _light: "orange.200"
            },
            pink: {
                _dark: "pink.600",
                _light: "pink.200"
            }
        },
    },
    global: {
        border: {
            _dark: "gray.700",
            _light: "gray.300"
        }
    }
}

// 3. extend the theme
const theme = extendTheme({ config, ...style})

export default theme