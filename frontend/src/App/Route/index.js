import { Route, Routes } from "react-router-dom"
import { About, BoteLB, CGInfo, GameIndex, GameInfo, Home, Project, ShipIndex, ShipInfo } from "../Screen"

export const TopNavigation = () => {

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/game_list" element={<GameIndex />} />
            <Route path="/about" element={<About />} />
            <Route path="/ship_list" element={<ShipIndex />} />
            <Route path="/project" element={<Project />} />
            <Route path="/game_info" element={<GameInfo />}/>
            <Route path="/ship_info" element={<ShipInfo />} />
            <Route path="/cg_info" element={<CGInfo />} />
            <Route path="/top_fav" element={<BoteLB />} />
        </Routes>
    )
}