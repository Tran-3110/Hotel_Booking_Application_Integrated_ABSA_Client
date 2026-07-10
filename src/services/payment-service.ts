import apiClient from "./api-client";

export const createPaymentUrl = async (orderId: string): Promise<string> => {
    const response = await apiClient.post<string>(`/payment/create/${orderId}`);
    return response.data;
};

export const createInvoicePaymentUrl = async (invoiceId: string): Promise<string> => {
    const response = await apiClient.post<string>(`/payment/create-invoice/${invoiceId}`);
    return response.data;
};