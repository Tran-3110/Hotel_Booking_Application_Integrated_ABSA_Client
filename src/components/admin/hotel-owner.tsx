'use client';

import React, { useState } from 'react';
import { User, UserPlus, Save, ShieldAlert } from 'lucide-react';
import {useDispatch, useSelector} from 'react-redux';
import { ReduxState } from "@/constants/redux-state";
import { hotelAdminService } from "@/services/admin/hotel-admin-service";
import Image from "next/image";
import {updateBasicField} from "@/store/slices/editHotelSlice";

export default function OwnerTab({ hotelId, onClose }: {
    hotelId: string,
    onClose: () => void,
}) {
    const { data: formData } = useSelector((state: ReduxState) => state.editHotelState);
    const [newUsername, setNewUsername] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const dispatch = useDispatch();

    if (!formData) return null;

    const handleSave = async () => {
        if (!newUsername.trim()) {
            window.alert("Vui lòng nhập Username của chủ sở hữu mới!");
            return;
        }

        if (newUsername.trim() === formData.owner?.username) {
            window.alert("Username nhập vào đang trùng với chủ sở hữu hiện tại!");
            return;
        }

        if (!window.confirm(`CẢNH BÁO: Bạn có chắc chắn muốn chuyển quyền sở hữu khách sạn "${formData.name}" cho user "${newUsername}" không? Hành động này sẽ thay đổi toàn bộ quyền quản lý!`)) {
            return;
        }

        setIsSaving(true);
        try {
            const data = await hotelAdminService.changeHotelOwner({ hotelId, username: newUsername.trim() });
            dispatch(updateBasicField({field: 'owner', value: data}))
            
            window.alert("Chuyển đổi chủ sở hữu thành công!");
        } catch (error: any) { 
            const errorMessage =error?.response?.data?.message || "Chuyển đổi thất bại. Vui lòng kiểm tra lại Username có tồn tại hay không!";

            window.alert(errorMessage);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-gray-50/30">

                {/* Thông báo cảnh báo */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-amber-800 shadow-sm">
                    <ShieldAlert className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
                    <div className="text-sm">
                        <p className="font-bold mb-1">Khu vực nguy hiểm (Danger Zone)</p>
                        <p>Việc thay đổi chủ sở hữu sẽ chuyển giao toàn bộ quyền quản lý, chỉnh sửa và doanh thu của khách sạn <strong>{formData.name}</strong> sang tài khoản mới. Vui lòng kiểm tra kỹ Username trước khi thực hiện.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Cột trái: Chủ sở hữu hiện tại */}
                    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-4">
                        <h3 className="font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
                            <User className="w-4 h-4 text-blue-500" />
                            Chủ sở hữu hiện tại
                        </h3>

                        <div className="flex items-start gap-4 pt-2">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden shrink-0 border border-gray-200 relative">
                                {formData.owner?.avatarUrl ? (
                                    <Image
                                        fill
                                        src={formData.owner.avatarUrl}
                                        alt="avatar"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User className="w-8 h-8 text-gray-400" />
                                )}
                            </div>
                            <div className="flex-1 space-y-1.5">
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Username</p>
                                    <p className="font-bold text-gray-800 text-base">{formData.owner?.username || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Email</p>
                                    <p className="text-sm text-gray-700">{formData.owner?.email || "Chưa cập nhật"}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium">Số điện thoại</p>
                                    <p className="text-sm text-gray-700">{formData.owner?.phone || "Chưa cập nhật"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Cột phải: Form đổi chủ mới */}
                    <div className="bg-white p-5 rounded-xl border border-purple-100 shadow-sm space-y-4 ring-1 ring-purple-50">
                        <h3 className="font-semibold text-purple-800 border-b border-purple-100 pb-2 flex items-center gap-2">
                            <UserPlus className="w-4 h-4 text-purple-600" />
                            Chuyển nhượng khách sạn
                        </h3>

                        <div className="pt-2 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                    Username chủ sở hữu mới <span className="text-red-500">*</span>
                                </label>
                                <input
                                    suppressHydrationWarning
                                    type="text"
                                    value={newUsername}
                                    onChange={(e) => setNewUsername(e.target.value)}
                                    placeholder="Nhập chính xác username..."
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium text-gray-800"
                                    disabled={isSaving}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-white flex items-center justify-end shrink-0 gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <button
                    onClick={onClose}
                    disabled={isSaving}
                    className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    Hủy
                </button>
                <button
                    onClick={handleSave}
                    disabled={isSaving || !newUsername.trim()}
                    className="px-6 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg flex items-center gap-2 shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSaving ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Đang xử lý...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4" /> Xác nhận chuyển đổi
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}