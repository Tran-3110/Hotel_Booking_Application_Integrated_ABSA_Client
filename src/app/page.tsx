"use client"

import { HomePageStatisticResponse } from "@/common/types/home";
import { imageLoader } from "@/common/utils/image-loader";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getHomePageData } from "@/services/home-service";
import { ArrowRight, Building2, MapPin, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {transformTitleToSlug} from "@/common/utils/slug";
import {useRouter} from "next/navigation";

export default function Home() {
    const [data, setData] = useState<HomePageStatisticResponse | null>(null)
    const router = useRouter()
    useEffect(() => {
        const fetchHomeData = async () => {
            try {
                const homeData = await getHomePageData();
                setData(homeData);
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu trang chủ:", error);
            }
        }
        fetchHomeData();
    }, [])

    return (
        <div>
            
            <section className="relative w-full h-screen">
                <div className="absolute top-0 left-0 inset-0 z-1 bg-black opacity-50"></div>
                <div className="absolute top-0 left-0 inset-0 z-0">
                    <Image
                        loader={imageLoader}
                        src={"/landing-background.webp"}
                        sizes="100vw"
                        fill
                        alt="Landing image"
                        style={{ objectFit: "cover" }}
                        priority
                    />
                </div>

                <div className="absolute z-2 mt-8 flex flex-col gap-8 justify-center items-center w-full h-full">
                    <div className="space-y-3 px-4">
                        <h3 className="text-neutral-50 text-center text-4xl font-semibold">
                            Tìm chỗ nghỉ tiếp theo cho chuyến du lịch của bạn
                        </h3>
                        <p className="text-neutral-50 text-center text-xl font-light">
                            Biến mỗi chuyến đi trở thành những hành trình đáng nhớ
                        </p>
                    </div>

                    <div className="w-full max-w-6xl z-3">
                        <div className="bg-background m-6 mx-auto rounded-xl p-4 shadow-lg">
                            <div className="flex flex-col md:flex-row justify-center gap-4">
                                <div className="flex-2 space-y-2">
                                    <p className="font-semibold text-sm">Địa điểm</p>
                                    <InputGroup>
                                        <InputGroupInput placeholder="Bạn muốn đi đâu?" />
                                        <InputGroupAddon>
                                            <MapPin size={18} />
                                        </InputGroupAddon>
                                    </InputGroup>
                                </div>
                                <div className="flex-2 space-y-2">
                                    <p className="font-semibold text-sm">Mức giá</p>
                                    <div className="flex gap-2 items-center">
                                        <Input placeholder="Từ" type="number" />
                                        <div className="w-3 bg-foreground h-px"></div>
                                        <Input placeholder="Đến" type="number" />
                                    </div>
                                </div>
                                <div className="flex-1 space-y-2">
                                    <p className="font-semibold text-sm">Đánh giá</p>
                                    <Select>
                                        <SelectTrigger className="w-full h-10">
                                            <div className="flex items-center gap-2">
                                                <Star className="h-4 w-4 text-muted-foreground" />
                                                <SelectValue placeholder="Mọi mức" />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Đánh giá</SelectLabel>
                                                <SelectItem value="all">Mọi mức đánh giá</SelectItem>
                                                <SelectItem value="5">5 Sao (Xuất sắc)</SelectItem>
                                                <SelectItem value="4">Từ 4 Sao trở lên</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex items-end">
                                    <Button
                                        variant={"default"}
                                        className="px-6 py-5 cursor-pointer bg-indigo-700 hover:bg-indigo-800 text-white w-full md:w-auto"
                                    >
                                        Tìm kiếm
                                        <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-6 py-12">
                <div className="w-full space-y-6">
                    <div>
                        <h3 className="font-semibold text-2xl">Điểm đến đang thịnh hành</h3>
                        <p className="text-muted-foreground">Các lựa chọn phổ biến nhất cho du khách tại Việt Nam</p>
                    </div>
                    <div className="flex gap-4 justify-center items-stretch overflow-x-auto pb-4">
                        {data?.provinceStatistics?.slice(0, 5).map(province => (
                            <div key={province.name} className="flex-1 min-w-50 space-y-3 cursor-pointer group">
                                <div className="relative w-full aspect-4/5 rounded-2xl overflow-hidden shadow-sm">
                                    <Image
                                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                                        src={province.thumbnail}
                                        alt={province.name}
                                        fill
                                        unoptimized={true}
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300"></div>
                                </div>
                                <div>
                                    <p className="text-center text-lg font-semibold">{province.name}</p>
                                    <p className="text-center text-sm text-muted-foreground">{province.hotelCount} chỗ ở</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-6 py-8">
                <div className="w-full space-y-6">
                    <div>
                        <h3 className="font-semibold text-2xl">Khám phá Việt Nam</h3>
                        <p className="text-muted-foreground">Những chỗ nghỉ nổi bật không thể bỏ lỡ cho kỳ nghỉ của bạn</p>
                    </div>
                    {/* Chuyển sang Grid 5 cột chằn chặn giống mục Khách sạn nổi bật */}
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-stretch">
                        {data && data.exploreHotels && data.exploreHotels.map(hotel => (
                            <Link
                                href={`/hotel/${transformTitleToSlug(hotel.name)}.${hotel.id}`}
                                key={hotel.id}
                                className="flex flex-col relative w-full pt-0 overflow-hidden cursor-pointer border rounded-xl bg-card text-card-foreground shadow transition-all hover:shadow-lg hover:-translate-y-1"
                            >
                                {/* Ảnh tỉ lệ 4:3 đồng bộ hoàn toàn */}
                                <div className="relative w-full aspect-4/3 shrink-0">
                                    <Image
                                        className="object-cover"
                                        src={hotel.thumbnail}
                                        alt={hotel.name}
                                        fill
                                        unoptimized={true}
                                    />
                                </div>

                                <CardHeader className="flex-1 p-4 flex flex-col justify-between">
                                    <div className="space-y-2">
                                        <CardTitle className="text-base leading-tight line-clamp-2" title={hotel.name}>
                                            {hotel.name}
                                        </CardTitle>
                                        <CardDescription className="flex items-start gap-1 text-xs mt-auto">
                                            <MapPin size={14} className="shrink-0 mt-0.5" />
                                            <span className="line-clamp-1">{hotel.province}</span>
                                        </CardDescription>
                                    </div>
                                </CardHeader>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
            <section className="max-w-7xl mx-auto px-6 py-12">
                <div className="w-full space-y-6">
                    <div>
                        <h3 className="font-semibold text-2xl">Khách sạn nổi bật</h3>
                        <p className="text-muted-foreground">Những chỗ nghỉ được đánh giá cao nhất với ưu đãi tốt</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-stretch">
                        {data?.promotionalHotels?.slice(0, 5).map(hotel => (
                            <Card key={hotel.id}
                                  onClick={() => router.push(`/hotel/${transformTitleToSlug(hotel.name)}.${hotel.id}`)}
                                  className="flex flex-col relative w-full pt-0 overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1">
                                <div className="relative w-full aspect-4/3 shrink-0">
                                    <Image
                                        className="object-cover"
                                        src={hotel.thumbnail}
                                        alt={hotel.name}
                                        fill
                                        unoptimized={true}
                                    />
                                </div>
                                <CardHeader className="flex-1 p-4">
                                    <CardAction className="space-y-1">
                                        <Badge className="bg-yellow-500 hover:bg-yellow-600 mb-2">
                                            {(Math.round(hotel.rating * 10) / 10).toFixed(1)}
                                            <Star fill="white" className="w-3 h-3 ml-1" />
                                        </Badge>
                                        <p className="text-xs text-muted-foreground">
                                            {hotel.rating >= 4.5 ? "Tuyệt hảo" : "Rất tốt"}
                                        </p>
                                    </CardAction>
                                    <CardTitle className="text-base leading-tight line-clamp-2 mt-2" title={hotel.name}>
                                        {hotel.name}
                                    </CardTitle>
                                    <CardDescription className="flex items-start gap-1 mt-2 text-xs">
                                        <MapPin size={14} className="shrink-0 mt-0.5" />
                                        <span className="line-clamp-2">{hotel.province}</span>
                                    </CardDescription>
                                </CardHeader>
                                <CardFooter className="flex flex-col items-end justify-end gap-1 bg-slate-50 border-t p-4">
                                    {hotel.originalPrice > hotel.promotionalPrice && (
                                        <p className="text-end text-red-500 line-through text-xs">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(hotel.originalPrice)}
                                        </p>
                                    )}
                                    <p className="text-end font-semibold text-base text-indigo-700">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(hotel.promotionalPrice)}
                                    </p>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            <section className="max-w-6xl mx-auto px-6 py-16 my-16 bg-indigo-50 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8 border border-indigo-100 shadow-sm">
                <div className="space-y-5 max-w-2xl px-4 md:px-8">
                    <h3 className="font-bold text-3xl text-indigo-950">
                        Đăng ký chỗ nghỉ của bạn trên HomeBook
                    </h3>
                    <p className="text-lg text-indigo-800">
                        Tiếp cận hàng triệu khách du lịch nội địa và quốc tế. Trở thành đối tác của chúng tôi ngay hôm nay để quản lý đặt phòng dễ dàng và tăng doanh thu cho khách sạn của bạn.
                    </p>
                    <Link href="/partner/register" className="inline-block mt-4">
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-6 text-lg font-semibold shadow-md transition-all hover:shadow-lg">
                            Trở thành đối tác
                        </Button>
                    </Link>
                </div>
                <div className="hidden md:flex items-center justify-center p-8 bg-indigo-200/50 rounded-full mr-12 shrink-0">
                    <Building2 className="w-32 h-32 text-indigo-600" strokeWidth={1.5} />
                </div>
            </section>

            <Footer />
        </div>
    );
}