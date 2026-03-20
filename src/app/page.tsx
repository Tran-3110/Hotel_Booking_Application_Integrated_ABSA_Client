"use client"

import { imageLoader } from "@/common/utils/image-loader";
import { NavBar } from "@/components/nav-bar";
import SearchToolBar from "@/components/search/search-tool-bar";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

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
                    className="absolute z-2 flex flex-col gap-8 justify-center items-center w-full h-full transition-transform duration-75"
                    style={{
                        opacity: heroOpacity,
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
                    <SearchToolBar variant="landing" />
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
