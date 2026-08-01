import Link from "next/link";
import HotelSlider from "@/components/hotel/hotel-slider";
import { EyeIcon, MapPin, Star } from "lucide-react";
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
import { RoomType } from "@/components/hotel/room-type";
import { hotelService } from "@/services/hotel-service";
import { notFound } from "next/navigation";
import CheckRoomBox from "@/components/hotel/check-room-box";
import { commentService } from "@/services/comment-service";
import CommentSection from "@/components/hotel/comment-section";

const navItems = [
    { name: 'Tổng quan', href: '#overview' },
    { name: 'Tiện Nghi', href: '#utilities' },
    { name: 'Giá cả và phòng', href: '#price' },
    { name: 'Quy định chung', href: '#regulation' },
    { name: 'Đánh giá', href: '#rating' },
];

export default async function HotelDetail({
    params,
}: {
    params: Promise<{ slug: string }>;
    // searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { slug } = await params;
    const lastDotIndex = slug.lastIndexOf(".");
    if (lastDotIndex === -1) return notFound();
    const hotelId = slug.slice(lastDotIndex + 1);

    let hotel = null;
    let commentPage = null;
    try {
        [hotel, commentPage] = await Promise.all([
            hotelService.getHotelById(hotelId),
            commentService.getCommentByHotel(hotelId, 0, 5)
        ]);
    } catch (error) {
        console.log("ERROR", error)
        return notFound();
    }

    if (!hotel) return notFound();

    if (!hotel) {
        return notFound();
    }

    return (
        <div className="px-0 md:px-60">
            <nav className="sticky top-18 z-10 bg-white">
                <div className="w-full border-b flex gap-6">
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

            <div className="pt-30 px-4 py-8 gap-8">
                <div className="lg:col-span-2 space-y-10">

                    {/* 1. Header & Breadcrumb */}
                    <section id="overview">
                        <p className="text-sm content-center text-gray-600 flex gap-2"><EyeIcon />
                            <strong>{hotel.viewCount}</strong> người xem khách sạn</p>
                        <div className="flex items-center max-w-2xl gap-5 text-3xl font-semibold text-gray-900">{hotel.name}
                            <div>
                                <span
                                    className="flex gap-1 items-center bg-yellow-100/50 text-yellow-700 font-bold px-2 py-1 rounded-lg text-sm">
                                    {hotel.avgRating} <Star className="h-full text-yellow-400" size={"1rem"}
                                        fill={"currentColor"} />
                                </span>
                            </div>

                        </div>
                        <p className="text-sm text-gray-600 mt-3 flex gap-2"><MapPin
                            className="text-red-700" /> {hotel.address.street}, {hotel.address.ward}, {hotel.address.province}
                        </p>
                        <div className="absolute w-70 top-36 right-60">
                            <CheckRoomBox checkPage={"hotel"} id={hotelId} viewCount={hotel.viewCount}
                                title={hotel.name} thumbnail={hotel.thumbnail}
                                address={hotel.address.street + ", " + hotel.address.ward + ", " + hotel.address.province}
                                avgRating={hotel.avgRating} />
                        </div>
                    </section>

                    {/* 2. Hotel Slider*/}
                    <section className="rounded-2xl overflow-hidden">
                        <HotelSlider images={hotel.images} />
                    </section>

                    {/* 3. Hotel Utilities */}
                    <section id="utilities" className="flex gap-3 flex-wrap border-y py-8">
                        {hotel.hotelUtilities.map((item, index) => (
                            <div key={index} className="border px-3 py-4 rounded-lg flex items-center gap-3">
                                <IconHotelUtility iconCode={item.iconCode} />
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
                                    <TableHead>Giá phòng (VND)</TableHead>
                                    <TableHead>Số lượng khách</TableHead>
                                    <TableHead>Khám phá</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {hotel.roomTypes.map((r, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{r.name}</TableCell>
                                        <TableCell>{r.price.toLocaleString("vi-VN")}₫/đêm</TableCell>
                                        <TableCell>{r.capacity}</TableCell>
                                        <TableCell><RoomType key={index} room={r} /></TableCell>
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
                                    {hotel.hotelRegulations.map((r, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">{r.name}</TableCell>
                                            <TableCell>
                                                <div dangerouslySetInnerHTML={{ __html: r.description }}></div>
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

                    {/* 7. Comments */}
                    <section id="rating" className="border-t py-8">
                        <CommentSection hotelId={hotelId} initialData={commentPage} />
                    </section>
                </div>
            </div>
        </div>
    )
}