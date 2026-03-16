import {createSlice} from "@reduxjs/toolkit";

interface SearchSlice {
    keyword: string
}

const initialState: SearchSlice = {
    keyword: ""
}

const searchSlice = createSlice({
    name: "search",
    initialState:initialState,
    reducers: {
        
    }
})

const {} = searchSlice.actions;

export default searchSlice.reducer;

