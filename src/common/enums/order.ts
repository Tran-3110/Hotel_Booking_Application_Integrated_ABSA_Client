export enum OrderStatus {
    // Before Paid
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    REJECTED = "REJECTED",
    CANCELLED = "CANCELLED",

    // After paid
    PAID = "PAID",
    CHECKED_IN = "CHECKED_IN",
    COMPLETED = "COMPLETED",
}