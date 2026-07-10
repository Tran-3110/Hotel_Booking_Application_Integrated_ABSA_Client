import {PageResponse} from "@/common/types/page";
import apiClient from "@/services/api-client";
import { AdminUserResponse } from "@/common/types/admin/user";
import {UserRole} from "@/common/enums/user";

export const userAdminService = {
    getUserList: async (page: number, size: number, sort: string, keyword?: string): Promise<PageResponse<AdminUserResponse>> => {
        const res = await apiClient.get(`/admin/users/get`, {
            params: {
                page: page,
                size: size,
                sort: sort,
                keyword: keyword?.trim()
            }
        })
        return res.data
    },
    updateUser: async (req: {id: string, active: boolean, role: UserRole}): Promise<AdminUserResponse> => {
        const res = await apiClient.put(`/admin/users/update`, req);
        return res.data
    }
}