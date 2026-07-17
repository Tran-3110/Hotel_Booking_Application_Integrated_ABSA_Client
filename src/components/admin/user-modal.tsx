'use client';

import React, { useState, useEffect } from 'react';
import { X, Shield, Activity, User, Mail, Phone, Calendar, CheckCircle, XCircle } from "lucide-react";
import { AdminUserResponse } from "@/common/types/admin/user";
import {userAdminService} from "@/services/admin/user-admin-service";
import {UserRole} from "@/common/enums/user";

interface UserEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: AdminUserResponse | null;
    onSuccess: (user: AdminUserResponse) => void;
}

export default function UserEditModal({ isOpen, onClose, data, onSuccess }: UserEditModalProps) {
    const [role, setRole] = useState<UserRole>(UserRole.USER);
    const [isActive, setIsActive] = useState<boolean>(true);
    const [isSaving, setIsSaving] = useState<boolean>(false);

    useEffect(() => {
        if (data && isOpen) {
            setRole(data.role);
            setIsActive(data.isActive);
        }
    }, [data, isOpen]);

    if (!isOpen || !data) return null;

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await userAdminService.updateUser({
                id: data.id, active: isActive, role: role
            })
            
            onSuccess(res);
            onClose();
        } catch (error) {
            console.error("Lỗi khi cập nhật người dùng:", error);
            alert("Có lỗi xảy ra khi cập nhật thông tin!");
        } finally {
            setIsSaving(false);
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        return new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        }).format(new Date(dateString));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                        <User className="w-5 h-5 text-purple-600" />
                        Chi tiết Người dùng
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
                        disabled={isSaving}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body (Scrollable) */}
                <div className="p-6 overflow-y-auto flex-1">

                    {/* Thông tin cơ bản (Profile Card) */}
                    <div className="flex items-start gap-4 mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <div className="h-16 w-16 rounded-full overflow-hidden border-2 border-white shadow-sm bg-gray-200 flex-shrink-0 flex items-center justify-center">
                            {data.avatarUrl ? (
                                <img src={data.avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                            ) : (
                                <span className="text-2xl font-bold text-gray-400">
                                    {data.displayName?.charAt(0).toUpperCase() || 'U'}
                                </span>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-gray-900 truncate">
                                {data.displayName}
                            </h3>
                            <p className="text-sm text-gray-500 font-medium">@{data.username}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-gray-400 bg-gray-200/50 px-2 py-0.5 rounded-md truncate max-w-full block">
                                    ID: {data.id}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Danh sách thông tin chi tiết */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                                <Mail className="w-4 h-4 text-gray-400" />
                                <span className="truncate">{data.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Phone className="w-4 h-4 text-gray-400" />
                                <span>{data.phone || 'Chưa cập nhật số điện thoại'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                {data.isVerified ? (
                                    <CheckCircle className="w-4 h-4 text-blue-500" />
                                ) : (
                                    <XCircle className="w-4 h-4 text-gray-400" />
                                )}
                                <span>{data.isVerified ? 'Đã xác minh tài khoản' : 'Chưa xác minh'}</span>
                            </div>
                        </div>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                                <User className="w-4 h-4 text-gray-400" />
                                <span>Giới tính: {data.gender === 'MALE' ? 'Nam' : data.gender === 'FEMALE' ? 'Nữ' : 'Khác'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span>Tham gia: {formatDate(data.createdAt)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Phân vùng chỉnh sửa */}
                    <div className="border-t border-gray-100 pt-6">
                        <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Cài đặt Quyền & Trạng thái</h4>

                        <div className="space-y-5">
                            {/* Chỉnh sửa Role */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                                    <Shield className="w-4 h-4 text-purple-600" />
                                    Vai trò
                                </label>
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value as UserRole)}
                                    className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block p-2.5 outline-none transition-shadow"
                                    disabled={isSaving}
                                >
                                    <option value={UserRole.USER}>Người dùng thường (USER)</option>
                                    <option value={UserRole.OWNER}>Chủ khách sạn (OWNER)</option>
                                    <option value={UserRole.ADMIN}>Quản trị viên (ADMIN)</option>
                                </select>
                            </div>

                            {/* Chỉnh sửa Active */}
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-900">
                                        <Activity className={`w-4 h-4 ${isActive ? 'text-green-500' : 'text-red-500'}`} />
                                        Trạng thái hoạt động
                                    </label>
                                    <p className="text-xs text-gray-500 mt-0.5 ml-6">
                                        {isActive ? 'Tài khoản đang được phép đăng nhập.' : 'Khóa tài khoản, cấm đăng nhập.'}
                                    </p>
                                </div>

                                {/* Toggle Switch */}
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={isActive}
                                        onChange={(e) => setIsActive(e.target.checked)}
                                        disabled={isSaving}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 disabled:opacity-50"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3 rounded-b-2xl">
                    <button
                        onClick={onClose}
                        disabled={isSaving}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 transition-colors"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-70 flex items-center gap-2 transition-colors active:scale-95"
                    >
                        {isSaving ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Đang lưu...
                            </>
                        ) : (
                            'Lưu thay đổi'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}