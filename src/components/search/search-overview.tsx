"use client"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {useDispatch, useSelector} from "react-redux";
import {ReduxState} from "@/constants/redux-state";
import {setSortType} from "@/store/slices/searchSlice";

const category = [
    {
        name: "Giá cả",
        items: [
            {
                name: "Từ thấp đến cao",
                value: "PRICE_ASC",
                action: null
            },
            {
                name: "Từ cao đến thấp",
                value: "PRICE_DESC",
                action: null
            }
        ]
    },
    {
        name: "Đánh giá",
        items: [
            {
                name: "Từ thấp đến cao",
                value: "RATING_ASC",
                action: null
            },
            {
                name: "Từ cao đến thấp",
                value: "RATING_DESC",
                action: null
            }
        ]
    }
]

export default function SearchOverview(props: {keyword: string, count: number}) {
    const sortType = useSelector((state:ReduxState) => state.searchState.sortType)
    const dispatch = useDispatch();
    return (
        <div className="py-3 w-full text-end">
            <label className="font-semibold text-lg">{props.keyword}: Đã tìm thấy {props.count} khách sạn</label>
            
            <div className="flex justify-end mt-3">
                <Select value={sortType} onValueChange={(value) => {
                    dispatch(setSortType(value));
                }}>
                    <SelectTrigger className="w-full max-w-64">
                        <SelectValue placeholder="Sắp xếp theo" />
                    </SelectTrigger>
                    <SelectContent>
                        {category.map(((c, index) => (
                            <SelectGroup key={index}>
                                <SelectLabel>{c.name}</SelectLabel>
                                {c.items.map(((item, index) => (
                                    <SelectItem key={index} value={item.value}>{item.name}</SelectItem>
                                )))}
                            </SelectGroup>
                            
                        )))}
                    </SelectContent>
                </Select>
            </div>
            
        </div>
    )
}