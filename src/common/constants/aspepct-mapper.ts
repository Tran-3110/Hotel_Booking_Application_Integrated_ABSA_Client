export const ASPECT_MAPPER: Record<string, string> = {
    // Tiện ích & Cơ sở vật chất chung
    'FACILITIES#CLEANLINESS': 'Vệ sinh tiện ích chung',
    'FACILITIES#COMFORT': 'Trải nghiệm tiện ích',
    'FACILITIES#DESIGN&FEATURES': 'Thiết kế cơ sở vật chất',
    'FACILITIES#GENERAL': 'Cơ sở vật chất chung',
    'FACILITIES#MISCELLANEOUS': 'Các tiện ích khác',
    'FACILITIES#PRICES': 'Giá cả dịch vụ/tiện ích',
    'FACILITIES#QUALITY': 'Chất lượng tiện ích',

    // Ẩm thực (F&B)
    'FOOD&DRINKS#MISCELLANEOUS': 'Các vấn đề ăn uống khác',
    'FOOD&DRINKS#PRICES': 'Giá cả ăn uống',
    'FOOD&DRINKS#QUALITY': 'Chất lượng món ăn',
    'FOOD&DRINKS#STYLE&OPTIONS': 'Menu / Sự đa dạng món ăn',

    // Tổng quan Khách sạn
    'HOTEL#CLEANLINESS': 'Vệ sinh khách sạn',
    'HOTEL#COMFORT': 'Sự thoải mái / Không gian',
    'HOTEL#DESIGN&FEATURES': 'Thiết kế & Kiến trúc',
    'HOTEL#GENERAL': 'Tổng quan khách sạn',
    'HOTEL#MISCELLANEOUS': 'Các vấn đề khác về khách sạn',
    'HOTEL#PRICES': 'Mức giá chung',
    'HOTEL#QUALITY': 'Chất lượng khách sạn',

    // Vị trí
    'LOCATION#GENERAL': 'Vị trí khách sạn',

    // Phòng ốc
    'ROOMS#CLEANLINESS': 'Vệ sinh phòng',
    'ROOMS#COMFORT': 'Độ thoải mái của phòng',
    'ROOMS#DESIGN&FEATURES': 'Thiết kế / Bài trí phòng',
    'ROOMS#GENERAL': 'Tổng quan phòng ốc',
    'ROOMS#MISCELLANEOUS': 'Các vấn đề khác của phòng',
    'ROOMS#PRICES': 'Giá phòng',
    'ROOMS#QUALITY': 'Chất lượng phòng',

    // Trang thiết bị trong phòng (Điều hòa, tivi, giường, khăn...)
    'ROOM_AMENITIES#CLEANLINESS': 'Độ sạch của vật dụng phòng',
    'ROOM_AMENITIES#COMFORT': 'Độ êm ái/Thoải mái của đồ dùng',
    'ROOM_AMENITIES#DESIGN&FEATURES': 'Thiết kế trang thiết bị phòng',
    'ROOM_AMENITIES#GENERAL': 'Trang thiết bị phòng',
    'ROOM_AMENITIES#MISCELLANEOUS': 'Vật dụng khác trong phòng',
    'ROOM_AMENITIES#PRICES': 'Phí dùng đồ trong phòng',
    'ROOM_AMENITIES#QUALITY': 'Chất lượng đồ dùng',

    // Dịch vụ & Nhân viên
    'SERVICE#GENERAL': 'Thái độ nhân viên / Dịch vụ',
};

export const translateAspect = (aspectKey: string): string => {
    return ASPECT_MAPPER[aspectKey] || aspectKey;
};