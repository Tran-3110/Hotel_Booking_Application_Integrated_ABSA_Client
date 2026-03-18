"use client"

import { VerificationType } from "@/common/types/verify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { VerifySchema } from "@/schemas/verify-schema"
import { requestVerify, verifyAccount } from "@/services/verify-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function VerifyAccountForm() {
    const router = useRouter()
    const { user } = useAuth()

    const verifySchema = VerifySchema()
    const [isVerifyLoading, setIsVerifyLoading] = useState(false)
    const [countdown, setCountdown] = useState(0)
    const [isSendingEmail, setIsSendingEmail] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const verifyForm = useForm({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            code: "",
            password: "DummyPasswd",
            confirmPassword: "DummyPasswd"
        }
    })

    const handleResendOtp = async () => {
        if (!email) return toast.error("Không tìm thấy email xác thực");
        setIsSendingEmail(true)
        try {
            const response = await requestVerify(email, VerificationType.VERIFY_USER)
            if (response.result) {
                setCountdown(60);
                toast.success("Mã xác thực mới đã được gửi vào email của bạn")
            }
        } catch {
            toast.error("Lỗi khi gửi lại mã")
        } finally {
            setIsSendingEmail(false)
        }
    }

    const onVerify = async (data: { code: string }) => {
        try {
            setIsVerifyLoading(true)
            const response = await verifyAccount(email, data.code)
            if (response.result) {
                setIsSuccess(true)
                toast.success("Xác thực tài khoản thành công")
                setTimeout(() => router.push("/login"), 2000)
            } else {
                toast.error("Xác thực thất bại", { description: response.message })
            }
        } catch {
            toast.error("Có lỗi xảy ra")
        } finally {
            setIsVerifyLoading(false)
        }
    }

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (countdown > 0) {
            timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
        }
        return () => clearInterval(timer);
    }, [countdown]);

    if (!user) {
        router.push("/login")
        return
    }

    const email = user.email

    return (
        <div className="w-full">
            <div className="space-y-1 text-center my-8">
                <h1 className="text-2xl font-bold">Xác thực tài khoản</h1>
                <p className="text-gray-500 text-sm">
                    Mã xác thực đã được gửi đến email của bạn
                </p>
            </div>

            <form onSubmit={verifyForm.handleSubmit(onVerify)} className="space-y-6">
                <div className="space-y-2">
                    <div className="flex justify-between items-end">
                        <label className="text-sm font-medium">Mã xác thực (OTP)</label>
                        <button
                            type="button"
                            disabled={isSendingEmail || countdown > 0}
                            onClick={handleResendOtp}
                            className="text-xs text-blue-600 hover:underline disabled:text-gray-400"
                        >
                            {countdown > 0 ? `Gửi lại sau ${countdown}s` : "Gửi lại mã"}
                        </button>
                    </div>
                    <Input
                        inputMode="numeric"
                        pattern="[0-9]*"
                        {...verifyForm.register("code")}
                        className={`py-6 text-center text-2xl tracking-[1em] ${verifyForm.formState.errors.code ? "border-red-500" : ""}`}
                    />
                    {verifyForm.formState.errors.code && (
                        <p className="text-xs text-red-500 text-center">{verifyForm.formState.errors.code.message}</p>
                    )}
                </div>

                <Button
                    type="submit"
                    className="w-full mt-4 py-4.5 cursor-pointer "
                    disabled={isVerifyLoading || isSuccess}
                >
                    {isVerifyLoading ? <Loader2 className="animate-spin mr-2" /> : "Xác nhận"}
                </Button>

                <Button
                    variant="ghost"
                    className="w-full cursor-pointer"
                    onClick={() => router.push("/login")}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại đăng nhập
                </Button>
            </form>
        </div>
    )
}