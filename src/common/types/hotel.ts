export type HotelStatus = 'AVAILABLE' | 'FULL' | 'UNAVAILABLE' | string;

export interface AddressResponse {
    id: string; 
    street: string;
    ward: string;
    province: string;
    postalCode: number;
    latitude: number;
    longitude: number;
}

export interface HotelUtilityResponse {
    name: string;
    iconCode: string;
}

export interface HotelRegulationResponse {
    id: string;
    name: string;
    description: string;
}

export interface RoomUtilityResponse {
    name: string;
    iconCode: string;
}

export interface RoomTypeResponse {
    id: string;
    name: string;
    description: string;
    capacity: number;
    price: number;
    roomUtilities: RoomUtilityResponse[]; 
    roomTypeImages: string[];
}

export interface HotelResponse {
    id: string;
    name: string;
    countComments: number;
    avgRating: number;
    images: string[];
    description: string;
    thumbnail: string;
    address: AddressResponse;
    roomTypes: RoomTypeResponse[];
    hotline: string;
    hotelUtilities: HotelUtilityResponse[];
    viewCount: number;
    status: HotelStatus;
    hotelRegulations: HotelRegulationResponse[];
}

export interface CardHotelResponse {
    id: string; 
    name: string;
    thumbnail: string;
    street: string;
    ward: string;
    province: string;
    latitude: number; 
    longitude: number;
    description: string;
    viewCount: number; 
    avgRating: number;
    totalComment: number;
    minPrice: number; 
    maxPrice: number;
}