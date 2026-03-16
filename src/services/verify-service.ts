import { apiUrl } from "@/common/constants/api-url"
import { VerificationType, VerifyResponse } from "@/common/types/verify"
import axios from "axios"

export const requestVerify = async (email: string, type: VerificationType) => {
    const endpoint = type === VerificationType.RESET_PASSWORD ? "reset-password" : "account"
    const response = await axios.post<VerifyResponse>(`${apiUrl}/send/${endpoint}`, { email })
    return response.data
}

export const verifyAccount = async (email: string, code: string) => {
    const response = await axios.post<VerifyResponse>(`${apiUrl}/account/`, { email, code })
    return response.data
}

export const resetPassword = async (email: string, code: string, newPassword: string) => {
    const response = await axios.post<VerifyResponse>(`${apiUrl}/reset-password`, { email, code, newPassword })
    return response.data
}