"use client"
import Form from "next/form";
import { BedIcon, MapPin, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { suggestSearch } from "@/services/search-service";
import { SuggestSearchResponse } from "@/common/types/suggest-search";
import { useSelector } from "react-redux";
import { ReduxState } from "@/constants/redux-state";
import { useDispatch } from "react-redux";
import { setKeyword } from "@/store/slices/searchSlice";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

export default function SearchToolBar() {
    const searchText = useSelector((state: ReduxState) => state.searchState.keyword)
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
        <div className="w-120 relative">
            <Form action="/search" className="flex w-full items-center gap-0 overflow-hidden rounded-full border border-input px-1.5 py-1 shadow-sm focus-within:ring-1 focus-within:ring-ring bg-background">
                <div className="flex items-center pl-4">
                    <BedIcon className="h-4 w-4 text-muted-foreground" />
                </div>
                <Input
                    name="q"
                    placeholder="Bạn muốn đến đâu?"
                    className=" border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base h-10 bg-transparent flex-1"
                    onChange={(e) => {
                        if (e.target.value === "") setResults([]);
                        dispatch(setKeyword(e.target.value));
                    }}
                />
                <Button
                    type="submit"
                    disabled={searchText.trim().length === 0}
                    className={cn(
                        "rounded-full px-6 h-10 font-medium transition-all cursor-pointer",
                        "bg-indigo-700 hover:bg-indigo-800 text-white",
                        "disabled:bg-indigo-500 disabled:cursor-not-allowed"
                    )}
                >
                    <Search className="mr-2 h-4 w-4" />
                    Tìm kiếm
                </Button>
            </Form>

            {results.length > 0 &&
                <div className="w-full absolute border rounded-md mt-1 shadow-sm">
                    {results.map((result, index) => (
                        <div key={index} className="p-2 hover:bg-gray-100 cursor-pointer border-b">
                            <label className="flex items-center gap-1 cursor-pointer font-medium">
                                <MapPin className="flex-1" size={"1.25rem"} />
                                <span className="flex-12 text-sm">
                                    {result.display_name || result.name || result.address.city || "Chưa xác định địa điểm."}
                                </span>
                            </label>
                            <p className="ps-10 text-xs text-gray-500">
                                {result.address.country}
                            </p>
                        </div>
                    ))}
                </div>
            }
        </div>

    )
}