import {PageResponse} from "@/common/types/page";
import apiClient from "@/services/api-client";
import {GetAdminSnapshotHotelResponse} from "@/common/types/admin/snapshot-hotel";
import {
    AdminHotelDetailResponse,
    HotelRegulationResponse,
    HotelUtilityResponse
} from "@/common/types/admin/hotel-detail";
import {HotelStatus} from "@/common/types/hotel";

export interface UpdateHotelInfoRequest {
    id: string;
    name: string;
    images: string[];
    description: string;
    thumbnail: string;
    street: string;
    ward: string;
    province: string;
    postalCode: number;
    latitude: number;
    longitude: number;
    hotline: string;
    hotelUtilities: string[];
    status: HotelStatus;
    hotelRegulations: HotelRegulationResponse[];
}

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
    },
    getHotelUtilities: async (): Promise<HotelUtilityResponse[]> => {
        const res = await apiClient.get(`/admin/hotels/utilities`)
        return res.data
    },
    updateHotelInfo: async (req: UpdateHotelInfoRequest): Promise<AdminHotelDetailResponse> => {
        const res = await apiClient.put(`/admin/hotels/update-hotel`, req)
        return res.data
    }
}