import { imageLoader } from "@/common/utils/image-loader";
import { NavBar } from "@/components/nav-bar";
import SearchToolBar from "@/components/search/search-tool-bar";
import Image from "next/image";

export default function Home() {
    return (
        <div>
            <NavBar />
            <section className="relative w-screen h-screen">
                <div className="absolute top-0 left-0 w-screen h-screen z-1 bg-black opacity-50"></div>
                <div className="absolute top-0 left-0 w-screen h-screen z-0">
                    <Image
                        loader={imageLoader}
                        src={"/landing-background.webp"}
                        sizes="100vw"
                        fill
                        alt="Landing image"
                    />
                </div>
                <div className="absolute z-2 flex flex-col gap-4 justify-center items-center w-full h-full">
                    <div className="space-y-4">
                        <h3 className="text-neutral-50 text-5xl font-semibold">
                            Tìm chỗ nghỉ tiếp theo cho chuyến du lịch của bạn
                        </h3>
                        <p className="text-neutral-50 text-center text-2xl">
                            Biến mỗi chuyến đi trở thành những hành trình đáng nhớ
                        </p>
                    </div>
                    <SearchToolBar />
                </div>
            </section>
        </div>
    );
}
