'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import {Store, Users, ShoppingBag, LayoutDashboard, Sparkles} from "lucide-react";

export default function AdminSideBar() {
    const pathName = usePathname();

    const navItems = [
        {
            name: 'Dashboard',
            href: '/admin/dashboard',
            icon: LayoutDashboard
        },
        {
            name: 'Quản lý khách sạn',
            href: '/admin/hotels',
            icon: Store
        },
        {
            name: 'Quản lý người dùng',
            href: '/admin/users',
            icon: Users
        },
        {
            name: 'Quản lý đơn hàng',
            href: '/admin/orders',
            icon: ShoppingBag
        },
        {
            name: 'Quản lý hệ thống AI',
            href: '/admin/ai',
            icon: Sparkles
        }
    ];

    return (
        <aside className="flex flex-col h-full w-64 px-5 py-6 transition-all duration-300">

            {/* Logo / Tên hệ thống */}
            <div className="flex items-center gap-3 mb-10 pl-2">
                <div className="flex-shrink-0 bg-purple-100 p-2 rounded-lg shadow-sm">
                    <Store className="h-6 w-6 text-purple-600" />
                </div>
                <span className="text-gray-800 font-extrabold text-2xl tracking-tight">
                    Admin Portal
                </span>
            </div>

            {/* Menu chính */}
            <div className="flex flex-col flex-1 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathName.startsWith(item.href);

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-3 transition-all duration-200 ${
                                isActive
                                    ? 'bg-purple-50 text-purple-700 border border-purple-100 shadow-sm' 
                                    : 'text-gray-500 hover:bg-purple-50 hover:text-purple-600 hover:translate-x-1'
                            }`}
                        >
                            <item.icon className={`h-5 w-5 ${isActive ? 'opacity-100' : 'opacity-70'}`} />
                            {item.name}
                        </Link>
                    );
                })}
            </div>
        </aside>
    );
}