import SearchFilter from "@/components/search/search-filter";
import SearchList from "@/components/search/search-list";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {MapPin} from "lucide-react";

interface SearchPageProps {
    searchParams: Promise<{
        q: string;
        lat: string;
        lon: string;
        bbox: string;
    }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const {q, lat, lon, bbox} = await searchParams;
    const apiMapKey =  process.env.NEXT_PUBLIC_STADIA_API_KEY;
    
    return (
        <div className="flex gap-3 px-50 pt-20 mb-15">
            
            <div className="w-70 top-25 h-fit">
                <div className="border rounded-lg overflow-hidden w-full h-40 relative mb-2">
                    <Button className="bottom-2 bg-indigo-500 hover:bg-indigo-600 left-[20%] right-[20%] absolute z-10">
                        <MapPin />Xem trên bản đồ</Button>
                    <Image className="object-cover absolute" sizes="auto" fill
                           src={`https://tiles.stadiamaps.com/static/outdoors?center=10.823,106.625&zoom=15&size=600x400&markers=10.823,106.625&api_key=${apiMapKey}`} alt="Hình ảnh map" />
                </div>
                
                <SearchFilter />
            </div>
            <div className="flex-1">
                {
                    !q || q.trim() === "" ? <div className="font-semibold text-center pt-10 text-lg">Không tìm thấy khách sạn. Vui lòng nhập từ khóa khác!</div> 
                        :  <SearchList keyword={q} lat={lat} lon={lon} bbox={bbox}/>
                }
            </div>
        </div>
    )
}