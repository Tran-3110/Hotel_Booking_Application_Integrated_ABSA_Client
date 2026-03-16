"use client"
import Form from "next/form";
import {BedIcon, MapPin, Search} from "lucide-react";
import {useEffect, useState} from "react";
import {suggestSearch} from "@/services/search-service";
import {SuggestSearchResponse} from "@/common/types/suggest-search";
import {useSelector} from "react-redux";
import {ReduxState} from "@/constants/redux-state";
import {useDispatch} from "react-redux";
import {setKeyword} from "@/store/slices/searchSlice";

export default function SearchToolBar() {
    const searchText = useSelector((state:ReduxState) => state.searchState.keyword)
    const dispatch = useDispatch();
    const [results, setResults] = useState<SuggestSearchResponse[]>([]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            const handleSuggestSearch = async () => {
                if (searchText.trim().length > 3) {
                    const data = await suggestSearch(searchText);
                    setResults(data);
                }
            }
            handleSuggestSearch();
        }, 1100);
        
        //Xóa timeout cũ khi user nhấn phím mới
        return () => clearTimeout(delayDebounceFn);
    }, [searchText, dispatch]);

    return (
        <div className="w-120 flex-col z-100">
            <Form action="/search" className="flex bg-yellow-400 p-1 gap-1 rounded-lg h-15 w-full">
                <div className="bg-white flex items-center rounded w-[70%] h-full">
                    <BedIcon className="w-15"/>
                    <input className="focus:outline-none"
                           placeholder="Bạn muốn đến đâu?" name="query" onChange={(e) => {
                        if (e.target.value === "") setResults([])
                        dispatch(setKeyword(e.target.value))
                    }}/>
                </div>

                <button type="submit" className="flex items-center justify-center gap-1 cursor-pointer w-[30%] bg-indigo-500 text-white 
            rounded"><Search/>Tìm kiếm
                </button>

            </Form>

            <div className="w-full">
                {results.map((result, index) => (
                    <div key={index} className="p-2 hover:bg-gray-100 cursor-pointer border-b">
                        <label className="flex items-center gap-2 cursor-pointer font-medium">
                            <MapPin className="flex-1"/>
                            <span className="flex-12">
                                {result.display_name || result.name || result.address.city || "Chưa xác định địa điểm."}
                            </span>
                        </label>
                        <p className="ps-11 text-xs text-gray-500">
                            {result.address.country}
                        </p>
                    </div>
                ))}
            </div>
        </div>

    )
}