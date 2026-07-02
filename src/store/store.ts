import {configureStore} from "@reduxjs/toolkit";
import searchReducer from "@/store/slices/searchSlice"
import bookingReducer from "@/store/slices/bookingSlice"

export const store = configureStore({
   reducer: {
       searchState: searchReducer,
       bookingState: bookingReducer,
   } 
})