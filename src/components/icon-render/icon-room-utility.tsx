import {Bed, Coffee, Info, Shield, TowelRack, TvIcon, Wind} from "lucide-react";
import React from "react";

const ROOM_UTILITY_ICONS: {[key: string]: React.ReactNode} = {
    bed: <Bed />,
    air_conditioner: <Wind />,
    tower: <TowelRack />,
    shield: <Shield />,
    tv: <TvIcon />,
    coffee: <Coffee />
}

export default function IconRoomUtility({iconCode}: {iconCode: string}) {
    return ROOM_UTILITY_ICONS[iconCode as keyof typeof ROOM_UTILITY_ICONS] || <Info />
}