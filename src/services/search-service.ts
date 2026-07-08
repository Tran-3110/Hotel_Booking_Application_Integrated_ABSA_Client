import axios from "axios";
import {SuggestSearchResponse} from "@/common/types/suggest-search";
import apiClient from "@/services/api-client";
import {CardHotelResponse} from "@/common/types/hotel";
import {PageResponse} from "@/common/types/page";

export const suggestSearch = async (keyword: string) => {
    const response = await axios.get<SuggestSearchResponse[]>(`https://nominatim.openstreetmap.org/search?q=${keyword}&format=json&addressdetails=1&limit=5&countrycodes=vn`)
    return response.data
}

export const searchHotels = async (
    type: number,
    keyword: string,
    page: number,
    extentAddress?: number[],
    minRating?: number,
    minPrice?: number,
    maxPrice?: number,
    sortType?: string
): Promise<PageResponse<CardHotelResponse>> => {
    const response = await apiClient.get(`/search/hotels`, {
        params: {
            type: type,
            keyWord: keyword,
            extentAddress: extentAddress,
            page: page,
            size: 10 ,
            minRating: minRating,
            minPrice: minPrice,
            maxPrice: maxPrice,
            sortType: sortType
        }
    })
    return response.data
}