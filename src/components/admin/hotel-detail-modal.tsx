'use client';

import React, { useState, useEffect } from 'react';
import { X, Building2, Info, BedDouble, Eye } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { hotelAdminService } from '@/services/admin/hotel-admin-service';
import { setInitialData, resetSlice } from '@/store/slices/editHotelSlice';

import BasicInfoTab from './basic-info-hotel';
import {ReduxState} from "@/constants/redux-state";
import RoomsTab from "@/components/admin/room-type";

interface HotelDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    hotelId: string | null;
    onSuccess?: () => void;
}

export default function HotelDetailModal({ isOpen, onClose, hotelId, onSuccess }: HotelDetailModalProps) {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<'basic' | 'rooms'>('basic');

    const roomCount = useSelector((state: ReduxState) => state.editHotelState.data?.roomTypes?.length || 0);
    const headerInfo = useSelector((state: ReduxState) => state.editHotelState.data ? { id: state.editHotelState.data.id, viewCount: state.editHotelState.data.viewCount } : null);

    useEffect(() => {
        if (isOpen && hotelId) {
            const fetchDetail = async () => {
                setLoading(true);
                try {
                    const data = await hotelAdminService.getHotelDetail(hotelId);
                    dispatch(setInitialData(data));
                } catch (error) {
                    console.error("Lỗi khi tải chi tiết:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchDetail();
            setActiveTab('basic');
        } else {
            dispatch(resetSlice());
        }
    }, [isOpen, hotelId, dispatch]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 sm:p-6 transition-opacity">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[95vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-gray-50/50 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <Building2 className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">
                                {loading ? "Đang tải dữ liệu..." : "Chi tiết Khách sạn"}
                            </h2>
                            {!loading && headerInfo && (
                                <p className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                                    ID: {headerInfo.id}
                                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                    <span className="flex items-center gap-1"><Eye className="w-3 h-3"/> {headerInfo.viewCount} views</span>
                                </p>
                            )}
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full shrink-0">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Tabs Navigation */}
                {!loading && headerInfo && (
                    <div className="flex border-b border-gray-200 px-6 bg-white shrink-0">
                        <button
                            onClick={() => setActiveTab('basic')}
                            className={`py-3 px-4 font-medium text-sm border-b-2 transition-colors ${
                                activeTab === 'basic' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <div className="flex items-center gap-2"><Info className="w-4 h-4"/> Thông tin cơ bản</div>
                        </button>
                        <button
                            onClick={() => setActiveTab('rooms')}
                            className={`py-3 px-4 font-medium text-sm border-b-2 transition-colors ${
                                activeTab === 'rooms' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <div className="flex items-center gap-2"><BedDouble className="w-4 h-4"/> Hạng phòng ({roomCount})</div>
                        </button>
                    </div>
                )}

                {/* Body Content */}
                <div className="flex-1 overflow-hidden">
                    {loading ? (
                        <div className="flex justify-center items-center h-full">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                        </div>
                    ) : (
                        <>
                            {activeTab === 'basic' && <BasicInfoTab hotelId={hotelId!} onClose={onClose} onSuccess={onSuccess} />}
                            {activeTab === 'rooms' && <RoomsTab hotelId={hotelId!} onClose={onClose} />}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}