"use client";

import { usePathname } from "next/navigation";
import { BarChart3, Vote, PlusCircle, FileStack } from "lucide-react";
import Link from "next/link";
import { cn } from "@/client/common/utils";
import { Button } from "@/client/common/components/ui/button";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { ROUTES } from "@/client/common/config";

interface SidebarLink {
  icon: React.ElementType;
  label: string;
  href: string;
}

const sidebarLinks: SidebarLink[] = [
  { icon: FileStack, label: "Created Polls", href: ROUTES.POLLS },
  { icon: Vote, label: "Cast Votes", href: ROUTES.VOTER_POLLS },
  { icon: BarChart3, label: "Poll Results", href: ROUTES.POLL_RESULTS },
  { icon: PlusCircle, label: "Create Poll", href: ROUTES.CREATE_POLL },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  return (
    <>
      <nav className="flex-grow space-y-1 p-4">
        {sidebarLinks.map(link => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                isActive ? "bg-main-light text-main" : "text-text-light hover:bg-main-light hover:text-main"
              )}
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-[hsl(var(--main-light))] p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-[hsl(var(--text-light))]"
          onClick={() => signOut()}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </>
  );
}
