'use client';

import React, { useState, useEffect } from 'react';
import { GetAdminSnapshotHotelResponse } from "@/common/types/admin/snapshot-hotel";
import { hotelAdminService } from "@/services/admin/hotel-admin-service";
import PaginationCustom from "@/components/pagination-custom";
import { Plus } from "lucide-react";
import HotelDetailModal from "@/components/admin/hotel-detail-modal";
import {Button} from "@/components/ui/button";
import AddHotelModal from "@/components/admin/add-hotel";
import {Input} from "@/components/ui/input";

export default function HotelManagement() {
    const [hotels, setHotels] = useState<GetAdminSnapshotHotelResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [page, setPage] = useState<number>(0);
    const [size] = useState<number>(10);
    const [totalPages, setTotalPages] = useState<number>(1);

    const [searchTerm, setSearchTerm] = useState<string>('');
    const [debouncedSearch, setDebouncedSearch] = useState<string>('');

    const [sortOrder, setSortOrder] = useState<'createdAt,desc' | 'createdAt,asc'>('createdAt,desc');

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
    const [selectedHotelId, setSelectedHotelId] = useState<string | null>(null);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);

    const fetchHotels = async () => {
        setLoading(true);
        try {
            const res = await hotelAdminService.getHotelList(page, size, sortOrder, debouncedSearch);
            setHotels(res.content);
            setTotalPages(res.totalPages);
        } catch (error) {
            window.alert("Lỗi khi tải danh sách khách sạn!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHotels();
    }, [page, debouncedSearch, sortOrder]);

    const handleEditClick = (id: string) => {
        setSelectedHotelId(id);
        setIsModalOpen(true);
    };

    return (
        <div className="p-6 mt-18 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Quản lý Khách sạn</h1>
                    <p className="text-sm text-gray-500 mt-1">Xem, tìm kiếm và quản lý trạng thái các khách sạn trong hệ thống.</p>
                </div>

                <Button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    Thêm khách sạn
                </Button>
            </div>

            {/* Toolbar: Search & Filter */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="relative w-full sm:w-96">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <Input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition duration-150 ease-in-out"
                        placeholder="Tìm kiếm theo tên khách sạn..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPage(0);
                        }}
                    />
                </div>

                <div className="w-full sm:w-auto">
                    <select suppressHydrationWarning
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-lg border bg-white cursor-pointer"
                        value={sortOrder}
                        onChange={(e) => {
                            setSortOrder(e.target.value as 'createdAt,desc' | 'createdAt,asc');
                            setPage(0);
                        }}
                    >
                        <option value="createdAt,desc">Mới nhất trước</option>
                        <option value="createdAt,asc">Cũ nhất trước</option>
                    </select>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách sạn</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vị trí</th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Lượt xem</th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                                    Đang tải dữ liệu...
                                </td>
                            </tr>
                        ) : hotels.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                                    Không tìm thấy khách sạn nào.
                                </td>
                            </tr>
                        ) : (
                            hotels.map((hotel) => (
                                <tr key={hotel.id} className="hover:bg-purple-50/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-12 w-12 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                                                {hotel.thumbnail && (
                                                    <img
                                                        className="h-12 w-12 object-cover"
                                                        src={hotel.thumbnail}
                                                        alt={hotel.name || 'Khách sạn'}
                                                    />
                                                )}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {hotel.name
                                                        ? (hotel.name.length > 40 ? hotel.name.substring(0, 40) + "..." : hotel.name)
                                                        : ""}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900 line-clamp-1">{hotel.street || ""}</div>
                                        <div className="text-sm text-gray-500">
                                            {[hotel.ward, hotel.province].filter(Boolean).join(", ")}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {hotel.viewCount || 0} views
            </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${hotel.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {hotel.isActive ? 'Hoạt động' : 'Tạm khóa'}
            </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleEditClick(hotel.id)}
                                            className="text-purple-600 hover:text-purple-900 transition-colors cursor-pointer"
                                        >
                                            Chi tiết
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>

                <div className="bg-white px-4 py-4 border-t border-gray-200 sm:px-6">
                    <PaginationCustom page={page} totalPages={totalPages} onPageChange={(currentPage) => setPage(currentPage)} />
                </div>
            </div>

            <HotelDetailModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                hotelId={selectedHotelId}
                onSuccess={() => {
                    fetchHotels();
                }}
            />

            <AddHotelModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={() => {
                    fetchHotels();
                }}
            />
        </div>
    );
}