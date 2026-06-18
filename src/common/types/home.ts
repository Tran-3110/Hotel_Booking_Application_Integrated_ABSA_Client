export interface ProvinceStatistic {
    name: string;
    hotelCount: number;
    postalCode: number;
    thumbnail: string;
}

export interface PromotionalHotelResponse {
    id: string;
    name: string;
    thumbnail: string;
    province: string;
    rating: number;
    originalPrice: number;
    promotionalPrice: number;
}

export interface HomePageStatisticResponse {
    provinceStatistics: ProvinceStatistic[];
    promotionalHotels: PromotionalHotelResponse[];
}