import AdminSideBar from "@/components/admin/admin-side-bar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex w-full bg-gray-50">
            <AdminSideBar />

            <main className="flex-1">
                {children}
            </main>

        </div>
    );
}