"use client"
import {ListFilter, Star} from "lucide-react";
import {useDispatch, useSelector} from "react-redux";
import {ReduxState} from "@/constants/redux-state";
import {changeSearchFilter, setMaxPrice, setMinPrice, setStarCount} from "@/store/slices/searchSlice";
import {useState} from "react";

export default function SearchFilter() {
    const {minPrice, maxPrice} = useSelector((state: ReduxState) => state.searchState);
    const [error, setError] = useState<string>("");
    const dispatch = useDispatch();
    return (
        <div className="border rounded-lg shadow-xs px-4 py-6 bg-white">
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
                                <input type="radio" name="star-filter" className="scale-150 my-1"
                                       onChange={() => dispatch(setStarCount(starCount))}/>
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
                    <span className="block font-semibold text-gray-600">Khoảng giá (vnđ)</span>
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <input
                                type="number" min={0}
                                placeholder="Min"
                                value={minPrice}
                                onChange={(event) => {
                                    const value = event.target.value;
                                    if (value != "" && Number(value) <= 0) return;
                                    dispatch(setMinPrice(event.target.value));
                                }}
                                className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 outline-none transition-all"
                            />
                            <span className="text-gray-400">-</span>
                            <input
                                type="number" min={0}
                                placeholder="Max"
                                value={maxPrice}
                                onChange={(event) => {
                                    const value = event.target.value;
                                    if (value != "" && Number(value) <= 0) return;
                                    dispatch(setMaxPrice(event.target.value));
                                }}
                                className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 outline-none transition-all"
                            />
                        </div>
                        <div className={"text-red-500"}>{error}</div>
                    </div>
                </div>

                <button
                    className="w-full py-2 mt-4 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-700 transition-transform active:scale-95"
                    onClick={() => {
                        if((minPrice != "" && Number(minPrice) <= 0)  || (maxPrice != "" && Number(maxPrice) < 0)) {
                            setError("Khoảng giá phải lớn hơn 0.")
                            return;
                        }
                        if(minPrice != "" && maxPrice != "" && Number(maxPrice) <= Number(minPrice)) {
                            setError("Khoảng giá không hợp lệ. Vui lòng nhập lại!")
                            return;
                        }
                        if(error != "") setError("");
                        dispatch(changeSearchFilter())
                    }}
                >
                    Áp dụng
                </button>
            </div>
        </div>
    );
}