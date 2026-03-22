'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs, FreeMode } from 'swiper/modules';
import { useState } from 'react';
import Image from 'next/image';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';

export default function HotelSlider({ images }: {images: string[]}) {
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

    return (
        <div className="relative group max-w-4xl mx-auto">
            <Swiper
                loop={true}
                spaceBetween={10}
                navigation={{
                    nextEl: '.custom-next',
                    prevEl: '.custom-prev',
                }}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[FreeMode, Navigation, Thumbs, Pagination]}
                className="rounded-lg overflow-hidden h-[400px]"
            >
                {images.map((img, index) => (
                    <SwiperSlide key={index}>
                        <Image src={img} loading={index === 0 ? "eager" : "lazy"} sizes="auto" fill className="object-cover" alt="hotel" />
                    </SwiperSlide>
                ))}

                <button className="custom-prev absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-white/50 p-2 rounded-full shadow-lg hover:bg-white/80 transition-all">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
                </button>

                <button className="custom-next absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-white/50 p-2 rounded-full shadow-lg hover:bg-white/80 transition-all">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                </button>
            </Swiper>

            <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={10}
                slidesPerView={4}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Navigation, Thumbs]}
                className="mt-2 h-20 cursor-pointer"
            >
                {images.map((img, index) => (
                    <SwiperSlide key={index} className="rounded-md overflow-hidden border-2 border-transparent">
                        <Image src={img} sizes="auto" fill className="object-cover" alt="thumb" />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}