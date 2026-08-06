import HotelManagement from "@/components/admin/hotel-management";
import {UserRole} from "@/common/enums/user";

export default function HotelOwnerPage() {
    return <HotelManagement role={UserRole.OWNER} />;
}