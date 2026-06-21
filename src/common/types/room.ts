export interface RoomDetailSnapShotResponse {
    id: string
    code: string
    valid: boolean
}

export interface RoomTypeValidResponse {
    roomTypeId: string
    name: string
    depositedPercent: number
    price: number
    data: RoomDetailSnapShotResponse[]
}