export interface SuggestSearchResponse {
    osm_id: string
    lat: string
    lon: string
    class: string
    name: string
    display_name: string
    address: {
        city: string
        country: string
    }
    boudingbox: string[]
}