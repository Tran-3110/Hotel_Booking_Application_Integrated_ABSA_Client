'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Package, Store } from "lucide-react"; 

export default function UserSideBar() {
    const pathName = usePathname();

    const navItems = [
        {
            name: 'Thông tin cá nhân',
            href: '/user/profile',
            icon: User, 
        },
        {
            name: 'Quản lý đơn hàng',
            href: '/user/order',
            icon: Package, 
        },
    ];

    return (
        <aside className="flex flex-col w-64 px-5 py-6 transition-all duration-300">

            {/* Tiêu đề Sidebar */}
            <div className="mb-6 px-4">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <Store className="w-5 h-5 text-purple-600" />
                    Tài khoản
                </h2>
            </div>

            {/* Menu chính */}
            <div className="flex flex-col flex-1 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathName.startsWith(item.href);

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`group px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-3 transition-all duration-200 ${
                                isActive
                                    ? 'bg-purple-50 text-purple-700 border border-purple-100 shadow-sm'
                                    : 'text-gray-500 hover:bg-purple-50 hover:text-purple-600 hover:translate-x-1 border border-transparent'
                            }`}
                        >
                            <item.icon
                                className={`h-5 w-5 transition-colors ${
                                    isActive
                                        ? 'text-purple-600'
                                        : 'text-gray-400 group-hover:text-purple-500'
                                }`}
                            />
                            {item.name}
                        </Link>
                    );
                })}
            </div>
        </aside>
    );
}