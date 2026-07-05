import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface SearchSlice {
    keyword: string;
    starCount: number;
    minPrice: string | number;
    maxPrice: string | number;
    checkFilter: number;
    sortType: "PRICE_ASC" | "PRICE_DESC" | "RATING_ASC" | "RATING_DESC" | string;
}

const initialState: SearchSlice = {
    keyword: "",
    starCount: 1,
    minPrice: "",
    maxPrice: "",
    checkFilter: 0,
    sortType: ""
}

const searchSlice = createSlice({
    name: "search",
    initialState:initialState,
    reducers: {
        setKeyword: (state, action:PayloadAction<string>) => {
            state.keyword = action.payload;
        },
        setStarCount: (state, action:PayloadAction<number>) => {
            state.starCount = action.payload;   
        },
        setMinPrice: (state, action:PayloadAction<string>) => {
            state.minPrice = action.payload;
        },
        setMaxPrice: (state, action:PayloadAction<string>) => {
            state.maxPrice = action.payload;
        },
        setSortType: (state, action:PayloadAction<string>) => {
            state.sortType = action.payload;
        },
        changeSearchFilter: (state) => {
            state.checkFilter = state.checkFilter + 1;
        }
    }
})

export const {setKeyword, setStarCount, setMinPrice, setMaxPrice, setSortType, changeSearchFilter} = searchSlice.actions;

export default searchSlice.reducer;

