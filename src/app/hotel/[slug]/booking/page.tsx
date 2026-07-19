"use client"

import * as React from "react"
import { useEffect, useMemo, useState } from "react"
import { notFound, useParams, useRouter, useSearchParams } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import {
    Star,
    XCircle,
    Home,
    Check,
    DollarSign,
    Percent,
    ShieldCheck,
    ChevronsRight, MapPin
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
import CheckRoomBox from "@/components/hotel/check-room-box"
import { ReduxState } from "@/constants/redux-state";
// import { RoomTypeValidResponse } from "@/common/types/room";
import { bookingService } from "@/services/booking-service";
import { hotelService } from "@/services/hotel-service";
import { setDataBooking } from "@/store/slices/bookingSlice";
import { OrderRequest, RoomDetailValidResponse } from "@/common/types/order"
import { toast } from "sonner"

export default function CheckAvailabilityCard() {
    const hotelData = useSelector((state: ReduxState) => state.bookingState)
    const dispatch = useDispatch()
    const params = useParams();
    const slug = params.slug as string;
    const hotelId = slug.slice(slug.lastIndexOf(".") + 1);
    const router = useRouter()

    const [validRooms, setValidRooms] = useState<RoomDetailValidResponse[]>([])
    const [loading, setLoading] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [selectedRooms, setSelectedRooms] = useState<{
        id: string;
        price: number;
    }[]>([])

    const searchParams = useSearchParams()
    const checkIn = searchParams.get("checkIn")
    const checkOut = searchParams.get("checkOut")

    const handleCheckAvailability = React.useCallback(async (inDate: string, outDate: string) => {
        setLoading(true)
        setSelectedRooms([])

        try {
            const res = await bookingService.getRoomDetailsValid(hotelId, inDate, outDate)
            setValidRooms(res)
        } catch (error) {
            console.error("Lỗi khi kiểm tra phòng trống:", error)
        } finally {
            setLoading(false)
        }
    }, [hotelId])

    const fetchHotelData = React.useCallback(async () => {
        try {
            const res = await hotelService.getSnapshotById(hotelId);
            if (res) {
                dispatch(setDataBooking({
                    hotelId: res.id,
                    title: res.name,
                    thumbnail: res.thumbnail,
                    viewCount: res.viewCount,
                    address: `${res.street}, ${res.ward}, ${res.province}`,
                    avgRating: res.avgRating
                }))
            } else notFound()
        } catch (error) {
            console.error("Lỗi khi lấy thông tin khách sạn:", error)
        }
    }, [hotelId, dispatch])

    useEffect(() => {
        if (hotelData.hotelId === "") fetchHotelData();

        if (checkIn && checkOut) {
            handleCheckAvailability(checkIn, checkOut)
        }
    }, [checkIn, checkOut, hotelData.hotelId, fetchHotelData, handleCheckAvailability])

    const handleToggleSelectRoom = (roomId: string, isValid: boolean, price: number) => {
        if (!isValid) return

        setSelectedRooms((prev) => {
            const isExisted = prev.some(room => room.id === roomId)
            if (isExisted) {
                return prev.filter(room => room.id !== roomId)
            } else {
                return [...prev, { id: roomId, price }]
            }
        })
    }

    const totalDepositAmount = useMemo(() => {
        return selectedRooms.reduce((sum, room) => {
            // const rate = room.depositedPercent > 1 ? room.depositedPercent / 100 : room.depositedPercent
            return sum + (room.price)
        }, 0)
    }, [selectedRooms])

    const handleConfirmBooking = async () => {
        if (selectedRooms.length === 0 || !checkIn || !checkOut) return

        setIsSubmitting(true)

        try {
            const payload: OrderRequest = {
                roomDetailsId: selectedRooms.map(r => r.id),
                checkin: checkIn,
                checkout: checkOut,
                note: "Khách tự đặt phòng qua hệ thống", // FIXME: Impl this data
                totalCapacity: selectedRooms.length * 2, // FIXME: Impl this data
            }

            const res = await bookingService.createOrder(payload)

            if (res.status) {
                toast.success(`Tạo đơn đặt phòng thành công!\nMã đơn: ${res.orderId}\nVui lòng chờ khách sạn xác nhận để tiến hành thanh toán.`)

                //Redirect to order detail page (impl later)
                router.push(`/user/orders/${res.orderId}`)
            }
        } catch (error: unknown) {
            console.error("Lỗi khi đặt phòng:", error)
            toast.error("Có lỗi xảy ra khi tạo đơn đặt phòng. Vui lòng thử lại!")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="max-w-5xl mx-auto mt-15 p-4 md:p-6 space-y-6 antialiased">

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                <div className="md:col-span-2 space-y-2.5">
                    <div className="flex items-center gap-2">
                        {hotelData?.viewCount != null && (
                            <span className="text-xs text-gray-400 font-medium">
                                | {hotelData.viewCount.toLocaleString('vi-VN')} lượt xem</span>
                        )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-2xl md:text-3xl font-semibold text-gray-950 tracking-tight">
                            {hotelData?.title || "Not Found"}
                        </h1>
                        <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-0.5 rounded-lg text-xs font-bold border border-amber-200">
                            {hotelData?.avgRating || 0} <Star className="w-3 h-3 fill-amber-500 stroke-amber-500" />
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 flex items-center gap-1.5">
                        <span className="inline-block p-1 bg-red-50 text-red-500 rounded-md"><MapPin
                            className="text-red-700" /></span>
                        {hotelData?.address || "Not Found"}
                    </p>
                </div>

                <div className="md:col-span-1">
                    <CheckRoomBox
                        checkPage="booking"
                        id={hotelData?.hotelId}
                        title={hotelData?.title}
                        address={hotelData?.address}
                        thumbnail={hotelData?.thumbnail}
                        viewCount={hotelData?.viewCount}
                    />
                </div>
            </div>

            {loading && (
                <div className="text-center py-20 space-y-3 bg-white rounded-3xl border border-gray-100 shadow-sm">
                    <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm font-semibold text-gray-500">Đang kiểm tra dữ liệu phòng trống thực thời...</p>
                </div>
            )}

            {!validRooms && !loading && (
                <div className="text-center py-16 bg-slate-50 rounded-3xl border-2 border-dashed border-gray-200 p-6 space-y-3">
                    <div className="text-4xl">📅</div>
                    <h3 className="text-base font-bold text-gray-900">Vui lòng chọn thời gian lưu trú</h3>
                    <p className="text-xs text-gray-500 max-w-sm mx-auto">
                        Hãy chọn ngày nhận phòng và trả phòng ở ô phía trên để hệ thống quét và trả về danh sách các phòng còn trống chính xác nhất.
                    </p>
                </div>
            )}

            {validRooms && !loading && (
                <div className="space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-300">

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="space-y-0.5">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Kiểm tra phòng trống</span>
                        </div>
                        {/* Đổi trạng thái hiển thị giỏ hàng sang màu Indigo đồng bộ */}
                        <div className="flex items-center gap-3 bg-indigo-50/70 border border-indigo-100/80 px-4 py-2 rounded-xl self-start sm:self-center">
                            <div className="p-2 bg-indigo-500 rounded-lg text-white">
                                <Home className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">Trạng thái giỏ</p>
                                <p className="text-sm font-bold text-indigo-900">Đã chọn {selectedRooms.length} phòng</p>
                            </div>
                        </div>
                    </div>

                    <h2 className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2 px-1">
                        <ShieldCheck className="w-5 h-5 text-emerald-500" /> Các loại phòng hiện có sẵn
                    </h2>

                    <div className="grid grid-cols-1 gap-5">
                        {validRooms?.map((roomType) => {
                            const calculatedDepositPerRoom = roomType.price

                            return (
                                <div key={roomType.roomTypeId} className="bg-white rounded-2xl border border-gray-200/70 shadow-sm hover:shadow-md transition-all overflow-hidden grid grid-cols-1 lg:grid-cols-4">

                                    <div className="p-5 bg-slate-50/50 border-b lg:border-b-0 lg:border-r border-gray-100 space-y-4 flex flex-col justify-between">
                                        <div className="space-y-1">
                                            <h3 className="font-bold text-gray-900 text-base leading-snug">{roomType.name}</h3>
                                        </div>

                                        <div className="space-y-2 bg-white p-3 rounded-xl border border-gray-200/60 shadow-sm">
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-gray-400 flex items-center gap-1"><DollarSign className="w-3.5 h-3.5 text-gray-400" /> Giá gốc:</span>
                                                <span className="font-bold text-gray-800">{roomType.price.toLocaleString('vi-VN')}đ</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-gray-400 flex items-center gap-1"><Percent className="w-3.5 h-3.5 text-gray-400" /> Cọc trước:</span>
                                                {/* <Badge variant="secondary" className="bg-orange-50 text-orange-700 font-bold border-none text-[10px] px-1.5 py-0">
                                                    {displayPercent}%
                                                </Badge> */}
                                            </div>
                                            <div className="pt-1.5 border-t border-dashed border-gray-200 flex justify-between items-center text-xs">
                                                <span className="font-semibold text-gray-900">Cọc / phòng:</span>
                                                <span className="font-extrabold text-orange-600">{calculatedDepositPerRoom.toLocaleString('vi-VN')}đ</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-5 lg:col-span-3 space-y-3">
                                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Chọn số phòng mong muốn:</span>

                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                            {roomType.data.map((room) => {
                                                const isSelected = selectedRooms.some(r => r.id === room.id)

                                                return (
                                                    <button
                                                        key={room.id}
                                                        disabled={!room.valid}
                                                        onClick={() => handleToggleSelectRoom(room.id, room.valid, roomType.price)}
                                                        className={cn(
                                                            "group flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-all relative select-none text-left",
                                                            room.valid
                                                                ? isSelected
                                                                    ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/10 scale-[1.02]"
                                                                    : "bg-white border-gray-200 text-gray-700 hover:border-gray-400 hover:bg-gray-50/50"
                                                                : "bg-gray-50 border-gray-100 text-gray-300 line-through cursor-not-allowed"
                                                        )}
                                                    >
                                                        <div className="space-y-0.5">
                                                            <span className={cn("text-[10px] font-medium block", isSelected ? "text-indigo-200" : "text-gray-400")}>Mã phòng</span>
                                                            <span className="text-sm font-bold tracking-wide">{room.code}</span>
                                                        </div>

                                                        {room.valid ? (
                                                            isSelected ? (
                                                                <div className="w-5 h-5 bg-white rounded-lg flex items-center justify-center text-indigo-600 shadow-sm">
                                                                    <Check className="w-3.5 h-3.5 stroke-3" />
                                                                </div>
                                                            ) : (
                                                                <div className="w-5 h-5 rounded-lg border border-gray-300 bg-white group-hover:border-gray-400 transition-colors" />
                                                            )
                                                        ) : (
                                                            <XCircle className="w-4 h-4 text-gray-300 shrink-0" />
                                                        )}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>

                                </div>
                            )
                        })}
                    </div>

                    {/* Thanh hóa đơn cố định (Sticky Bottom Bar) */}
                    <div className="sticky bottom-4 left-0 right-0 bg-white border border-gray-200 rounded-2xl p-4 md:p-5 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-50">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                <span>Tổng tiền cọc ước tính</span>
                                <span className="text-gray-300">•</span>
                                <span className="text-gray-500 normal-case">Đang chọn {selectedRooms.length} phòng</span>
                            </div>
                            <p className="text-2xl md:text-3xl font-black text-emerald-600 tracking-tight">
                                {totalDepositAmount.toLocaleString('vi-VN')}đ
                            </p>
                        </div>

                        <Button
                            size="lg"
                            className={cn(
                                "font-semibold px-8 h-14 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm md:text-base",
                                selectedRooms.length > 0 && !isSubmitting
                                    ? "bg-indigo-600 hover:bg-indigo-700 text-white active:scale-[0.98] shadow-indigo-600/10"
                                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                            )}
                            onClick={handleConfirmBooking}
                            disabled={selectedRooms.length === 0 || isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                                    Đang xử lý...
                                </>
                            ) : (
                                <>
                                    Tiến hành xác nhận đặt phòng
                                    <ChevronsRight className="w-5 h-5" />
                                </>
                            )}
                        </Button>
                    </div>

                </div>
            )}
        </div>
    )
}