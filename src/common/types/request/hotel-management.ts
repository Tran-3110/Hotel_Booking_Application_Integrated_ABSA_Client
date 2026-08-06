import {HotelRegulationResponse, RoomDetailResponse} from "@/common/types/admin/hotel-detail";
import {HotelStatus} from "@/common/enums/hotel";

export interface UpdateHotelInfoRequest {
    id: string;
    name: string;
    images: string[];
    description: string;
    thumbnail: string;
    street: string;
    ward: string;
    province: string;
    postalCode: number;
    latitude: number;
    longitude: number;
    hotline: string;
    hotelUtilities: string[];
    status: HotelStatus;
    hotelRegulations: HotelRegulationResponse[];
}

export interface UpdateActiveHotelRequest {
    id: string;
    active: boolean
}

export interface UpdateActiveRoomTypeRequest {
    id: string;
    active: boolean
}

export interface UpdateRoomTypeRequest {
    id?: string;
    hotelId: string;
    name: string;
    description: string;
    price: number;
    capacity: number;
    images: string[];
    roomUtilities: string[];
    roomDetails: RoomDetailResponse[];
}

export interface AddHotelRequest {
    name: string;
    description: string;
}