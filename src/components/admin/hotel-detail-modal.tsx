'use client';

import React, { useState, useEffect } from 'react';
import {
    X, Building2, MapPin, Phone, Info,
    BedDouble, User, Image as ImageIcon,
    ShieldCheck, Wifi, DoorOpen, CalendarDays, Eye
} from 'lucide-react';
import { hotelAdminService } from '@/services/admin/hotel-admin-service';
import { AdminHotelDetailResponse } from "@/common/types/admin/hotel-detail";

interface HotelDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    hotelId: string | null;
    onSuccess?: () => void;
}

export default function HotelDetailModal({ isOpen, onClose, hotelId, onSuccess }: HotelDetailModalProps) {
    const [loading, setLoading] = useState<boolean>(false);
    const [saving, setSaving] = useState<boolean>(false);
    const [formData, setFormData] = useState<AdminHotelDetailResponse | null>(null);

    // State quản lý Tab hiện tại ('basic' hoặc 'rooms')
    const [activeTab, setActiveTab] = useState<'basic' | 'rooms'>('basic');

    useEffect(() => {
        if (isOpen && hotelId) {
            const fetchDetail = async () => {
                setLoading(true);
                try {
                    const data = await hotelAdminService.getHotelDetail(hotelId);
                    setFormData(data);
                } catch (error) {
                    console.error("Lỗi khi tải chi tiết:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchDetail();
            setActiveTab('basic'); // Mặc định mở tab đầu tiên
        } else {
            setFormData(null);
        }
    }, [isOpen, hotelId]);

    if (!isOpen) return null;

    const handleSave = async () => {
        setSaving(true);
        try {
            console.log("Dữ liệu chuẩn bị lưu:", formData);
            // await hotelAdminService.updateHotel(hotelId, formData);
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            console.error("Lỗi khi lưu:", error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 sm:p-6 transition-opacity">
            {/* Tăng max-w-6xl để có không gian hiển thị list dữ liệu */}
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-gray-50/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <Building2 className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">
                                {loading ? "Đang tải dữ liệu..." : "Chi tiết Khách sạn"}
                            </h2>
                            {formData && (
                                <p className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                                    ID: {formData.id}
                                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                    <span className="flex items-center gap-1"><Eye className="w-3 h-3"/> {formData.viewCount} views</span>
                                </p>
                            )}
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Tabs Navigation */}
                {!loading && formData && (
                    <div className="flex border-b border-gray-200 px-6 bg-white">
                        <button
                            onClick={() => setActiveTab('basic')}
                            className={`py-3 px-4 font-medium text-sm border-b-2 transition-colors ${
                                activeTab === 'basic'
                                    ? 'border-purple-600 text-purple-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            <div className="flex items-center gap-2"><Info className="w-4 h-4"/> Thông tin cơ bản</div>
                        </button>
                        <button
                            onClick={() => setActiveTab('rooms')}
                            className={`py-3 px-4 font-medium text-sm border-b-2 transition-colors ${
                                activeTab === 'rooms'
                                    ? 'border-purple-600 text-purple-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            <div className="flex items-center gap-2"><BedDouble className="w-4 h-4"/> Hạng phòng & Giá ({formData.roomTypes?.length || 0})</div>
                        </button>
                    </div>
                )}

                {/* Body (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
                    {loading || !formData ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                        </div>
                    ) : (
                        <>
                            {/* ================= TAB 1: THÔNG TIN CƠ BẢN ================= */}
                            <div className={activeTab === 'basic' ? 'block space-y-8' : 'hidden'}>

                                {/* 1. Grid Core Info & Address */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Cột trái: Thông tin chính */}
                                    <div className="space-y-4 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                                        <h3 className="font-semibold text-gray-800 border-b pb-2 mb-4">Thông tin chung</h3>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Tên khách sạn</label>
                                            <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-purple-500 outline-none" />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Hotline</label>
                                                <input type="text" value={formData.hotline} onChange={(e) => setFormData({...formData, hotline: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-purple-500 outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái (Status)</label>
                                                <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-purple-500 outline-none">
                                                    <option value="AVAILABLE">Available</option>
                                                    <option value="FULL">Full</option>
                                                    <option value="UNAVAILABLE">Unavailable</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                                            <textarea rows={4} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:ring-1 focus:ring-purple-500 outline-none text-sm" />
                                        </div>

                                        <div className="flex gap-4 text-xs text-gray-400 mt-2">
                                            <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3"/> Tạo: {new Date(formData.createdAt).toLocaleDateString()}</span>
                                            <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3"/> Cập nhật: {new Date(formData.updatedAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    {/* Cột phải: Địa chỉ & Owner */}
                                    <div className="space-y-4">
                                        {/* Địa chỉ */}
                                        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                                            <h3 className="font-semibold text-gray-800 border-b pb-2 mb-4 flex items-center gap-2"><MapPin className="w-4 h-4 text-red-500"/> Địa chỉ</h3>
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">Đường / Số nhà</label>
                                                    <input type="text" value={formData.address?.street || ''} onChange={(e) => setFormData({...formData, address: { ...formData.address, street: e.target.value }})} className="w-full px-3 py-1.5 border rounded-lg outline-none text-sm" />
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">Phường / Xã</label>
                                                        <input type="text" value={formData.address?.ward || ''} onChange={(e) => setFormData({...formData, address: { ...formData.address, ward: e.target.value }})} className="w-full px-3 py-1.5 border rounded-lg outline-none text-sm" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">Tỉnh / Thành phố</label>
                                                        <input type="text" value={formData.address?.province || ''} onChange={(e) => setFormData({...formData, address: { ...formData.address, province: e.target.value }})} className="w-full px-3 py-1.5 border rounded-lg outline-none text-sm" />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-3 gap-3">
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">Postal Code</label>
                                                        <input type="number" value={formData.address?.postalCode || 0} onChange={(e) => setFormData({...formData, address: { ...formData.address, postalCode: parseInt(e.target.value) }})} className="w-full px-3 py-1.5 border rounded-lg outline-none text-sm" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">Latitude</label>
                                                        <input type="number" value={formData.address?.latitude || 0} onChange={(e) => setFormData({...formData, address: { ...formData.address, latitude: parseFloat(e.target.value) }})} className="w-full px-3 py-1.5 border rounded-lg outline-none text-sm" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-700 mb-1">Longitude</label>
                                                        <input type="number" value={formData.address?.longitude || 0} onChange={(e) => setFormData({...formData, address: { ...formData.address, longitude: parseFloat(e.target.value) }})} className="w-full px-3 py-1.5 border rounded-lg outline-none text-sm" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Chủ sở hữu (Read-only) */}
                                        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-start gap-4">
                                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                                                {formData.owner?.avatarUrl ? <img src={formData.owner.avatarUrl} alt="avatar" /> : <User className="text-gray-400" />}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-800 text-sm">Chủ sở hữu: {formData.owner?.username || "N/A"}</h3>
                                                <p className="text-xs text-gray-500">{formData.owner?.email || "Chưa cập nhật email"}</p>
                                                <p className="text-xs text-gray-500">{formData.owner?.phone || "Chưa cập nhật SĐT"} • {formData.owner?.gender}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 2. Lists (Utilities, Regulations, Images) */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                        <h4 className="font-medium text-sm flex items-center gap-2 mb-3"><Wifi className="w-4 h-4 text-emerald-500"/> Tiện ích khách sạn</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {formData.hotelUtilities?.map(u => (
                                                <span key={u.id} className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-md border border-emerald-100">{u.name}</span>
                                            ))}
                                            {(!formData.hotelUtilities || formData.hotelUtilities.length === 0) && <span className="text-xs text-gray-400">Không có dữ liệu</span>}
                                        </div>
                                    </div>

                                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                        <h4 className="font-medium text-sm flex items-center gap-2 mb-3"><ShieldCheck className="w-4 h-4 text-amber-500"/> Nội quy</h4>
                                        <ul className="space-y-2 text-xs text-gray-600">
                                            {formData.hotelRegulations?.map(r => (
                                                <li key={r.id} className="flex flex-col"><strong className="text-gray-800">{r.name}</strong> <span>{r.description}</span></li>
                                            ))}
                                            {(!formData.hotelRegulations || formData.hotelRegulations.length === 0) && <span className="text-gray-400">Không có dữ liệu</span>}
                                        </ul>
                                    </div>

                                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                        <h4 className="font-medium text-sm flex items-center gap-2 mb-3"><ImageIcon className="w-4 h-4 text-blue-500"/> Hình ảnh ({formData.images?.length || 0})</h4>
                                        <div className="grid grid-cols-3 gap-2">
                                            {formData.images?.slice(0, 6).map(img => (
                                                <div key={img.id} className="aspect-square bg-gray-100 rounded-lg overflow-hidden border">
                                                    <img src={img.path} alt="hotel img" className="w-full h-full object-cover" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ================= TAB 2: HẠNG PHÒNG ================= */}
                            <div className={activeTab === 'rooms' ? 'block' : 'hidden'}>
                                {(!formData.roomTypes || formData.roomTypes.length === 0) ? (
                                    <div className="text-center py-10 text-gray-500">Khách sạn này chưa có hạng phòng nào.</div>
                                ) : (
                                    <div className="space-y-6">
                                        {formData.roomTypes.map((room, index) => (
                                            <div key={room.id} className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 relative">
                                                {/* Dấu badge phân biệt phòng */}
                                                <div className="absolute top-4 right-4 bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full">
                                                    #{index + 1}
                                                </div>

                                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                                    {/* Thông tin chính của phòng */}
                                                    <div className="col-span-1 space-y-3">
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-700">Tên hạng phòng</label>
                                                            <input type="text" value={room.name} readOnly className="w-full font-semibold text-gray-800 border-b border-gray-200 py-1 outline-none bg-transparent" />
                                                        </div>
                                                        <div className="flex gap-4">
                                                            <div>
                                                                <label className="block text-xs font-medium text-gray-700">Giá (Price)</label>
                                                                <input type="number" value={room.price} readOnly className="w-full text-sm text-green-600 font-medium py-1 outline-none bg-transparent border-b border-gray-200" />
                                                            </div>
                                                            <div>
                                                                <label className="block text-xs font-medium text-gray-700">Sức chứa</label>
                                                                <input type="number" value={room.capacity} readOnly className="w-full text-sm py-1 outline-none bg-transparent border-b border-gray-200" />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-700">Phần trăm cọc (%)</label>
                                                            <input type="number" value={room.depositedPercent} readOnly className="w-full text-sm py-1 outline-none bg-transparent border-b border-gray-200" />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-700">Mô tả</label>
                                                            <p className="text-xs text-gray-500 mt-1 line-clamp-3">{room.description}</p>
                                                        </div>
                                                    </div>

                                                    {/* Danh sách phòng chi tiết & Tiện ích */}
                                                    <div className="col-span-1 lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">

                                                        {/* Các mã phòng (Room Details) */}
                                                        <div>
                                                            <h5 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1"><DoorOpen className="w-3 h-3"/> Mã phòng thực tế ({room.roomDetails?.length || 0})</h5>
                                                            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-2">
                                                                {room.roomDetails?.map(detail => (
                                                                    <span key={detail.id} className={`px-2 py-1 text-xs rounded border ${detail.isActive ? 'bg-white border-green-200 text-green-700' : 'bg-gray-100 border-gray-200 text-gray-500'}`}>
                                                                        {detail.roomCode}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        {/* Tiện ích phòng & Ảnh */}
                                                        <div className="space-y-4">
                                                            <div>
                                                                <h5 className="text-xs font-semibold text-gray-700 mb-2">Tiện ích phòng</h5>
                                                                <div className="flex flex-wrap gap-1">
                                                                    {room.roomUtilities?.map(u => (
                                                                        <span key={u.id} className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] rounded border border-blue-100">{u.name}</span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <h5 className="text-xs font-semibold text-gray-700 mb-2">Ảnh mẫu phòng ({room.roomTypeImages?.length || 0})</h5>
                                                                <div className="flex gap-2 overflow-x-auto pb-1">
                                                                    {room.roomTypeImages?.map(img => (
                                                                        <img key={img.id} src={img.path} className="w-12 h-12 rounded object-cover border border-gray-200 flex-shrink-0" alt="room" />
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>

                {/* Footer Buttons */}
                <div className="px-6 py-4 border-t border-gray-100 bg-white flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <label className="flex items-center cursor-pointer gap-2">
                            <input
                                type="checkbox"
                                disabled={loading || !formData}
                                checked={formData?.isActive || false}
                                onChange={(e) => setFormData(formData ? {...formData, isActive: e.target.checked} : null)}
                                className="w-5 h-5 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                            />
                            <span className="text-sm font-medium text-gray-700">Trạng thái Active</span>
                        </label>
                    </div>

                    <div className="flex items-center gap-3">
                        <button onClick={onClose} className="px-5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            Hủy
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={loading || saving || !formData}
                            className="px-5 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-sm transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {saving ? (
                                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Lưu...</>
                            ) : "Lưu thay đổi"}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}