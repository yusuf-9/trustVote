import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";

// config
import { ROUTES } from "@/client/common/config";

// components
import DashboardSidebar from "@/client/modules/dashboard/components/sidebar";
import DashboardHeader from "@/client/modules/dashboard/components/header";

// utils
import { getCustomServerSession } from "@/server/utils";

// providers
import ReactQueryProvider from "@/client/common/providers/query";
import WalletProvider, { WalletGateway } from "@/client/modules/polls/contexts/wallet";

export default async function ProtectedPagesLayout({ children }: PropsWithChildren) {
  const user = await getCustomServerSession();

  if (!user) {
    return redirect(ROUTES.LOGIN);
  }

  return (
    <ReactQueryProvider>
      <WalletProvider>
        <div className="min-h-screen bg-main-light">
          {/* Sidebar */}
          <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-main-light bg-white flex flex-col">
            <div className="flex h-16 items-center border-b border-main-light px-6">
              <span className="text-xl font-bold text-main">TrustVote</span>
            </div>
            <DashboardSidebar />
          </aside>

          {/* Main Content */}
          <div className="ml-64">
            <DashboardHeader />
            <main className="p-6">
              <WalletGateway>{children}</WalletGateway>
            </main>
          </div>
        </div>
      </WalletProvider>
    </ReactQueryProvider>
  );
}
