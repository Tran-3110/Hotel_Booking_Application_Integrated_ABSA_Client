"use client"
import {ListFilter, Star} from "lucide-react";

export default function SearchFilter() {

    return (
        <div className="border w-70 rounded-lg shadow-xs px-4 py-6 bg-white">
            <label className="flex items-center gap-2 font-bold mb-5 text-gray-800 border-b pb-2">
                <ListFilter size={18}/> Bộ lọc
            </label>

            <div className="space-y-6">
                {/* Lọc theo Rating bằng Icon */}
                <div>
                    <span className="block font-semibold mb-3 text-gray-600">Đánh giá</span>
                    <div className="flex flex-col gap-3">
                        {[5, 4, 3, 2].map((starCount) => (
                            <div key={starCount} className="flex items-center gap-3">
                                <input type="checkbox" className="scale-150 my-1" />
                                <button
                                    className={`flex items-center gap-2 group transition-all `}
                                >
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={16}
                                                fill={i < starCount ? "currentColor" : "none"}
                                                className={i < starCount ? "text-yellow-500" : "text-gray-300"}
                                            />
                                        ))}
                                    </div>
                                    <span className={`text-xs font-medium`}>
                                    {starCount === 5 ? "" : "trở lên"}
                                </span>
                                </button>
                            </div>

                        ))}
                    </div>
                </div>

                <hr className="border-gray-100"/>

                {/* Lọc theo Giá */}
                <div>
                    <span className="block font-semibold mb-3 text-gray-600">Khoảng giá (vnđ)</span>
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <input
                                type="number" min={0}
                                placeholder="Min"
                                className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 outline-none transition-all"
                            />
                            <span className="text-gray-400">-</span>
                            <input
                                type="number"
                                placeholder="Max"
                                className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 outline-none transition-all"
                            />
                        </div>
                        <button
                            className="w-full py-2 mt-10 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-700 transition-transform active:scale-95">
                            Áp dụng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}