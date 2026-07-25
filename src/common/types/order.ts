import { OrderStatus } from './payment';
import { AuthUser } from './auth';

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

export interface OrderRequest {
    roomDetailsId: string[];
    note?: string;
    checkin: string;  // ISO String: "2026-07-20T14:00:00"
    checkout: string; // ISO String: "2026-07-22T12:00:00"
    totalCapacity: number;
}

export interface UpdateOrderStatusRequest {
    status: OrderStatus;
}

export interface OrderResponse {
    status: boolean;
    orderId: string;
    price: number;
}

export interface UpdateOrderResponse {
    result: boolean;
    message: string;
}

export interface RoomDetailSnapShotResponse {
    id: string;
    code: string;
    valid: boolean;
}

export interface RoomDetailValidResponse {
    roomTypeId: string;
    name: string;
    price: number;
    data: RoomDetailSnapShotResponse[];
}

export interface OrderDetail {
    id: string;
    actualPrice: number;
    platformFee: number;
}

export interface Order {
    id: string;
    hotel?: HotelResponse;
    user?: AuthUser;
    orderDetails?: OrderDetail[];
    orderStatus: OrderStatus;
    note: string;
    totalCapacity: number;
    checkInDate: string;
    checkOutDate: string;
    createdAt: string;
    updatedAt: string;
    totalAmount?: number;
}

export interface OrderStatusCount {
    status: OrderStatus
    count: number
}