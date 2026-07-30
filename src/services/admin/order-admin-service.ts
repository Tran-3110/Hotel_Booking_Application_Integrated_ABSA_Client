import {PageResponse} from "@/common/types/page";
import {AdminOrderResponse} from "@/common/types/admin/order";
import apiClient from "@/services/api-client";
import {OrderStatus} from "@/common/enums/order";

interface GetOrderResponse {
    keyword?: string
    startDate?: string
    endDate?: string
    page: number
    size: number
}

export const orderAdminService = {
    getOrders: async (req: GetOrderResponse): Promise<PageResponse<AdminOrderResponse>> => {
        const res = await apiClient.get(`/admin/orders/get`, {
            params: req
        })
        return res.data
    },
    changeStatus: async (id: string, status: OrderStatus): Promise<boolean> => {
        const res = await apiClient.patch(`/admin/orders/${id}/status`, {
            status: status
        })
        return res.data
    }
    
}