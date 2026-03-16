import {createSlice, PayloadAction} from "@reduxjs/toolkit";

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
        setKeyword: (state, action:PayloadAction<string>) => {
            state.keyword = action.payload;
        }
    }
})

export const {setKeyword} = searchSlice.actions;

export default searchSlice.reducer;

