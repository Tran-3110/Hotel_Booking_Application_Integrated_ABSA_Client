"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useState } from "react";
import { AuthResponse } from "@/common/types/auth";
import { handleRegisterOwner } from "@/services/auth-service";
import axios from "axios";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { PasswordInput } from "@/components/password-input";
import { RegisterOwnerValues, RegisterOwnerSchema } from "@/schemas/register-owner-schema";

export default function RegisterOwnerForm() {
    const registerSchema = RegisterOwnerSchema();
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<RegisterOwnerValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: "",
            username: "",
            password: "",
            confirmPassword: "",
            displayName: "",
            phone: "",
            gender: "OTHER",
            userType: "DEFAULT",
            bankCode: "",
            bankAccount: "",
            bankOwnerName: "",
            acceptTerms: false
        }
    });

    const onSubmit = async (data: RegisterOwnerValues) => {
        setIsLoading(true);
        try {
            const response: AuthResponse = await handleRegisterOwner(data);
            if (response.result === true) {
                toast.success("Đăng ký đối tác thành công", {
                    description: "Bạn sẽ được chuyển về trang đăng nhập sau 5 giây",
                });
                setTimeout(() => {
                    router.push("/login");
                }, 5000);
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
        <div className="w-full h-full max-h-[85vh] overflow-y-auto pr-4 pb-6 custom-scrollbar">
            <div className="w-full sticky top-0 bg-white/80 backdrop-blur-md z-10 pb-4 pt-2">
                <div className="flex justify-end gap-2">
                    <Button
                        variant={"ghost"}
                        className="cursor-pointer"
                        onClick={() => router.push("/login")}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Trở về đăng nhập
                    </Button>
                </div>
                <div className="space-y-1 text-center mt-2">
                    <h1 className="text-2xl font-bold">Trở thành Đối tác</h1>
                    <p className="text-gray-500 text-sm">Điền thông tin để bắt đầu kinh doanh cùng HomeBook</p>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 mt-4">
                <div className="space-y-4">
                    <h3 className="font-semibold text-primary border-b pb-2 uppercase text-sm tracking-wider">1. Thông tin cá nhân</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium">Tên đăng nhập *</label>
                            <Input
                                type="text"
                                {...register("username")}
                                className={`py-4 mt-1 ${errors.username ? "border-destructive focus-visible:ring-destructive" : ""}`}
                            />
                            {errors.username && <p className="text-xs text-destructive mt-1">{errors.username.message}</p>}
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium">Địa chỉ Email *</label>
                            <Input
                                type="email"
                                {...register("email")}
                                className={`py-4 mt-1 ${errors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
                            />
                            {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium">Họ và tên hiển thị *</label>
                            <Input
                                type="text"
                                {...register("displayName")}
                                className={`py-4 mt-1 ${errors.displayName ? "border-destructive focus-visible:ring-destructive" : ""}`}
                            />
                            {errors.displayName && <p className="text-xs text-destructive mt-1">{errors.displayName.message}</p>}
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium">Số điện thoại</label>
                            <Input
                                type="tel"
                                {...register("phone")}
                                className="py-4 mt-1"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium">Mật khẩu *</label>
                            <PasswordInput
                                {...register("password")}
                                className={`py-4 mt-1 ${errors.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
                            />
                            {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium">Xác nhận mật khẩu *</label>
                            <PasswordInput
                                {...register("confirmPassword")}
                                className={`py-4 mt-1 ${errors.confirmPassword ? "border-destructive focus-visible:ring-destructive" : ""}`}
                            />
                            {errors.confirmPassword && <p className="text-xs text-destructive mt-1">{errors.confirmPassword.message}</p>}
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium">Giới tính</label>
                            <select
                                {...register("gender")}
                                className="flex w-full rounded-md border border-input bg-background px-3 py-4 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                            >
                                <option value="MALE">Nam</option>
                                <option value="FEMALE">Nữ</option>
                                <option value="OTHER">Khác</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="font-semibold text-primary border-b pb-2 uppercase text-sm tracking-wider">2. Thông tin thanh toán</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1 md:col-span-2">
                            <label className="text-sm font-medium">Ngân hàng (Bank Code) *</label>
                            <Input
                                list="bank-list"
                                type="text"
                                placeholder="Nhập mã hoặc chọn ngân hàng (VD: NCB, VCB...)"
                                {...register("bankCode")}
                                className={`py-4 mt-1 uppercase ${errors.bankCode ? "border-destructive focus-visible:ring-destructive" : ""}`}
                            />
                            <datalist id="bank-list">
                                <option value="VCB">Vietcombank</option>
                                <option value="TCB">Techcombank</option>
                                <option value="MB">MB Bank</option>
                                <option value="VTB">VietinBank</option>
                                <option value="ACB">ACB</option>
                                <option value="NCB">NCB (Sandbox)</option>
                                <option value="VNPAY">VNPAY (Sandbox)</option>
                            </datalist>
                            {errors.bankCode && <p className="text-xs text-destructive mt-1">{errors.bankCode.message}</p>}
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium">Số tài khoản *</label>
                            <Input
                                type="text"
                                {...register("bankAccount")}
                                className={`py-4 mt-1 ${errors.bankAccount ? "border-destructive focus-visible:ring-destructive" : ""}`}
                            />
                            {errors.bankAccount && <p className="text-xs text-destructive mt-1">{errors.bankAccount.message}</p>}
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium">Tên chủ tài khoản *</label>
                            <Input
                                type="text"
                                {...register("bankOwnerName")}
                                className={`py-4 mt-1 uppercase ${errors.bankOwnerName ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                placeholder="NGUYEN VAN A"
                            />
                            {errors.bankOwnerName && <p className="text-xs text-destructive mt-1">{errors.bankOwnerName.message}</p>}
                        </div>
                    </div>
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
                                <span>Bằng cách click vào, bạn đã đồng ý với</span>
                                <a href="/terms" className="mx-1 text-primary underline hover:opacity-70">Điều khoản đối tác</a>
                                <span>và</span>
                                <a href="/privacy" className="mx-1 text-primary underline hover:opacity-70">Chính sách bảo mật</a>
                            </p>
                        </label>
                    </div>
                    {errors.acceptTerms && <p className="text-xs text-destructive">{errors.acceptTerms.message}</p>}
                </div>

                <Button
                    type="submit"
                    className="w-full mt-4 cursor-pointer py-6 text-base font-semibold"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Đang xử lý đăng ký...
                        </>
                    ) : (
                        "Đăng ký Đối tác"
                    )}
                </Button>
            </form>
        </div>
    );
}