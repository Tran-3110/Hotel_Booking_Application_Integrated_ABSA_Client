"use client"

import { useState, useEffect } from "react";
import Image from "next/image";
import { Calendar, Clock, FileText, Star, Loader2 } from "lucide-react";
import { HistoryOrderResponse, RoomTypeSnapShotResponse } from "@/common/types/order";
import { OrderStatus } from "@/common/enums/order";
import { bookingService } from "@/services/booking-service";
import { PageResponse } from "@/common/types/page";
import PaginationCustom from "@/components/pagination-custom";
import { formatDate } from "@/common/utils/format";
import { Button } from "@/components/ui/button";
import { createPaymentUrl } from "@/services/payment-service";
import { useRouter } from "next/navigation";

const TAB_CONFIG = [
    { value: OrderStatus.PENDING, label: "Chờ xử lý" },
    { value: OrderStatus.CONFIRMED, label: "Đã xác nhận" },
    { value: OrderStatus.PAID, label: "Đã thanh toán" },
    { value: OrderStatus.CHECKED_IN, label: "Đã nhận phòng" },
    { value: OrderStatus.COMPLETED, label: "Hoàn thành" },
    { value: OrderStatus.CANCELLED, label: "Đã hủy" },
    { value: OrderStatus.REJECTED, label: "Bị từ chối" },
];

