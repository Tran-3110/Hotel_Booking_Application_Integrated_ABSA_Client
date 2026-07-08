'use client';

import React from 'react';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

interface AdminPaginationProps {
    page: number; 
    totalPages: number;
    onPageChange: (newPage: number) => void;
}

const generatePagination = (currentPage: number, totalPages: number) => {
    const current = currentPage + 1; 

    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (current <= 3) {
        return [1, 2, 3, 4, '...', totalPages - 1, totalPages];
    }

    if (current >= totalPages - 2) {
        return [1, 2, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, '...', current - 1, current, current + 1, '...', totalPages];
};

export default function PaginationCustom({ page, totalPages, onPageChange }: AdminPaginationProps) {
    if (totalPages <= 1) return null;

    return (
        <Pagination>
            <PaginationContent>
                {/* Nút Trước */}
                <PaginationItem>
                    <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            if (page > 0) onPageChange(page - 1);
                        }}
                        text={"Trang trước"}
                        className={page === 0 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                </PaginationItem>

                {/* Render danh sách các số trang */}
                {generatePagination(page, totalPages).map((item, index) => (
                    <PaginationItem key={index} className="hidden sm:inline-block">
                        {item === '...' ? (
                            <PaginationEllipsis />
                        ) : (
                            <PaginationLink
                                href="#"
                                isActive={page === (item as number) - 1}
                                onClick={(e) => {
                                    e.preventDefault();
                                    onPageChange((item as number) - 1);
                                }}
                            >
                                {item}
                            </PaginationLink>
                        )}
                    </PaginationItem>
                ))}

                {/* Text hiển thị cho Mobile */}
                <PaginationItem className="sm:hidden">
                    <span className="text-sm font-medium mx-4 text-gray-500">
                        Trang {page + 1} / {totalPages}
                    </span>
                </PaginationItem>

                {/* Nút Sau */}
                <PaginationItem>
                    <PaginationNext
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            if (page < totalPages - 1) onPageChange(page + 1);
                        }}
                        text={"Trang sau"}
                        className={page >= totalPages - 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}