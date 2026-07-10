import {UserRole} from "@/common/enums/user";

export interface AuthUser {
    id: string;
    email: string;
    username: string;
    displayName: string | null;
    gender: number;
    avatar: string | null;
    phone: string | null;
    description: string | null;
    isActive: boolean;
    isVerified: boolean;
    role: UserRole;
    jwtToken: string | null;
}

export interface AuthResponse {
    result: boolean;
    message: string;
    authDto: AuthUser | null;
}