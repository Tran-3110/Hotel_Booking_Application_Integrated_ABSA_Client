'use client';

import React, { useState, useEffect } from 'react';
import { OrderStatus } from "@/common/enums/order";
import { orderAdminService } from "@/services/admin/order-admin-service";
import { AdminOrderResponse } from "@/common/types/admin/order";

interface OrderStatusModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: AdminOrderResponse | null;
    onSuccess: (updatedOrderId: string, newStatus: OrderStatus) => void;
}

export default function OrderStatusModal({ isOpen, onClose, order, onSuccess }: OrderStatusModalProps) {
    const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(OrderStatus.PENDING);
    const [submitting, setSubmitting] = useState<boolean>(false);

    useEffect(() => {
        if (order) {
            setSelectedStatus(order.orderStatus);
        }
    }, [order]);

    if (!isOpen || !order) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedStatus === order.orderStatus) {
            onClose();
            return;
        }

        setSubmitting(true);
        try {
            const data = await orderAdminService.changeStatus(order.id, selectedStatus);
            if (data) {
                onSuccess(order.id, selectedStatus);
                onClose();
            }
        } catch (error) {
            console.error("Change order status error:", error);
            window.alert("Cập nhật trạng thái đơn hàng thất bại!");
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusLabel = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.PENDING: return 'Chờ xử lý (PENDING)';
            case OrderStatus.CONFIRMED: return 'Đã xác nhận (CONFIRMED)';
            case OrderStatus.REJECTED: return 'Từ chối (REJECTED)';
            case OrderStatus.CANCELLED: return 'Đã hủy (CANCELLED)';
            case OrderStatus.PAID: return 'Đã thanh toán (PAID)';
            case OrderStatus.CHECKED_IN: return 'Đã nhận phòng (CHECKED_IN)';
            case OrderStatus.COMPLETED: return 'Hoàn thành (COMPLETED)';
            default: return status;
        }
    };

    const getStatusBadgeClass = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.COMPLETED:
                return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case OrderStatus.CHECKED_IN:
            case OrderStatus.PAID:
            case OrderStatus.CONFIRMED:
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case OrderStatus.PENDING:
                return 'bg-amber-100 text-amber-800 border-amber-200';
            case OrderStatus.REJECTED:
            case OrderStatus.CANCELLED:
                return 'bg-rose-100 text-rose-800 border-rose-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl transition-all">
                {/* Header */}
                <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Cập nhật trạng thái đơn</h3>
                        <p className="text-xs text-purple-600 font-semibold">Mã đơn: #{order.id}</p>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={submitting}
                        className="text-gray-400 hover:text-gray-600 text-lg font-bold p-1 cursor-pointer disabled:opacity-50"
                    >
                        ✕
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Trạng thái hiện tại:
                        </label>
                        <div className="mb-4">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeClass(order.orderStatus)}`}>
                                {getStatusLabel(order.orderStatus)}
                            </span>
                        </div>

                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Chọn trạng thái mới:
                        </label>
                        <select
                            className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 cursor-pointer"
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
                            disabled={submitting}
                        >
                            <optgroup label="Trước khi thanh toán (Before Paid)">
                                <option value={OrderStatus.PENDING}>{getStatusLabel(OrderStatus.PENDING)}</option>
                                <option value={OrderStatus.CONFIRMED}>{getStatusLabel(OrderStatus.CONFIRMED)}</option>
                                <option value={OrderStatus.REJECTED}>{getStatusLabel(OrderStatus.REJECTED)}</option>
                                <option value={OrderStatus.CANCELLED}>{getStatusLabel(OrderStatus.CANCELLED)}</option>
                            </optgroup>
                            <optgroup label="Sau khi thanh toán (After Paid)">
                                <option value={OrderStatus.PAID}>{getStatusLabel(OrderStatus.PAID)}</option>
                                <option value={OrderStatus.CHECKED_IN}>{getStatusLabel(OrderStatus.CHECKED_IN)}</option>
                                <option value={OrderStatus.COMPLETED}>{getStatusLabel(OrderStatus.COMPLETED)}</option>
                            </optgroup>
                        </select>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={submitting}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={submitting || selectedStatus === order.orderStatus}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                        >
                            {submitting ? "Đang xử lý..." : "Lưu thay đổi"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}