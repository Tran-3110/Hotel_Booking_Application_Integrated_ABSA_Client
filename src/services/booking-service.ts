import {RoomTypeValidResponse} from "@/common/types/room";
import apiClient from "@/services/api-client";

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
    }
}