export default function OrderPage() {
    const [activeTab, setActiveTab] = useState<OrderStatus>(OrderStatus.PENDING);
    const [orderCounts, setOrderCounts] = useState<Record<string, number>>({});

    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [size] = useState(10);
    const [orders, setOrders] = useState<PageResponse<HistoryOrderResponse> | null>(null);

    const router = useRouter()

    useEffect(() => {
        const fetchOrders = async () => {
            setIsLoading(true);
            try {
                const [countArray, dataRes] = await Promise.all([
                    bookingService.countOrders(),
                    bookingService.getHistoryOrder(activeTab, page, size)
                ]);

                const mappedCounts = countArray.reduce((acc: Record<string, number>, curr: {
                    status: OrderStatus,
                    count: number
                }) => {
                    acc[curr.status] = curr.count;
                    return acc;
                }, {});

                setOrderCounts(mappedCounts);
                setOrders(dataRes);
            } catch (error) {
                console.log(error)
                alert("Đã có lỗi xảy ra khi lấy dữ liệu!");
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, [activeTab, page, size]);

    const calculateOrderTotal = (roomTypes: RoomTypeSnapShotResponse[]) => {
        return roomTypes.reduce((total, roomType) => {
            const roomTypeTotal = roomType.data.reduce((sum, room) => sum + room.actualPrice, 0);
            return total + roomTypeTotal;
        }, 0);
    };

    const countTotalRooms = (roomTypes: RoomTypeSnapShotResponse[]) => {
        return roomTypes.reduce((total, roomType) => total + roomType.data.length, 0);
    };

    // Kiểm tra có được phép Đánh giá không (chỉ khi Hoàn thành & <= 7 ngày)
    const checkCanReview = (checkoutString: string, currentTabStatus: OrderStatus) => {
        if (currentTabStatus !== OrderStatus.COMPLETED) return false;

        const checkoutDate = new Date(checkoutString).getTime();
        const now = new Date().getTime();
        const diffInDays = (now - checkoutDate) / (1000 * 3600 * 24);

        return diffInDays >= 0 && diffInDays <= 7;
    };

    const currentOrders = orders?.content || [];

    return (
        <div className="flex-1 p-6 lg:p-10 bg-gray-50 min-h-screen font-sans">
            <div className="mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">Quản lý đơn hàng</h1>
                    <p className="text-gray-500 mt-2 text-sm">Xem và quản lý lịch sử đặt phòng của bạn</p>
                </div>

                {/* Tabs Filter */}
                <div className="flex gap-3 mb-6 overflow-x-auto pb-3 scrollbar-hide">
                    {TAB_CONFIG.map((tab) => {
                        const isActive = activeTab === tab.value;
                        const count = orderCounts[tab.value] || 0;

                        return (
                            <button
                                key={tab.value}
                                onClick={() => {
                                    setActiveTab(tab.value);
                                    setPage(0);
                                }}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap border ${isActive
                                    ? 'bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-200'
                                    : 'bg-white border-gray-200 text-gray-600 hover:bg-purple-50'
                                    }`}
                            >
                                {tab.label}
                                {/* Badge đếm số lượng */}
                                <span
                                    className={`flex items-center justify-center px-2 py-0.5 rounded-full text-[11px] font-bold ${isActive
                                        ? 'bg-white text-purple-600'
                                        : 'bg-gray-100 text-gray-500'
                                        }`}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Danh sách đơn hàng */}
                <div className="space-y-6 mb-8">
                    {isLoading ? (
                        // Loading State
                        <div
                            className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100">
                            <Loader2 className="w-8 h-8 text-purple-600 animate-spin mb-3" />
                            <p className="text-gray-500 font-medium">Đang tải dữ liệu...</p>
                        </div>
                    ) : currentOrders.length === 0 ? (
                        // Empty State
                        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
                            <p className="text-gray-500 font-medium">Chưa có đơn hàng nào ở mục này.</p>
                        </div>
                    ) : (
                        // Render dữ liệu thực tế
                        currentOrders.map((order) => {
                            const canReview = checkCanReview(order.checkout, activeTab);

                            return (
                                <div key={order.id}
                                    className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                    {/* Order Header */}
                                    <div className="flex items-center gap-4">
                                        {/* Sửa lại phần này: Thêm bg, flex, justify-center để chứa chữ cái nếu thiếu ảnh */}
                                        <div
                                            className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-gray-100 bg-purple-100 flex items-center justify-center">
                                            {order.hotel?.thumbnail ? (
                                                <Image
                                                    src={order.hotel.thumbnail}
                                                    alt={order.hotel?.name || "Hotel"}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <span className="text-2xl font-bold text-purple-600">
                                                    {order.hotel?.name?.charAt(0) || "H"}
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-lg text-gray-900">{order.hotel?.name || "Khách sạn không xác định"}</h3>
                                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                                <Clock className="w-3 h-3" /> Đặt lúc: {formatDate(order.createdAt)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Order Body */}
                                    <div className="py-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Cột 1: Thông tin nhận/trả phòng & Ghi chú */}
                                        <div className="flex flex-col justify-between">
                                            <div className="space-y-4">
                                                <div className="flex items-start gap-3">
                                                    <div
                                                        className="p-2 bg-purple-50 rounded-lg text-purple-600 shrink-0">
                                                        <Calendar className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Nhận
                                                            phòng</p>
                                                        <p className="text-gray-900 font-medium mt-0.5">{formatDate(order.checkin)}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <div className="p-2 bg-gray-50 rounded-lg text-gray-500 shrink-0">
                                                        <Calendar className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Trả
                                                            phòng</p>
                                                        <p className="text-gray-900 font-medium mt-0.5">{formatDate(order.checkout)}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {order.note && (
                                                <div
                                                    className="mt-5 p-3.5 bg-yellow-50/50 border border-yellow-100 rounded-xl flex items-start gap-2.5">
                                                    <FileText className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
                                                    <div>
                                                        <p className="text-xs font-semibold text-yellow-800 mb-0.5">Ghi
                                                            chú của bạn</p>
                                                        <p className="text-sm text-yellow-700 italic">{order.note}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Cột 2: Chi tiết các phòng (Dùng thanh cuộn tùy chỉnh nếu quá dài) */}
                                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                            <h4 className="text-sm font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">
                                                Chi tiết phòng ({countTotalRooms(order.data)} phòng)
                                            </h4>
                                            <div
                                                className="space-y-3 max-h-35 overflow-y-auto pr-2 custom-scrollbar">
                                                {order.data.map((roomType, index) => (
                                                    <div key={roomType.id || index}>
                                                        <p className="text-sm font-semibold text-purple-700">{roomType.name}</p>
                                                        <div className="mt-1 space-y-1">
                                                            {roomType.data.map((room, index) => (
                                                                <div key={room.id || index}
                                                                    className="flex justify-between items-center text-xs text-gray-600">
                                                                    <span
                                                                        className="flex items-center gap-1 before:content-['•'] before:text-gray-400">
                                                                        Phòng {room.code}
                                                                    </span>
                                                                    <span className="font-medium text-gray-800">
                                                                        {room.actualPrice.toLocaleString("vi-VN", {
                                                                            style: "currency",
                                                                            currency: "VND"
                                                                        })}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Footer: Tổng tiền & Buttons */}
                                    <div
                                        className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Tổng tiền thanh toán</p>
                                            <p className="text-xl font-bold text-purple-700">{calculateOrderTotal(order.data).toLocaleString("vi-VN", {
                                                style: "currency",
                                                currency: "VND"
                                            })}</p>
                                        </div>
                                        <div className="flex gap-3 w-full sm:w-auto">
                                            {canReview && (<Button
                                                className="flex-1 sm:flex-none px-6 py-5 flex items-center justify-center gap-2 border border-purple-200 text-purple-700 bg-purple-50 hover:bg-purple-100 font-semibold rounded-xl text-sm transition-colors text-center">
                                                <Star className="w-4 h-4" /> Đánh giá
                                            </Button>
                                            )}
                                            {order.status === OrderStatus.CONFIRMED &&
                                                <Button
                                                    className="flex-1 sm:flex-none px-6 py-5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl text-sm transition-colors text-center shadow-sm"
                                                    onClick={async () => {
                                                        const paymentUrl = await createPaymentUrl(order.id)
                                                        console.log(paymentUrl)
                                                        if (paymentUrl) router.push(paymentUrl)
                                                    }}
                                                >
                                                    Thanh toán
                                                </Button>
                                            }
                                            <Button
                                                className="flex-1 sm:flex-none px-6 py-5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl text-sm transition-colors text-center shadow-sm">
                                                Đặt lại
                                            </Button>
                                        </div>
                                    </div>

                                </div>
                            );
                        })
                    )}
                </div>

                <div className="flex justify-center mt-6">
                    <PaginationCustom
                        page={page}
                        totalPages={orders?.totalPages || 0}
                        onPageChange={(newPage) => setPage(newPage)}
                    />
                </div>
            </div>
        </div>
    );
}