'use client';

import React, {useState, useEffect, useRef} from 'react';
import {MapPin, ShieldCheck, Wifi, CalendarDays, User, Image as ImageIcon, Plus, Trash2} from 'lucide-react';
import {useDispatch, useSelector} from 'react-redux';
import MultiUploadBox from "@/components/upload/multi-upload-box";
import {FilePreview} from "@/common/types/file";
import {
    setSavingStatus,
    updateAddressField,
    updateBasicField,
    resetChanges,
    setHotelUtilitiesFormData, setHotelRegulation, setInitialData
} from "@/store/slices/editHotelSlice";
import {ReduxState} from "@/constants/redux-state";
import {HotelUtilityResponse} from "@/common/types/admin/hotel-detail";
import {hotelAdminService, UpdateHotelInfoRequest} from "@/services/admin/hotel-admin-service";
import Image from "next/image";
import {cloudinary} from "@/services/upload-service";

export default function BasicInfoTab({hotelId, onClose, onSuccess}: {
    hotelId: string,
    onClose: () => void,
    onSuccess?: () => void
}) {
    const dispatch = useDispatch();

    const {
        data: formData,
        isSaving,
    } = useSelector((state: ReduxState) => state.editHotelState);

    const [hotelImages, setHotelImages] = useState<FilePreview[]>([]);
    const [thumbnailId, setThumbnailId] = useState<string | null>(null);
    const [reset, setReset] = useState<number>(0);
    const [hotelUtilities, setHotelUtilities] = useState<HotelUtilityResponse[]>([]);

    const [isUtilityDropdownOpen, setIsUtilityDropdownOpen] = useState(false);
    const utilityDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (utilityDropdownRef.current && !utilityDropdownRef.current.contains(event.target as Node)) {
                setIsUtilityDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (formData) {
            const mappedImages: FilePreview[] = (formData.images || []).map((img) => ({
                id: img.id.toString(),
                url: img.path,
            }));

            setHotelImages(mappedImages);

            if (formData.thumbnail) {
                const matchedImg = mappedImages.find(img => img.url === formData.thumbnail);
                setThumbnailId(matchedImg ? matchedImg.id : (mappedImages[0]?.id || null));
            } else {
                setThumbnailId(mappedImages[0]?.id || null);
            }
        }
    }, [reset]);

    useEffect(() => {
        const fetchHotelUtilities = async () => {
            try {
                const data = await hotelAdminService.getHotelUtilities();
                setHotelUtilities(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchHotelUtilities();
    }, []);

    if (!formData) return null;

    const handleFilesAdded = (files: File[]) => {
        const imageFiles = files.filter(f => f.type.startsWith("image/"));
        const newPreviews: FilePreview[] = imageFiles.map((file) => ({
            id: Math.random().toString(36).substring(7),
            url: URL.createObjectURL(file),
            file: file,
        }));

        const updatedImages = [...hotelImages, ...newPreviews];
        setHotelImages(updatedImages);

        if (!thumbnailId && updatedImages.length > 0) {
            setThumbnailId(updatedImages[0].id);
        }
    };

    const handleRemoveFile = (id: string) => {
        const filteredImages = hotelImages.filter((item) => item.id !== id);
        setHotelImages(filteredImages);

        if (id === thumbnailId) {
            setThumbnailId(filteredImages.length > 0 ? filteredImages[0].id : null);
        }
    };

    const toggleUtility = (utility: HotelUtilityResponse) => {
        const currentUtilities = formData.hotelUtilities || [];
        const isSelected = currentUtilities.some(u => u.id === utility.id);

        let newUtilities;
        if (isSelected) {
            newUtilities = currentUtilities.filter(u => u.id !== utility.id);
        } else {
            newUtilities = [...currentUtilities, utility];
        }

        dispatch(setHotelUtilitiesFormData(newUtilities));
    };

    const handleAddRegulation = () => {
        const currentRegulations = formData.hotelRegulations || [];
        if (currentRegulations.some(r => !r.name || r.name.trim() === "")) {
            window.alert("Vui lòng điền đầy đủ thông tin quy định hiện có!")
            return;
        }

        const newRegulation = {name: "", description: ""};
        dispatch(setHotelRegulation([...currentRegulations, newRegulation]));
    };

    const handleUpdateRegulation = (index: number, field: 'name' | 'description', value: string) => {
        const currentRegulations = [...(formData.hotelRegulations || [])];
        currentRegulations[index] = {...currentRegulations[index], [field]: value};
        dispatch(setHotelRegulation(currentRegulations));
    };

    const handleRemoveRegulation = (index: number) => {
        const currentRegulations = formData.hotelRegulations || [];
        const newRegulations = currentRegulations.filter((_, i) => i !== index);
        dispatch(setHotelRegulation(newRegulations));
    };

    const handleSave = async () => {
        if (!formData.name || formData.name.trim() === "") {
            window.alert("Tên khách sạn không được để trống!");
            return;
        }
        if (formData.hotelRegulations?.some((d) => d.name.trim() === "")) {
            window.alert("Có tên nội quy đang bị bỏ trống. Vui lòng kiểm tra lại!");
            return;
        }
        
        dispatch(setSavingStatus(true));
        try {
            const existingUrls = hotelImages.filter(item => !item.file).map(item => item.url);
            const newFilesToUpload = hotelImages.filter(item => item.file);

            let newUploadedImages: {id: string, url: string}[] = [];
            if (newFilesToUpload.length > 0) {
                const sigData = await cloudinary.getSignature(`homebooking-hotel`);
                const uploadPromises = newFilesToUpload.map(async (item) => {
                    const res = await cloudinary.uploadSingleImage(item.file!, sigData);
                    return {id: item.id, url: res.secure_url};
                });
                newUploadedImages = await Promise.all(uploadPromises);
            }

            let finalThumbnailUrl = "";
            const currentThumbItem = hotelImages.find(item => item.id === thumbnailId);

            if (currentThumbItem) {
                if (!currentThumbItem.file) {
                    finalThumbnailUrl = currentThumbItem.url;
                } else {
                    const uploadedThumb = newUploadedImages.find(img => img.id === thumbnailId);
                    if (uploadedThumb) finalThumbnailUrl = uploadedThumb.url;
                }
            }

            const allImageUrls = [...existingUrls, ...newUploadedImages.map(img => img.url)];
            if (!finalThumbnailUrl) finalThumbnailUrl = allImageUrls[0] || "";

            const requestData: UpdateHotelInfoRequest = {
                id: hotelId,
                name: formData.name,
                description: formData.description,
                hotline: formData.hotline,
                status: formData.status,
                images: allImageUrls,
                thumbnail: finalThumbnailUrl,
                street: formData.address?.street || "",
                ward: formData.address?.ward || "",
                province: formData.address?.province || "",
                postalCode: formData.address?.postalCode || 0,
                latitude: formData.address?.latitude || 0,
                longitude: formData.address?.longitude || 0,
                hotelUtilities: (formData.hotelUtilities || []).map(u => u.id),
                hotelRegulations: formData.hotelRegulations || []
            };

            const res = await hotelAdminService.updateHotelInfo(requestData);
            dispatch(setInitialData(res));

            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            window.alert("Cập nhật khách sạn không thành công. Vui lòng thử lại!");
            console.error("Lỗi khi lưu Tab 1:", error);
        } finally {
            dispatch(setSavingStatus(false));
        }
    };
    
    const handleChangeActive = async (active: boolean) => {
        const res = await hotelAdminService.updateActive({
            id: hotelId, active: active
        })
        if(res.success) {
            dispatch(updateBasicField({field: "isActive", value: res.active}))
            if (onSuccess) onSuccess();
        } else {
            window.alert("Đã có lỗi xảy ra khi thay đổi trạng thái khách sạn!")
        }
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-gray-50/30">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Cột trái: Thông tin chính */}
                    <div className="space-y-4 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="font-semibold text-gray-800 border-b pb-2 mb-4">Thông tin chung</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tên khách sạn</label>
                            <input type="text" value={formData.name || ""}
                                   onChange={(e) => dispatch(updateBasicField({field: 'name', value: e.target.value}))}
                                   className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-1 focus:ring-purple-500"/>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Hotline</label>
                                <input type="text" value={formData.hotline || ""}
                                       onChange={(e) => dispatch(updateBasicField({
                                           field: 'hotline',
                                           value: e.target.value
                                       }))}
                                       className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-1 focus:ring-purple-500"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái
                                    (Status)</label>
                                <select value={formData.status || "AVAILABLE"}
                                        onChange={(e) => dispatch(updateBasicField({
                                            field: 'status',
                                            value: e.target.value
                                        }))}
                                        className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-1 focus:ring-purple-500">
                                    <option value="AVAILABLE">Available</option>
                                    <option value="FULL">Full</option>
                                    <option value="UNAVAILABLE">Unavailable</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                            <textarea rows={4} value={formData.description || ""}
                                      onChange={(e) => dispatch(updateBasicField({
                                          field: 'description',
                                          value: e.target.value
                                      }))}
                                      className="w-full px-3 py-2 border rounded-lg outline-none text-sm focus:ring-1 focus:ring-purple-500"/>
                        </div>
                        <div className="flex gap-4 text-xs text-gray-400 mt-2">
                            <span className="flex items-center gap-1"><CalendarDays
                                className="w-3 h-3"/> Tạo: {formData.createdAt ? new Date(formData.createdAt).toLocaleDateString() : ""}</span>
                            <span className="flex items-center gap-1"><CalendarDays
                                className="w-3 h-3"/> Cập nhật: {formData.updatedAt ? new Date(formData.updatedAt).toLocaleDateString() : ""}</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Phần Địa chỉ & Tọa độ */}
                        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                            <h3 className="font-semibold text-gray-800 border-b pb-2 mb-4 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-red-500"/> Địa chỉ & Tọa độ
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Đường / Số
                                        nhà</label>
                                    <input
                                        type="text"
                                        value={formData.address?.street || ''}
                                        onChange={(e) => dispatch(updateAddressField({
                                            field: 'street',
                                            value: e.target.value
                                        }))}
                                        className="w-full px-3 py-1.5 border rounded-lg outline-none text-sm focus:ring-1 focus:ring-purple-500"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Phường /
                                            Xã</label>
                                        <input
                                            type="text"
                                            value={formData.address?.ward || ''}
                                            onChange={(e) => dispatch(updateAddressField({
                                                field: 'ward',
                                                value: e.target.value
                                            }))}
                                            className="w-full px-3 py-1.5 border rounded-lg outline-none text-sm focus:ring-1 focus:ring-purple-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Tỉnh / Thành
                                            phố</label>
                                        <input
                                            type="text"
                                            value={formData.address?.province || ''}
                                            onChange={(e) => dispatch(updateAddressField({
                                                field: 'province',
                                                value: e.target.value
                                            }))}
                                            className="w-full px-3 py-1.5 border rounded-lg outline-none text-sm focus:ring-1 focus:ring-purple-500"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Vĩ độ
                                            (Latitude)</label>
                                        <input
                                            type="number"
                                            step="any"
                                            value={formData.address?.latitude || 0}
                                            onChange={(e) => dispatch(updateAddressField({
                                                field: 'latitude',
                                                value: Number(e.target.value)
                                            }))}
                                            className="w-full px-3 py-1.5 border rounded-lg outline-none text-sm focus:ring-1 focus:ring-purple-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">Kinh độ
                                            (Longitude)</label>
                                        <input
                                            type="number"
                                            step="any"
                                            value={formData.address?.longitude || 0}
                                            onChange={(e) => dispatch(updateAddressField({
                                                field: 'longitude',
                                                value: Number(e.target.value)
                                            }))}
                                            className="w-full px-3 py-1.5 border rounded-lg outline-none text-sm focus:ring-1 focus:ring-purple-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Phần Owner */}
                        <div
                            className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-start gap-4">
                            <div
                                className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden shrink-0 relative">
                                {formData.owner?.avatarUrl ? (
                                    <Image
                                        fill
                                        src={formData.owner.avatarUrl}
                                        alt="avatar"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User className="text-gray-400"/>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-800 text-sm truncate">
                                    Chủ sở hữu: {formData.owner?.username || "N/A"}
                                </h3>
                                <p className="text-xs text-gray-500 truncate">
                                    {formData.owner?.email || "Chưa cập nhật email"}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    {formData.owner?.phone || "Chưa cập nhật sđt"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tiện ích & Nội quy */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    {/* Dropdown Tiện ích */}
                    <div
                        className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm relative h-full flex flex-col"
                        ref={utilityDropdownRef}>
                        <h4 className="font-medium text-sm flex items-center gap-2 mb-3 border-b pb-2"><Wifi
                            className="w-4 h-4 text-emerald-500"/> Tiện ích khách sạn</h4>

                        <div
                            onClick={() => setIsUtilityDropdownOpen(!isUtilityDropdownOpen)}
                            className={`min-h-[50px] w-full bg-gray-50 rounded-xl p-3 flex flex-wrap gap-2 cursor-pointer border-2 transition-all flex-1 ${isUtilityDropdownOpen ? "border-emerald-200 bg-white shadow-sm" : "border-transparent"}`}
                        >
                            {(!formData.hotelUtilities || formData.hotelUtilities.length === 0) && (
                                <div className="flex items-center px-1 text-gray-400 text-sm italic">Nhấp để chọn tiện
                                    ích...</div>
                            )}

                            {formData.hotelUtilities?.map(u => (
                                <span key={u.id}
                                      className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-sm">
                                    {u.name}
                                    <button onClick={(e) => {
                                        e.stopPropagation();
                                        toggleUtility(u);
                                    }}
                                            className="hover:bg-emerald-200 hover:text-emerald-900 rounded-full w-4 h-4 flex items-center justify-center transition-colors">×</button>
                                </span>
                            ))}
                        </div>

                        {isUtilityDropdownOpen && (
                            <div
                                className="absolute z-20 w-full left-0 mt-2 top-full bg-white border border-gray-100 shadow-xl rounded-xl p-3 grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                                {hotelUtilities.map(utility => {
                                    const isSelected = formData.hotelUtilities?.some(u => u.id === utility.id);
                                    return (
                                        <div
                                            key={utility.id}
                                            onClick={() => toggleUtility(utility)}
                                            className={`p-3 rounded-lg text-sm font-medium cursor-pointer transition-all flex justify-between items-center ${isSelected ? "bg-emerald-50 text-emerald-700" : "text-gray-600 hover:bg-gray-50"}`}
                                        >
                                            {utility.name}
                                            {isSelected && <span className="text-emerald-600 font-bold">✓</span>}
                                        </div>
                                    );
                                })}
                                {hotelUtilities.length === 0 && (
                                    <div className="col-span-full text-center text-sm text-gray-400 py-2">Đang tải dữ
                                        liệu...</div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Quản lý Nội quy (Có thể sửa trực tiếp) */}
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm h-full flex flex-col">
                        <div className="flex items-center justify-between mb-3 border-b pb-2">
                            <h4 className="font-medium text-sm flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-amber-500"/> Nội quy
                            </h4>
                            <button
                                onClick={handleAddRegulation}
                                className="w-6 h-6 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center hover:bg-amber-100 transition-colors"
                                title="Thêm nội quy"
                            >
                                <Plus className="w-4 h-4"/>
                            </button>
                        </div>

                        <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px] pr-1">
                            {formData.hotelRegulations?.map((r, index) => (
                                <div key={r.id || index}
                                     className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg group">
                                    <div className="flex-1 space-y-2">
                                        <input
                                            type="text"
                                            placeholder="Tên nội quy (VD: Hút thuốc)"
                                            value={r.name}
                                            onChange={(e) => handleUpdateRegulation(index, 'name', e.target.value)}
                                            className="w-full bg-transparent border-b border-gray-300 focus:border-amber-500 outline-none font-semibold text-sm text-gray-800 pb-1 placeholder-gray-400"
                                        />
                                        <textarea
                                            placeholder="Mô tả chi tiết..."
                                            value={r.description}
                                            rows={2}
                                            onChange={(e) => handleUpdateRegulation(index, 'description', e.target.value)}
                                            className="w-full bg-white border border-gray-200 rounded-md p-2 text-xs text-gray-600 outline-none focus:border-amber-500 resize-none placeholder-gray-400"
                                        />
                                    </div>
                                    <button
                                        onClick={() => handleRemoveRegulation(index)}
                                        className="text-gray-400 hover:text-red-500 p-1 transition-colors mt-1"
                                        title="Xóa nội quy"
                                    >
                                        <Trash2 className="w-4 h-4"/>
                                    </button>
                                </div>
                            ))}
                            {(!formData.hotelRegulations || formData.hotelRegulations.length === 0) && (
                                <div
                                    className="text-xs text-gray-400 text-center py-6 italic border-2 border-dashed border-gray-100 rounded-lg">
                                    Chưa có nội quy nào. Bấm nút + ở góc để thêm.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* MultiUploadBox */}
                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="font-semibold text-gray-800 border-b pb-2 mb-4 flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-blue-500"/>
                        Quản lý hình ảnh ({hotelImages.length})
                    </h3>
                    <MultiUploadBox
                        previews={hotelImages}
                        thumbnailId={thumbnailId}
                        onFilesAdded={handleFilesAdded}
                        onRemoveFile={handleRemoveFile}
                        onSetThumbnail={(id) => setThumbnailId(id)}
                    />
                </div>
            </div>

            {/* Footer Tab 1 */}
            <div className="px-6 py-4 border-t border-gray-100 bg-white flex items-center justify-between shrink-0">
                <label className="flex items-center cursor-pointer gap-2">
                    <input
                        type="checkbox"
                        checked={formData.isActive || false}
                        onChange={(e) => {
                            if (confirm("Xác nhận thay đổi trạng thái hoạt động của khách sạn?")) {
                                handleChangeActive(e.target.checked);
                            }
                        }}
                        className="w-5 h-5 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Trạng thái Active</span>
                </label>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => {
                            if (window.confirm("Bạn có chắc chắn muốn hủy mọi thay đổi và khôi phục dữ liệu gốc?")) {
                                dispatch(resetChanges());
                                setReset(prev => prev + 1);
                            }
                        }}
                        className="px-4 py-2 text-sm font-medium text-amber-600 hover:bg-amber-50 border border-amber-200 rounded-lg transition-colors"
                    >
                        Reset dữ liệu
                    </button>
                    <button onClick={onClose}
                            className="px-5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">Hủy
                    </button>
                    <button onClick={handleSave} disabled={isSaving}
                            className="px-5 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center gap-2 shadow-sm transition-colors disabled:opacity-50">
                        {isSaving ? "Đang lưu..." : "Lưu"}
                    </button>
                </div>
            </div>
        </div>
    );
}