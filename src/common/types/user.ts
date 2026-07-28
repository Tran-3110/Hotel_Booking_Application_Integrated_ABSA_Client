import { UserRole } from "../enums/user";
import { Gender } from "./admin/hotel-detail";

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