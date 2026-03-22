import Link from "next/link";
import HotelSlider from "@/components/hotel/hotel-slider";
import {EyeIcon, MapPin, Star} from "lucide-react";
import IconHotelUtility from "@/components/icon-render/icon-hotel-utility";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export default async function HotelDetail({params} : {params: Promise<{slug: string}>}) {
    // Structure: slug.id
    const {slug} = await params;
    const hotelId = slug.slice(slug.lastIndexOf(".")+1)
    console.log("Id", hotelId);
    
    const navItems = [
        { name: 'Tổng quan', href: '#overview' },
        { name: 'Tiện Nghi', href: '#utilities' },
        { name: 'Giá cả và phòng', href: '#price' },
        { name: 'Quy định chung', href: '#regulation' },
        { name: 'Đánh giá', href: '#rating' },
    ];

    const hotel = {
        id: "lumiere-123",
        name: "The Lumiere Saigon",
        avgRating: 5,
        countComments: 23,
        address: "259 Đ. Lê Thánh Tôn, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh",
        price: 3500000,
        description: `Tọa lạc tại vị trí "vàng" ngay trung tâm Quận 1, The Lumiere Saigon Central mang đến không gian nghỉ dưỡng thượng lưu pha trộn giữa nét kiến trúc Đông Dương quyến rũ và hơi thở hiện đại. 

Khách sạn sở hữu hệ thống phòng nghỉ cao cấp với tầm nhìn bao trọn biểu tượng thành phố. Tại đây, bạn có thể thư giãn tại hồ bơi vô cực tầng thượng, thưởng thức ẩm thực tinh hoa tại nhà hàng Michelin-selected hoặc tái tạo năng lượng tại trung tâm Spa quốc tế.`,
        utilities: [
            {
                id: "123",
                iconCode: "wifi",
                name: "WiFi miễn phí"
            },
            {
                id: "124",
                iconCode: "pool",
                name: "Bể bơi miễn phí"
            },
            {
                id: "123",
                iconCode: "view",
                name: "Hướng nhìn ra biến"
            },
        ],
        // Link ảnh Unsplash theo chủ đề khách sạn
        images: [
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200", // Toàn cảnh sang trọng
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1000", // Phòng ngủ Suite
            "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1000", // Hồ bơi vô cực
            "https://images.unsplash.com/photo-1544124499-58912cbddaad?q=80&w=1000", // Nhà hàng
            "https://images.unsplash.com/photo-1560624052-449f5ddf0c31?q=80&w=1000", // Lobby/Sảnh
            "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1000", // View thành phố
        ],
        roomTypes: [
            {
                id: "12332",
                name: "Phòng VIP 1",
                description: "",
                capacity: 2,
                price: 22323232,
                roomUtilities: {
                    id: 1223,
                    name: "Giường đôi",
                    iconCode: "bed"
                },
                roomTypeImages: [
                    {
                        id: 1212,
                        url: ""
                    }
                ],
                depositedPercent: 0.3
            }
        ],
        hotline: "5778908",
        viewCount: 1000,
        regulation: [
            {
                id: 1,
                name: "Thời gian Nhận & Trả phòng",
                description: `
            <p>Để đảm bảo công tác chuẩn bị phòng ốc chu đáo nhất, quý khách vui lòng lưu ý các mốc thời gian sau:</p>
            <ul class="list-disc pl-5 mt-2">
                <li><strong>Giờ nhận phòng (Check-in):</strong> Từ 14:00 hàng ngày.</li>
                <li><strong>Giờ trả phòng (Check-out):</strong> Trước 12:00 trưa hàng ngày.</li>
                <li><em>Phụ phí:</em> Trả phòng muộn từ 12:00 - 18:00 tính 50% tiền phòng; sau 18:00 tính 100% tiền phòng (tùy thuộc vào tình trạng phòng trống).</li>
            </ul>
        `
            },
            {
                id: 2,
                name: "Giấy tờ tùy thân & Đăng ký",
                description: `
            <p>Theo quy định của pháp luật hiện hành về lưu trú:</p>
            <ul class="list-disc pl-5 mt-2">
                <li>Khách nội địa vui lòng xuất trình <strong>CCCD/CMND</strong> hoặc Hộ chiếu bản gốc còn hạn.</li>
                <li>Khách quốc tế vui lòng xuất trình <strong>Hộ chiếu và Visa</strong> (hoặc giấy miễn thị thực) hợp lệ.</li>
                <li>Trẻ em cần có Giấy khai sinh bản sao hoặc bản chính nếu không đi cùng bố mẹ có tên trong hộ khẩu.</li>
            </ul>
        `
            },
            {
                id: 3,
                name: "Danh mục hàng cấm & Hạn chế",
                description: `
            <div class="bg-red-50 p-3 border-l-4 border-red-500">
                <p class="font-semibold text-red-700">Tuyệt đối không mang các vật dụng sau vào khuôn viên khách sạn:</p>
                <ul class="list-disc pl-5 mt-1 text-red-600">
                    <li>Vũ khí, chất nổ, chất dễ cháy hoặc các loại hóa chất độc hại.</li>
                    <li>Chất gây nghiện, ma túy và các chất cấm khác theo quy định của pháp luật.</li>
                    <li>Các loại trái cây có mùi nồng (sầu riêng, mít...) hoặc thực phẩm nặng mùi trong phòng ngủ.</li>
                    <li>Vật nuôi hoặc thú cưng (trừ khi có sự thỏa thuận và đồng ý bằng văn bản từ Ban quản lý).</li>
                </ul>
            </div>
        `
            },
            {
                id: 4,
                name: "An toàn & Nội quy chung",
                description: `
            <ul class="list-decimal pl-5 space-y-2">
                <li><strong>Hút thuốc:</strong> Nghiêm cấm hút thuốc trong phòng ngủ. Quý khách vui lòng sử dụng khu vực ban công hoặc khu vực hút thuốc công cộng được chỉ định.</li>
                <li><strong>Trật tự:</strong> Giữ yên tĩnh, không gây ồn ào hoặc tổ chức đánh bạc, các hoạt động trái pháp luật trong phòng.</li>
                <li><strong>Tài sản:</strong> Vui lòng gửi đồ vật có giá trị cao tại két sắt an toàn trong phòng hoặc ký gửi tại quầy lễ tân.</li>
                <li><strong>Vệ sinh:</strong> Không tự ý di chuyển đồ đạc hoặc mang trang thiết bị của khách sạn ra khỏi phòng khi chưa được phép.</li>
            </ul>
        `
            }
        ]
    };
    
    return (
        <div className="px-50">
            <nav className="sticky top-0 z-10 bg-white">
                <div className="w-full max-w-5xl border-b flex gap-6 w-full">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            scroll={true}
                            className="text-center flex-1 py-4 text-sm font-medium text-gray-600 hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 transition-all"
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>
            </nav>
            <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-10">

                    {/* 1. Header & Breadcrumb */}
                    <section id="overview">
                        <p className="text-sm content-center text-gray-600 flex gap-2"><EyeIcon/>
                            <strong>{hotel.viewCount}</strong> người xem khách sạn</p>
                        <div className="flex items-center gap-5 text-3xl font-semibold text-gray-900">{hotel.name}
                            <div>
                                <span
                                    className="flex gap-1 items-center bg-yellow-100/50 text-yellow-700 font-bold px-2 py-1 rounded-lg text-sm">
                                {hotel.avgRating} <Star className="h-full text-yellow-400" size={"1rem"}
                                                        fill={"currentColor"}/>
                            </span>
                            </div>

                        </div>
                        <p className="text-sm text-gray-600 mt-3 flex gap-2"><MapPin
                            className="text-red-700"/> {hotel.address}</p>
                    </section>
                    {/* 2. Hotel Slider*/}
                    <section className="rounded-2xl overflow-hidden shadow-lg">
                        <HotelSlider images={hotel.images}/>
                    </section>
                    {/* 3. Hotel Utilities */}
                    <section id="utilities" className="flex gap-3 flex-wrap border-y py-8">
                        {hotel.utilities.map((item, index) => (
                            <div key={index} className="border px-3 py-4 rounded-lg flex items-center gap-3">
                                <IconHotelUtility iconCode={item.iconCode}/>
                                <span className="text-sm">{item.name}</span>
                            </div>
                        ))}
                    </section>
                    {/* 4. Description */}
                    <section className="prose max-w-none">
                        <p className="text-lg font-semibold mb-2">Giới thiệu</p>
                        <p className="text-gray-700 leading-relaxed">
                            {hotel.description}
                        </p>
                    </section>
                    {/* 5. Room & Price */}
                    <section id="price" className="border-y py-8">
                        <p className="text-lg font-semibold mb-2">Giá cả và Phòng</p>
                        <Table>
                            <TableCaption>Danh sách các loại phòng.</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Loại phòng</TableHead>
                                    <TableHead>Thanh toán trước</TableHead>
                                    <TableHead>Số lượng khách</TableHead>
                                    <TableHead className="text-right">Khám phá</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {hotel.roomTypes.map((r, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{r.name}</TableCell>
                                        <TableCell>{r.depositedPercent * 100} %</TableCell>
                                        <TableCell>{r.capacity}</TableCell>
                                        <TableCell className="text-right">Xem chi tiết</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </section>
                    {/* 6. Regulation */}
                    <section id="regulation" className="prose max-w-none">
                        <p className="text-lg font-semibold mb-2">Quy định chung</p>
                        <div className="text-gray-700 leading-relaxed">
                            {hotel.regulation.map((item, index) => (
                                <div key={index} className="mb-4">
                                    <h3 className="font-semibold text-blue-800 mb-1">{index+1}. {item.name}</h3>
                                    <div
                                        className="text-gray-700"
                                        dangerouslySetInnerHTML={{ __html: item.description }}
                                    />
                                </div>
                            ))}

                            <p className="italic text-sm text-gray-500 mt-4">
                                * Khách sạn có quyền từ chối phục vụ hoặc mời quý khách rời đi nếu vi phạm nghiêm trọng
                                các quy định trên mà không hoàn lại tiền phòng.
                            </p>
                        </div>
                    </section>
                    {/* 7. Comments*/}
                    <section id="price" className="border-t py-8">
                        <p className="text-lg font-semibold mb-2">Đánh giá</p>

                    </section>
                </div>

                {/* CỘT PHẢI: BOX ĐẶT PHÒNG (STICKY) */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 bg-white border rounded-2xl p-6 shadow-xl space-y-6">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500">Giá mỗi đêm từ</span>
                            <span className="text-3xl font-black text-orange-600">3.200.000₫</span>
                        </div>

                        <button
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95">
                            Kiểm tra phòng trống
                        </button>

                        <ul className="text-sm text-gray-500 space-y-2 border-t pt-4">
                            <li className="flex items-center gap-2">✅ Hủy miễn phí trước 24h</li>
                            <li className="flex items-center gap-2">✅ Không cần thanh toán ngay</li>
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    )
}