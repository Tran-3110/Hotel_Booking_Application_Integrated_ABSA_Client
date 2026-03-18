import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function SearchOverview(props: {keyword: string}) {
    const category = [
        {
            name: "Giá cả",
            items: [
            {
                name: "Từ thấp đến cao",
                value: "Từ cao đến thấp",
                action: null
            },
            {
                name: "Từ cao đến thấp",
                value: "GC2",
                action: null
            }
        ]
        },
        {
            name: "Đánh giá",
            items: [
                {
                    name: "Từ thấp đến cao",
                    value: "ĐG1",
                    action: null
                },
                {
                    name: "Từ cao đến thấp",
                    value: "ĐG2",
                    action: null
                }
            ]
        }
    ]
    return (
        <div className="py-3 w-full text-end">
            <label className="font-semibold text-lg">{props.keyword}: Đã tìm thấy 123 khách sạn</label>
            
            <div className="flex justify-end mt-3">
                <Select>
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