'use client'
import dynamic from 'next/dynamic'

// Import Page với ssr: false
const Page = dynamic(() => import('@/components/search/search-map'), {
    ssr: false,
    loading: () => <div className="h-96 w-full bg-gray-100 animate-pulse flex items-center justify-center">Đang tải bản đồ...</div>
})

export default function MapPage() {
    const hotelCoord: [number, number] = [10.762622, 106.660172]; // Ví dụ: TP.HCM

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Vị trí khách sạn</h1>

            {/* Khung chứa bản đồ phải có chiều cao cố định */}
            <div className="h-[400px] w-full shadow-lg border rounded-xl overflow-hidden">
                <Page position={hotelCoord} />
            </div>
        </div>
    )
}