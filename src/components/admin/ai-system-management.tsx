'use client';

import React, { useEffect, useState } from 'react';
import {
    BrainCircuit, Play, CheckCircle2, AlertCircle,
    Database, Activity, RefreshCw, ListFilter, Clock
} from 'lucide-react';
import { aiAdminService } from "@/services/admin/ai-admin-service";
import { DashboardResponse, ReviewAspectResponse } from "@/common/types/ai";
import {HotelAspect, HotelAspectLabelMap, Sentiment} from "@/common/enums/ai";

export default function AiSystemManagement() {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);

    const fetchDashboard = async () => {
        try {
            const data = await aiAdminService.getDashboard();
            setDashboard(data);
        } catch (e) {
            console.error(e);
            alert("Lỗi khi lấy dữ liệu dashboard!");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    const handleBatchAnalyze = async () => {
        if (!window.confirm("Hành động này sẽ phân tích và cập nhật lại toàn bộ dữ liệu đánh giá trong hệ thống. Bạn có chắc chắn muốn tiếp tục?")) {
            return;
        }

        setIsAnalyzing(true);
        try {
            const data = await aiAdminService.allPredict();
            alert(`Hoàn tất!\nTổng số lượng đánh giá: ${data.totalComments}\nĐã cập nhật phân tích: ${data.processedComments}`);
            await fetchDashboard();
        } catch (e) {
            console.error(e);
            alert("Có lỗi xảy ra trong quá trình phân tích hàng loạt!");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const totalComments = dashboard?.totalComments ?? 0;
    const commentsPredicted = dashboard?.commentsPredicted ?? 0;
    const pendingComments = Math.max(0, totalComments - commentsPredicted);
    const predictedPercentage = totalComments > 0
        ? Math.round((commentsPredicted / totalComments) * 100)
        : 0;

    const renderSentimentBadge = (sentiment: string, aspect: string) => {
        const upperSent = sentiment?.toUpperCase() || '';
        let badgeStyle = "bg-gray-100 text-gray-700 border-gray-200";

        if (upperSent.includes(Sentiment.POSITIVE)) {
            badgeStyle = "bg-emerald-50 text-emerald-700 border-emerald-200";
        } else if (upperSent.includes(Sentiment.NEGATIVE)) {
            badgeStyle = "bg-rose-50 text-rose-700 border-rose-200";
        } else if (upperSent.includes(Sentiment.NEUTRAL)) {
            badgeStyle = "bg-amber-50 text-amber-700 border-amber-200";
        }

        return (
            <span className={`px-2 py-0.5 text-xs font-semibold rounded-md border ${badgeStyle}`}>
                {aspect} ({sentiment})
            </span>
        );
    };

    return (
        <div className="p-6 mt-20 space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Quản lý hệ thống AI</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Quản lý hệ thống Phân tích khía cạnh cảm xúc trong câu đánh giá
                    </p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    AI Server Online
                </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border rounded-xl bg-card shadow-sm">
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                        <Database className="w-4 h-4" />
                        <h3 className="font-medium">Tổng Đánh Giá</h3>
                    </div>
                    <p className="text-3xl font-bold">
                        {isLoading ? "..." : totalComments.toLocaleString()}
                    </p>
                </div>

                <div className="p-4 border rounded-xl bg-card shadow-sm">
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                        <BrainCircuit className="w-4 h-4 text-blue-600" />
                        <h3 className="font-medium">Đã Phân Tích (AI)</h3>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-bold text-blue-600">
                            {isLoading ? "..." : commentsPredicted.toLocaleString()}
                        </p>
                        {!isLoading && (
                            <span className="text-sm font-normal text-muted-foreground">
                                ({predictedPercentage}%)
                            </span>
                        )}
                    </div>
                </div>

                <div className="p-4 border rounded-xl bg-card shadow-sm">
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                        <AlertCircle className="w-4 h-4 text-orange-500" />
                        <h3 className="font-medium">Chờ Phân Tích</h3>
                    </div>
                    <p className="text-3xl font-bold text-orange-500">
                        {isLoading ? "..." : pendingComments.toLocaleString()}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Cột trái: Control Panel & Logs */}
                <div className="lg:col-span-2 space-y-6">

                    {/* BATCH ANALYZE CONTROL */}
                    <div className="p-6 border rounded-xl bg-card shadow-sm border-blue-100">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-lg font-semibold flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-blue-500" />
                                    Cập nhật phân tích toàn bộ hệ thống
                                </h2>
                                <p className="text-sm text-muted-foreground mt-2 max-w-xl leading-relaxed">
                                    Tính năng này sẽ gọi AI Model quét và <strong className="text-foreground">ghi đè/cập nhật lại kết quả</strong> khía cạnh (aspects) cho <strong>tất cả</strong> các bài đánh giá hiện có trong cơ sở dữ liệu.
                                </p>
                                <p className="text-sm text-amber-600 mt-1 italic">
                                    * Lưu ý: Tác vụ này có thể mất vài phút đến vài chục phút tùy thuộc vào số lượng dữ liệu.
                                </p>
                            </div>
                            <button
                                onClick={handleBatchAnalyze}
                                disabled={isAnalyzing || isLoading}
                                className={`flex items-center shrink-0 gap-2 px-4 py-2 rounded-lg font-medium text-white transition-colors
                                    ${isAnalyzing ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-sm'}`}
                            >
                                {isAnalyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                                {isAnalyzing ? 'Đang phân tích...' : 'Bắt đầu Phân tích'}
                            </button>
                        </div>
                    </div>

                    {/* RECENT LOGS REAL DATA */}
                    <div className="p-6 border rounded-xl bg-card shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <ListFilter className="w-5 h-5" />
                                Khía cạnh phân tích gần đây
                            </h2>
                            <span className="text-xs text-muted-foreground">
                                Mới nhất
                            </span>
                        </div>

                        <div className="space-y-3">
                            {isLoading ? (
                                <p className="text-sm text-muted-foreground py-4 text-center">Đang tải nhật ký...</p>
                            ) : !dashboard?.reviewAspectsNewest || dashboard.reviewAspectsNewest.length === 0 ? (
                                <p className="text-sm text-muted-foreground py-4 text-center">Chưa có dữ liệu phân tích gần đây.</p>
                            ) : (
                                dashboard.reviewAspectsNewest.map((item: ReviewAspectResponse) => (
                                    <div key={item.id} className="p-3 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                                        <div className="flex items-start justify-between gap-2">
                                            <p className="text-sm font-medium text-foreground italic">
                                                {item.content}
                                            </p>
                                            {item.createdAt && (
                                                <span className="text-[11px] text-muted-foreground whitespace-nowrap flex items-center gap-1 shrink-0">
                                                    <Clock className="w-3 h-3" />
                                                    {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                                            {renderSentimentBadge(item.sentiment, item.aspect)}
                                            {item.opinionWord && (
                                                <span className="text-xs text-muted-foreground">
                                                    Từ ngữ biểu thị: <span className="font-medium text-foreground">{item.opinionWord}</span>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Cột phải: Khía cạnh hỗ trợ */}
                <div className="p-6 border rounded-xl bg-card shadow-sm h-fit">
                    <h2 className="text-lg font-semibold mb-2">Khía cạnh hỗ trợ (34)</h2>
                    <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                        {Object.values(HotelAspect).map((aspect) => (
                            <div
                                key={aspect}
                                className="px-3 py-2 border rounded-md text-xs font-mono font-medium hover:bg-muted/50 transition-colors"
                            >
                                <p className="text-xs font-mono font-semibold text-blue-600">
                                    {aspect}
                                </p>

                                <p className="text-xs text-muted-foreground mt-0.5">
                                    {HotelAspectLabelMap[aspect]}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}