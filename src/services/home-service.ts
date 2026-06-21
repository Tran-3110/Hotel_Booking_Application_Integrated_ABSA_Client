import { apiUrl } from "@/common/constants/api-url"
import { HomePageStatisticResponse } from "@/common/types/home"
import axios from "axios"

export const getHomePageData = async () => {
    const res = await axios.get<HomePageStatisticResponse>(`${apiUrl}/home/data`)
    return res.data
}