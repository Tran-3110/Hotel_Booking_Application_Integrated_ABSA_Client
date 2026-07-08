'use client';

import React from 'react';
import { DoorOpen } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { setSavingStatus, updateRoomField, resetChanges } from '@/store/slices/editHotelSlice';
import {ReduxState} from "@/constants/redux-state";

export default function RoomsTab({ hotelId, onClose }: { hotelId: string, onClose: () => void }) {
    const dispatch = useDispatch();
    const { data: formData, isSaving } = useSelector((state: ReduxState) => state.editHotelState);
    const rooms = formData?.roomTypes || [];

    const handleSave = async () => {
        dispatch(setSavingStatus(true));
        try {
            console.log("Lưu Tab 2 - Danh sách phòng từ Redux:", rooms);
            // TODO: Logic gọi API lưu danh sách phòng ở đây
            onClose();
        } catch (error) {
            console.error("Lỗi khi lưu Tab 2:", error);
        } finally {
            dispatch(setSavingStatus(false));
        }
    };

    if (rooms.length === 0) {
        return <div className="text-center py-10 text-gray-500">Khách sạn này chưa có hạng phòng nào.</div>;
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/30">
                {rooms.map((room, index) => (
                    <div key={room.id} className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 relative">
                        <div className="absolute top-4 right-4 bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1 rounded-full">
                            #{index + 1}
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="col-span-1 space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700">Tên hạng phòng</label>
                                    <input
                                        type="text"
                                        value={room.name || ""}
                                        onChange={(e) => dispatch(updateRoomField({ roomIndex: index, field: 'name', value: e.target.value }))}
                                        className="w-full font-semibold text-gray-800 border-b border-gray-200 py-1 outline-none bg-transparent focus:border-purple-500 transition-colors"
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700">Giá (Price)</label>
                                        <input
                                            type="number"
                                            value={room.price || 0}
                                            onChange={(e) => dispatch(updateRoomField({ roomIndex: index, field: 'price', value: Number(e.target.value) }))}
                                            className="w-full text-sm text-green-600 font-medium py-1 outline-none bg-transparent border-b border-gray-200 focus:border-purple-500 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700">Sức chứa</label>
                                        <input
                                            type="number"
                                            value={room.capacity || 0}
                                            onChange={(e) => dispatch(updateRoomField({ roomIndex: index, field: 'capacity', value: Number(e.target.value) }))}
                                            className="w-full text-sm py-1 outline-none bg-transparent border-b border-gray-200 focus:border-purple-500 transition-colors"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-1 lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
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
                                <div className="space-y-4">
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

            {/* Footer Tab 2 */}
            <div className="px-6 py-4 border-t border-gray-100 bg-white flex items-center justify-end shrink-0 mt-auto">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => {
                            if(window.confirm("Bạn có chắc chắn muốn hủy mọi thay đổi của phòng và khôi phục dữ liệu gốc?")) {
                                dispatch(resetChanges());
                            }
                        }}
                        className="px-4 py-2 text-sm font-medium text-amber-600 hover:bg-amber-50 border border-amber-200 rounded-lg transition-colors"
                    >
                        Reset dữ liệu
                    </button>
                    <button onClick={onClose} className="px-5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Hủy</button>
                    <button onClick={handleSave} disabled={isSaving} className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 shadow-sm transition-colors disabled:opacity-50">
                        {isSaving ? "Đang lưu..." : "Lưu"}
                    </button>
                </div>
            </div>
        </div>
    );
}