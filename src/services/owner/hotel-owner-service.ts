import {PageResponse} from "@/common/types/page";
import apiClient from "@/services/api-client";
import {GetAdminSnapshotHotelResponse} from "@/common/types/admin/snapshot-hotel";
import {
    AdminHotelDetailResponse,
    HotelUtilityResponse,
    RoomTypeResponse,
    RoomUtilityResponse,
    UpdateActiveHotelResponse,
    UpdateActiveRoomTypeResponse
} from "@/common/types/admin/hotel-detail";
import {AdminCommentResponse} from "@/common/types/admin/comment";
import {
    AddHotelRequest,
    UpdateActiveHotelRequest, UpdateActiveRoomTypeRequest,
    UpdateHotelInfoRequest, UpdateRoomTypeRequest
} from "@/common/types/request/hotel-management";

export const hotelOwnerService = {
    createHotel: async (req: AddHotelRequest): Promise<boolean> => {
        const res = await apiClient.post(`/owner/hotels/create`, req);
        return res.data
    },
    getHotelList: async (page: number, size: number, sort: string, keyword?: string): Promise<PageResponse<GetAdminSnapshotHotelResponse>> => {
        const res = await apiClient.get(`/owner/hotels/get`, {
            params: {
                page: page,
                size: size,
                sort: sort,
                keyword: keyword?.trim()
            }
        })
        return res.data
    },
    getHotelDetail: async (id: string): Promise<AdminHotelDetailResponse> => {
        const res = await apiClient.get(`/owner/hotels/${id}`)
        return res.data
    },
    getHotelUtilities: async (): Promise<HotelUtilityResponse[]> => {
        const res = await apiClient.get(`/owner/hotels/utilities`)
        return res.data
    },
    getRoomUtilities: async (): Promise<RoomUtilityResponse[]> => {
        const res = await apiClient.get(`/owner/hotels/room-utilities`)
        return res.data
    },
    updateHotelInfo: async (req: UpdateHotelInfoRequest): Promise<AdminHotelDetailResponse> => {
        const res = await apiClient.put(`/owner/hotels/update-hotel`, req)
        return res.data
    },
    updateActive: async (req: UpdateActiveHotelRequest): Promise<UpdateActiveHotelResponse> => {
        const res = await apiClient.patch(`/owner/hotels/active`, req)
        return res.data
    },
    updateRoomType: async (req: UpdateRoomTypeRequest): Promise<RoomTypeResponse> => {
        const res = await apiClient.put(`/owner/hotels/update-room-type`, req)
        return res.data
    },
    updateActiveRoomType: async (req: UpdateActiveRoomTypeRequest): Promise<UpdateActiveRoomTypeResponse> => {
        const res = await apiClient.patch(`/owner/hotels/active-room-type`, req)
        return res.data
    },
    getHotelComments: async (hotelId: string, page: number, size: number): Promise<PageResponse<AdminCommentResponse>> => {
        const res = await apiClient.get(`/owner/hotels/comments/${hotelId}`, {
            params: {
                page, size
            }
        })
        return res.data
    }
}