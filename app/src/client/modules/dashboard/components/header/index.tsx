"use client";

import { LogOut, Search, Settings } from "lucide-react";
import { Button } from "@/client/common/components/ui/button";
import { Input } from "@/client/common/components/ui/input";
import { User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/client/common/components/ui/dropdown-menu";
import { useWallet } from "@/client/modules/polls/contexts/wallet";
import { signOut } from "next-auth/react";
import useUserInfo from "@/client/modules/auth/hooks/use-user-info";

export default function DashboardHeader() {
  const { wallet, isConnected } = useWallet();

  const { userInfo } = useUserInfo();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-main-light bg-white px-6">
      <div className="flex flex-1 items-center gap-4">
        <Search className="h-4 w-4 text-text-light" />
        <Input
          type="search"
          placeholder="Search polls..."
          className="w-[300px] bg-transparent"
        />
      </div>
      <div className="flex items-center gap-2">
        {isConnected ? (
          <h6 className="text-sm text-text-light bg-white border border-main-light rounded-md px-2 py-1">
            {`${wallet?.slice(0, 6)}...${wallet?.slice(-4)}`}
          </h6>
        ) : (
          <h6 className="text-sm text-text-light bg-white border border-main-light rounded-md px-2 py-1">
            No wallet connected
          </h6>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-8 w-8 rounded-full bg-green p-0"
            >
              <User className="h-4 w-4 text-[#0F9D58]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56"
            align="end"
            forceMount
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{userInfo?.name ?? ""}</p>
                <p className="text-xs leading-none text-muted-foreground">{userInfo?.email ?? ""}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              disabled
            >
              <Settings className="mr-2 h-4 w-4" />
              <span className="text-sm">Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() =>
                signOut({
                  redirect: true,
                  callbackUrl: "/auth/login",
                })
              }
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span className="text-sm">Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
