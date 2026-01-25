import React, { useState } from 'react'
import { Box, Button, Flex, Text, Icon } from '@chakra-ui/react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { useContentFilter } from '../../Context/ContentFilterContext'

export const CensoredImage = ({ 
    src, 
    alt, 
    rating, 
    style, 
    buttonText = "Click to reveal content",
    warningText = "This content has been hidden based on your content filter setting",
    ...imageProps 
}) => {
    const { shouldCensorContent } = useContentFilter()
    const [isRevealed, setIsRevealed] = useState(false)
    
    const isCensored = shouldCensorContent(rating) && !isRevealed
    
    if (!isCensored) {
        return <img src={src} alt={alt} style={style} {...imageProps} />
    }

    return (
        <Box 
            style={style} 
            display="flex" 
            alignItems="center" 
            justifyContent="center"
            bg={{ base: "gray.100", _dark: "gray.700" }}
            border="2px dashed"
            borderColor={{ base: "gray.400", _dark: "gray.500" }}
            borderRadius="md"
            position="relative"
            minH="200px"
            zIndex={10}
            {...imageProps}
            onClick={(e) => e.stopPropagation()}
        >
            <Flex direction="column" align="center" p={4} zIndex={11}>
                <Icon as={FaEyeSlash} boxSize={8} color={{ base: "gray.500", _dark: "gray.400" }} mb={2} />
                <Text fontSize="sm" color={{ base: "gray.600", _dark: "gray.300" }} textAlign="center" mb={4}>
                    {warningText}
                </Text>
                <Button 
                    size="sm" 
                    colorScheme="blue" 
                    leftIcon={<FaEye />}
                    zIndex={12}
                    onClick={(e) => {
                        e.stopPropagation()
                        setIsRevealed(true)
                    }}
                >
                    {buttonText}
                </Button>
            </Flex>
        </Box>
    )
}