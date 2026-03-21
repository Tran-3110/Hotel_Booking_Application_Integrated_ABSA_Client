"use client"

import { imageLoader } from "@/common/utils/image-loader";
import { NavBar } from "@/components/nav-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { ArrowRight, MapPin, Search, Star } from "lucide-react";
import Image from "next/image";

export default function Home() {

    const heroOpacity = Math.max(1 - scrollY / 250, 0);
    const isHeroHidden = heroOpacity === 0;

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
                        transform: `translateY(${scrollY * 0.4}px)`,
                        pointerEvents: isHeroHidden ? "none" : "auto"
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
                                        className="px-4 py-5 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg dark:bg-white dark:text-black dark:hover:bg-white/90"
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
            <section>
                <div className="relative h-screen w-full">
                </div>
            </section>
        </div>
    );
}
