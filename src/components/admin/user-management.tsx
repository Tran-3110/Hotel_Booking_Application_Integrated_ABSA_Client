'use client';

import React, { useEffect, useState } from 'react';
import { Input } from "@/components/ui/input";
import PaginationCustom from "@/components/pagination-custom";
import { AdminUserResponse } from "@/common/types/admin/user";
import { userAdminService } from "@/services/admin/user-admin-service";
import UserEditModal from "@/components/admin/user-modal";
import {Gender, UserRole} from "@/common/enums/user";

export default function UserManagement() {
    const [users, setUsers] = useState<AdminUserResponse[]>([]);
    
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<AdminUserResponse | null>(null);
    const [page, setPage] = useState<number>(0);
    const [size] = useState<number>(10);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [debouncedSearch, setDebouncedSearch] = useState<string>('');
    const [sortOrder, setSortOrder] = useState<'createdAt,desc' | 'createdAt,asc'>('createdAt,desc');

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [searchTerm]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await userAdminService.getUserList(page, size, sortOrder, debouncedSearch);
            setUsers(res.content);
            setTotalPages(res.totalPages);
        } catch (error) {
            window.alert("Lỗi khi tải danh sách người dùng!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page, debouncedSearch, sortOrder]);

    const handleEditClick = (id: string) => {
        const user = users.find(u => u.id === id);
        if (user) {
            setSelectedUser(user);
            setIsModalOpen(true);
        }
    };

    const getRoleBadgeColor = (role: UserRole) => {
        switch (role) {
            case UserRole.ADMIN: return 'bg-purple-100 text-purple-800';
            case UserRole.OWNER: return 'bg-blue-100 text-blue-800';
            case UserRole.USER: return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        }).format(date);
    };

    return (
        <div className="p-6 mt-18 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Quản lý Người dùng</h1>
                    <p className="text-sm text-gray-500 mt-1">Xem, tìm kiếm và phân quyền người dùng trong hệ thống.</p>
                </div>
            </div>

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
                        placeholder="Tìm kiếm theo tên, email hoặc username..."
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
                        <option value="createdAt,desc">Đăng ký mới nhất</option>
                        <option value="createdAt,asc">Đăng ký cũ nhất</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Người dùng</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thông tin liên hệ</th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Vai trò & Trạng thái</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian</th>
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
                        ) : users.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                                    Không tìm thấy người dùng nào.
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id} className="hover:bg-purple-50/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center mt-1">
                                                {user.avatarUrl ? (
                                                    <img
                                                        className="h-full w-full object-cover"
                                                        src={user.avatarUrl}
                                                        alt={user.displayName}
                                                    />
                                                ) : (
                                                    <span className="text-gray-400 font-bold text-lg">
                                                        {user.displayName?.charAt(0).toUpperCase() || 'U'}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="ml-4 flex flex-col">
                                                <span className="text-sm font-bold text-gray-900">
                                                    {user.displayName}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    @{user.username}
                                                </span>
                                                <span className="text-[10px] text-gray-400 mt-0.5" title={user.id}>
                                                    ID: {user.id.substring(0, 8)}...
                                                </span>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col gap-1">
                                            <div className="text-sm text-gray-900 flex items-center gap-1">
                                                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                                {user.email}
                                            </div>
                                            <div className="text-xs text-gray-600 flex items-center gap-1">
                                                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                                {user.phone || "Chưa cập nhật"}
                                            </div>
                                            <div className="text-xs text-gray-500 ml-4.5">
                                                Giới tính: {user.gender === Gender.MALE ? 'Nam' : user.gender === Gender.FEMALE ? 'Nữ' : user.gender === Gender.OTHER ? 'Khác' : ''}
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <div className="flex flex-col items-center gap-1.5">
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getRoleBadgeColor(user.role)}`}>
                                                {user.role}
                                            </span>
                                            <div className="flex gap-1 mt-1">
                                                <span className={`px-1.5 py-0.5 text-[10px] leading-4 font-semibold rounded ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`} title="Trạng thái kích hoạt">
                                                    {user.isActive ? 'Active' : 'Locked'}
                                                </span>
                                                <span className={`px-1.5 py-0.5 text-[10px] leading-4 font-semibold rounded ${user.isVerified ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`} title="Xác minh Email/Tài khoản">
                                                    {user.isVerified ? 'Verified' : 'Unverified'}
                                                </span>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col gap-1 text-xs">
                                            <div className="text-gray-900">
                                                <span className="text-gray-500 mr-1">Tạo:</span>
                                                {formatDate(user.createdAt)}
                                            </div>
                                            <div className="text-gray-500">
                                                <span className="mr-1">Sửa:</span>
                                                {formatDate(user.updatedAt)}
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleEditClick(user.id)}
                                            className="text-purple-600 hover:text-purple-900 transition-colors cursor-pointer inline-flex items-center gap-1"
                                        >
                                            Chỉnh sửa
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

            <UserEditModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                data={selectedUser}
                onSuccess={(updatedUser) => {
                    setUsers(prevUsers =>
                        prevUsers.map(user =>
                            user.id === updatedUser.id ? updatedUser : user
                        )
                    );
                }}
            />
        </div>
    );
}