"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { RegisterValues, useRegisterSchema } from "@/schemas/register-schema";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useState } from "react";
import { AuthResponse } from "@/common/types/auth";
import { handleRegister } from "@/services/auth-service";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
    const registerSchema = useRegisterSchema();
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<RegisterValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: "",
            username: "",
            password: "",
            confirmPassword: "",
            acceptTerms: false
        }
    });

    const onSubmit = async (data: RegisterValues) => {
        setIsLoading(true);
        try {
            const response: AuthResponse = await handleRegister(data);
            if (response.result === true) {
                toast.success("Đăng ký thành công", {
                    description: "Bạn sẽ được chuyển về trang đăng nhập sau 5 giây",
                });
                setTimeout(() => {
                    router.push("/login")
                }, 5000)
            } else {
                toast.error("Đăng ký thất bại", {
                    description: "Lỗi không xác định, hãy thử lại sau",
                });
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const serverMessage = error.response?.data?.message || "Lỗi không xác định, hãy thử lại sau";

                toast.error("Đăng ký thất bại", {
                    description: serverMessage,
                });
            } else {
                toast.error("An unexpected error occurred");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full">
            <div className="space-y-1 text-center my-8">
                <h1 className="text-2xl font-bold">Tạo tài khoản mới</h1>
                <p className="text-gray-500 text-sm">Nhập thông tin dưới đây để tạo tài khoản</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-1">
                    <label className="text-sm font-medium">Địa chỉ Email</label>
                    <Input
                        type="email"
                        placeholder="name@example.com"
                        {...register("email")}
                        className={`py-4 mt-1 ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                    />
                    {errors.email && (
                        <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                    )}
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium">Tên người dùng</label>
                    <Input
                        type="text"
                        {...register("username")}
                        className={`py-4 mt-1 ${errors.username ? "border-destructive focus-visible:ring-destructive" : ""}`}
                    />
                    {errors.username && (
                        <p className="text-xs text-destructive mt-1">{errors.username.message}</p>
                    )}
                </div>

                {/* Password Field */}
                <div className="space-y-1">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-medium">Nhập mật khẩu của bạn</label>
                    </div>
                    <Input
                        type="password"
                        {...register("password")}
                        className={`py-4 mt-1 ${errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                    />
                    {errors.password && (
                        <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
                    )}
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium">Xác nhận mật khẩu</label>
                    <Input
                        type="password"
                        {...register("confirmPassword")}
                        className={`py-4 mt-1 ${errors.confirmPassword ? "border-destructive focus-visible:ring-destructive" : ""}`}
                    />
                    {errors.confirmPassword && (
                        <p className="text-xs text-destructive mt-1">{errors.confirmPassword.message}</p>
                    )}
                </div>


                <div className="space-y-2">
                    <div className="flex items-start space-x-2">
                        <Checkbox
                            id="terms"
                            onCheckedChange={(checked) => {
                                setValue("acceptTerms", checked === true, { shouldValidate: true });
                            }}
                        />
                        <label
                            htmlFor="terms"
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            <p>
                                <span>
                                    Bằng cách click vào, bạn đã đồng ý với
                                </span>
                                <a href="/terms" className="text-primary underline hover:opacity-70">Điều khoản dịch vụ</a>
                                <span>
                                    và
                                </span>
                                <a href="/privacy" className="text-primary underline hover:opacity-70">Chính sách bảo mật</a>
                            </p>
                        </label>
                    </div>

                    {errors.acceptTerms && (
                        <p className="text-xs text-destructive">{errors.acceptTerms.message}</p>
                    )}
                </div>

                <Button
                    type="submit"
                    className="w-full mt-4 cursor-pointer py-4.5"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Đang đăng ký
                        </>
                    ) : (
                        "Đăng ký"
                    )}
                </Button>
            </form>
        </div>
    );
}