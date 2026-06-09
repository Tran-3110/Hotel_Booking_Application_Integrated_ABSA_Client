export interface ProvinceStastistic {
    name: string,
    hotelCount: number,
    postalCode: string,
    thumbnail: string
}

export interface HomePageStatisticResponse {
    provinceStatistics: ProvinceStastistic[]
}