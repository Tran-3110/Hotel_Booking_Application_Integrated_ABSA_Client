'use client';

import React, { useState, useEffect } from 'react';
import { X, Building } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { hotelAdminService } from "@/services/admin/hotel-admin-service";

interface AddHotelModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddHotelModal({ isOpen, onClose, onSuccess }: AddHotelModalProps) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setName('');
            setDescription('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            window.alert("Vui lòng nhập tên khách sạn!");
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await hotelAdminService.createHotel({
                name: name,
                description: description
            });

            if(res) {
                window.alert("Thêm khách sạn thành công!");
                onSuccess();
                onClose();
            } else {
                window.alert("Thêm khách sạn thất bại. Vui lòng thử lại!");
            }
        } catch (error) {
            window.alert("Đã có lỗi xảy ra. Vui lòng thử lại!");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">

                {/* Header Modal */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <Building className="w-5 h-5 text-purple-600" />
                        Thêm khách sạn mới
                    </h3>
                    <Button
                        suppressHydrationWarning // Thêm chống lỗi extension
                        onClick={onClose}
                        disabled={isSubmitting}
                        variant="ghost" // Dùng variant ghost của shadcn thay vì hardcode bg-gray-200 sẽ đẹp hơn
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 h-8 w-8 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Body Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Tên khách sạn <span className="text-red-500">*</span>
                        </label>
                        <Input
                            suppressHydrationWarning // Thêm chống lỗi extension
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="VD: Mường Thanh Luxury..."
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm"
                            disabled={isSubmitting}
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                            Mô tả ngắn
                        </label>
                        <textarea
                            suppressHydrationWarning // Thêm chống lỗi extension
                            rows={4}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Nhập mô tả hoặc thông tin giới thiệu..."
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm resize-none"
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Footer / Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
                        <Button
                            suppressHydrationWarning // Thêm chống lỗi extension
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            variant="secondary"
                            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            Hủy
                        </Button>
                        <Button
                            suppressHydrationWarning // Thêm chống lỗi extension
                            type="submit"
                            disabled={isSubmitting}
                            className="px-5 py-2.5 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Đang xử lý...
                                </>
                            ) : (
                                "Xác nhận thêm"
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}