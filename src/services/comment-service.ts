import { PageResponse } from "@/common/types/page"
import apiClient from "./api-client"
import { CommentResponse } from "@/common/types/comment"

export const commentService = {
    getCommentByHotel: async (id: string, page: number, size: number) => {
        const response = await apiClient.get<PageResponse<CommentResponse>>(`/comment/get/hotel/${id}`, { params: { page, size } })
        return response.data
    }
}