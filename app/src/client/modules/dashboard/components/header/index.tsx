"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { Button } from "@/client/common/components/ui/button";
import { Input } from "@/client/common/components/ui/input";
import { User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/client/common/components/ui/dropdown-menu";

export default function DashboardHeader() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<string[]>([]);

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask");
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccounts(accounts);
      setWalletAddress(accounts[0]);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const selectAccount = (account: string) => {
    setWalletAddress(account);
  };

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
        {walletAddress ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="text-sm">
                {`${walletAddress.slice(0,6)}...${walletAddress.slice(-4)}`}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {accounts.map((account) => (
                <DropdownMenuItem key={account} onClick={() => selectAccount(account)}>
                  {`${account.slice(0,6)}...${account.slice(-4)}`}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button variant="outline" onClick={connectWallet} className="text-sm">
            Connect Wallet
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
        >
          <User className="h-5 w-5 text-[hsl(var(--text-light))]" />
        </Button>
      </div>
    </header>
  );
}
