import {PageResponse} from "@/common/types/page";
import {AdminOrderResponse} from "@/common/types/admin/order";
import apiClient from "@/services/api-client";
import {OrderStatus} from "@/common/enums/order";

interface GetOrderResponse {
    keyword?: string
    status?: OrderStatus
    startDate?: string
    endDate?: string
    page: number
    size: number
}

export const orderOwnerService = {
    getOrders: async (req: GetOrderResponse): Promise<PageResponse<AdminOrderResponse>> => {
        const res = await apiClient.get(`/owner/orders/get`, {
            params: req
        })
        return res.data
    },
    changeStatus: async (id: string, status: OrderStatus): Promise<boolean> => {
        const res = await apiClient.patch(`/owner/orders/${id}/status`, {
            orderStatus: status
        })
        return res.data
    }
    
}