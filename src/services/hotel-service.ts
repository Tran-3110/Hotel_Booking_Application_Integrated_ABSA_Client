import apiClient from "@/services/api-client";
import {CardHotelResponse, HotelResponse} from "@/common/types/hotel";

export const hotelService = {
    getHotelById: async (id: string): Promise<HotelResponse> => {
        const res = await apiClient.get(`/hotel/get-hotel-detail`, {
            params: {
                id: id,
            }
        });
        return res.data
    },
    getSnapshotById: async (id: string): Promise<CardHotelResponse> => {
        const res = await apiClient.get(`/hotel/get-snapshot`, {
            params: {
                id: id,
            }
        })
        return res.data
    }
}