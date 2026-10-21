"use client";

import React, { useState } from "react";
import { Network, List } from "lucide-react";
import { cn } from "@/utils/helpers";
import { MapLinksData } from "@/types/map";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import MapTab from "@/components/tabs/MapTab";
import PagesTab from "@/components/tabs/PagesTab";

interface SiteMapTabProps {
  isMapping: boolean;
  mapLinksData: MapLinksData[] | null;
  error: string | null;
}

export default function SiteMapTab({
  isMapping,
  mapLinksData,
  error,
}: SiteMapTabProps) {
  const [viewMode, setViewMode] = useState<"graph" | "list">("graph");

  if (isMapping) {
    return <LoadingState message="Discovering site links..." />;
  }

  if (error) {
    return <ErrorState title="Site map failed" message={error} />;
  }

  if (!mapLinksData || mapLinksData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in w-full">
        <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-primary mb-2">
          <Network className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-foreground">No site map data</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
          No links were found for this website.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* View Switcher Header */}
      <div className="shrink-0 flex items-center justify-between gap-3 px-4 sm:px-6 py-2.5 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          <span className="text-base font-serif font-normal text-foreground">
            Site Map
          </span>
          <span className="text-xs text-muted-foreground">
            ({mapLinksData.length} pages found)
          </span>
        </div>

        <div className="flex items-center gap-1 bg-accent/60 p-1 rounded-lg border border-border">
          <button
            type="button"
            onClick={() => setViewMode("graph")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              viewMode === "graph"
                ? "bg-card text-foreground font-semibold border border-border/60"
                : "text-muted-foreground hover:text-foreground font-normal"
            )}
            aria-label="View graph"
          >
            <Network className="w-3.5 h-3.5" />
            <span>Graph</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              viewMode === "list"
                ? "bg-card text-foreground font-semibold border border-border/60"
                : "text-muted-foreground hover:text-foreground font-normal"
            )}
            aria-label="View list"
          >
            <List className="w-3.5 h-3.5" />
            <span>List</span>
          </button>
        </div>
      </div>

      {/* View Content */}
      <div className="flex-1 min-h-0 overflow-hidden pb-[calc(4.25rem+env(safe-area-inset-bottom))] md:pb-0 flex flex-col">
        {viewMode === "graph" ? (
          <div className="h-full flex-1 min-h-0 relative">
            <MapTab isMapping={false} mapLinksData={mapLinksData} error={null} />
          </div>
        ) : (
          <div className="h-full flex-1 min-h-0 overflow-y-auto px-4 md:px-8 py-4">
            <PagesTab isMapping={false} mapLinksData={mapLinksData} />
          </div>
        )}
      </div>
    </div>
  );
}
