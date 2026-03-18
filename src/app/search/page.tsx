"use client"
import SearchFilter from "@/components/search/search-filter";
import SearchOverview from "@/components/search/search-overview";
import {useSearchParams} from "next/navigation";
import SearchList from "@/components/search/search-list";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {MapPin} from "lucide-react";

export default function Search() {
    const params = useSearchParams();
    const apiMapKey =  process.env.NEXT_PUBLIC_STADIA_API_KEY;
    return (
        <div className="flex gap-3 px-50">
            <div className="w-70 top-0 sticky h-fit z-50">
                <div className="border rounded-lg overflow-hidden w-full h-40 relative mb-2">
                    <Button className="bottom-2 bg-indigo-500 hover:bg-indigo-600 left-[20%] right-[20%] absolute z-60">
                        <MapPin />Xem trên bản đồ</Button>
                    <Image className="object-cover absolute" sizes="auto" fill
                           src={`https://tiles.stadiamaps.com/static/outdoors?center=10.823,106.625&zoom=15&size=600x400&markers=10.823,106.625&api_key=${apiMapKey}`} alt="Hình ảnh map" /> 
                </div>
                
                
                <SearchFilter />
            </div>
            <div className="flex-1">
                <SearchOverview keyword={params.get("q") || ""} />
                <SearchList />
            </div>
        </div>
    )
}