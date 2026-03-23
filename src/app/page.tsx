"use client"

import { imageLoader } from "@/common/utils/image-loader";
import { NavBar } from "@/components/nav-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldSeparator } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, MapPin, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {

    // const heroOpacity = Math.max(1 - scrollY / 250, 0);
    // const isHeroHidden = heroOpacity === 0;

    return (
        <div>
            <NavBar />
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
                    />
                </div>

                <div
                    className="absolute z-2 mt-8 flex flex-col gap-8 justify-center items-center w-full h-full"
                    style={{
                        // opacity: heroOpacity,
                        // transform: `translateY(${scrollY * 0.4}px)`,
                        // pointerEvents: isHeroHidden ? "none" : "auto"
                    }}
                >
                    <div className="space-y-3">
                        <h3 className="text-neutral-50 text-4xl font-semibold">
                            Tìm chỗ nghỉ tiếp theo cho chuyến du lịch của bạn
                        </h3>
                        <p className="text-neutral-50 text-center text-xl font-light">
                            Biến mỗi chuyến đi trở thành những hành trình đáng nhớ
                        </p>
                    </div>

                    <div className=" w-full z-3">
                        <div className=" bg-background m-6 mx-16 rounded-xl p-4 space-y-4">
                            <div className="flex justify-center gap-4">
                                <div className="flex-2 space-y-2">
                                    <p className="font-semibold">Địa điểm</p>
                                    <InputGroup>
                                        <InputGroupInput placeholder="Bạn muốn đi đâu?" />
                                        <InputGroupAddon>
                                            <MapPin />
                                        </InputGroupAddon>
                                    </InputGroup>
                                </div>
                                <div className="flex-2 space-y-2">
                                    <p className="font-semibold">Mức giá</p>
                                    <div className="flex gap-4 items-center">
                                        <Input placeholder="Từ" type="number" />
                                        <div className="w-4 bg-foreground h-px"></div>
                                        <Input placeholder="Đến" type="number" />
                                    </div>
                                </div>
                                <div className="flex-1 space-y-2">
                                    <p className="font-semibold">Đánh giá</p>
                                    <Select>
                                        <SelectTrigger className="w-full h-10">
                                            <div className="flex items-center gap-2">
                                                <Star className="h-4 w-4 text-muted-foreground" />
                                                <SelectValue placeholder="Mọi mức đánh giá" />
                                            </div>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Đánh giá</SelectLabel>
                                                <SelectItem value="all">Mọi mức đánh giá</SelectItem>
                                                <SelectItem value="5">5 Sao (Xuất sắc)</SelectItem>
                                                <SelectItem value="4">Từ 4 Sao trở lên (Rất tốt)</SelectItem>
                                                <SelectItem value="3">Từ 3 Sao trở lên (Tốt)</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex items-end">
                                    <Button
                                        variant={"default"}
                                        className="px-4 py-5 cursor-pointer bg-indigo-700 hover:bg-indigo-800 text-white"
                                    >
                                        Tìm kiếm
                                        <ArrowRight />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Detail section */}
            <section className="px-12 py-8">
                <div className="w-full space-y-4">
                    <div>
                        <h3 className="font-semibold text-2xl">
                            Điểm đến đang thịnh hành
                        </h3>
                        <p className="text-muted-foreground">
                            Các lựa chọn phổ biến nhất cho du khách tại Việt Nam
                        </p>
                    </div>
                    <div className="flex gap-4 justify-center h-50">
                        {
                            ["TP.Hồ Chí Minh", "Hà Nội", "Đà Lạt", "Hội An", "Vũng Tàu"].map((ele, index) => (
                                <div key={index} className="flex-1 space-y-2">
                                    {/* Temporary image, prototype only */}
                                    <div className="relative w-full h-full">
                                        <Image
                                            className="object-cover rounded-2xl"
                                            src={"https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                                            alt="Background"
                                            fill
                                        />
                                    </div>
                                    <div>
                                        <p className="text-center text-lg font-semibold">{ele}</p>
                                        <p className="text-center text-sm text-muted-foreground">500 chỗ ở</p>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </section>
            <section className="px-12 py-8 my-12">
                <div className="w-full space-y-4">
                    <div>
                        <h3 className="font-semibold text-2xl">
                            Điểm đến đề xuất
                        </h3>
                        <p className="text-muted-foreground">
                            Các điểm đến đề xuất tại TP.Hồ Chí Minh
                        </p>
                    </div>
                    <div className="flex gap-4 justify-center h-50">
                        {
                            ["TP.Hồ Chí Minh", "Hà Nội", "Đà Lạt", "Hội An", "Vũng Tàu"].map((ele, index) => (
                                <div key={index} className="flex-1 space-y-2">
                                    {/* Temporary image, prototype only */}
                                    <div className="relative w-full h-full">
                                        <Image
                                            className="object-cover rounded-2xl"
                                            src={"https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                                            alt="Background"
                                            fill
                                        />
                                    </div>
                                    <div>
                                        <p className="text-center text-lg font-semibold">{ele}</p>
                                        <p className="text-center text-sm text-muted-foreground">500 chỗ ở</p>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </section>
            <section className="px-12 pt-8 ">
                <div className="w-full space-y-4">
                    <div>
                        <h3 className="font-semibold text-2xl">
                            Địa điểm khuyến mãi hàng đầu
                        </h3>
                        <p className="text-muted-foreground">
                            Các điểm đến đề xuất tại TP.Hồ Chí Minh
                        </p>
                    </div>
                    <div className="flex gap-4 justify-center h-50">
                        {
                            ["TP.Hồ Chí Minh", "Hà Nội", "Đà Lạt", "Hội An", "Vũng Tàu"].map((ele, index) => (

                                <Card key={index} className="flex-1 relative mx-auto w-full pt-0 h-fit">
                                    {/* Temporary image, prototype only */}
                                    <div className="relative w-full h-full aspect-video">
                                        <Image
                                            className="object-cover rounded-tr-2xl rounded-tl-2xl"
                                            src={"https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                                            alt="Background"
                                            fill
                                        />
                                    </div>
                                    <CardHeader>
                                        <CardAction className="space-y-1">
                                            <Badge className="bg-yellow-500">
                                                4.5
                                                <Star fill="white" />
                                            </Badge>
                                            <p className="text-xs text-muted-foreground">Xuất sắc</p>
                                        </CardAction>
                                        <CardTitle>
                                            Lorem ipsum dolor
                                        </CardTitle>
                                        <CardDescription className="flex items-center gap-1">
                                            <MapPin size={"1rem"} />
                                            {ele}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardFooter className="flex justify-end gap-2 bg-background border-0">
                                        <p className="text-end text-red-500 line-through text-xs">4.000.000 VNĐ</p>
                                        <p className="text-end font-semibold text-lg">3.000.000 VNĐ</p>
                                    </CardFooter>
                                </Card>

                                // <div key={index} className="flex-1 space-y-2">


                                //     <div>
                                //         <p className="text-center text-lg font-semibold">{ele}</p>
                                //         <p className="text-center text-sm text-muted-foreground">500 chỗ ở</p>
                                //     </div>
                                // </div>
                            ))
                        }
                    </div>
                </div>
            </section>
            <footer className="relative w-full mt-40 bg-muted">
                <div className="flex gap-4 px-12 py-3">
                    <div className="flex-1 space-y-3">
                        <h4 className="font-semibold">
                            Hỗ trợ
                        </h4>
                        <div>
                            <p className="my-1"><Link className="text-sm hover:text-muted-foreground" href={"/security-center"}>Trung tâm thông tin bảo mật</Link></p>
                        </div>
                    </div>
                    <div className="flex-1 space-y-3">
                        <h4 className="font-semibold">
                            Điều khoản và chính sách
                        </h4>
                        <div>
                            <Link className="text-sm hover:text-muted-foreground" href={"/privacy-policy"}><p className="my-1">Chính sách bảo mật</p></Link>
                            <Link className="text-sm hover:text-muted-foreground" href={"/term-of-service"}><p className="my-1">Điều khoản dịch vụ</p></Link>
                            <Link className="text-sm hover:text-muted-foreground" href={"/accessibility-statement"}><p className="my-1">Chính sách về Khả năng tiếp cận</p></Link>
                        </div>
                    </div>
                    <div className="flex-1 space-y-3">
                        <h4 className="font-semibold">
                            Về chúng tôi
                        </h4>
                        <div>
                            <Link className="text-sm hover:text-muted-foreground" href={"/about-us"}><p className="my-1">Về HomeBook</p></Link>
                            <Link className="text-sm hover:text-muted-foreground" href={"/contact-us"}><p className="my-1">Liên hệ chúng tôi</p></Link>
                        </div>
                    </div>
                </div>
                <FieldSeparator />
                <div className="flex justify-center p-4">
                    <div className="space-y-1">
                        <p className="text-xs text-muted-foreground text-center">&copy; 2026 HomeBook. Bảo lưu mọi quyền</p>
                        <p className="text-xs text-muted-foreground text-center">Địa chỉ: Khu phố 33, phường Linh Trung, Thủ Đức, TP.HCM</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
