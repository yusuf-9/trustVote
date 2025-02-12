import { ROUTES } from "@/client/common/config";
import { getCustomServerSession } from "@/server/utils";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";

export default async function AuthPagesLayout({ children }: PropsWithChildren) {
  const user = await getCustomServerSession();

  if (user) {
    return redirect(ROUTES.DASHBOARD);
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-main-light via-main-light/10 to-main-light p-5 sm:p-10">
      {children}
    </div>
  );
}
