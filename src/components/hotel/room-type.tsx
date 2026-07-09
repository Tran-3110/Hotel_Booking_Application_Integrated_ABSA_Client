'use client'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Users, BedDouble, ScrollText, Info} from "lucide-react"
import HotelSlider from "@/components/hotel/hotel-slider";
import IconRoomUtility from "@/components/icon-render/icon-room-utility";
import {RoomTypeResponse} from "@/common/types/hotel";

export function RoomType({ room }: { room: RoomTypeResponse }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full">Xem chi tiết</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[700px] z-100 lg:max-w-[1020px] max-h-[93vh] overflow-x-hidden overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl font-semibold text-blue-950">
                        <BedDouble /> {room.name}</DialogTitle>
                </DialogHeader>

                <div className="space-y-8">
                    <div className="-mx-6 -mt-2 relative">
                        {room.roomTypeImages && room.roomTypeImages.length > 0 ? (
                            <div className="w-full h-64 sm:h-145">
                                <HotelSlider images={room.roomTypeImages} />
                            </div>
                        ) : (
                            <div className="w-full h-64 bg-gray-100 flex items-center justify-center text-gray-400">
                                No images available
                            </div>
                        )}
                        <div className="absolute top-4 right-10 z-50">
                            <div className="bg-white px-4 py-1.5 border border-2 rounded-full font-semibold shadow-xl">
                                <span
                                    className="text-xs text-gray-400 font-normal line-through mr-2">{room.price.toLocaleString("vi-VN")}đ</span>
                                {room.price.toLocaleString("vi-VN")}₫/đêm
                             </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-gray-50 p-5 rounded-xl border">
                        <div className="flex items-center gap-3.5">
                            <div className="p-3 bg-white rounded-full text-indigo-500 shadow-sm">
                                <Users className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 font-semibold uppercase">Số lượng khách</p>
                                <p className="text-base font-semibold text-gray-900">{room.capacity} người lớn</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <h4 className="flex gap-2 items-center font-semibold text-lg text-blue-950"><ScrollText />Tiện nghi nổi bật</h4>
                        </div>
                        <div id="utilities" className="flex gap-3 flex-wrap border-y py-8">
                            {room.roomUtilities.map((item, index) => (
                                <div key={index} className="border px-3 py-4 rounded-lg flex items-center gap-3">
                                    <IconRoomUtility iconCode={item.iconCode}/>
                                    <span className="text-sm">{item.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <DialogDescription>
                        <span className="flex gap-2 items-center font-semibold text-lg text-blue-950 mb-3"><Info />Mô tả chi tiết</span>
                        <span
                            className="text-sm text-gray-600 prose prose-sm max-w-none leading-relaxed"
                            dangerouslySetInnerHTML={{__html: room.description}}
                        />
                    </DialogDescription>
                </div>

                <DialogFooter className="sticky bottom-0 z-120 bg-white pt-4 border-t mt-4">
                    <DialogClose asChild>
                        <Button variant="ghost">Đóng</Button>
                    </DialogClose>
                    <Button className="bg-indigo-500 hover:bg-indigo-600 px-8">Đặt ngay</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}