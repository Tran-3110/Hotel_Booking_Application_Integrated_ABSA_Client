import apiClient from "@/services/api-client";

export interface GetDashboardData {
    totalHotels: number;
    totalHotelsActive: number;
    totalOrders: number;
    totalUsers: number;
    totalUsersActive: number;
}

export const dashboardAdminService = {
    getDashboard: async (): Promise<GetDashboardData> => {
        const res = await apiClient.get(`/admin/dashboard/get`);
        return res.data;
    }
}