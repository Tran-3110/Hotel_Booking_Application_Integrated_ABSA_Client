import {Gender, UserRole} from "../enums/user";

export interface UserDto {
    userId: string;
    username: string;
    email: string;
    displayName: string | null;
    avatarUrl: string | null;
    gender: Gender;
    role: UserRole;
    updatedAt: string
}