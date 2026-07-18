import UserSideBar from "@/components/user/user-side-bar";

export default function UserLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex mt-20 w-full bg-gray-50">
            <UserSideBar />

            <main className="flex-1">
                {children}
            </main>

        </div>
    );
}