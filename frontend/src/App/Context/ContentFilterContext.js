import React, { createContext, useContext, useState, useEffect } from 'react'

const ContentFilterContext = createContext()

export const useContentFilter = () => {
    const context = useContext(ContentFilterContext)
    if (!context) {
        throw new Error('useContentFilter must be used within a ContentFilterProvider')
    }
    return context
}

// Rating hierarchy: general < sensitive < questionable < explicit
const RATING_LEVELS = {
    'general': 0,      // General
    'sensitive': 1,    // Sensitive (PG)
    'questionable': 2, // Questionable (R)
    'explicit': 3      // Explicit (X)
}

const RATING_DISPLAY = {
    'general': 'General',
    'sensitive': 'Sensitive', 
    'questionable': 'Questionable',
    'explicit': 'Explicit'
}

export const ContentFilterProvider = ({ children }) => {
    const [maxRating, setMaxRating] = useState('explicit') // Default to show all content

    // Load from localStorage on mount
    useEffect(() => {
        const savedRating = localStorage.getItem('kansenindex_max_rating')
        if (savedRating && RATING_LEVELS.hasOwnProperty(savedRating)) {
            setMaxRating(savedRating)
        }
    }, [])

    // Save to localStorage when changed
    useEffect(() => {
        localStorage.setItem('kansenindex_max_rating', maxRating)
    }, [maxRating])

    // Check if content should be censored
    const shouldCensorContent = (contentRating) => {
        if (!contentRating) {
            return false // No rating means safe
        }
        
        const contentLevel = RATING_LEVELS[contentRating] !== undefined ? RATING_LEVELS[contentRating] : 0
        const maxLevel = RATING_LEVELS[maxRating] !== undefined ? RATING_LEVELS[maxRating] : 3
        const shouldCensor = contentLevel > maxLevel
        
        return shouldCensor
    }

    const value = {
        maxRating,
        setMaxRating,
        shouldCensorContent,
        RATING_LEVELS,
        RATING_DISPLAY
    }

    return (
        <ContentFilterContext.Provider value={value}>
            {children}
        </ContentFilterContext.Provider>
    )
}