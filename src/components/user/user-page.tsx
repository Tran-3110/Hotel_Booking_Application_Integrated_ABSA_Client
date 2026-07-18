"use client"

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { AuthUser } from "@/common/types/auth";
import Image from "next/image";
import { Gender } from "@/common/enums/user";
import { userService } from "@/services/user-service";
import { cloudinary } from "@/services/upload-service";
import {FilePreview} from "@/common/types/file";

export default function ProfilePage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState<AuthUser | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [avatarData, setAvatarData] = useState<FilePreview | null>(null);

    useEffect(() => {
        const data = localStorage.getItem("user_data");
        if (!data) {
            router.push("/login");
        } else {
            try {
                const parsedUser: AuthUser = JSON.parse(data);
                setFormData(parsedUser);
            } catch (error) {
                console.error("Invalid user data", error);
                router.push("/login");
            }
        }
        setIsLoading(false);
    }, [router]);

    // Cleanup object URL khi component unmount hoặc khi chọn ảnh khác
    useEffect(() => {
        return () => {
            // Chỉ revoke những url được tạo từ file cục bộ
            if (avatarData?.file) {
                URL.revokeObjectURL(avatarData.url);
            }
        };
    }, [avatarData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => prev ? { ...prev, [name]: value } : null);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 1024 * 1024) {
                alert("Dung lượng file vượt quá 1MB. Vui lòng chọn ảnh khác.");
                return;
            }

            setAvatarData({
                id: Math.random().toString(36).substring(7), // Tạo id ngẫu nhiên
                url: URL.createObjectURL(file), // URL dùng để preview
                file: file // File thật để upload
            });
        }
    };

    const handleReset = () => {
        const data = localStorage.getItem("user_data");
        if (data) {
            try {
                setFormData(JSON.parse(data));
                setAvatarData(null); 
                if (fileInputRef.current) fileInputRef.current.value = '';
            } catch (error) {
                console.error("Lỗi khi reset dữ liệu!");
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData) return;

        try {
            setIsSaving(true);
            let updatedAvatarUrl = formData.avatar || '';

            if (avatarData?.file) {
                const sigData = await cloudinary.getSignature(`homebooking-avatar`);
                const uploadRes = await cloudinary.uploadSingleImage(avatarData.file, sigData);
                updatedAvatarUrl = uploadRes.secure_url;
            }

            const updatedUser = await userService.update({
                gender: formData.gender || Gender.OTHER,
                phone: formData.phone || '',
                avatarUrl: updatedAvatarUrl,
                displayName: formData.displayName || ''
            });

            setFormData(updatedUser);
            localStorage.setItem("user_data", JSON.stringify(updatedUser));

            setAvatarData(null);
            if (fileInputRef.current) fileInputRef.current.value = '';

            alert("Đã lưu thay đổi!");

        } catch (error) {
            console.error("Lỗi khi cập nhật hồ sơ:", error);
            alert("Đã xảy ra lỗi khi lưu thông tin. Vui lòng thử lại!");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center min-h-[500px]">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    if (!formData) return null;

    const displayAvatarUrl = avatarData?.url || formData.avatar;

    return (
        <div className="h-screen bg-gray-50 p-6 lg:p-8 lg:ps-20 font-sans">
            <div className="max-w-3xl">
                <form onSubmit={handleSubmit} className="space-y-6">

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-100">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Thông tin cá nhân</h1>
                            <p className="text-gray-500 mt-1 text-sm">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={handleReset}
                                disabled={isSaving}
                                className="px-5 py-2.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors shadow-sm disabled:opacity-50"
                            >
                                Đặt lại
                            </button>
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors shadow-sm flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSaving ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                        Đang lưu...
                                    </>
                                ) : (
                                    "Lưu thay đổi"
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Phần Avatar */}
                    <div className="flex items-center gap-6 pb-6">
                        <div className="relative w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center overflow-hidden border border-purple-200 shrink-0">
                            {displayAvatarUrl ? (
                                <Image src={displayAvatarUrl} alt="Avatar" fill sizes="80px" className="object-cover" />
                            ) : (
                                <span className="text-2xl text-purple-600 font-bold z-10">
                                    {formData.displayName?.charAt(0) || formData.username.charAt(0)}
                                </span>
                            )}
                        </div>
                        <div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/jpeg, image/png, image/webp"
                                className="hidden"
                            />

                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Chọn ảnh
                            </button>
                            <p className="text-xs text-gray-500 mt-2">Định dạng JPEG, PNG. Dung lượng tối đa 1MB.</p>
                        </div>
                    </div>

                    {/* Form Fields... */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tên đăng nhập</label>
                            <input type="text" value={formData.username} disabled className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed outline-none" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input type="email" value={formData.email} disabled className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed outline-none" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Tên hiển thị</label>
                            <input type="text" name="displayName" value={formData.displayName || ''} onChange={handleChange} placeholder="Nhập tên hiển thị" className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                            <input type="tel" name="phone" value={formData.phone || ''} onChange={handleChange} placeholder="Nhập số điện thoại" className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Giới tính</label>
                            <select name="gender" value={formData.gender ?? Gender.OTHER} onChange={handleChange} className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all">
                                <option value={Gender.MALE}>Nam</option>
                                <option value={Gender.FEMALE}>Nữ</option>
                                <option value={Gender.OTHER}>Khác</option>
                            </select>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}