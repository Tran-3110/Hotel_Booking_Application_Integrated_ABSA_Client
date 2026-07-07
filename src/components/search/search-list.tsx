"use client"; 

import HotelCard from "@/components/hotel/hotel-card";
import SearchOverview from "@/components/search/search-overview";
import { useEffect, useState } from "react";
import { searchHotels } from "@/services/search-service";
import { CardHotelResponse } from "@/common/types/hotel";
import { PageResponse } from "@/common/types/page";
import {useSelector} from "react-redux";
import {ReduxState} from "@/constants/redux-state";
import PaginationCustom from "@/components/pagination-custom";

interface SearchListProps {
    keyword: string;
    lat?: string;
    lon?: string;
    bbox?: string;
}

export default function SearchList(props: SearchListProps) {
    const {starCount, minPrice, maxPrice, checkFilter, sortType} = useSelector((state: ReduxState) => state.searchState);
    const [data, setData] = useState<PageResponse<CardHotelResponse>>();
    const [page, setPage] = useState<number>(0); 
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetch = async () => {
            setIsLoading(true);
            try {
                if(props.lat && props.lon && props.lat.trim().length > 0 && props.lon.trim().length > 0) {
                    let extent:number[];
                    if (props.bbox) {
                        extent = props.bbox.split(",").map(e => Number(e));
                    } else {
                        extent = [Number(props.lat), Number(props.lon)];
                    }
                    const res = await searchHotels(1, props.keyword, page, extent, starCount, 
                        minPrice === "" || Number(minPrice) < 0 ?  undefined : Number(minPrice),
                        maxPrice === "" || Number(maxPrice) < 0 || Number(maxPrice) <= Number(minPrice) ?  undefined : Number(maxPrice),
                        sortType);
                    setData(res);
                } else {
                    const res = await searchHotels(0, props.keyword, page, undefined, starCount,
                        minPrice === "" || Number(minPrice) < 0 ?  undefined : Number(minPrice),
                        maxPrice === "" || Number(maxPrice) < 0 || Number(maxPrice) <= Number(minPrice) ?  undefined : Number(maxPrice),
                        sortType);
                    setData(res);   
                }
            } catch (error) {
                console.error("Lỗi khi fetch hotels:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetch();
    }, [props.keyword, props.lat, props.lon, props.bbox, page, sortType, checkFilter]); 

    useEffect(() => {
        setPage(0);
    }, [props.keyword, props.lat, props.lon, props.bbox, sortType, checkFilter]);

    const totalPages = data?.totalPages || 0;

    return (
        <>
            <SearchOverview keyword={props.keyword} count={data?.totalElements || 0} />

            <div className="flex flex-col min-h-[400px]">
                {isLoading ? (
                    <div className="flex-1 flex items-center justify-center py-10 text-gray-500">
                        Đang tải danh sách khách sạn...
                    </div>
                ) : data?.content && data.content.length > 0 ? (
                    data.content.map((hotel) => (
                        <div key={hotel.id} className="flex-1 py-1">
                            <HotelCard
                                hotelId={hotel.id}
                                thumbnail={hotel.thumbnail}
                                title={hotel.name}
                                totalComment={hotel.totalComment}
                                avgRating={hotel.avgRating}
                                address={`${hotel.street}, ${hotel.ward}, ${hotel.province}`}
                                description={hotel.description}
                                oldPrice={hotel.minPrice}
                                newPrice={hotel.minPrice}
                            />
                        </div>
                    ))
                ) : (
                    <div className="flex-1 flex items-center justify-center py-10 text-gray-500">
                        Không tìm thấy khách sạn nào ở khu vực này.
                    </div>
                )}

                {totalPages > 1 && (
                    <div className="p-5">
                        <PaginationCustom page={page} totalPages={totalPages} onPageChange={(currentPage) => setPage(currentPage)} />
                    </div>
                )}
            </div>
        </>
    );
}