'use client';

import React, { useEffect, useState } from 'react';
import { Input } from "@/components/ui/input";
import PaginationCustom from "@/components/pagination-custom";
import { AdminOrderResponse, OrderDetailResponse } from "@/common/types/admin/order";
import { orderOwnerService } from "@/services/owner/order-owner-service";
import { formatDate } from "@/common/utils/format";
import { OrderStatus } from "@/common/enums/order";
import { CheckCircle, Clock, Check, Ban, Eye, AlertCircle, Layers, House } from 'lucide-react';

export default function OrderOwnerManagement() {
    const [orders, setOrders] = useState<AdminOrderResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<AdminOrderResponse | null>(null);

    // Chỉ sử dụng 2 tab: 'PENDING' và 'ALL'
    const [activeTab, setActiveTab] = useState<'PENDING' | "CHECK_IN" | "COMPLETED" | 'ALL'>('PENDING');

    // Pagination & Filter States
    const [page, setPage] = useState<number>(0);
    const [size] = useState<number>(20);
    const [totalPages, setTotalPages] = useState<number>(1);

    const [searchTerm, setSearchTerm] = useState<string>('');
    const [debouncedSearch, setDebouncedSearch] = useState<string>('');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

    // Debounce search
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 500);

        return () => clearTimeout(handler);
    }, [searchTerm]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const formattedStartDate = startDate ? `${startDate}T00:00:00` : undefined;
            const formattedEndDate = endDate ? `${endDate}T23:59:59` : undefined;

            let statusFilter: OrderStatus | undefined = undefined;
            if (activeTab === 'PENDING') {
                statusFilter = OrderStatus.PENDING;
            } else if (activeTab === 'CHECK_IN') {
                statusFilter = OrderStatus.PAID;
            }
            else if (activeTab === "COMPLETED") {
                statusFilter = OrderStatus.CHECKED_IN
            }

            const res = await orderOwnerService.getOrders({
                keyword: debouncedSearch.trim() || undefined,
                status: statusFilter,
                startDate: formattedStartDate,
                endDate: formattedEndDate,
                page,
                size
            });

            setOrders(res.content);
            setTotalPages(res.totalPages);
        } catch (error) {
            console.error("Fetch owner orders error:", error);
            window.alert("Lỗi khi tải danh sách đơn hàng!");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [page, debouncedSearch, startDate, endDate, activeTab]);


    // Thao tác Duyệt Checkin và Checkout
    const handleArrivalOrder = async (orderId: string, newStatus: OrderStatus.CHECKED_IN | OrderStatus.COMPLETED) => {
        const actionText = newStatus === OrderStatus.CHECKED_IN ? "CHECK-IN" : "CHECK-OUT";

        if (!window.confirm(`Bạn có chắc chắn muốn xác nhận ${actionText} cho đơn hàng #${orderId.substring(0, 8)}?`)) return;

        setProcessingId(orderId);
        try {
            const success = await orderOwnerService.changeStatus(orderId, newStatus);
            if (success) {
                window.alert(`Cập nhật trạng thái ${actionText} thành công!`);

                // Cập nhật lại danh sách orders trên giao diện ngay lập tức
                setOrders(prev => prev.map(o => o.id === orderId ? { ...o, orderStatus: newStatus } : o));

                if (selectedOrder?.id === orderId) {
                    setSelectedOrder(prev => prev ? { ...prev, orderStatus: newStatus } : null);
                }
            } else {
                window.alert("Thao tác thất bại. Vui lòng thử lại!");
            }
        } catch (error) {
            console.error("Error processing order:", error);
            window.alert("Đã xảy ra lỗi trong quá trình xử lý!");
        } finally {
            setProcessingId(null);
        }
    };

    // Thao tác Duyệt (CONFIRMED) hoặc Từ Chối (REJECTED)
    const handleProcessOrder = async (orderId: string, newStatus: OrderStatus.CONFIRMED | OrderStatus.REJECTED) => {
        const isConfirm = newStatus === OrderStatus.CONFIRMED;
        const actionText = isConfirm ? "XÁC NHẬN DUYỆT" : "TỪ CHỐI";

        if (!window.confirm(`Bạn có chắc chắn muốn ${actionText} đơn hàng #${orderId.substring(0, 8)}?`)) return;

        setProcessingId(orderId);
        try {
            const success = await orderOwnerService.changeStatus(orderId, newStatus);
            if (success) {
                window.alert(`Đã ${actionText.toLowerCase()} đơn hàng thành công!`);

                // Nếu đang ở tab PENDING -> Loại bỏ đơn này khỏi danh sách
                if (activeTab === 'PENDING') {
                    setOrders(prev => prev.filter(o => o.id !== orderId));
                } else {
                    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, orderStatus: newStatus } : o));
                }

                if (selectedOrder?.id === orderId) {
                    setSelectedOrder(prev => prev ? { ...prev, orderStatus: newStatus } : null);
                }
            } else {
                window.alert("Thao tác thất bại. Vui lòng thử lại!");
            }
        } catch (error) {
            console.error("Error processing order:", error);
            window.alert("Đã xảy ra lỗi trong quá trình xử lý!");
        } finally {
            setProcessingId(null);
        }
    };

    const calculateOrderTotal = (orderDetails: OrderDetailResponse[]) => {
        if (!orderDetails) return { totalActual: 0, totalFee: 0 };
        return orderDetails.reduce((acc, detail) => {
            const detailSum = (detail.roomDetails || []).reduce((sum, r) => ({
                actual: sum.actual + (r.actualPrice || 0),
                fee: sum.fee + (r.platformFee || 0)
            }), { actual: 0, fee: 0 });
            return {
                totalActual: acc.totalActual + detailSum.actual,
                totalFee: acc.totalFee + detailSum.fee
            };
        }, { totalActual: 0, totalFee: 0 });
    };

    const getStatusBadgeClass = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.COMPLETED:
                return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case OrderStatus.CHECKED_IN:
                return 'bg-teal-50 text-teal-700 border-teal-200';
            case OrderStatus.PAID:
                return 'bg-blue-50 text-blue-700 border-blue-200';
            case OrderStatus.CONFIRMED:
                return 'bg-sky-50 text-sky-700 border-sky-200';
            case OrderStatus.PENDING:
                return 'bg-amber-50 text-amber-700 border-amber-300 animate-pulse';
            case OrderStatus.REJECTED:
                return 'bg-purple-50 text-purple-700 border-purple-200';
            case OrderStatus.CANCELLED:
                return 'bg-rose-50 text-rose-700 border-rose-200';
            default:
                return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    const pendingCount = activeTab === 'PENDING' ? orders.length : 0;

    return (
        <div className="p-6 mt-18 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Quản lý Xét duyệt Đặt phòng</h1>
                    <p className="text-sm text-gray-500 mt-1">Duyệt hoặc từ chối các yêu cầu đặt phòng mới từ khách hàng.</p>
                </div>
            </div>

            {/* Sub Nav Tabs (Chỉ giữ PENDING và ALL) */}
            <div className="flex items-center gap-2 mb-6 border-b border-gray-200 pb-3">
                <button
                    onClick={() => { setActiveTab('PENDING'); setPage(0); }}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${activeTab === 'PENDING'
                        ? 'bg-amber-500 text-white shadow-md shadow-amber-200'
                        : 'bg-white text-amber-700 border border-amber-200 hover:bg-amber-50'
                        }`}
                >
                    <Clock className="w-4 h-4" />
                    Cần xét duyệt
                    {pendingCount > 0 && (
                        <span className="ml-1 px-2 py-0.5 bg-white text-amber-700 rounded-full text-[10px] font-extrabold shadow-sm">
                            {pendingCount}
                        </span>
                    )}
                </button>


                <button
                    onClick={() => { setActiveTab('CHECK_IN'); setPage(0); }}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${activeTab === 'CHECK_IN'
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-200'
                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                        }`}
                >
                    <House className="w-4 h-4" />
                    Quản lý nhận phòng
                </button>

                <button
                    onClick={() => { setActiveTab('COMPLETED'); setPage(0); }}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${activeTab === 'COMPLETED'
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-200'
                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                        }`}
                >
                    <House className="w-4 h-4" />
                    Quản lý trả phòng
                </button>

                <button
                    onClick={() => { setActiveTab('ALL'); setPage(0); }}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${activeTab === 'ALL'
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-200'
                        : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                        }`}
                >
                    <Layers className="w-4 h-4" />
                    Tất cả đơn hàng
                </button>
            </div>

            {/* Filter Section */}
            <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <Input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                        placeholder="Tìm kiếm theo tên khách sạn, tên khách hàng..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setPage(0);
                        }}
                    />
                </div>

                <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 whitespace-nowrap">Từ ngày:</span>
                        <input
                            type="date"
                            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                            value={startDate}
                            onChange={(e) => {
                                setStartDate(e.target.value);
                                setPage(0);
                            }}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 whitespace-nowrap">Đến ngày:</span>
                        <input
                            type="date"
                            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                            value={endDate}
                            onChange={(e) => {
                                setEndDate(e.target.value);
                                setPage(0);
                            }}
                        />
                    </div>
                    {(startDate || endDate) && (
                        <button
                            onClick={() => {
                                setStartDate('');
                                setEndDate('');
                                setPage(0);
                            }}
                            className="text-xs text-purple-600 hover:text-purple-800 underline font-medium cursor-pointer"
                        >
                            Xóa lọc ngày
                        </button>
                    )}
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã đơn / Khách hàng</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách sạn</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phòng đặt</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Doanh thu / Phí sàn</th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động xét duyệt</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                                        Đang tải danh sách đơn đặt phòng...
                                    </td>
                                </tr>
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                                        {activeTab === 'PENDING' ? (
                                            <div className="flex flex-col items-center justify-center py-6">
                                                <CheckCircle className="w-10 h-10 text-emerald-500 mb-2 opacity-80" />
                                                <p className="font-semibold text-gray-700">Tuyệt vời! Không có đơn hàng nào chờ duyệt.</p>
                                            </div>
                                        ) : "Không có đơn đặt phòng nào."}
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => {
                                    const { totalActual, totalFee } = calculateOrderTotal(order.orderDetails);
                                    const isPending = order.orderStatus === OrderStatus.PENDING;
                                    const isPaid = order.orderStatus === OrderStatus.PAID;
                                    const isCheckin = order.orderStatus === OrderStatus.CHECKED_IN;
                                    const isProcessingThis = processingId === order.id;

                                    return (
                                        <tr key={order.id} className="hover:bg-purple-50/40 transition-colors">
                                            {/* Khách hàng & Mã đơn */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-start">
                                                    <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center mt-1">
                                                        {order.customer?.avatarUrl ? (
                                                            <img
                                                                className="h-full w-full object-cover"
                                                                src={order.customer.avatarUrl}
                                                                alt={order.customer.username}
                                                            />
                                                        ) : (
                                                            <span className="text-gray-400 font-bold text-lg">
                                                                {order.customer?.username?.charAt(0).toUpperCase() || 'C'}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="ml-3 flex flex-col">
                                                        <span className="text-sm font-bold text-gray-900">
                                                            {order.customer?.username || "N/A"}
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            {order.customer?.email}
                                                        </span>
                                                        <span className="text-[10px] text-purple-600 font-semibold mt-0.5">
                                                            #{order.id.substring(0, 8)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Khách sạn */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {order.hotel ? (
                                                    <div className="flex items-center gap-3">
                                                        {order.hotel.thumbnail && (
                                                            <img
                                                                src={order.hotel.thumbnail}
                                                                alt={order.hotel.name}
                                                                className="h-9 w-9 rounded-lg object-cover border border-gray-200"
                                                            />
                                                        )}
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-semibold text-gray-900 max-w-[180px] truncate" title={order.hotel.name}>
                                                                {order.hotel.name}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs italic text-gray-400">Chưa gắn khách sạn</span>
                                                )}
                                            </td>

                                            {/* Chi tiết Phòng */}
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1.5 max-w-[240px]">
                                                    {order.orderDetails && order.orderDetails.length > 0 ? (
                                                        order.orderDetails.map((detail, index) => (
                                                            <div key={index} className="text-xs border-b border-gray-100 last:border-none pb-1">
                                                                <span className="font-semibold text-gray-800">{detail.roomTypeName}</span>
                                                                <div className="flex flex-wrap gap-1 mt-0.5">
                                                                    {detail.roomDetails?.map((room, index) => (
                                                                        <span key={index} className="px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded text-[10px] font-mono">
                                                                            P.{room.roomCode}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <span className="text-xs text-gray-400 italic">Không có thông tin phòng</span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Doanh thu thực nhận & Phí sàn */}
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="text-sm font-bold text-emerald-600">
                                                        {totalActual.toLocaleString('vi-VN', {
                                                            style: 'currency',
                                                            currency: 'VND',
                                                        })}
                                                    </span>
                                                    <span className="text-xs text-gray-400">
                                                        Phí sàn: {totalFee.toLocaleString('vi-VN', {
                                                            style: 'currency',
                                                            currency: 'VND',
                                                        })}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Trạng thái */}
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeClass(order.orderStatus)}`}>
                                                    {order.orderStatus}
                                                </span>
                                            </td>

                                            {/* Nút Xét duyệt & Thao tác */}
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end gap-2">
                                                    {/* Nếu đơn PENDING -> Hiện nút Duyệt / Từ chối */}
                                                    {isPending ? (
                                                        <>
                                                            <button
                                                                disabled={isProcessingThis}
                                                                onClick={() => handleProcessOrder(order.id, OrderStatus.CONFIRMED)}
                                                                className="text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                                                                title="Duyệt nhận đơn này"
                                                            >
                                                                <Check className="w-3.5 h-3.5" /> Duyệt
                                                            </button>
                                                            <button
                                                                disabled={isProcessingThis}
                                                                onClick={() => handleProcessOrder(order.id, OrderStatus.REJECTED)}
                                                                className="text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
                                                                title="Từ chối đơn hàng"
                                                            >
                                                                <Ban className="w-3.5 h-3.5" /> Từ chối
                                                            </button>
                                                            <button
                                                                onClick={() => setSelectedOrder(order)}
                                                                className="text-gray-500 hover:text-gray-800 p-1.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                                                                title="Xem chi tiết"
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </button>
                                                        </>
                                                    ) :
                                                        isPaid ? (
                                                            <>
                                                                <button
                                                                    disabled={isProcessingThis}
                                                                    onClick={() => handleArrivalOrder(order.id, OrderStatus.CHECKED_IN)}
                                                                    className="text-white bg-purple-600 hover:bg-purple-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                                                                    title="Xác nhận khách đã nhận phòng"
                                                                >
                                                                    <Check className="w-3.5 h-3.5" /> Check-in
                                                                </button>
                                                                <button
                                                                    disabled={isProcessingThis}
                                                                    onClick={() => handleArrivalOrder(order.id, OrderStatus.COMPLETED)}
                                                                    className="text-white bg-purple-600 hover:bg-purple-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                                                                    title="Xác nhận khách đã trả phòng"
                                                                >
                                                                    <CheckCircle className="w-3.5 h-3.5" /> Check-out
                                                                </button>
                                                                <button
                                                                    onClick={() => setSelectedOrder(order)}
                                                                    className="text-gray-500 hover:text-gray-800 p-1.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                                                                    title="Xem chi tiết"
                                                                >
                                                                    <Eye className="w-4 h-4" />
                                                                </button>
                                                            </>
                                                        )
                                                            :
                                                            isCheckin ? (
                                                                <>
                                                                    <button
                                                                        disabled={isProcessingThis}
                                                                        onClick={() => handleArrivalOrder(order.id, OrderStatus.COMPLETED)}
                                                                        className="text-white bg-purple-600 hover:bg-purple-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm transition-colors cursor-pointer disabled:opacity-50"
                                                                        title="Xác nhận khách đã trả phòng"
                                                                    >
                                                                        <CheckCircle className="w-3.5 h-3.5" /> Check-out
                                                                    </button>
                                                                    <button
                                                                        onClick={() => setSelectedOrder(order)}
                                                                        className="text-gray-500 hover:text-gray-800 p-1.5 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                                                                        title="Xem chi tiết"
                                                                    >
                                                                        <Eye className="w-4 h-4" />
                                                                    </button>
                                                                </>
                                                            )
                                                                : (
                                                                    <button
                                                                        onClick={() => setSelectedOrder(order)}
                                                                        className="text-purple-600 hover:text-purple-900 font-semibold text-xs cursor-pointer bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                                                                    >
                                                                        <Eye className="w-3.5 h-3.5" /> Chi tiết
                                                                    </button>
                                                                )
                                                    }
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Phân trang */}
                <div className="bg-white px-4 py-4 border-t border-gray-200 sm:px-6">
                    <PaginationCustom
                        page={page}
                        totalPages={totalPages}
                        onPageChange={(currentPage) => setPage(currentPage)}
                    />
                </div>
            </div>

            {/* Modal Xem Chi Tiết & Xét Duyệt */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
                        <div className="flex justify-between items-start border-b border-gray-100 pb-4 mb-4">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Chi tiết đơn hàng #{selectedOrder.id.substring(0, 8)}</h3>
                                <p className="text-xs text-gray-500">ID đầy đủ: {selectedOrder.id}</p>
                            </div>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="text-gray-400 hover:text-gray-600 text-xl font-bold p-1 cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4 text-sm">
                            {/* Lịch lưu trú */}
                            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-xl text-xs">
                                <div>
                                    <span className="text-gray-500 block">Ngày Check-in:</span>
                                    <strong className="text-gray-800 text-sm">{formatDate(selectedOrder.checkinDate)}</strong>
                                </div>
                                <div>
                                    <span className="text-gray-500 block">Ngày Check-out:</span>
                                    <strong className="text-gray-800 text-sm">{formatDate(selectedOrder.checkoutDate)}</strong>
                                </div>
                            </div>

                            {/* Ghi chú khách hàng */}
                            {selectedOrder.note && (
                                <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl text-xs text-amber-900">
                                    <strong className="block mb-0.5 flex items-center gap-1">
                                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                                        Ghi chú từ khách hàng:
                                    </strong>
                                    {selectedOrder.note}
                                </div>
                            )}

                            {/* Danh sách phòng chi tiết */}
                            <div>
                                <h4 className="font-bold text-gray-800 mb-2">Danh sách phòng khách chọn</h4>
                                <div className="space-y-2">
                                    {selectedOrder.orderDetails?.map((detail) => (
                                        <div key={detail.id} className="border border-gray-200 rounded-xl p-3 bg-gray-50/30">
                                            <div className="font-bold text-purple-700 text-sm mb-2">{detail.roomTypeName}</div>
                                            <div className="space-y-1">
                                                {detail.roomDetails?.map((room, index) => (
                                                    <div key={index} className="flex justify-between items-center text-xs bg-white p-2 rounded-lg border border-gray-100">
                                                        <span>Mã phòng phân bổ: <strong className="font-mono">{room.roomCode}</strong></span>
                                                        <div className="text-right">
                                                            <div>Giá phòng: <strong>{room.actualPrice.toLocaleString('vi-VN', {
                                                                style: 'currency',
                                                                currency: 'VND',
                                                            })}</strong></div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Thời gian khởi tạo */}
                            <div className="text-xs text-gray-400 pt-2 border-t border-gray-100 flex justify-between">
                                <span>Tạo lúc: {formatDate(selectedOrder.createdAt)}</span>
                                <span>Cập nhật: {formatDate(selectedOrder.updatedAt)}</span>
                            </div>
                        </div>

                        {/* Actions ở Footer Modal */}
                        <div className="mt-6 flex justify-between items-center pt-3 border-t border-gray-100">
                            {selectedOrder.orderStatus === OrderStatus.PENDING ? (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleProcessOrder(selectedOrder.id, OrderStatus.CONFIRMED)}
                                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                                    >
                                        Duyệt đơn này
                                    </button>
                                    <button
                                        onClick={() => handleProcessOrder(selectedOrder.id, OrderStatus.REJECTED)}
                                        className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold border border-red-200 rounded-xl text-xs transition-colors cursor-pointer"
                                    >
                                        Từ chối đơn
                                    </button>
                                </div>
                            ) : <div />}

                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl text-xs transition-colors cursor-pointer"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}