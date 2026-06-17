"use client"
import Form from "next/form";
import { BedIcon, MapPin, Search } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { suggestSearch } from "@/services/search-service";
import { SuggestSearchResponse } from "@/common/types/suggest-search";
import { useSelector } from "react-redux";
import { ReduxState } from "@/constants/redux-state";
import { useDispatch } from "react-redux";
import {setKeyword} from "@/store/slices/searchSlice";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { useRouter } from 'next/navigation';

export default function SearchToolBar({ variant }: { variant?: 'header' | 'landing' }) {
    const searchText = useSelector((state: ReduxState) => state.searchState.keyword)
    const dispatch = useDispatch();
    const [results, setResults] = useState<SuggestSearchResponse[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const router = useRouter()

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            const handleSuggestSearch = async () => {
                if (searchText.trim().length > 3) {
                    const data = await suggestSearch(searchText);
                    setResults(data);
                }
            }
            handleSuggestSearch();
        }, 1100);

        return () => clearTimeout(delayDebounceFn);
    }, [searchText, dispatch]);

    return (
        <div
            ref={containerRef}
            className={cn(
                "relative transition-all duration-300",
                variant === "landing" ? "w-full max-w-3xl" : "w-120"
            )}
        >
            <Form action="/search"
                className={cn(
                    "flex w-full items-center gap-0 overflow-hidden rounded-full border bg-background transition-all duration-300",
                    "focus-within:ring-1 focus-within:ring-ring focus-within:border-input",
                    variant === "landing" ? "px-3 py-2.5 shadow-lg border-transparent" : "px-1.5 py-1 shadow-sm border-input"
                )}
            >
                <div className="flex items-center pl-4">
                    <BedIcon className={cn(
                        "text-muted-foreground",
                        variant === "landing" ? "h-6 w-6" : "h-4 w-4"
                    )} />
                </div>
                <Input
                    name="q"
                    placeholder="Bạn muốn đến đâu?"
                    className={cn(
                        "border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent! flex-1",
                        variant === "landing" ? "text-lg! h-12" : "text-base h-10"
                    )}
                    onFocus={() => {
                        if (results.length > 0) setIsOpen(true);
                    }}
                    onChange={(e) => {
                        if (e.target.value === "") {
                            setResults([]);
                            setIsOpen(false);
                        } else {
                            setIsOpen(true);
                        }
                        dispatch(setKeyword(e.target.value));
                    }}
                />
                <Button
                    type={"button"}
                    disabled={searchText.trim().length === 0}
                    className={cn(
                        "rounded-full font-medium transition-all cursor-pointer",
                        "bg-indigo-700 hover:bg-indigo-800 text-white",
                        variant === "landing" ? "px-8 h-12 text-base" : "px-6 h-10 text-sm"
                    )}
                    onClick={() => {
                        const lat = results[0].lat
                        const lon = results[0].lon
                        const bbox = results[0].boundingbox.join(",")
                        router.push(`/search?q=${searchText}&lat=${lat}&lon=${lon}&bbox=${bbox}`);
                    }}
                >
                    <Search className="mr-1 h-4 w-4" />
                    Tìm kiếm
                </Button>
            </Form>

            {isOpen && results.length > 0 &&
                <div className={cn(
                    "w-full absolute left-0 z-50 flex flex-col overflow-hidden border bg-background mt-2",
                    variant === "landing" ? "rounded-2xl shadow-xl" : "rounded-xl shadow-md"
                )}>
                    {results.map((result, index) => (
                        <div key={index} className={cn(
                            "hover:bg-accent/50 cursor-pointer border-b last:border-0 transition-colors",
                            variant === "landing" ? "p-4" : "p-2.5"
                        )} onClick={() => {
                            const bbox = result.boundingbox.join(",");
                            router.push(`/search?q=${result.display_name || result.name || result.address?.city || "Chưa xác định địa điểm."}&lat=${result.lat}&lon=${result.lon}&bbox=${bbox}`);
                        }}>
                            <label className="flex items-start gap-2.5 cursor-pointer">
                                <MapPin className={cn(
                                    "text-muted-foreground shrink-0 mt-0.5",
                                    variant === "landing" ? "h-5 w-5" : "h-4 w-4"
                                )} />
                                <div className="flex flex-col flex-1 gap-0.5">
                                    <span className={cn(
                                        "font-medium leading-tight",
                                        variant === "landing" ? "text-base" : "text-sm"
                                    )}>
                                        {result.display_name || result.name || result.address?.city || "Chưa xác định địa điểm."}
                                    </span>
                                    <span className={cn(
                                        "text-muted-foreground",
                                        variant === "landing" ? "text-sm" : "text-xs"
                                    )}>
                                        {result.address?.country}
                                    </span>
                                </div>
                            </label>
                        </div>
                    ))}
                </div>
            }
        </div>
    )
}