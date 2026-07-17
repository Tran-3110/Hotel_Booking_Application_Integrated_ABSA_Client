import {Gender, UserRole} from "@/common/enums/user";

export interface AdminUserResponse {
    id: string;
    username: string;
    email: string;
    displayName: string;
    avatarUrl: string;
    phone: string;
    gender: Gender;
    role: UserRole;
    isActive: boolean;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
}