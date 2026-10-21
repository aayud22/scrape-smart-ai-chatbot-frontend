"use client";

import React from "react";
import {
  MessageSquare,
  BarChart3,
  FileText,
  Network,
} from "lucide-react";
import { cn } from "@/utils/helpers";
import { SidebarItemType } from "@/types/common";
import { Dispatch, SetStateAction } from "react";

interface BottomNavProps {
  activeTab: SidebarItemType;
  setActiveTab: Dispatch<SetStateAction<SidebarItemType>>;
}

const NAV_ITEMS = [
  { id: "chat", icon: MessageSquare, label: "Chat" },
  { id: "seo", icon: BarChart3, label: "SEO" },
  { id: "scrape", icon: FileText, label: "Scrape" },
  { id: "map", icon: Network, label: "Site map" },
] as const;

export function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border px-2 pt-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] z-50 flex items-center justify-around">
      {NAV_ITEMS.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as SidebarItemType)}
            aria-label={item.label}
            className={cn(
              "flex flex-col items-center justify-center gap-1 px-3 py-1.5 rounded-lg transition-colors duration-150 min-w-16 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              isActive
                ? "bg-accent text-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground font-normal"
            )}
          >
            <item.icon className={cn("w-4 h-4 stroke-[1.75px]", isActive && "text-primary")} />
            <span className="text-xs leading-none">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
