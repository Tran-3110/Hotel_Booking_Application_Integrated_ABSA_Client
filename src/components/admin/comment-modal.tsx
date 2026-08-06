'use client';

import React, { useState, useEffect } from 'react';
import { X, MessageSquare, Star, User, Calendar, CheckCircle2, XCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { hotelAdminService } from "@/services/admin/hotel-admin-service";
import { hotelOwnerService } from "@/services/owner/hotel-owner-service";
import PaginationCustom from "@/components/pagination-custom";
import { PageResponse } from "@/common/types/page";
import { AdminCommentResponse } from "@/common/types/admin/comment";
import { formatDate } from "@/common/utils/format";
import { UserRole } from "@/common/enums/user";

interface HotelCommentsModalProps {
    isOpen: boolean;
    hotelId: string | null;
    role: UserRole;
    hotelName: string | null;
    onClose: () => void;
}

export default function HotelCommentsModal({ isOpen, hotelId, hotelName, role, onClose }: HotelCommentsModalProps) {
    const [commentsPage, setCommentsPage] = useState<PageResponse<AdminCommentResponse> | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [page, setPage] = useState<number>(0);
    const [size] = useState<number>(10);

    const isOwner = role === UserRole.OWNER;
    const currentService = isOwner ? hotelOwnerService : hotelAdminService;

    const fetchComments = async () => {
        if (!hotelId) return;
        setIsLoading(true);
        try {
            const data = await currentService.getHotelComments(hotelId, page, size);
            setCommentsPage(data || null);
        } catch (error) {
            window.alert("Không thể tải danh sách đánh giá. Vui lòng thử lại!");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!isOpen || !hotelId) {
            setCommentsPage(null);
            setPage(0);
            return;
        }

        fetchComments();
    }, [isOpen, hotelId, page, role]);

    const handleToggleStatus = async (commentId: string, currentStatus: boolean) => {
        if(!confirm("Bạn có muốn ẩn đánh giá?")) return;

        setUpdatingId(commentId);
        try {
            const success = await hotelAdminService.toggleCommentStatus(commentId, !currentStatus);
            if (success) {
                setCommentsPage((prev) => {
                    if (!prev) return null;
                    return {
                        ...prev,
                        content: prev.content.map((item) =>
                            item.id === commentId ? { ...item, isActive: !currentStatus } : item
                        ),
                    };
                });
            } else {
                window.alert("Thao tác thất bại. Vui lòng thử lại!");
            }
        } catch (error) {
            console.error("Lỗi thay đổi trạng thái đánh giá:", error);
            window.alert("Đã có lỗi xảy ra. Vui lòng thử lại!");
        } finally {
            setUpdatingId(null);
        }
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const getSentimentBadge = (sentiment: string) => {
        const lower = sentiment?.toLowerCase() || '';
        if (lower.includes('positive') || lower.includes('tích cực')) {
            return 'bg-emerald-50 text-emerald-700 border-emerald-200';
        }
        if (lower.includes('negative') || lower.includes('tiêu cực')) {
            return 'bg-rose-50 text-rose-700 border-rose-200';
        }
        return 'bg-amber-50 text-amber-700 border-amber-200';
    };

    if (!isOpen) return null;

    const commentList = commentsPage?.content || [];
    const totalElements = commentsPage?.totalElements || 0;
    const totalPages = commentsPage?.totalPages || 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[85vh] overflow-hidden flex flex-col">

                {/* Header Modal */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl">
                            <MessageSquare className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">
                                Danh sách đánh giá
                            </h3>
                            <p className="text-xs text-gray-500">
                                {hotelName ? `Khách sạn: ${hotelName}` : 'Tất cả nhận xét từ khách hàng'}
                            </p>
                        </div>
                    </div>
                    <Button
                        suppressHydrationWarning
                        onClick={onClose}
                        variant="ghost"
                        className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 h-8 w-8 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Body Content - Comment List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                            <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                            <p className="text-sm">Đang tải danh sách đánh giá...</p>
                        </div>
                    ) : commentList.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 py-12">
                            <MessageSquare className="w-12 h-12 stroke-[1.5] mb-2 opacity-40" />
                            <p className="text-sm font-medium">Khách sạn này chưa có đánh giá nào</p>
                        </div>
                    ) : (
                        commentList.map((comment) => (
                            <div
                                key={comment.id}
                                className={`p-4 border rounded-xl bg-white shadow-sm transition-all space-y-3 ${
                                    comment.isActive ? 'border-gray-100' : 'border-red-100 bg-red-50/20'
                                }`}
                            >
                                {/* Comment Header */}
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        {comment.avatarUrl ? (
                                            <img
                                                src={comment.avatarUrl}
                                                alt={comment.username}
                                                className="w-10 h-10 rounded-full object-cover border border-gray-200"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm border border-purple-100">
                                                {comment.username?.charAt(0)?.toUpperCase() || <User className="w-5 h-5" />}
                                            </div>
                                        )}
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                                {comment.username || 'Khách hàng'}
                                                <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${
                                                    comment.isActive
                                                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                                                        : 'bg-rose-50 text-rose-600 border border-rose-200'
                                                }`}>
                                                    {comment.isActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                                    {comment.isActive ? 'Hiển thị' : 'Đã ẩn'}
                                                </span>
                                            </h4>
                                            <p className="text-xs text-gray-500">{comment.email}</p>
                                        </div>
                                    </div>

                                    {/* Action Toggle & Rating & Date */}
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <div className="flex items-center justify-end gap-1 mb-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-4 h-4 ${
                                                            i < Math.floor(comment.rating)
                                                                ? 'fill-amber-400 text-amber-400'
                                                                : 'fill-gray-100 text-gray-300'
                                                        }`}
                                                    />
                                                ))}
                                                <span className="text-xs font-bold text-gray-700 ml-1">
                                                    {comment.rating.toFixed(1)}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-end gap-1 text-[11px] text-gray-400">
                                                <Calendar className="w-3 h-3" />
                                                {formatDate(comment.createdAt)}
                                            </div>
                                        </div>

                                        {/* Nút Ẩn / Hiện Comment (Chỉ hiển thị cho Admin) */}
                                        {!isOwner && (
                                            <Button
                                                suppressHydrationWarning
                                                variant="outline"
                                                size="sm"
                                                disabled={updatingId === comment.id}
                                                onClick={() => handleToggleStatus(comment.id, comment.isActive)}
                                                className={`h-8 px-2.5 text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                                                    comment.isActive
                                                        ? 'border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300'
                                                        : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-300'
                                                }`}
                                            >
                                                {updatingId === comment.id ? (
                                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                ) : comment.isActive ? (
                                                    <>
                                                        <EyeOff className="w-3.5 h-3.5" />
                                                        Ẩn
                                                    </>
                                                ) : (
                                                    <>
                                                        <Eye className="w-3.5 h-3.5" />
                                                        Hiện
                                                    </>
                                                )}
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                {/* Content */}
                                <p className="text-sm text-gray-700 leading-relaxed bg-gray-50/50 p-3 rounded-lg border border-gray-50">
                                    {comment.content}
                                </p>

                                {/* Sentiment Aspects */}
                                {comment.sentimentAspects && comment.sentimentAspects.length > 0 && (
                                    <div className="pt-1">
                                        <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                            Phân tích khía cạnh:
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {comment.sentimentAspects.map((aspect) => (
                                                <div
                                                    key={aspect.id}
                                                    className={`text-xs px-2.5 py-1 rounded-md border flex items-center gap-1.5 font-medium ${getSentimentBadge(aspect.sentiment)}`}
                                                >
                                                    <span className="font-semibold">{aspect.aspect}:</span>
                                                    <span>{aspect.opinionWord}</span>
                                                    <span className="text-[10px] opacity-75 capitalize">({aspect.sentiment})</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Footer Modal với Pagination */}
                <div
                    className="flex flex-col sm:flex-row items-center justify-between px-6 py-3 border-t border-gray-100 bg-gray-50/50 flex-shrink-0 gap-3">
                    <p className="text-xs text-gray-500">
                        Tổng cộng: <span className="font-semibold text-gray-800">{totalElements}</span> đánh giá
                    </p>

                    <div className="py-1">
                        <PaginationCustom
                            page={page}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>

                    <Button
                        suppressHydrationWarning
                        onClick={onClose}
                        variant="secondary"
                        className="px-5 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        Đóng
                    </Button>
                </div>

            </div>
        </div>
    );
}