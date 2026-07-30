'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    Building2,
    Users,
    ShoppingBag,
    RotateCw,
    ChevronRight,
    UserCheck,
    Hotel,
    ShieldCheck,
} from 'lucide-react';
import { dashboardAdminService, GetDashboardData } from "@/services/admin/dashboard-admin-service";

function CircularProgress({ percentage, colorClass }: { percentage: number; colorClass: string }) {
    const radius = 16;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 40 40">
                {/* Vòng nền xám */}
                <circle
                    cx="20"
                    cy="20"
                    r={radius}
                    className="stroke-gray-100"
                    strokeWidth="4"
                    fill="transparent"
                />
                {/* Vòng tiến trình tô màu động */}
                <circle
                    cx="20"
                    cy="20"
                    r={radius}
                    className={`${colorClass} transition-all duration-700 ease-out`}
                    strokeWidth="4"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                />
            </svg>
            <span className="absolute text-[10px] font-bold text-gray-700">
                {percentage}%
            </span>
        </div>
    );
}

export default function AdminDashboardPage() {
    const [dashboardData, setDashboardData] = useState<GetDashboardData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const data = await dashboardAdminService.getDashboard();
            setDashboardData(data);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu dashboard:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const hotelActivePercentage = dashboardData?.totalHotels
        ? Math.floor((dashboardData.totalHotelsActive / dashboardData.totalHotels) * 100)
        : 0;

    const userActivePercentage = dashboardData?.totalUsers
        ? Math.floor((dashboardData.totalUsersActive / dashboardData.totalUsers) * 100)
        : 0;

    return (
        <div className="p-6 mt-18 h-screen max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Bảng điều khiển</h1>
                    <p className="text-xs text-gray-500 mt-1">Tổng quan hoạt động chính của hệ thống khách sạn.</p>
                </div>
                <button
                    onClick={fetchDashboardData}
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                    <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-purple-600' : 'text-gray-500'}`} />
                    Làm mới
                </button>
            </div>

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Card 1: Đơn hàng */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold text-gray-500">Tổng Đơn hàng</span>
                        <div className="p-2.5 bg-purple-50 rounded-xl text-purple-600">
                            <ShoppingBag className="w-5 h-5" />
                        </div>
                    </div>
                    {loading ? (
                        <div className="h-8 w-24 bg-gray-100 animate-pulse rounded my-1" />
                    ) : (
                        <div className="text-2xl font-extrabold text-gray-900">
                            {dashboardData?.totalOrders?.toLocaleString('vi-VN') || 0}
                        </div>
                    )}
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md mt-2">
                        Tất cả giao dịch đặt phòng
                    </span>
                </div>

                {/* Card 2: Khách sạn */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold text-gray-500">Đối tác Khách sạn</span>
                        <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600">
                            <Building2 className="w-5 h-5" />
                        </div>
                    </div>
                    {loading ? (
                        <div className="h-8 w-24 bg-gray-100 animate-pulse rounded my-1" />
                    ) : (
                        <div className="text-2xl font-extrabold text-gray-900">
                            {dashboardData?.totalHotels?.toLocaleString('vi-VN') || 0}
                        </div>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                            <Hotel className="w-3 h-3" />
                            {dashboardData?.totalHotelsActive || 0} đang hoạt động ({hotelActivePercentage}%)
                        </span>
                    </div>
                </div>

                {/* Card 3: Người dùng */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold text-gray-500">Tài khoản Người dùng</span>
                        <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600">
                            <Users className="w-5 h-5" />
                        </div>
                    </div>
                    {loading ? (
                        <div className="h-8 w-24 bg-gray-100 animate-pulse rounded my-1" />
                    ) : (
                        <div className="text-2xl font-extrabold text-gray-900">
                            {dashboardData?.totalUsers?.toLocaleString('vi-VN') || 0}
                        </div>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                            <UserCheck className="w-3 h-3" />
                            {dashboardData?.totalUsersActive || 0} đang hoạt động ({userActivePercentage}%)
                        </span>
                    </div>
                </div>
            </div>

            {/* Quick Actions & System Info Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Tóm tắt nhanh trạng thái */}
                <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-purple-600" />
                        Tình trạng Hoạt động Hệ thống
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-gray-50/70 border border-gray-100 flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Tỷ lệ Khách sạn hoạt động</p>
                                <p className="text-lg font-bold text-gray-800">
                                    {dashboardData?.totalHotelsActive || 0} / {dashboardData?.totalHotels || 0}
                                </p>
                            </div>
                            <CircularProgress percentage={hotelActivePercentage} colorClass="stroke-purple-600" />
                        </div>

                        <div className="p-4 rounded-xl bg-gray-50/70 border border-gray-100 flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Tỷ lệ Tài khoản hoạt động</p>
                                <p className="text-lg font-bold text-gray-800">
                                    {dashboardData?.totalUsersActive || 0} / {dashboardData?.totalUsers || 0}
                                </p>
                            </div>
                            <CircularProgress percentage={userActivePercentage} colorClass="stroke-emerald-500" />
                        </div>
                    </div>
                </div>

                {/* Quick Navigation Panel */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                    <div>
                        <h3 className="text-sm font-bold text-gray-800 mb-1">Lối tắt quản lý</h3>
                        <p className="text-xs text-gray-400 mb-4">Truy cập nhanh danh mục điều hành</p>

                        <div className="space-y-2">
                            <Link
                                href="/admin/orders"
                                className="flex items-center justify-between p-2.5 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/40 transition-all text-xs font-medium text-gray-700 hover:text-purple-700 group cursor-pointer"
                            >
                                <span className="flex items-center gap-2.5">
                                    <ShoppingBag className="w-4 h-4 text-purple-600" />
                                    Quản lý Đơn hàng
                                </span>
                                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 group-hover:text-purple-600 transition-all" />
                            </Link>

                            <Link
                                href="/admin/users"
                                className="flex items-center justify-between p-2.5 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/40 transition-all text-xs font-medium text-gray-700 hover:text-purple-700 group cursor-pointer"
                            >
                                <span className="flex items-center gap-2.5">
                                    <Users className="w-4 h-4 text-blue-600" />
                                    Quản lý Người dùng
                                </span>
                                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 group-hover:text-purple-600 transition-all" />
                            </Link>

                            <Link
                                href="/admin/hotels"
                                className="flex items-center justify-between p-2.5 rounded-xl border border-gray-100 hover:border-purple-200 hover:bg-purple-50/40 transition-all text-xs font-medium text-gray-700 hover:text-purple-700 group cursor-pointer"
                            >
                                <span className="flex items-center gap-2.5">
                                    <Building2 className="w-4 h-4 text-emerald-600" />
                                    Quản lý Khách sạn
                                </span>
                                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 group-hover:text-purple-600 transition-all" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}