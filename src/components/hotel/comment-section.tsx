"use client";

import { useState, useMemo } from "react";
import { Star, FilterX, Filter } from "lucide-react";
import { CommentResponse } from "@/common/types/comment";
import { commentService } from "@/services/comment-service";
import CommentForm from "@/components/hotel/send-comment";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageResponse } from "@/common/types/page";
import { translateAspect } from "@/common/constants/aspepct-mapper";

interface CommentSectionProps {
    hotelId: string;
    initialData: PageResponse<CommentResponse>;
}

export default function CommentSection({ hotelId, initialData }: CommentSectionProps) {
    const [comments, setComments] = useState<CommentResponse[]>(initialData?.content || []);
    const [page, setPage] = useState(2);
    const [isLoading, setIsLoading] = useState(false);

    const [showFilters, setShowFilters] = useState(false);
    const [selectedAspect, setSelectedAspect] = useState<string | null>(null);
    const [selectedSentiment, setSelectedSentiment] = useState<string | null>(null);

    const totalElements = initialData?.totalElements || 0;
    const [hasMore, setHasMore] = useState(comments.length < totalElements);

    const uniqueAspects = useMemo(() => {
        const aspects = comments
            .flatMap((c) => c.sentiments?.map((s) => s.aspect))
            .filter(Boolean);
        return Array.from(new Set(aspects));
    }, [comments]);

    const filteredComments = useMemo(() => {
        return comments.filter((comment) => {
            if (!comment.sentiments || comment.sentiments.length === 0) {
                return !selectedAspect && !selectedSentiment;
            }

            const matchAspect = selectedAspect
                ? comment.sentiments.some(s => s.aspect === selectedAspect)
                : true;

            const matchSentiment = selectedSentiment
                ? comment.sentiments.some(s => s.sentiment === selectedSentiment)
                : true;

            return matchAspect && matchSentiment;
        });
    }, [comments, selectedAspect, selectedSentiment]);

    const handleLoadMore = async () => {
        if (!hasMore || isLoading) return;
        setIsLoading(true);
        try {
            const res = await commentService.getCommentByHotel(hotelId, page, 5);
            if (res && res.content) {
                const newComments = res.content;
                setComments((prev) => [...prev, ...newComments]);
                setPage((prev) => prev + 1);

                if (comments.length + newComments.length >= totalElements) {
                    setHasMore(false);
                }
            }
        } catch (error) {
            console.error("Lỗi khi tải thêm bình luận:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const clearFilters = () => {
        setSelectedAspect(null);
        setSelectedSentiment(null);
    };

    return (
        <section id="rating" className="border-t py-8">
            <p className="text-xl font-semibold mb-6">Đánh giá ({totalElements})</p>

            <CommentForm hotelId={hotelId} />

            {comments.length > 0 && uniqueAspects.length > 0 && (
                <div className="mt-6 flex justify-end">
                    <Button
                        variant="outline"
                        onClick={() => setShowFilters(!showFilters)}
                        className="text-sm bg-background text-foreground hover:bg-accent"
                    >
                        <Filter className="w-4 h-4 mr-2" />
                        {showFilters ? "Ẩn bộ lọc" : "Lọc đánh giá"}
                    </Button>
                </div>
            )}

            {/* BỘ LỌC ĐÁNH GIÁ */}
            {showFilters && comments.length > 0 && uniqueAspects.length > 0 && (
                <div className="my-6 p-5 bg-background rounded-xl border shadow-sm transition-all">
                    <div className="flex items-center justify-between mb-5">
                        <p className="font-semibold text-base text-foreground">Bộ lọc đánh giá</p>
                        {(selectedAspect || selectedSentiment) && (
                            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 text-sm text-muted-foreground hover:text-foreground">
                                <FilterX className="w-4 h-4 mr-1" /> Bỏ lọc
                            </Button>
                        )}
                    </div>

                    <div className="space-y-5">
                        <div>
                            <p className="text-sm text-muted-foreground mb-3 font-medium">Khía cạnh nhắc đến:</p>
                            <div className="flex flex-wrap gap-2.5">
                                {uniqueAspects.map((aspect) => (
                                    <Badge
                                        key={aspect}
                                        variant={selectedAspect === aspect ? "default" : "outline"}
                                        className="cursor-pointer transition-colors text-sm py-1 px-3"
                                        onClick={() => setSelectedAspect(selectedAspect === aspect ? null : aspect)}
                                    >
                                        {translateAspect(aspect)}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <div>
                            <p className="text-sm text-muted-foreground mb-3 font-medium">Cảm xúc:</p>
                            <div className="flex flex-wrap gap-2.5">
                                {["Positive", "Negative", "Neutral"].map((sentiment) => {
                                    const isSelected = selectedSentiment === sentiment;

                                    return (
                                        <Badge
                                            key={sentiment}
                                            variant="outline"
                                            className={`cursor-pointer transition-colors text-sm py-1 px-3 ${sentiment === "Positive"
                                                    ? isSelected
                                                        ? "bg-green-600 text-white border-transparent hover:bg-green-700"
                                                        : "bg-background text-green-600 border-green-500 hover:bg-green-50"
                                                    : sentiment === "Negative"
                                                        ? isSelected
                                                            ? "bg-red-600 text-white border-transparent hover:bg-red-700"
                                                            : "bg-background text-red-600 border-red-500 hover:bg-red-50"
                                                        : isSelected
                                                            ? "bg-foreground text-background border-transparent hover:bg-foreground/90"
                                                            : "bg-background text-foreground border-input hover:bg-accent"
                                                }`}
                                            onClick={() => setSelectedSentiment(isSelected ? null : sentiment)}
                                        >
                                            {sentiment === "Positive" ? "Tích cực" : sentiment === "Negative" ? "Tiêu cực" : "Trung tính"}
                                        </Badge>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-8">
                {filteredComments.length > 0 ? (
                    <div className="space-y-8">
                        {filteredComments.map((comment: CommentResponse, index: number) => (
                            <div key={`${comment.commentId}-${index}`} className="border-b pb-8 last:border-0">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center font-bold text-muted-foreground uppercase text-lg">
                                        {comment.user?.username.charAt(0) || "U"}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-base text-foreground">{comment.user?.username || "Người dùng ẩn danh"}</p>
                                        <div className="flex items-center gap-1 mt-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size="14px"
                                                    fill={i < (comment.rating || 5) ? "currentColor" : "none"}
                                                    className={i < (comment.rating || 5) ? "text-yellow-400" : "text-gray-300"}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <span className="text-sm text-muted-foreground ml-auto">
                                        {comment.updatedAt ? new Date(comment.updatedAt).toLocaleDateString("vi-VN") : ""}
                                    </span>
                                </div>

                                <p className="text-foreground text-base mt-4 leading-relaxed">
                                    {comment.content}
                                </p>

                                {comment.sentiments && comment.sentiments.length > 0 && (
                                    <div className="mt-5 p-4 bg-muted/50 rounded-xl border space-y-3">
                                        <p className="text-sm font-semibold text-foreground mb-2">Chi tiết đánh giá:</p>
                                        {comment.sentiments.map((s, i) => {
                                            const sentimentDisplay = s.sentiment === "Positive" ? "Tích cực" : s.sentiment === "Negative" ? "Tiêu cực" : "Trung tính";

                                            return (
                                                <div key={i} className="text-base flex flex-wrap items-center gap-x-2 gap-y-2">
                                                    <span className="text-muted-foreground">Khía cạnh:</span>
                                                    <Badge variant="outline" className="bg-background text-sm py-0.5 px-2 font-medium uppercase">
                                                        {translateAspect(s.aspect)}
                                                    </Badge>

                                                    <span className="text-muted-foreground ml-3">Cảm xúc:</span>
                                                    <Badge
                                                        variant="default"
                                                        className={`text-sm py-0.5 px-2 font-medium ${s.sentiment === "Positive"
                                                                ? "bg-green-600 text-white hover:bg-green-700"
                                                                : s.sentiment === "Negative"
                                                                    ? "bg-red-600 text-white hover:bg-red-700"
                                                                    : "bg-foreground text-background hover:bg-foreground/90"
                                                            }`}
                                                    >
                                                        {sentimentDisplay}
                                                    </Badge>

                                                    <span className="text-muted-foreground ml-3">Từ ý kiến:</span>
                                                    <span className="font-medium text-foreground italic">&quot;{s.opinionWord}&quot;</span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground text-base italic text-center py-8">
                        {comments.length > 0
                            ? "Không có bình luận nào khớp với bộ lọc."
                            : "Chưa có đánh giá nào cho khách sạn này."}
                    </p>
                )}
            </div>

            {hasMore && comments.length > 0 && (
                <div className="mt-10 flex justify-center">
                    <Button
                        variant="outline"
                        onClick={handleLoadMore}
                        disabled={isLoading}
                        className="min-w-40 text-base py-5 bg-background text-foreground hover:bg-accent"
                    >
                        {isLoading ? "Đang tải..." : "Xem thêm bình luận"}
                    </Button>
                </div>
            )}
        </section>
    );
}