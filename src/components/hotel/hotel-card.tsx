import Image from "next/image";
import {ChevronRight, MapPin, Star} from "lucide-react";
import {Button} from "@/components/ui/button";
import {transformTitleToSlug} from "@/common/utils/slug";
import Link from "next/link";

export default function HotelCard(props: {
    hotelId: string, thumbnail: string, title: string, totalComment: number, avgRating: number, 
    address: string, description: string, oldPrice: number, newPrice: number 
}) {
    return (
        <Link href={`/hotel/${transformTitleToSlug(props.title)}.${props.hotelId}`}
            className="hover:shadow group relative flex flex-col md:flex-row w-full h-auto md:h-[240px] bg-white rounded-xl overflow-hidden border border-gray-200 transition-all duration-300"
        >

            <div className="relative w-full md:w-[320px] h-[200px] md:h-full overflow-hidden">
                <Image
                    src={props.thumbnail}
                    sizes="100wv"
                    alt="Hotel Image"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
            </div>

            <div className="flex flex-1 flex-col p-5">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-1 mb-1">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={12} fill={i < props.avgRating ? "#facc15" : "none"}
                                      className={i < props.avgRating ? "text-yellow-400" : "text-gray-300"}/>
                            ))}
                            <span className="text-[10px] text-gray-500 ml-1">({props.totalComment} đánh giá)</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {props.title}
                        </h3>
                        <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                            <MapPin size={14} className="shrink-0"/>
                            <span className="truncate">{props.address}</span>
                        </div>
                    </div>

                    <div className="hidden md:flex flex-col items-end">
                        <div
                            className="flex gap-1 items-center bg-yellow-100/50 text-yellow-700 font-bold px-2 py-1 rounded-lg text-sm">
                            {props.avgRating} <Star className="h-full text-yellow-400" size={"1rem"}
                                                    fill={"currentColor"}/>
                        </div>
                        <span className="text-[10px] text-gray-500 mt-1 italic">{props.avgRating >= 4 ? "Tuyệt vời" :
                            props.avgRating < 4 && props.avgRating >= 3 ? "Khá tốt" : "Tệ"}</span>
                    </div>
                </div>

                <p className="mt-3 text-sm text-gray-600 line-clamp-3 leading-relaxed">
                    {props.description}
                </p>

                {/* Giá */}
                <div className="text-right">
                    <span
                        className="text-xs text-gray-400 line-through">{props.oldPrice.toLocaleString("vi-VN")}đ</span>
                    <div className="flex-end items-baseline gap-1">
                        <span
                            className="text-2xl font-semibold text-red-500 items-end mr-1">{props.newPrice.toLocaleString("vi-VN")}</span>
                        <span className="text-xs font-semibold text-gray-500 uppercase">VND</span>
                    </div>
                    <Button size="sm" className="mt-2 bg-blue-600 hover:bg-blue-700 rounded-full px-5 py-4">
                        Xem chi tiết <ChevronRight size={14} className="ml-1"/>
                    </Button>
                </div>
            </div>
        </Link>
    );
}