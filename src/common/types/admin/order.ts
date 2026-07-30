import { OrderStatus } from "@/common/enums/order";

export interface RoomDetailResponse {
    id: string;
    roomCode: string;
    actualPrice: number;  
    platformFee: number;  
}

export interface OrderDetailResponse {
    id: string;
    roomTypeName: string;
    roomDetails: RoomDetailResponse[];
}

export interface HotelResponse {
    id: string;
    name: string;
    ownerUsername?: string | null;
    ownerEmail?: string | null;
    thumbnail?: string | null;
    isActive: boolean;
}

export interface CustomerResponse {
    id: string;
    email: string;
    username: string;
    avatarUrl?: string | null;
    isActive: boolean;
}

export interface AdminOrderResponse {
    id: string;
    hotel?: HotelResponse | null;
    customer: CustomerResponse;
    orderStatus: OrderStatus;
    orderDetails: OrderDetailResponse[];
    note?: string | null;
    totalCapacity: number;
    checkinDate: string;
    checkoutDate: string;
    createdAt: string;
    updatedAt: string;
}