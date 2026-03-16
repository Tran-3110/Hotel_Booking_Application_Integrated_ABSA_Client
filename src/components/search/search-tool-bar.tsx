"use client"
import Form from "next/form";
import {BedIcon, MapPin, Search} from "lucide-react";
import {useEffect, useState} from "react";

interface SuggestSearchResponse {
    osm_id: string
    lat: string
    lon: string
    class: string
    name: string
    display_name: string
    address: {
        city: string
        country: string
    }
    boudingbox: string[]
}

export default function SearchToolBar() {
    const [searchText, setSearchText] = useState("");
    const [results, setResults] = useState<SuggestSearchResponse[]>([]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            const autoSuggestSearch = async () => {
                if (searchText.trim().length > 3) {
                    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${searchText}&format=json&addressdetails=1&limit=5&countrycodes=vn`, {})
                    const data = await response.json();

                    setResults(data);
                }
            }
            autoSuggestSearch();
        }, 1100);
        
        //Xóa timeout cũ khi user nhấn phím mới
        return () => clearTimeout(delayDebounceFn);
    }, [searchText]);

    return (
        <div className="w-120 flex-col z-100">
            <Form action="/search" className="flex bg-yellow-400 p-1 gap-1 rounded-lg h-15 w-full">
                <div className="bg-white flex items-center rounded w-[70%] h-full">
                    <BedIcon className="w-15"/>
                    <input className="focus:outline-none"
                           placeholder="Bạn muốn đến đâu?" name="query" onChange={(e) => {
                        if (e.target.value === "") setResults([])
                        setSearchText(e.target.value)
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