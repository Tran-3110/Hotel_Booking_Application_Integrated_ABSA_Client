// import { RoomTypeValidResponse } from "@/common/types/room";
import apiClient from "@/services/api-client";
import {
    OrderRequest,
    OrderResponse,
    UpdateOrderStatusRequest,
    UpdateOrderResponse,
    RoomDetailValidResponse,
    HistoryOrderResponse,
    OrderStatusCount
} from '@/common/types/order';
import { OrderStatus } from '@/common/types/payment';
import { PageResponse } from "@/common/types/page";

export const bookingService = {
    getRoomDetailsValid: async (
        hotelId: string,
        startDate: string,
        endDate: string
    ): Promise<RoomDetailValidResponse[]> => {
        const response = await apiClient.get<RoomDetailValidResponse[]>('/booking/choose-room', {
            params: {
                hotelId,
                startDate,
                endDate
            }
        });
        return response.data;
    },

    createOrder: async (orderRequest: OrderRequest): Promise<OrderResponse> => {
        const response = await apiClient.post<OrderResponse>('/booking/create-order', orderRequest);
        return response.data;
    },

    updateOrderStatus: async (
        orderId: string,
        status: OrderStatus
    ): Promise<UpdateOrderResponse> => {
        const requestPayload: UpdateOrderStatusRequest = { status };
        const response = await apiClient.put<UpdateOrderResponse>(`/booking/${orderId}/status`, requestPayload);
        return response.data;
    },

    countOrders: async () => {
        const response = await apiClient.get<OrderStatusCount[]>(`/booking/count`)
        return response.data
    },

    getHistoryOrder: async (
        status: OrderStatus,
        page: number,
        size: number
    ): Promise<PageResponse<HistoryOrderResponse>> => {
        const response = await apiClient.get(`/booking/get`, { params: { status, page, size } })
        return response.data
    }
}
