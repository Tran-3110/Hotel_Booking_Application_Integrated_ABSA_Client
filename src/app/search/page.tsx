"use client"
import SearchFilter from "@/components/search/search-filter";
import SearchOverview from "@/components/search/search-overview";
import {useSearchParams} from "next/navigation";
import SearchList from "@/components/search/search-list";

export default function Search() {
    const params = useSearchParams();
    return (
        <div className="flex gap-3 px-50">
            <div className="flex-none top-0 sticky h-fit z-50">
                <SearchFilter />
            </div>
            <div className="flex-1">
                <SearchOverview keyword={params.get("q") || ""} />
                <SearchList />
            </div>
        </div>
    )
}