import {AuthUser} from "@/common/types/auth";
import apiClient from "@/services/api-client";
import {Gender} from "@/common/enums/user";

export interface UpdateUserRequest {
    avatarUrl: string;
    displayName: string;
    phone: string;
    gender: Gender;
}

export const userService = {
    update: async (req: UpdateUserRequest): Promise<AuthUser> => {
        const res = await apiClient.put(`/users/update`, req)
        return res.data
    }
}