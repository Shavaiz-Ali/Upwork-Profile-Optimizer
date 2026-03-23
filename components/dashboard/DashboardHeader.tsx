"use client";

import React from "react";
import { User, Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export const DashboardHeader = ({ title }: { title: string }) => {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-8">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold tracking-tight">{title}</h1>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search analyses..."
            className="w-64 pl-9 bg-muted/50 border-none focus-visible:ring-1"
          />
        </div>

        <div className="flex items-center gap-2">
          <button className="relative rounded-full p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
          </button>
          
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center border text-muted-foreground overflow-hidden cursor-pointer hover:border-primary transition-colors">
            <User className="h-5 w-5" />
          </div>
        </div>
      </div>
    </header>
  );
};
