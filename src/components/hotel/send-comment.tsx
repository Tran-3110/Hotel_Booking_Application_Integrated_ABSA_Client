"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { commentService } from "@/services/comment-service";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";

export default function CommentForm({ hotelId }: { hotelId: string }) {
    const [rating, setRating] = useState(5);
    const [hover, setHover] = useState(0);
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return toast.error("Vui lòng nhập nội dung đánh giá!");
        if (!user) {
            toast.error("Vui lòng đăng nhập để đánh giá.");
            return;
        }

        setIsSubmitting(true);
        try {
            await commentService.insertComment({ hotelId, userId: user?.id, content, rating });
            toast.success("Đánh giá của bạn đã được gửi thành công");
            setContent("");
            setRating(5);
            router.refresh();
        } catch (error) {
            console.error("Lỗi khi gửi đánh giá:", error);
            toast.error("Có lỗi xảy ra, vui lòng thử lại sau.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="border border-border rounded-xl p-5 bg-background shadow-sm mb-8 mt-4 space-y-4"
        >
            <h3 className="font-semibold text-foreground">Gửi đánh giá của bạn</h3>

            <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground">Chất lượng:</span>
                <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            type="button"
                            key={star}
                            className="focus:outline-none transition-colors p-1"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(0)}
                        >
                            <Star
                                size="22px"
                                fill={(hover || rating) >= star ? "currentColor" : "none"}
                                className={(hover || rating) >= star ? "text-yellow-400" : "text-muted"}
                            />
                        </button>
                    ))}
                </div>
            </div>

            <Textarea
                placeholder="Chia sẻ trải nghiệm của bạn về khách sạn này..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={isSubmitting}
                className="min-h-25 resize-y bg-background text-foreground"
            />

            {/* Nút submit */}
            <div className="flex justify-end">
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-500 dark:hover:bg-indigo-600"
                >
                    {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
                </Button>
            </div>
        </form>
    );
}