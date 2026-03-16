import * as z from "zod";

export const useRegisterSchema = () => {

    return z
        .object({
            email: z
                .string()
                .min(1, { message: "Trường này không được để trống" })
                .pipe(z.email({ message: "Email không hợp lệ" })),

            username: z
                .string()
                .min(3, { message: "Tên tài khoản dài từ 3 - 20 ký tự" })
                .max(20, { message: "Tên tài khoản dài từ 3 - 20 ký tự" }),

            password: z
                .string()
                .min(6, { message: "Mật khẩu dài từ 6 - 32 ký tự" })
                .max(32, { message: "Mật khẩu dài từ 6 - 32 ký tự" }),

            confirmPassword: z
                .string()
                .min(1, { message: "Trường này không được để trống" }),

            acceptTerms: z
                .boolean()
                .refine((val) => val === true, {
                    message: "Bạn cần đồng ý chính sách và điều khoản trước khi tiếp tục",
                }),
        })
        .refine((data) => data.password === data.confirmPassword, {
            message: "Xác nhận mật khẩu không đúng",
            path: ["confirmPassword"],
        });
};

export type RegisterValues = z.infer<ReturnType<typeof useRegisterSchema>>;