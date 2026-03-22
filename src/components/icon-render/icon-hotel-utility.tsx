import {EyeIcon, Info, Waves, WifiIcon} from "lucide-react";
import React from "react";

const HOTEL_UTILITY_ICONS: {[key: string]: React.ReactNode} = {
    wifi: <WifiIcon />,
    view: <EyeIcon />,
    pool: <Waves />
}

export default function IconHotelUtility({iconCode}: {iconCode: string}) {
    return HOTEL_UTILITY_ICONS[iconCode as keyof typeof HOTEL_UTILITY_ICONS] || <Info />
}