import {configureStore} from "@reduxjs/toolkit";
import searchReducer from "@/store/slices/searchSlice"

export const store = configureStore({
   reducer: {
       searchState: searchReducer
   } 
})