"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Folder,
  ChevronDown,
  ExternalLink,
  Globe,
} from "lucide-react";
import { cn } from "@/utils/helpers";
import { MapLinksData, GroupedNode, NodeGroup } from "@/types/map";

interface DirectoryPanelProps {
  mapLinksData: MapLinksData[];
  searchQuery: string;
  selectedUrl?: string | null;
  onNodeSelect?: (url: string) => void;
}

export default function DirectoryPanel({
  mapLinksData,
  searchQuery,
  selectedUrl,
  onNodeSelect,
}: DirectoryPanelProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    new Set(["root"])
  );

  const toggleGroup = (groupName: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupName)) next.delete(groupName);
      else next.add(groupName);
      return next;
    });
  };

  // Group URLs by first path segment
  const groups = useMemo<NodeGroup[]>(() => {
    if (!mapLinksData) return [];

    const pathMap: Record<string, GroupedNode[]> = {};

    mapLinksData.forEach((item, idx) => {
      try {
        const urlObj = new URL(item.url);
        const segments = urlObj.pathname.split("/").filter(Boolean);
        const groupKey = segments[0] || "root";
        const nodeId = `NODE-${String(idx + 1).padStart(3, "0")}`;

        if (!pathMap[groupKey]) pathMap[groupKey] = [];
        pathMap[groupKey].push({
          id: nodeId,
          label: segments.slice(1).join("/") || segments[0] || "/",
          url: item.url,
          title: item.title,
          path: urlObj.pathname,
          status: idx % 3 === 0 ? "synced" : idx % 3 === 1 ? "pending" : "synced",
        });
      } catch {
        // skip invalid URLs
      }
    });

    return Object.entries(pathMap).map(
      ([key, nodes]) => ({
        name: key.charAt(0).toUpperCase() + key.slice(1).replace(/[-_]/g, " "),
        icon: Globe,
        nodes,
      })
    );
  }, [mapLinksData]);

  // Filter by search query
  const filteredGroups = useMemo(() => {
    if (!searchQuery) return groups;
    return groups
      .map((group) => ({
        ...group,
        nodes: group.nodes.filter(
          (node) =>
            node.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            node.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
            node.id.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      }))
      .filter((group) => group.nodes.length > 0);
  }, [groups, searchQuery]);

  const totalNodes = mapLinksData?.length || 0;

  return (
    <div className="flex flex-col h-full min-h-0 bg-card overflow-hidden w-full">
      {/* Directory Header */}
      <div className="p-4 border-b border-border shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Folder className="w-4 h-4" />
            </div>
            <span className="text-sm font-semibold text-foreground">
              Directory Tree
            </span>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-0.5 bg-accent border border-border rounded-full text-xs font-medium text-muted-foreground">
            {totalNodes} links
          </div>
        </div>
      </div>

      {/* Scrollable Directory List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0">
        <div className="p-2 space-y-1">
          {filteredGroups.map((group) => {
            const isExpanded = expandedGroups.has(group.name);

            return (
              <div key={group.name} className="rounded-xl overflow-hidden">
                {/* Group Header */}
                <button
                  type="button"
                  onClick={() => toggleGroup(group.name)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none",
                    isExpanded
                      ? "bg-accent/60"
                      : "hover:bg-accent/30"
                  )}
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <group.icon className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="text-xs font-semibold text-foreground truncate">
                      {group.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {group.nodes.length > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {group.nodes.length}
                      </span>
                    )}
                    <ChevronDown
                      className={cn(
                        "w-3.5 h-3.5 text-muted-foreground transition-transform duration-200",
                        !isExpanded && "-rotate-90"
                      )}
                    />
                  </div>
                </button>

                {/* Group Items */}
                <AnimatePresence initial={false}>
                  {isExpanded && group.nodes.length > 0 && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="overflow-hidden"
                    >
                      <div className="pl-3 pr-1 py-1 space-y-1">
                        {group.nodes.map((node) => (
                          <div
                            key={node.id}
                            onClick={() => onNodeSelect?.(node.url)}
                            className={cn(
                              "flex items-center justify-between px-3 py-2 rounded-lg transition-all cursor-pointer group/node",
                              selectedUrl === node.url
                                ? "bg-primary/10 ring-1 ring-primary/30"
                                : "hover:bg-accent/40"
                            )}
                          >
                            <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-mono font-medium text-foreground truncate">
                                  {node.label || node.id}
                                </span>
                                <StatusBadge status={node.status} />
                              </div>
                              <span className="text-xs text-muted-foreground truncate block">
                                {node.url.replace(/^https?:\/\//, "")}
                              </span>
                            </div>
                            <a
                              href={node.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              aria-label={`Open ${node.url} in new tab`}
                              className="p-1.5 rounded-md text-muted-foreground hover:text-primary transition-all opacity-0 group-hover/node:opacity-100 focus:opacity-100"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

const StatusBadge = ({ status }: { status: "synced" | "pending" | "error" }) => {
  const styles = {
    synced: "bg-success/10 text-success border-success/20",
    pending: "bg-warning/10 text-warning border-warning/20",
    error: "bg-destructive/10 text-destructive border-destructive/20",
  };

  const labels = {
    synced: "Synced",
    pending: "Pending",
    error: "Error",
  };

  return (
    <span
      className={cn(
        "px-1.5 py-0.5 rounded text-xs font-medium border",
        styles[status]
      )}
    >
      {labels[status]}
    </span>
  );
};
