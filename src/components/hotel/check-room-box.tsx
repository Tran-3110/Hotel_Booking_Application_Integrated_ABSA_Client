"use client"

import * as React from "react"
import { format, parseISO } from "date-fns" 
import { vi } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
import { usePathname, useRouter, useSearchParams } from "next/navigation" // Thêm useSearchParams
import { useDispatch } from "react-redux"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { setDataBooking } from "@/store/slices/bookingSlice"

interface CheckRoomBoxProps {
    checkPage: "hotel" | "booking"
    id?: string
    title?: string
    thumbnail?: string
    viewCount?: number
    address?: string
    avgRating?: number
}

export default function CheckRoomBox({ checkPage, id, title, thumbnail, address, viewCount, avgRating }: CheckRoomBoxProps) {
    const pathname = usePathname()
    const router = useRouter()
    const dispatch = useDispatch()

    const searchParams = useSearchParams()
    const checkInParam = searchParams.get("checkIn")
    const checkOutParam = searchParams.get("checkOut")

    const [date, setDate] = React.useState<DateRange | undefined>(() => {
        if (checkInParam && checkOutParam) {
            return {
                from: parseISO(checkInParam),
                to: parseISO(checkOutParam)
            }
        }
        return undefined
    })

    React.useEffect(() => {
        if (checkInParam && checkOutParam) {
            setDate({
                from: parseISO(checkInParam),
                to: parseISO(checkOutParam)
            })
        }
    }, [checkInParam, checkOutParam])

    const handleCheckRoom = () => {
        if (!date?.from || !date?.to) return

        const startDateStr = format(date.from, "yyyy-MM-dd")
        const endDateStr = format(date.to, "yyyy-MM-dd")

        const startDateTime = `${startDateStr}T14:00:00`
        const endDateTime = `${endDateStr}T12:00:00`

        if (checkPage === "hotel") {
            dispatch(setDataBooking({
                hotelId: id || "",
                title: title || "",
                address: address || "",
                viewCount: viewCount || 0,
                thumbnail: thumbnail || "",
                avgRating: avgRating || 0
            }))

            const targetUrl = `${pathname}/booking?checkIn=${startDateTime}&checkOut=${endDateTime}`
            router.push(targetUrl)

        } else if (checkPage === "booking") {
            const targetUrl = `${pathname}?checkIn=${startDateTime}&checkOut=${endDateTime}`
            router.push(targetUrl)
        }
    }

    return (
        <div className="bg-slate-50 p-4 rounded-2xl border border-gray-200/60 space-y-3 w-full">
            <div className="space-y-1">
                <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">
                    Thời gian lưu trú
                </label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className="w-full justify-start text-left border-gray-300 bg-white hover:bg-gray-50 rounded-xl h-11 shadow-sm"
                        >
                            <CalendarIcon className="mr-2 h-4 w-4 text-gray-400 shrink-0"/>
                            {date?.from && date?.to ? (
                                <span className="text-xs text-gray-800 font-medium">
                                    {format(date.from, "dd/MM")} - {format(date.to, "dd/MM/yyyy")}
                                </span>
                            ) : (
                                <span className="text-xs text-gray-400">Chọn ngày lưu trú</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 rounded-2xl shadow-xl" align="end">
                        <Calendar
                            mode="range"
                            defaultMonth={date?.from}
                            selected={date}
                            onSelect={setDate}
                            numberOfMonths={2}
                            locale={vi}
                            disabled={{ before: new Date() }}
                        />
                    </PopoverContent>
                </Popover>
            </div>

            <Button
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl h-11 transition-all shadow-md active:scale-[0.98]"
                onClick={handleCheckRoom}
                disabled={!date?.from || !date?.to}
            >
                Kiểm tra phòng trống
            </Button>
        </div>
    )
}