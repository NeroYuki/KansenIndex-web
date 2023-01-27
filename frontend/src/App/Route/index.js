import { useEffect, useState } from "react"
import { Route, Routes, useLocation } from "react-router-dom"
import { About, CGInfo, GameIndex, GameInfo, Home, Project, ShipIndex, ShipInfo } from "../Screen"

export const TopNavigation = () => {
    const location = useLocation()

    const [cgInfoState, setCgInfoState] = useState({
        char: 'Placeholder Character',
        filename: 'Placeholder Filename.png',
        folder: 'Placeholder Folder',
        is_base: true,
        is_damage: true,
        is_oath: true,
        is_retrofit: true
    })
    
    useEffect(() => {
        if (location.state && location.state.data) {
            setCgInfoState(location.state.data)
        }
    }, [location])

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/game_list" element={<GameIndex />} />
            <Route path="/about" element={<About />} />
            <Route path="/ship_list" element={<ShipIndex />} />
            <Route path="/project" element={<Project />} />
            <Route path="/game_info" element={<GameInfo />}/>
            <Route path="/ship_info" element={<ShipInfo />} />
            <Route path="/cg_info" element={<CGInfo data={cgInfoState}/>} />
        </Routes>
    )
}