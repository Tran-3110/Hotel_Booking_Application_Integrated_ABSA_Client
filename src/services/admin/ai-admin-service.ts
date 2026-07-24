import {BatchPredictResponse, DashboardResponse} from "@/common/types/ai";
import apiClient from "@/services/api-client";

export const aiAdminService = {
    allPredict: async (): Promise<BatchPredictResponse> => {    
        const res = await apiClient.post(`/admin/ai/batch-analyze`)
        return res.data
    },
    getDashboard: async (): Promise<DashboardResponse> => {
        const res = await apiClient.get(`/admin/ai/dashboard`)
        return res.data
    }
}