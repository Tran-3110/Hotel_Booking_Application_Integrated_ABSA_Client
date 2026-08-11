import { apiUrl } from "@/common/constants/api-url"
import { HomePageStatisticResponse } from "@/common/types/home"
import axios from "axios"

export const getHomePageData = async () => {
    const res = await axios.get<HomePageStatisticResponse>(`${apiUrl}/home/data`, {
        headers: {
            "ngrok-skip-browser-warning": "true"
        }
    })
    return res.data
}