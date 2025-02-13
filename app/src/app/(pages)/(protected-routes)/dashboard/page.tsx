import { redirect } from "next/navigation";
import { ROUTES } from "@/client/common/config";

export default function DashboardPage() {
    return redirect(ROUTES.POLLS);
}
