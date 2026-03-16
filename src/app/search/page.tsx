import SearchFilter from "@/components/search/search-filter";
import HotelCard from "@/components/hotel/hotel-card";

export default function Search() {
    return (
        <div className="flex px-50">
            <SearchFilter />
            <div className="flex-10">
                <HotelCard />
            </div>
        </div>
    )
}