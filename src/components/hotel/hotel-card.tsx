import Image from "next/image";
import {Badge, ChevronRight, Coffee, MapPin, Star, Wifi} from "lucide-react";
import {Button} from "@/components/ui/button";

export default function HotelCard() {
    return (
        <div className="pl-5 py-5">
            <div
                className="group relative flex flex-col md:flex-row w-full h-auto md:h-[240px] bg-white rounded-xl overflow-hidden border border-gray-200 transition-all duration-300">

                <div className="relative w-full md:w-[320px] h-[200px] md:h-full overflow-hidden">
                    <Image
                        src="https://images.unsplash.com/photo-1596871648443-4b6727284f6c?auto=format&fit=crop&q=80&w=800"
                        alt="Hotel Image"
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <Badge className="absolute top-3 left-3 bg-black/60 backdrop-blur-md border-none text-white">
                        Ưu đãi đặc biệt
                    </Badge>
                </div>

                <div className="flex flex-1 flex-col p-5">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-1 mb-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={12} fill={i < 4 ? "#facc15" : "none"}
                                          className={i < 4 ? "text-yellow-400" : "text-gray-300"}/>
                                ))}
                                <span className="text-[10px] text-gray-500 ml-1">(120 đánh giá)</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                The Myst Dong Khoi
                            </h3>
                            <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                                <MapPin size={14} className="shrink-0"/>
                                <span className="truncate">6-8 Hồ Huấn Nghiệp, Quận 1, TP. HCM</span>
                            </div>
                        </div>

                        <div className="hidden md:flex flex-col items-end">
                            <div className="flex gap-1 items-center bg-yellow-100/50 text-yellow-700 font-bold px-2 py-1 rounded-lg text-sm">
                                9.2 <Star className="h-full text-yellow-400" size={"1rem"} fill={"currentColor"} />
                            </div>
                            <span className="text-[10px] text-gray-500 mt-1 italic">Tuyệt vời</span>
                        </div>
                    </div>

                    <p className="mt-3 text-sm text-gray-600 line-clamp-3 leading-relaxed">
                        Trải nghiệm không gian nghỉ dưỡng sang trọng giữa lòng thành phố với lối kiến trúc độc bản mang
                        đậm dấu ấn Sài Gòn xưa.
                    </p>

                    {/* Giá */}
                    <div className="text-right">
                        <span className="text-xs text-gray-400 line-through">2.500.000đ</span>
                        <div className="flex-end items-baseline gap-1">
                            <span className="text-2xl font-semibold text-red-500 items-end">1.890.000</span>
                            <span className="text-xs font-semibold text-gray-500 uppercase">VND</span>
                        </div>
                        <Button size="sm" className="mt-2 bg-blue-600 hover:bg-blue-700 rounded-full px-5">
                            Xem chi tiết <ChevronRight size={14} className="ml-1"/>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}