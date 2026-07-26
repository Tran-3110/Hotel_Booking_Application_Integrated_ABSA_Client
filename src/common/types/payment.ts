import { AuthUser } from './auth';

export enum OrderStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    REJECTED = 'REJECTED',
    CANCELLED = 'CANCELLED',
    PAID = 'PAID',
    CHECKED_IN = 'CHECKED_IN',
    COMPLETED = 'COMPLETED'
}

export enum InvoiceStatus {
    PENDING = 'PENDING',
    PAID = 'PAID',
    OVERDUE = 'OVERDUE',
    CANCELLED = 'CANCELLED'
}

export interface PlatformInvoice {
    id: string;
    user: AuthUser; 
    amount: number;
    billingName: string;
    createdAt: string;
    dueDate: string;
    status: InvoiceStatus;
}