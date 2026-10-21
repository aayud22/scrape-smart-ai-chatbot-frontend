"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  MessageSquare,
  FileText,
  Network,
  Plus,
  Cpu,
  PieChart,
} from "lucide-react";
import { cn } from "@/utils/helpers";
import { Tooltip } from "@/components/ui/Tooltip";

import { SidebarItemType } from "@/types/common";
import { Dispatch, SetStateAction } from "react";

interface SidebarProps {
  activeTab: SidebarItemType;
  setActiveTab: Dispatch<SetStateAction<SidebarItemType>>;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  onNewExtraction?: () => void;
}

const SIDEBAR_ITEMS = [
  { id: "chat", label: "Chat", icon: MessageSquare },
  { id: "seo", label: "SEO audit", icon: PieChart },
  { id: "scrape", label: "Scrape", icon: FileText },
  { id: "map", label: "Site map", icon: Network },
] as const;

/** Wraps children in a Tooltip only when the sidebar is collapsed */
const ConditionalTooltip = ({
  show,
  label,
  children,
}: {
  show: boolean;
  label: string;
  children: React.ReactElement;
}) => {
  if (!show) return children;
  return (
    <Tooltip content={label} side="right" sideOffset={12}>
      {children}
    </Tooltip>
  );
};

export function Sidebar({ activeTab, setActiveTab, isCollapsed, onNewExtraction }: SidebarProps) {
  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 260 }}
      className="hidden md:flex flex-col h-screen bg-card border-r border-border sticky top-0 z-40 transition-colors duration-300 overflow-hidden"
    >
      {/* Brand Logo Area */}
      <div className={cn("px-6 pt-8 pb-4 transition-opacity duration-200", isCollapsed ? "opacity-0" : "opacity-100")}>
        {!isCollapsed && (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
              <Cpu className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight leading-none">ScrapeSmart</span>
              <span className="text-xs font-medium text-primary">AI</span>
            </div>
          </div>
        )}
      </div>

      {/* Primary Action Button */}
      <div className="px-3 pb-6">
        <ConditionalTooltip show={isCollapsed} label="New Extraction">
          <button 
            onClick={onNewExtraction}
            aria-label="New Extraction"
            className={cn(
              "flex items-center gap-2 bg-primary hover:bg-primary-hover text-primary-foreground font-medium text-xs rounded-lg transition-colors w-full cursor-pointer justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              isCollapsed ? "h-11" : "h-9 px-4"
            )}
          >
            <Plus className="w-4 h-4" />
            {!isCollapsed && <span>New Extraction</span>}
          </button>
        </ConditionalTooltip>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {SIDEBAR_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <ConditionalTooltip key={item.id} show={isCollapsed} label={item.label}>
              <button
                onClick={() => setActiveTab(item.id as SidebarItemType)}
                aria-label={item.label}
                className={cn(
                  "group relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-150 w-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  isCollapsed && "justify-center",
                  isActive
                    ? "bg-accent text-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50 font-normal"
                )}
              >
                <item.icon className={cn("w-4 h-4 shrink-0", isActive ? "text-primary opacity-100" : "opacity-70 group-hover:opacity-100")} />
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.15 }}
                    className="text-xs"
                  >
                    {item.label}
                  </motion.span>
                )}
                {isActive && !isCollapsed && (
                  <motion.div 
                    layoutId="active-indicator"
                    className="absolute left-0 w-0.5 h-4 bg-primary rounded-r-full"
                  />
                )}
              </button>
            </ConditionalTooltip>
          );
        })}
      </nav>

    </motion.aside>
  );
}
