'use client';

import React, { useState, useEffect, useRef } from 'react';
import { DoorOpen, Plus, Trash2, ImageIcon, Wifi, Save, Power, PowerOff } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import {
    updateRoomField,
    addRoomType,
    removeRoomType,
    resetChanges,
    updateRoomType
} from '@/store/slices/editHotelSlice';
import { ReduxState } from "@/constants/redux-state";
import MultiUploadBox from "@/components/upload/multi-upload-box";
import { FilePreview } from "@/common/types/file";
import { cloudinary } from "@/services/upload-service";
import { RoomDetailResponse, RoomUtilityResponse } from "@/common/types/admin/hotel-detail";
import { hotelAdminService, UpdateRoomTypeRequest } from "@/services/admin/hotel-admin-service";

export default function RoomsTab({ hotelId, onSuccess, onClose }: { hotelId: string, onSuccess?: () => void, onClose: () => void }) {
    const dispatch = useDispatch();
    const { data: formData } = useSelector((state: ReduxState) => state.editHotelState);
    const rooms = formData?.roomTypes || [];

    const [roomImages, setRoomImages] = useState<Record<number, FilePreview[]>>({});
    const [reset, setReset] = useState<number>(0);
    const [savingIndex, setSavingIndex] = useState<number | null>(null);

    const [availableRoomUtilities, setAvailableRoomUtilities] = useState<RoomUtilityResponse[]>([]);
    const [openUtilityDropdownIndex, setOpenUtilityDropdownIndex] = useState<number | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchUtilities = async () => {
            try {
                const data = await hotelAdminService.getRoomUtilities();
                setAvailableRoomUtilities(data);
            } catch (error) {
                window.alert("Lỗi lấy danh sách tiện ích phòng!");
            }
        };
        fetchUtilities();
    }, []);

    useEffect(() => {
        if (rooms) {
            const initialImagesState: Record<number, FilePreview[]> = {};
            rooms.forEach((room, index) => {
                const mappedImages: FilePreview[] = (room.roomTypeImages || []).map((img) => ({
                    id: img.id.toString(),
                    url: img.path,
                }));
                initialImagesState[index] = mappedImages;
            });
            setRoomImages(initialImagesState);
        }
    }, [formData, reset]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpenUtilityDropdownIndex(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleFilesAdded = (roomIndex: number, files: File[]) => {
        const imageFiles = files.filter(f => f.type.startsWith("image/"));
        const newPreviews: FilePreview[] = imageFiles.map((file) => ({
            id: Math.random().toString(36).substring(7),
            url: URL.createObjectURL(file),
            file: file,
        }));
        setRoomImages(prev => ({
            ...prev,
            [roomIndex]: [...(prev[roomIndex] || []), ...newPreviews]
        }));
    };

    const handleRemoveFile = (roomIndex: number, id: string) => {
        setRoomImages(prev => ({
            ...prev,
            [roomIndex]: (prev[roomIndex] || []).filter((item) => item.id !== id)
        }));
    };

    const toggleRoomUtility = (roomIndex: number, utility: RoomUtilityResponse) => {
        const currentRoom = rooms[roomIndex];
        const currentUtilities = currentRoom.roomUtilities || [];
        const isSelected = currentUtilities.some((u) => u.id === utility.id);

        const newUtilities = isSelected
            ? currentUtilities.filter((u) => u.id !== utility.id)
            : [...currentUtilities, utility];

        dispatch(updateRoomField({ roomIndex, field: 'roomUtilities', value: newUtilities }));
    };

    const handleAddRoomDetail = (roomIndex: number) => {
        const currentRoom = rooms[roomIndex];
        const currentDetails = currentRoom.roomDetails || [];

        if (currentDetails.some(d => d.roomCode.trim() === "")) {
            window.alert("Vui lòng điền mã phòng đang trống trước khi thêm mới!");
            return;
        }

        const newDetails = [...currentDetails, { roomCode: "", isActive: true }];
        dispatch(updateRoomField({ roomIndex, field: 'roomDetails', value: newDetails }));
    };

    const handleUpdateRoomDetail = (roomIndex: number, detailIndex: number, field: string, value: any) => {
        const newDetails = [...(rooms[roomIndex].roomDetails || [])];
        newDetails[detailIndex] = { ...newDetails[detailIndex], [field]: value };
        dispatch(updateRoomField({ roomIndex, field: 'roomDetails', value: newDetails }));
    };

    const handleRemoveRoomDetail = (roomIndex: number, detailIndex: number) => {
        const newDetails = [...(rooms[roomIndex].roomDetails || [])];
        newDetails.splice(detailIndex, 1);
        dispatch(updateRoomField({ roomIndex, field: 'roomDetails', value: newDetails }));
    };

    const handleAddRoomType = () => {
        if (rooms.some(r => !r.name || r.name.trim() === "")) {
            window.alert("Vui lòng điền đầy đủ tên cho các hạng phòng hiện tại trước khi thêm mới!");
            return;
        }
        dispatch(addRoomType({
            name: "", description: "", price: 0, capacity: 1,
            roomUtilities: [], roomTypeImages: [], roomDetails: [], isActive: true
        }));
    };

    const handleSaveSingleRoom = async (index: number) => {
        const room = rooms[index];

        if (!room.name || room.name.trim() === "") {
            window.alert("Tên hạng phòng không được để trống!");
            return;
        }
        if (room.roomDetails?.some((d: RoomDetailResponse) => d.roomCode.trim() === "")) {
            window.alert("Có mã phòng đang bị bỏ trống. Vui lòng kiểm tra lại!");
            return;
        }
        if (room.price < 0) {
            window.alert("Giá tiền không được nhỏ hơn 0!");
            return;
        }
        if (room.capacity < 1) {
            window.alert("Số lượng khách trong phòng không được nhỏ hơn 1!");
            return;
        }

        setSavingIndex(index);
        try {
            const sigData = await cloudinary.getSignature(`homebooking-room`);
            const roomImgState = roomImages[index] || [];

            const existingUrls = roomImgState.filter(item => !item.file).map(item => item.url);
            const newFilesToUpload = roomImgState.filter(item => item.file);

            let newUploadedUrls: string[] = [];
            if (newFilesToUpload.length > 0) {
                const uploadPromises = newFilesToUpload.map(async (item) => {
                    const res = await cloudinary.uploadSingleImage(item.file!, sigData);
                    return res.secure_url;
                });
                newUploadedUrls = await Promise.all(uploadPromises);
            }

            const allImageUrls = [...existingUrls, ...newUploadedUrls];

            const req: UpdateRoomTypeRequest = {
                id: room.id,
                hotelId: hotelId,
                name: room.name,
                description: room.description || "",
                price: room.price || 0,
                capacity: room.capacity || 1,
                images: allImageUrls,
                roomUtilities: room.roomUtilities?.map((u: RoomUtilityResponse) => u.id) || [],
                roomDetails: room.roomDetails?.map((d: RoomDetailResponse) => ({
                    id: d.id,
                    roomCode: d.roomCode,
                    isActive: d.isActive !== undefined ? d.isActive : true
                })) || []
            };

            const data = await hotelAdminService.updateRoomType(req);
            dispatch(updateRoomType({ index: index, data: data }));

            window.alert(`Lưu hạng phòng "${room.name}" thành công!`);
            if(onSuccess) onSuccess();
        } catch (error) {
            window.alert("Cập nhật phòng không thành công. Vui lòng thử lại!");
        } finally {
            setSavingIndex(null);
        }
    };

    const handleUpdateActive = async (index: number) => {
        const room = rooms[index];
        const currentActive = room.isActive !== false; 
        const newActiveState = !currentActive; 

        if (window.confirm(`Bạn có chắc chắn muốn ${newActiveState ? 'kích hoạt' : 'vô hiệu hóa'} hạng phòng "${room.name || 'này'}" không?`)) {
            try {
                if (room.id) {
                    setSavingIndex(index);
                    const res = await hotelAdminService.updateActiveRoomType({
                        id: room.id, active: newActiveState
                    });

                    if (res.success) {
                        dispatch(updateRoomField({ roomIndex: index, field: "isActive", value: res.active }));
                        if(onSuccess) onSuccess();
                    } else {
                        window.alert("Cập nhật trạng thái thất bại!");
                    }
                }
            } catch (error) {
                window.alert("Đã có lỗi xảy ra!");
            } finally {
                setSavingIndex(null);
            }
        }
    };

    const handleRemoveUnsavedRoom = (index: number) => {
        dispatch(removeRoomType(index));
        setRoomImages(prev => {
            const newState: Record<number, FilePreview[]> = {};
            for (let i = 0; i < rooms.length; i++) {
                if (i < index) newState[i] = prev[i] || [];
                else if (i > index) newState[i - 1] = prev[i] || [];
            }
            return newState;
        });
    };

    return (
        <div className="flex flex-col h-full bg-gray-50/50">
            <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={dropdownRef}>

                <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <div>
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2 text-lg">
                            <DoorOpen className="w-5 h-5 text-purple-600"/>
                            Danh sách hạng phòng ({rooms.length})
                        </h3>
                    </div>
                    <button onClick={handleAddRoomType} className="bg-purple-600 text-white hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm transition-colors">
                        <Plus className="w-4 h-4"/> Thêm hạng phòng mới
                    </button>
                </div>

                {rooms.length === 0 && (
                    <div className="text-center py-16 bg-white border border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center">
                        <DoorOpen className="w-12 h-12 text-gray-300 mb-3"/>
                        <p className="text-gray-500 font-medium">Khách sạn này chưa có hạng phòng nào.</p>
                    </div>
                )}

                <div className="space-y-6">
                    {rooms.map((room, index) => {
                        const currentImgState = roomImages[index] || [];
                        const isDropdownOpen = openUtilityDropdownIndex === index;
                        const isSavingThis = savingIndex === index;
                        const isInactive = room.isActive === false; // Kiểm tra xem phòng có đang bị tắt không

                        return (
                            <div key={room.id || index} className={`bg-white border ${isSavingThis ? 'border-purple-300 ring-4 ring-purple-50' : 'border-gray-200'} rounded-xl shadow-sm relative group transition-all ${isInactive ? 'opacity-75 grayscale-[20%]' : ''}`}>

                                {/* Badge đánh số và báo trạng thái vô hiệu hóa */}
                                <div className={`absolute top-0 right-8 -translate-y-1/2 text-white text-xs font-bold px-4 py-1 rounded-full shadow-md z-10 ${isInactive ? 'bg-gray-500' : 'bg-gradient-to-r from-purple-600 to-indigo-600'}`}>
                                    Phòng #{index + 1} {isInactive ? "(Đã vô hiệu hóa)" : ""}
                                </div>

                                <div className={`p-6 ${isInactive ? 'pointer-events-none' : ''}`}>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                                        {/* THÔNG TIN CƠ BẢN */}
                                        <div className="space-y-5">
                                            <div>
                                                <h4 className="font-semibold text-gray-800 border-b pb-2 mb-4 text-sm flex items-center gap-2">Thông tin cơ bản</h4>
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="block text-xs font-semibold text-gray-600 mb-1">Tên hạng phòng *</label>
                                                        <input type="text" value={room.name || ""} placeholder="VD: Standard Double Room" onChange={(e) => dispatch(updateRoomField({ roomIndex: index, field: 'name', value: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-purple-500 font-medium text-gray-800"/>
                                                    </div>

                                                    <div>
                                                        <label className="block text-xs font-semibold text-gray-600 mb-1">Mô tả phòng</label>
                                                        <textarea rows={2} value={room.description || ""} placeholder="Mô tả ngắn gọn về hạng phòng..." onChange={(e) => dispatch(updateRoomField({ roomIndex: index, field: 'description', value: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none text-sm focus:ring-1 focus:ring-purple-500"/>
                                                    </div>

                                                    <div className="grid grid-cols-3 gap-3">
                                                        <div>
                                                            <label className="block text-xs font-semibold text-gray-600 mb-1">Giá (VNĐ)</label>
                                                            <input type="number" value={room.price || 0} onChange={(e) => dispatch(updateRoomField({ roomIndex: index, field: 'price', value: Number(e.target.value) }))} className="w-full px-3 py-2 text-emerald-600 font-bold border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-purple-500"/>
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-semibold text-gray-600 mb-1">Sức chứa</label>
                                                            <input type="number" value={room.capacity || 0} onChange={(e) => dispatch(updateRoomField({ roomIndex: index, field: 'capacity', value: Number(e.target.value) }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-1 focus:ring-purple-500 font-medium text-gray-800"/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* TIỆN ÍCH */}
                                            <div className={`bg-gray-50 p-4 rounded-xl border border-gray-200 mt-2 ${isDropdownOpen ? 'relative z-20' : 'relative'}`}>
                                                <h5 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                                                    <Wifi className="w-4 h-4 text-emerald-500"/> Tiện ích phòng
                                                </h5>
                                                <div
                                                    onClick={() => setOpenUtilityDropdownIndex(isDropdownOpen ? null : index)}
                                                    className={`min-h-[46px] w-full bg-white rounded-lg p-2 flex flex-wrap gap-2 cursor-pointer border transition-all ${isDropdownOpen ? "border-emerald-300 ring-2 ring-emerald-100" : "border-gray-300"}`}
                                                >
                                                    {(!room.roomUtilities || room.roomUtilities.length === 0) && (
                                                        <div className="flex items-center px-2 text-gray-400 text-sm italic">Nhấp để chọn tiện ích...</div>
                                                    )}
                                                    {room.roomUtilities?.map((u) => (
                                                        <span key={u.id} className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
                                                            {u.name}
                                                            <button onClick={(e) => { e.stopPropagation(); toggleRoomUtility(index, u); }} className="hover:bg-emerald-200 hover:text-emerald-900 rounded-full w-4 h-4 flex items-center justify-center">×</button>
                                                        </span>
                                                    ))}
                                                </div>

                                                {isDropdownOpen && (
                                                    <div className="absolute w-full left-0 mt-2 top-full bg-white border border-gray-200 shadow-xl rounded-xl p-2 grid grid-cols-1 sm:grid-cols-2 gap-1 max-h-48 overflow-y-auto">
                                                        {availableRoomUtilities.map(utility => {
                                                            const isSelected = room.roomUtilities?.some((u) => u.id === utility.id);
                                                            return (
                                                                <div key={utility.id} onClick={() => toggleRoomUtility(index, utility)} className={`p-2 rounded-md text-xs font-medium cursor-pointer flex justify-between items-center transition-colors ${isSelected ? "bg-emerald-50 text-emerald-700" : "text-gray-600 hover:bg-gray-100"}`}>
                                                                    {utility.name}
                                                                    {isSelected && <span className="text-emerald-600 font-bold">✓</span>}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* CỘT PHẢI: MÃ PHÒNG & QUẢN LÝ ẢNH */}
                                        <div className="space-y-5 flex flex-col h-full relative z-10">
                                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col max-h-[220px]">
                                                <div className="flex items-center justify-between mb-3 border-b pb-2 border-gray-200">
                                                    <h5 className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                                                        <DoorOpen className="w-4 h-4 text-indigo-500"/> Mã phòng thực tế ({room.roomDetails?.length || 0})
                                                    </h5>
                                                    <button onClick={() => handleAddRoomDetail(index)} className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-md flex items-center justify-center hover:bg-indigo-200 transition-colors" title="Thêm mã phòng">
                                                        <Plus className="w-4 h-4"/>
                                                    </button>
                                                </div>
                                                <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                                    {room.roomDetails?.map((detail, dIndex: number) => (
                                                        <div key={detail.id || dIndex} className={`flex items-center gap-2 p-2 rounded-lg border transition-colors ${detail.isActive !== false ? 'bg-white border-green-200 shadow-sm' : 'bg-gray-100 border-gray-300 opacity-70'}`}>
                                                            <input type="text" placeholder="VD: P101" value={detail.roomCode} onChange={(e) => handleUpdateRoomDetail(index, dIndex, 'roomCode', e.target.value)} className={`flex-1 bg-transparent outline-none text-sm font-bold ${detail.isActive !== false ? 'text-gray-800' : 'text-gray-500'}`}/>
                                                            <label className="flex items-center cursor-pointer" title="Trạng thái hoạt động">
                                                                <input type="checkbox" checked={detail.isActive !== false} onChange={(e) => handleUpdateRoomDetail(index, dIndex, 'isActive', e.target.checked)} className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500 cursor-pointer"/>
                                                            </label>
                                                            <button onClick={() => handleRemoveRoomDetail(index, dIndex)} className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-colors" title="Xóa mã phòng này">
                                                                <Trash2 className="w-4 h-4"/>
                                                            </button>
                                                        </div>
                                                    ))}
                                                    {(!room.roomDetails || room.roomDetails.length === 0) && (
                                                        <div className="text-xs text-gray-400 text-center py-6 italic border-2 border-dashed border-gray-300 rounded-lg bg-gray-50/50">
                                                            Chưa có mã phòng nào.
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* QUẢN LÝ ẢNH */}
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-800 border-b pb-2 mb-3 text-sm flex items-center gap-2">
                                                    <ImageIcon className="w-4 h-4 text-blue-500"/> Hình ảnh phòng ({currentImgState.length})
                                                </h4>
                                                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 h-full min-h-[140px]">
                                                    <MultiUploadBox
                                                        previews={currentImgState}
                                                        onFilesAdded={(files) => handleFilesAdded(index, files)}
                                                        onRemoveFile={(id) => handleRemoveFile(index, id)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* ACTION BAR - XỬ LÝ ẨN/HIỆN NÚT */}
                                <div className="mt-6 px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-xl flex items-center justify-between">
                                    <span className="text-xs text-gray-400 italic font-medium">
                                        {room.id ? `ID Phòng: ${room.id}` : "Phòng mới chưa lưu"}
                                    </span>
                                    <div className="flex items-center gap-3">

                                        {/* NẾU PHÒNG ĐÃ LƯU (CÓ ID) -> HIỂN THỊ NÚT VÔ HIỆU HÓA / KÍCH HOẠT */}
                                        {room.id ? (
                                            <button
                                                onClick={() => handleUpdateActive(index)}
                                                disabled={savingIndex !== null}
                                                className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 ${
                                                    !isInactive
                                                        ? 'text-amber-600 bg-amber-50 hover:bg-amber-100 border border-amber-200'
                                                        : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200'
                                                }`}
                                            >
                                                {!isInactive ? (
                                                    <><PowerOff className="w-4 h-4"/> Vô hiệu hóa</>
                                                ) : (
                                                    <><Power className="w-4 h-4"/> Kích hoạt lại</>
                                                )}
                                            </button>
                                        ) : (
                                            /* NẾU PHÒNG CHƯA LƯU (KHÔNG CÓ ID) -> HIỂN THỊ NÚT XÓA */
                                            <button
                                                onClick={() => handleRemoveUnsavedRoom(index)}
                                                disabled={savingIndex !== null}
                                                className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 border border-red-200"
                                            >
                                                <Trash2 className="w-4 h-4"/> Xóa phòng
                                            </button>
                                        )}

                                        <button
                                            onClick={() => handleSaveSingleRoom(index)}
                                            disabled={savingIndex !== null || isInactive}
                                            className="px-6 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center gap-2 shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isSavingThis ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    Đang lưu...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="w-4 h-4"/> Lưu phòng này
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>

                            </div>
                        );
                    })}
                </div>
            </div>

            {/* footer  */}
            <div className="px-6 py-4 border-t border-gray-200 bg-white flex justify-between items-center shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-30">
                <button
                    type="button"
                    onClick={() => {
                        if (window.confirm("Bạn có chắc chắn muốn hủy mọi thay đổi chưa lưu trên các phòng và khôi phục lại dữ liệu gốc ban đầu?")) {
                            dispatch(resetChanges());
                            setReset(prev => prev + 1);
                        }
                    }}
                    className="px-4 py-2 text-sm font-medium text-amber-600 hover:bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2 transition-colors"
                >
                    Reset dữ liệu
                </button>

                <button onClick={onClose} className="px-8 py-2.5 text-sm font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                    Đóng cửa sổ
                </button>
            </div>
        </div>
    );
}