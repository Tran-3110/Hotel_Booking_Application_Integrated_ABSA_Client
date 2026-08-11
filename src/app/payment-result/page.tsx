import { notFound } from "next/navigation";
import Link from "next/link";

export default function PaymentResultPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | undefined };
}) {
    const responseCode = searchParams.vnp_ResponseCode;
    const orderInfo = searchParams.vnp_OrderInfo;
    const amount = searchParams.vnp_Amount;

    if (!responseCode) {
        return notFound();
    }

    const isSuccess = responseCode === "00";

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            {isSuccess ? (
                <div className="bg-green-100 text-green-800 p-6 rounded-lg text-center shadow-md">
                    <h1 className="text-2xl font-bold mb-2">Thanh toán thành công!</h1>
                    <p>Đơn hàng: {orderInfo}</p>
                    <p>Số tiền: {Number(amount) / 100} VNĐ</p>
                </div>
            ) : (
                <div className="bg-red-100 text-red-800 p-6 rounded-lg text-center shadow-md">
                    <h1 className="text-2xl font-bold mb-2">Giao dịch thất bại</h1>
                    <p>Mã lỗi: {responseCode}</p>
                    <p>Vui lòng thử lại hoặc chọn phương thức thanh toán khác.</p>
                </div>
            )}

            <Link href="/" className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                Quay về trang chủ
            </Link>
        </div>
    );
}