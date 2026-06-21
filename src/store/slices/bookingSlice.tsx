import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface BookingSlice {
    hotelId: string;
    title: string;
    thumbnail: string;
    viewCount: number;
    address: string;
    avgRating: number;
}

const initialState: BookingSlice = {
    hotelId: "",
    title: "",
    thumbnail: "",
    viewCount: 0,
    address: "",
    avgRating: 0
}

const bookingSlice = createSlice({
    name: "booking",
    initialState:initialState,
    reducers: {
        setDataBooking: (state, action: PayloadAction<BookingSlice>) => {
            state.hotelId = action.payload.hotelId;
            state.title = action.payload.title;
            state.thumbnail = action.payload.thumbnail;
            state.viewCount = action.payload.viewCount;
            state.address = action.payload.address;
            state.avgRating = action.payload.avgRating;
        }
    }
})

export const {setDataBooking} = bookingSlice.actions;

export default bookingSlice.reducer;

