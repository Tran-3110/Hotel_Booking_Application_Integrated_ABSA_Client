import { apiUrl } from "@/common/constants/api-url"
import { VerificationType, VerifyResponse } from "@/common/types/verify"
import axios from "axios"
import apiClient from "./api-client"

export const requestVerify = async (email: string, type: VerificationType) => {
    const endpoint = type === VerificationType.RESET_PASSWORD ? "reset-password" : "account"
    const response = await axios.post<VerifyResponse>(`${apiUrl}/verify/send/${endpoint}`, { email })
    return response.data
}

export const verifyAccount = async (email: string, code: string) => {
    const response = await apiClient.post<VerifyResponse>(`${apiUrl}/verify/account`, { email, code })
    return response.data
}

export const resetPassword = async (email: string, code: string, newPassword: string) => {
    const response = await axios.post<VerifyResponse>(`${apiUrl}/verify/reset-password`, { email, code, newPassword })
    return response.data
}