import OwnerSideBar from "@/components/owner/owner-side-bar";

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex w-full bg-gray-50">
            <OwnerSideBar />

            <main className="flex-1">
                {children}
            </main>

        </div>
    );
}