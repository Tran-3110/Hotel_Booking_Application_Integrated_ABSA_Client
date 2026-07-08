"use client";

import { useRef, ChangeEvent, DragEvent, useEffect } from "react";
import { FilePreview } from "@/common/types/file";
import Image from "next/image";

interface MultiUploadBoxProps {
    previews: FilePreview[];
    thumbnailId: string | null;
    onFilesAdded: (files: File[]) => void;
    onRemoveFile: (id: string) => void;
    onSetThumbnail: (id: string) => void;
}

export default function MultiUploadBox({
                                           previews,
                                           thumbnailId,
                                           onFilesAdded,
                                           onRemoveFile,
                                           onSetThumbnail
                                       }: MultiUploadBoxProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Vẫn giữ cleanup RAM ở đây để an toàn, đề phòng Component bị unmount
    useEffect(() => {
        return () => {
            previews.forEach(item => {
                if (item.file && item.url.startsWith("blob:")) {
                    URL.revokeObjectURL(item.url);
                }
            });
        };
    }, [previews]);

    const handleClick = () => fileInputRef.current?.click();

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            onFilesAdded(Array.from(e.target.files));
        }
        // Reset input để có thể chọn lại cùng 1 file nếu vừa xóa
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onFilesAdded(Array.from(e.dataTransfer.files));
        }
    };

    return (
        <div className="space-y-6 mb-8">
            <div
                onClick={handleClick}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className="border-2 border-dashed border-blue-200 bg-blue-50/30 rounded-[2rem] p-10 text-center hover:bg-blue-50 transition-all cursor-pointer group"
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    multiple
                    className="hidden"
                />
                <p className="text-gray-700 font-medium">
                    <span className="text-violet-600 underline">Tải lên</span>
                </p>
            </div>

            {previews.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-2">
                        Danh sách file ({previews.length})
                    </h3>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-white rounded-[2rem] border border-gray-100 shadow-sm">
                        {previews.map((item) => {
                            const isThumbnail = item.id === thumbnailId;
                            return (
                                <div
                                    key={item.id}
                                    onClick={() => onSetThumbnail(item.id)}
                                    className={`group relative aspect-square rounded-2xl overflow-hidden cursor-pointer transition-all border-4 
                                    ${isThumbnail ? "border-violet-500 shadow-lg scale-[1.02]" : "border-transparent hover:border-violet-200"}`}
                                >
                                    {/* Ảnh */}
                                    {item.url ? (
                                        <Image
                                            src={item.url}
                                            alt="preview"
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-xs">
                                            Ảnh bị lỗi
                                        </div>
                                    )}

                                    {isThumbnail && (
                                        <div className="absolute top-2 left-2 bg-violet-600 text-white text-[9px] font-bold px-2 py-1 rounded-md shadow-sm pointer-events-none z-10 tracking-wider">
                                            THUMBNAIL
                                        </div>
                                    )}

                                    {/* Nút Xóa */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onRemoveFile(item.id);
                                        }}
                                        className="absolute top-2 right-2 w-6 h-6 bg-white/90 hover:bg-red-500 hover:text-white text-gray-500 rounded-full flex items-center justify-center shadow-sm z-10 transition-colors"
                                    >
                                        ×
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}