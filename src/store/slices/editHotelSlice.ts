import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    AdminHotelDetailResponse,
    HotelRegulationResponse,
    HotelUtilityResponse
} from "@/common/types/admin/hotel-detail";

interface EditHotelState {
    data: AdminHotelDetailResponse | null;
    isSaving: boolean;

    originalData: AdminHotelDetailResponse | null;
}

const initialState: EditHotelState = {
    data: null,
    isSaving: false,
    originalData: null,
};

const editHotelSlice = createSlice({
    name: "editHotel",
    initialState,
    reducers: {
        setInitialData: (state, action: PayloadAction<AdminHotelDetailResponse>) => {
            state.data = action.payload;

            // Backup
            state.originalData = action.payload;
        },
        updateBasicField: (state, action: PayloadAction<{ field: string; value: any }>) => {
            if (state.data) {
                (state.data as Record<string, any>)[action.payload.field] = action.payload.value;
            }
        },
        updateAddressField: (state, action: PayloadAction<{ field: string; value: any }>) => {
            if (state.data && state.data.address) {
                state.data.address = {
                    ...state.data.address,
                    [action.payload.field]: action.payload.value
                };
            }
        },
        updateRoomField: (state, action: PayloadAction<{ roomIndex: number; field: string; value: any }>) => {
            if (state.data && state.data.roomTypes) {
                (state.data.roomTypes[action.payload.roomIndex] as Record<string, any>)[action.payload.field] = action.payload.value;
            }
        },
        setHotelUtilitiesFormData: (state, action: PayloadAction<HotelUtilityResponse[]>) => {
            if (state.data) {
                state.data.hotelUtilities = action.payload;
            }
        },
        setHotelRegulation: (state, action: PayloadAction<HotelRegulationResponse[]>) => {
            if (state.data) {
                state.data.hotelRegulations = action.payload;
            }
        },
        setSavingStatus: (state, action: PayloadAction<boolean>) => {
            state.isSaving = action.payload;
        },
        resetChanges: (state) => {
            state.data = state.originalData;
        },
        resetSlice: () => initialState,
    }
});

export const {
    setInitialData,
    updateBasicField,
    updateAddressField,
    updateRoomField,
    setSavingStatus,
    setHotelUtilitiesFormData,
    setHotelRegulation,
    resetChanges,
    resetSlice
} = editHotelSlice.actions;

export default editHotelSlice.reducer;