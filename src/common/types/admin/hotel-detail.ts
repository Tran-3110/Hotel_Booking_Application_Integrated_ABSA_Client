import {HotelStatus} from "@/common/types/hotel";

export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export interface OwnerResponse {
    id: string;
    username: string;
    avatarUrl: string;
    email: string;
    phone: string;
    gender: Gender;
    isActive: boolean;
}

export interface ImageResponse {
    id: string;
    path: string;
}

export interface HotelRegulationResponse {
    id: string;
    name: string;
    description: string;
}

export interface RoomUtilityResponse {
    id: string;
    name: string;
    iconCode: string;
}

export interface RoomTypeImageResponse {
    id: string;
    path: string;
}

export interface RoomDetailResponse {
    id: string;
    roomCode: string;
    isActive: boolean;
}

export interface RoomTypeResponse {
    id: string;
    name: string;
    description: string;
    capacity: number;
    price: number;
    roomUtilities: RoomUtilityResponse[];
    roomTypeImages: RoomTypeImageResponse[];
    roomDetails: RoomDetailResponse[];
    depositedPercent: number;
}

export interface AddressResponse {
    id: string;
    street: string;
    ward: string;
    province: string;
    postalCode: number;
    latitude: number;
    longitude: number;
    isActive: boolean;
    createdAt: string; 
    updatedAt: string;
}

export interface HotelUtilityResponse {
    id: string;
    name: string;
    iconCode: string;
}

export interface AdminHotelDetailResponse {
    id: string;
    name: string;
    owner?: OwnerResponse;
    images: ImageResponse[];
    description: string;
    thumbnail: string;
    address: AddressResponse;
    roomTypes: RoomTypeResponse[];
    hotline: string;
    hotelUtilities: HotelUtilityResponse[];
    viewCount: number;
    isActive: boolean;
    status: HotelStatus;
    hotelRegulations: HotelRegulationResponse[];
    createdAt: string;
    updatedAt: string;
}