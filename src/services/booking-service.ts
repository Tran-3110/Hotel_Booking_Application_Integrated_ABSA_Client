import {RoomTypeValidResponse} from "@/common/types/room";
import apiClient from "@/services/api-client";
import {OrderStatus} from "@/common/enums/order";
import {PageResponse} from "@/common/types/page";
import {HistoryOrderResponse} from "@/common/types/order";

export const bookingService = {
    getRoomDetailsValid: async (hotelId: string, checkIn: string, checkOut: string): Promise<RoomTypeValidResponse[]> => {
        const res = await apiClient.get(`/booking/choose-room`, {
            params: {
                hotelId: hotelId,
                startDate: checkIn,
                endDate: checkOut,
            }
        })
        return res.data
    },
    getHistoryOrder: async (status: OrderStatus, page: number, size: number): Promise<PageResponse<HistoryOrderResponse>> => {
        const res = await apiClient.get(`/booking/get`, {
            params: {
                status, page, size,
            }
        })
        return res.data
    },
    countOrders: async (): Promise<{status: OrderStatus, count: number}[]> => {
        const res = await apiClient.get(`/booking/count`)
        return res.data
    }
}