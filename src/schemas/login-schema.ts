import * as z from "zod";

export const LoginSchema = () => z.object({
    email: z
        .string()
        .trim()
        .min(1, { message: "Trường này không được để trống" })
        .pipe(
            z.email({ message: "Email không hợp lệ" })
        ),

    password: z
        .string()
        .min(6, { message: "Mật khẩu dài từ 6 - 32 ký tự" })
});

export type LoginValues = z.infer<ReturnType<typeof LoginSchema>>;