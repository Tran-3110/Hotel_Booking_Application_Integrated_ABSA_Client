import Link from "next/link";
import { FieldSeparator } from "./ui/field";

export function Footer() {
    return (
        <footer className="w-full bg-muted border-t">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 px-6 py-12">
                <div className="flex-1 space-y-4">
                    <h4 className="font-semibold text-lg">Hỗ trợ</h4>
                    <div className="flex flex-col space-y-2">
                        <Link className="text-sm text-muted-foreground hover:text-foreground transition-colors" href="/security-center">Trung tâm thông tin bảo mật</Link>
                    </div>
                </div>
                <div className="flex-1 space-y-4">
                    <h4 className="font-semibold text-lg">Điều khoản và chính sách</h4>
                    <div className="flex flex-col space-y-2">
                        <Link className="text-sm text-muted-foreground hover:text-foreground transition-colors" href="/privacy-policy">Chính sách bảo mật</Link>
                        <Link className="text-sm text-muted-foreground hover:text-foreground transition-colors" href="/term-of-service">Điều khoản dịch vụ</Link>
                        <Link className="text-sm text-muted-foreground hover:text-foreground transition-colors" href="/accessibility-statement">Chính sách về Khả năng tiếp cận</Link>
                    </div>
                </div>
                <div className="flex-1 space-y-4">
                    <h4 className="font-semibold text-lg">Về chúng tôi</h4>
                    <div className="flex flex-col space-y-2">
                        <Link className="text-sm text-muted-foreground hover:text-foreground transition-colors" href="/about-us">Về HomeBook</Link>
                        <Link className="text-sm text-muted-foreground hover:text-foreground transition-colors" href="/contact-us">Liên hệ chúng tôi</Link>
                    </div>
                </div>
            </div>
            <FieldSeparator />
            <div className="flex justify-center p-6 bg-slate-100">
                <div className="space-y-1">
                    <p className="text-xs text-muted-foreground text-center">&copy; 2026 HomeBook. Bảo lưu mọi quyền</p>
                    <p className="text-xs text-muted-foreground text-center">Địa chỉ: Khu phố 33, phường Linh Trung, Thủ Đức, TP.HCM</p>
                </div>
            </div>
        </footer>
    )
}