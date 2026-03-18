import HotelCard from "@/components/hotel/hotel-card";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

export default function SearchList() {
    const MOCK_HOTELS = [
        {
            hotelId: "H1",
            thumbnail: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop",
            title: "Grand Luxury Resort & Spa",
            totalComment: 1450,
            avgRating: 4.9,
            address: "Bãi Dài, Phú Quốc, Kiên Giang",
            description: "Trải nghiệm kỳ nghỉ đẳng cấp 5 sao với hồ bơi vô cực sát biển và dịch vụ spa tận tâm.",
            oldPrice: 5500000,
            newPrice: 4200000,
        },
        {
            hotelId: "H2",
            thumbnail: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&auto=format&fit=crop",
            title: "The Heritage Boutique Hotel",
            totalComment: 856,
            avgRating: 4.7,
            address: "Trần Phú, Nha Trang, Khánh Hòa",
            description: "Khách sạn phong cách kiến trúc Đông Dương độc đáo, tọa lạc ngay mặt tiền biển Nha Trang sầm uất.",
            oldPrice: 2800000,
            newPrice: 2150000,
        },
        {
            hotelId: "H3",
            thumbnail: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800&auto=format&fit=crop",
            title: "Mountain View Lodge",
            totalComment: 420,
            avgRating: 4.6,
            address: "Mường Hoa, Sa Pa, Lào Cai",
            description: "Nằm lưng chừng núi với tầm nhìn ôm trọn thung lũng Mường Hoa và những ruộng bậc thang kỳ vĩ.",
            oldPrice: 1950000,
            newPrice: 1600000,
        },
        {
            hotelId: "H4",
            thumbnail: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800&auto=format&fit=crop",
            title: "Central Urban Suites",
            totalComment: 2100,
            avgRating: 4.4,
            address: "Lê Thánh Tôn, Quận 1, TP. Hồ Chí Minh",
            description: "Căn hộ dịch vụ hiện đại giữa lòng thành phố, thuận tiện đi lại cho các chuyến công tác hoặc du lịch.",
            oldPrice: 2200000,
            newPrice: 1850000,
        }
    ];
    
    return (
        <div className="flex-col">
            {MOCK_HOTELS.map((hotel, index) => (
                <div key={index} className="flex-1 py-1">
                    <HotelCard hotelId={hotel.hotelId} thumbnail={hotel.thumbnail} title={hotel.title}
                               totalComment={hotel.totalComment} avgRating={hotel.avgRating} address={hotel.address}
                               description={hotel.description} oldPrice={hotel.oldPrice} newPrice={hotel.newPrice} />
                </div>
            ))}
            <div className="p-5">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious href="#" text="Trang trước"/>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#">1</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#" isActive>
                                2
                            </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#">3</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext href="#" text="Trang sau"/>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    )
}