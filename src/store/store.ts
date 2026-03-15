import {configureStore} from "@reduxjs/toolkit";
import searchReducer from "@/redux/slices/searchSlice"

export const store = configureStore({
   reducer: {
       searchState: searchReducer
   } 
})