import { z } from "zod";

export const RegisterOwnerSchema = () => z.object({
    username: z.string().min(4, "Tên đăng nhập phải có ít nhất 4 ký tự").max(50),
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z.string(),
    displayName: z.string().min(1, "Vui lòng nhập họ và tên"),
    phone: z.string().optional(),

    gender: z.enum(["MALE", "FEMALE", "OTHER"]),
    userType: z.enum(["DEFAULT", "PREMIUM", "ADVERTISEMENT"]),

    bankCode: z.string().min(1, "Vui lòng chọn ngân hàng"),
    bankAccount: z.string().min(1, "Vui lòng nhập số tài khoản"),
    bankOwnerName: z.string().min(1, "Vui lòng nhập tên chủ tài khoản"),
    acceptTerms: z.boolean().refine(val => val === true, {
        message: "Bạn phải đồng ý với điều khoản",
    })
}).refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
});

export type RegisterOwnerValues = z.infer<ReturnType<typeof RegisterOwnerSchema>>;