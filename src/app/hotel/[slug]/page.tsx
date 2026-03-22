import Link from "next/link";
import HotelSlider from "@/components/hotel/hotel-slider";
import {ChevronsRight, EyeIcon, MapPin, Star} from "lucide-react";
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
import {RoomType} from "@/components/hotel/room-type";

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
                id: "VIP-101",
                name: "Phòng VIP 1 - Luxury King Suite",
                description: `
      <div class="space-y-2">
        <p><strong>Mã hạng phòng: VIP-101.</strong> Trải nghiệm đẳng cấp thượng lưu với không gian rộng 60m², nội thất gỗ óc chó và tầm nhìn panorama hướng biển.</p>
        <ul class="list-disc pl-5 text-sm text-gray-600">
          <li>Giường King Size tiêu chuẩn quốc tế.</li>
          <li>Hệ thống điều khiển ánh sáng và rèm tự động.</li>
          <li>Phòng tắm đứng và bồn tắm nằm riêng biệt.</li>
        </ul>
      </div>
    `,
                capacity: 2,
                price: 5500000,
                roomUtilities: [
                    { id: 1, name: "Điều hòa", iconCode: "air_conditioner" },
                    { id: 2, name: "Máy pha cà phê", iconCode: "coffee" },
                    { id: 3, name: "Bồn tắm Jacuzzi", iconCode: "tower" }
                ],
                roomTypeImages: [
                    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1200&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1200&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop"
                ],
                depositedPercent: 0.3
            },
            {
                id: "DLX-202",
                name: "Phòng Deluxe Twin",
                description: `
      <div class="space-y-2">
        <p><strong>Mã hạng phòng: DLX-202.</strong> Phù hợp cho khách đi công tác hoặc du lịch cặp đôi với phong cách tối giản, hiện đại và đầy đủ tiện nghi.</p>
        <ul class="list-disc pl-5 text-sm text-gray-600">
          <li>2 Giường đơn cao cấp.</li>
          <li>Bàn làm việc rộng rãi, đầy đủ ổ cắm điện.</li>
          <li>Cửa sổ lớn đón ánh sáng tự nhiên.</li>
        </ul>
      </div>
    `,
                capacity: 2,
                price: 2200000,
                roomUtilities: [
                    { id: 4, name: "Điều hòa", iconCode: "air_conditioner" },
                    { id: 5, name: "Tivi Smart 4K", iconCode: "tv" },
                    { id: 6, name: "Két sắt an toàn", iconCode: "shield" }
                ],
                roomTypeImages: [
                    "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1200&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1595571024048-45a59177f538?q=80&w=1200&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1591088398332-8a77d399e843?q=80&w=1200&auto=format&fit=crop"
                ],
                depositedPercent: 0.2
            },
            {
                id: "FAM-303",
                name: "Phòng Family Ocean View",
                description: `
      <div class="space-y-2">
        <p><strong>Mã hạng phòng: FAM-303.</strong> Không gian lý tưởng cho gia đình 4 người với diện tích lớn và khu vực sinh hoạt chung ấm cúng.</p>
        <ul class="list-disc pl-5 text-sm text-gray-600">
          <li>1 Giường đôi và 2 giường đơn.</li>
          <li>Khu vực ghế sofa thư giãn hướng biển.</li>
          <li>Trái cây tươi và nước suối miễn phí hàng ngày.</li>
        </ul>
      </div>
    `,
                capacity: 4,
                price: 4800000,
                roomUtilities: [
                    { id: 7, name: "Tủ lạnh Mini", iconCode: "refrigerator" },
                    { id: 8, name: "Ban công hướng biển", iconCode: "waves" },
                    { id: 9, name: "Bữa sáng miễn phí", iconCode: "utensils" }
                ],
                roomTypeImages: [
                    "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=1200&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1200&auto=format&fit=crop",
                    "https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=1200&auto=format&fit=crop"
                ],
                depositedPercent: 0.3
            }
        ],
        hotline: "5778908",
        viewCount: 1000,
        regulations: [
            {
                id: 1,
                name: "Nhận & Trả phòng",
                description: `
            <ul class="list-disc pl-5 space-y-1">
                <li><strong>Check-in:</strong> Sau 14:00.</li>
                <li><strong>Check-out:</strong> Trước 12:00.</li>
                <li><em>Phụ thu trả muộn:</em> 50% (đến 18:00), 100% (sau 18:00).</li>
            </ul>
        `
            },
            {
                id: 2,
                name: "Thủ tục đăng ký",
                description: `
            <p>Xuất trình <strong>CCCD/Hộ chiếu</strong> bản gốc (Khách quốc tế cần Visa/Giấy miễn thị thực hợp lệ). Trẻ em cần Giấy khai sinh.</p>
        `
            },
            {
                id: 3,
                name: "Danh mục cấm",
                description: `
            <ul class="list-disc pl-5 text-red-600 font-medium">
                <li>Vũ khí, chất cháy nổ, ma túy.</li>
                <li>Trái cây nặng mùi (Sầu riêng, mít...).</li>
                <li>Vật nuôi, thú cưng.</li>
            </ul>
        `
            },
            {
                id: 4,
                name: "Nội quy chung",
                description: `
            <ul class="list-disc pl-5">
                <li><strong>Không hút thuốc</strong> trong phòng.</li>
                <li>Giữ yên tĩnh sau 22:00.</li>
                <li>Gửi tài sản quý giá tại két sắt hoặc Lễ tân.</li>
                <li>Không tự ý di chuyển trang thiết bị phòng.</li>
            </ul>
        `
            }
        ]
    };
    
    return (
        <div className="px-0 md:px-60">
            <nav className="sticky top-0 z-10 bg-white">
                <div className="w-full border-b flex gap-6 w-full">
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
            <div className="z-90 fixed top-18 right-[15rem] w-[20rem] bg-white border rounded-lg p-6 shadow">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-500">Giá mỗi đêm từ</span>
                    <span className="text-xl font-semibold text-orange-600">3.200.000₫</span>
                </div>

                <button
                    className="flex gap-2 justify-center items-center w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-lg shadow-lg transition-all active:scale-95">
                    <ChevronsRight /> Kiểm tra phòng trống
                </button>
            </div>
            
            <div className="px-4 py-8 gap-8">
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
                    <section className="rounded-2xl overflow-hidden">
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
                                    <TableHead>Khám phá</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {hotel.roomTypes.map((r, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{r.name}</TableCell>
                                        <TableCell>{r.depositedPercent * 100} %</TableCell>
                                        <TableCell>{r.capacity}</TableCell>
                                        <TableCell><RoomType key={index} room={r}/></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </section>
                    {/* 6. Regulation */}
                    <section id="regulation" className="prose max-w-none">
                        <p className="text-lg font-semibold mb-4">Quy định chung</p>
                        <div className="border rounded-lg p-4">
                            <Table>
                                <TableBody>
                                    {hotel.regulations.map((r, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">{r.name}</TableCell>
                                            <TableCell>
                                                <div dangerouslySetInnerHTML={{__html: r.description}}></div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        <p className="italic text-sm text-gray-500 mt-4">
                            * Khách sạn có quyền từ chối phục vụ hoặc mời quý khách rời đi nếu vi phạm nghiêm trọng
                            các quy định trên mà không hoàn lại tiền phòng.
                        </p>
                    </section>
                    {/* 7. Comments*/}
                    <section id="price" className="border-t py-8">
                        <p className="text-lg font-semibold mb-2">Đánh giá</p>

                    </section>
                </div>


            </div>
        </div>
    )
}