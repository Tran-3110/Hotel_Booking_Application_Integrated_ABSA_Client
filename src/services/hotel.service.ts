import apiClient from "@/services/api-client";
import {HotelResponse} from "@/types/hotel";

export const hotelService = {
    getHotelById: async (id: string): Promise<HotelResponse> => {
        const res = await apiClient.get(`/hotel/get-hotel-detail`, {
            params: {
                id: id,
            }
        });
        return res.data
    }
}