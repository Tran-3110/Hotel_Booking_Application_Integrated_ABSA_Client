export enum Sentiment {
    POSITIVE = 'POSITIVE',
    NEGATIVE = 'NEGATIVE',
    NEUTRAL = 'NEUTRAL',
}

export enum HotelAspect {
    HOTEL_GENERAL = 'HOTEL#GENERAL',
    HOTEL_PRICES = 'HOTEL#PRICES',
    HOTEL_DESIGN_FEATURES = 'HOTEL#DESIGN&FEATURES',
    HOTEL_CLEANLINESS = 'HOTEL#CLEANLINESS',
    HOTEL_COMFORT = 'HOTEL#COMFORT',
    HOTEL_QUALITY = 'HOTEL#QUALITY',
    HOTEL_STYLE_OPTIONS = 'HOTEL#STYLE&OPTIONS',
    HOTEL_MISCELLANEOUS = 'HOTEL#MISCELLANEOUS',

    ROOMS_GENERAL = 'ROOMS#GENERAL',
    ROOMS_PRICES = 'ROOMS#PRICES',
    ROOMS_DESIGN_FEATURES = 'ROOMS#DESIGN&FEATURES',
    ROOMS_CLEANLINESS = 'ROOMS#CLEANLINESS',
    ROOMS_COMFORT = 'ROOMS#COMFORT',
    ROOMS_QUALITY = 'ROOMS#QUALITY',
    ROOMS_STYLE_OPTIONS = 'ROOMS#STYLE&OPTIONS',

    ROOM_AMENITIES_GENERAL = 'ROOM_AMENITIES#GENERAL',
    ROOM_AMENITIES_PRICES = 'ROOM_AMENITIES#PRICES',
    ROOM_AMENITIES_DESIGN_FEATURES = 'ROOM_AMENITIES#DESIGN&FEATURES',
    ROOM_AMENITIES_CLEANLINESS = 'ROOM_AMENITIES#CLEANLINESS',
    ROOM_AMENITIES_QUALITY = 'ROOM_AMENITIES#QUALITY',
    ROOM_AMENITIES_STYLE_OPTIONS = 'ROOM_AMENITIES#STYLE&OPTIONS',

    FACILITIES_GENERAL = 'FACILITIES#GENERAL',
    FACILITIES_PRICES = 'FACILITIES#PRICES',
    FACILITIES_DESIGN_FEATURES = 'FACILITIES#DESIGN&FEATURES',
    FACILITIES_CLEANLINESS = 'FACILITIES#CLEANLINESS',
    FACILITIES_QUALITY = 'FACILITIES#QUALITY',
    FACILITIES_STYLE_OPTIONS = 'FACILITIES#STYLE&OPTIONS',

    SERVICE_GENERAL = 'SERVICE#GENERAL',
    SERVICE_PRICES = 'SERVICE#PRICES',
    SERVICE_QUALITY = 'SERVICE#QUALITY',
    SERVICE_STYLE_OPTIONS = 'SERVICE#STYLE&OPTIONS',

    LOCATION_GENERAL = 'LOCATION#GENERAL',
    LOCATION_MISCELLANEOUS = 'LOCATION#MISCELLANEOUS',

    FOOD_DRINKS_QUALITY = 'FOOD&DRINKS#QUALITY',
}

export const HotelAspectLabelMap: Record<string, string> = {
    [HotelAspect.HOTEL_GENERAL]: 'Khách sạn - Tổng quan',
    [HotelAspect.HOTEL_PRICES]: 'Khách sạn - Giá cả',
    [HotelAspect.HOTEL_DESIGN_FEATURES]: 'Khách sạn - Thiết kế & Cảnh quan',
    [HotelAspect.HOTEL_CLEANLINESS]: 'Khách sạn - Vệ sinh',
    [HotelAspect.HOTEL_COMFORT]: 'Khách sạn - Độ thoải mái',
    [HotelAspect.HOTEL_QUALITY]: 'Khách sạn - Chất lượng chung',
    [HotelAspect.HOTEL_STYLE_OPTIONS]: 'Khách sạn - Phong cách',
    [HotelAspect.HOTEL_MISCELLANEOUS]: 'Khách sạn - Khác',

    [HotelAspect.ROOMS_GENERAL]: 'Phòng - Tổng quan',
    [HotelAspect.ROOMS_PRICES]: 'Phòng - Giá phòng',
    [HotelAspect.ROOMS_DESIGN_FEATURES]: 'Phòng - Thiết kế',
    [HotelAspect.ROOMS_CLEANLINESS]: 'Phòng - Sạch sẻ',
    [HotelAspect.ROOMS_COMFORT]: 'Phòng - Tiện nghi',
    [HotelAspect.ROOMS_QUALITY]: 'Phòng - Chất lượng',
    [HotelAspect.ROOMS_STYLE_OPTIONS]: 'Phòng - Loại phòng',

    [HotelAspect.ROOM_AMENITIES_GENERAL]: 'Trang thiết bị phòng - Tổng quan',
    [HotelAspect.ROOM_AMENITIES_PRICES]: 'Trang thiết bị phòng - Chi phí',
    [HotelAspect.ROOM_AMENITIES_DESIGN_FEATURES]: 'Trang thiết bị phòng - Thiết kế',
    [HotelAspect.ROOM_AMENITIES_CLEANLINESS]: 'Trang thiết bị phòng - Vệ sinh',
    [HotelAspect.ROOM_AMENITIES_QUALITY]: 'Trang thiết bị phòng - Chất lượng',
    [HotelAspect.ROOM_AMENITIES_STYLE_OPTIONS]: 'Trang thiết bị phòng - Đa dạng',

    [HotelAspect.FACILITIES_GENERAL]: 'Tiện ích chung - Tổng quan',
    [HotelAspect.FACILITIES_PRICES]: 'Tiện ích chung - Chi phí',
    [HotelAspect.FACILITIES_DESIGN_FEATURES]: 'Tiện ích chung - Thiết kế/Quy mô',
    [HotelAspect.FACILITIES_CLEANLINESS]: 'Tiện ích chung - Vệ sinh',
    [HotelAspect.FACILITIES_QUALITY]: 'Tiện ích chung - Chất lượng',
    [HotelAspect.FACILITIES_STYLE_OPTIONS]: 'Tiện ích chung - Đa dạng',

    [HotelAspect.SERVICE_GENERAL]: 'Dịch vụ & Phục vụ - Tổng quan',
    [HotelAspect.SERVICE_PRICES]: 'Dịch vụ - Chi phí',
    [HotelAspect.SERVICE_QUALITY]: 'Dịch vụ - Chất lượng',
    [HotelAspect.SERVICE_STYLE_OPTIONS]: 'Dịch vụ - Phong cách',

    [HotelAspect.LOCATION_GENERAL]: 'Vị trí - Tổng quan',
    [HotelAspect.LOCATION_MISCELLANEOUS]: 'Vị trí - Đường đi / Bãi xe',

    [HotelAspect.FOOD_DRINKS_QUALITY]: 'Ẩm thực - Chất lượng đồ ăn & uống',
};