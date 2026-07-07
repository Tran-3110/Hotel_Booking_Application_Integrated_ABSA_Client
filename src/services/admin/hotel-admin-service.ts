import {PageResponse} from "@/common/types/page";
import apiClient from "@/services/api-client";
import {GetAdminSnapshotHotelResponse} from "@/common/types/admin/snapshot-hotel";
import {AdminHotelDetailResponse} from "@/common/types/admin/hotel-detail";

export const hotelAdminService = {
    getHotelList: async (page: number, size: number): Promise<PageResponse<GetAdminSnapshotHotelResponse>> => {
        const res = await apiClient.get(`/admin/hotels/get`, {
            params: {
                page: page,
                size: size,
            }
        })
        return res.data
    },
    getHotelDetail: async (id: string): Promise<AdminHotelDetailResponse> => {
        const res = await apiClient.get(`/admin/hotels/${id}`)
        return res.data
    }
}