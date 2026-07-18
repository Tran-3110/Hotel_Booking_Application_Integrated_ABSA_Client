import {OrderStatus} from "@/common/enums/order";

export interface HistoryOrderResponse {
    id: string;
    hotel: HotelResponse;
    note: string;
    checkin: string;
    status: OrderStatus;
    checkout: string;  
    createdAt: string; 
    data: RoomTypeSnapShotResponse[];
}

export interface HotelResponse {
    id: string;
    name: string;
    thumbnail: string;
}

export interface RoomTypeSnapShotResponse {
    id: string;
    name: string;
    data: RoomDetailSnapShotResponse[];
}

export interface RoomDetailSnapShotResponse {
    id: string;
    code: string;
    actualPrice: number;
}