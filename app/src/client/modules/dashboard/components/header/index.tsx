
"use client";

import { Search } from "lucide-react";

import { Button } from "@/client/common/components/ui/button";
import { Input } from "@/client/common/components/ui/input";
import { User } from "lucide-react";

export default function DashboardHeader() {
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
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full"
      >
        <User className="h-5 w-5 text-[hsl(var(--text-light))]" />
      </Button>
    </header>
  );
}
