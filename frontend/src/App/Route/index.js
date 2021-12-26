import { Route, Routes } from "react-router-dom"
import { Home, ShipIndex } from "../Screen"

export const TopNavigation = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ship_list" element={<ShipIndex />} />
        </Routes>
    )
}