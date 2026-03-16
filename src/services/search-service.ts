import axios from "axios";
import {SuggestSearchResponse} from "@/common/types/suggest-search";

export const suggestSearch = async (keyword: string) => {
    const response = await axios.get<SuggestSearchResponse[]>(`https://nominatim.openstreetmap.org/search?q=${keyword}&format=json&addressdetails=1&limit=5&countrycodes=vn`)
    return response.data
}