import React from 'react'
import { Select, Flex, Icon, Tooltip, Box } from '@chakra-ui/react'
import { FaShieldAlt } from 'react-icons/fa'
import { useContentFilter } from '../../Context/ContentFilterContext'

export const ContentRatingSelector = () => {
    const { maxRating, setMaxRating } = useContentFilter()

    const handleRatingChange = (event) => {
        setMaxRating(event.target.value)
    }

    return (
        <Flex direction="row" alignItems="center" mr={4}>
            <Tooltip label="Content Filter: Select maximum rating to display" placement="bottom">
                <Box>
                    <Icon as={FaShieldAlt} color="orange.400" boxSize="16px" mr={2} />
                </Box>
            </Tooltip>
            <Select 
                value={maxRating}
                onChange={handleRatingChange}
                size="sm"
                width="120px"
                variant="filled"
            >
                <option value="general">General</option>
                <option value="sensitive">Sensitive</option>
                <option value="questionable">Questionable</option>
                <option value="explicit">Explicit</option>
            </Select>
        </Flex>
    )
}