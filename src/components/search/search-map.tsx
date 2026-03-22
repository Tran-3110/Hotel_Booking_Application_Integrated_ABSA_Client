'use client'
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useMemo } from 'react'

// Icon mặc định cho Marker chính
const icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41]
})

const invisibleIcon = L.divIcon({
    className: 'bg-transparent',
    html: '',
    iconSize: [0, 0]
});

export default function SearchMap({ position }: { position: [number, number] }) {

    const islands = useMemo(() => [
        { id: 'hs', name: 'Quần đảo Hoàng Sa (Việt Nam)', pos: [16.5, 112.0] as [number, number] },
        { id: 'ts', name: 'Quần đảo Trường Sa (Việt Nam)', pos: [10.0, 114.3] as [number, number] }
    ], []);

    return (
        <div className="relative h-full w-full">
            <MapContainer
                center={position}
                zoom={13}
                scrollWheelZoom={false}
                className="h-full w-full rounded-lg"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Marker hiển thị vị trí khách sạn */}
                <Marker position={position} icon={icon}>
                    <Popup>Vị trí khách sạn của bạn ở đây!</Popup>
                </Marker>

                {islands.map(island => (
                    <Marker key={island.id} position={island.pos} icon={invisibleIcon}>
                        <Tooltip
                            permanent
                            direction="center"
                            className="custom-island-label"
                        >
                            {island.name}
                        </Tooltip>
                    </Marker>
                ))}
            </MapContainer>

            <style jsx global>{`
                .custom-island-label {
                    background: transparent !important;
                    border: none !important;
                    box-shadow: none !important;
                    color: #d32f2f !important; 
                    font-weight: bold !important;
                    font-size: 14px !important;
                    text-shadow: 1px 1px 2px white, -1px -1px 2px white !important; /* Tạo viền trắng cho chữ dễ đọc */
                    white-space: nowrap;
                }
                .leaflet-tooltip-top:before, .leaflet-tooltip-bottom:before, 
                .leaflet-tooltip-left:before, .leaflet-tooltip-right:before {
                    display: none !important;
                }
            `}</style>
        </div>
    )
}