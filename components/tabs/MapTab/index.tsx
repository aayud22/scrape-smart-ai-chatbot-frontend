import React, { useState, useRef } from "react";
import {
  ReactFlowProvider,
  type ReactFlowInstance,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import DirectoryPanel from "@/components/map/DirectoryPanel";
import {
  Search,
  Target,
  MousePointer2,
  Hand,
  PanelRightOpen,
  PanelRightClose,
} from "lucide-react";
import { cn } from "@/utils/helpers";
import { ZoomControls } from "./ZoomControls";
import { MapCanvas } from "./MapCanvas";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";

import { MapLinksData, InteractionMode } from "@/types/map";

interface MapTabProps {
  isMapping: boolean;
  mapLinksData: MapLinksData[] | null;
  error: string | null;
}

export default function MapTab({ isMapping, mapLinksData, error }: MapTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [interactionMode, setInteractionMode] = useState<InteractionMode>(
    "pan"
  );
  const [showPanel, setShowPanel] = useState(true);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const flowRef = useRef<ReactFlowInstance | null>(null);

  if (isMapping)
    return (
      <LoadingState message="Mapping site links..." />
    );
  if (error)
    return <ErrorState title="Failed to map site" message={error} />;
  if (!mapLinksData) return null;

  return (
    <ReactFlowProvider>
      <div className="flex flex-col h-full overflow-hidden">
        {/* ── Sub-header Toolbar ── */}
        <div className="shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-6 py-2.5 border-b border-border bg-card">
          {/* Left: Title */}
          <h2 className="text-sm font-semibold tracking-tight whitespace-nowrap text-foreground">
            Site Graph
          </h2>

          {/* Right: Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Search */}
            <div className="relative group/search">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-focus-within/search:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Find node or URL..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 w-full sm:w-56 pl-9 pr-3 bg-accent/50 border border-border rounded-xl text-xs font-normal placeholder:text-muted-foreground/60 focus:border-primary/50 outline-none transition-all"
                aria-label="Find node or URL"
              />
            </div>

            {/* Zoom + Reset */}
            <ZoomControls />

            {/* Mode Toggle */}
            <div className="flex items-center gap-0.5 p-0.5 bg-accent/50 border border-border rounded-xl">
              <button
                type="button"
                onClick={() => setInteractionMode("select")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none",
                  interactionMode === "select"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
                aria-label="Select mode"
              >
                <MousePointer2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Select</span>
              </button>
              <button
                type="button"
                onClick={() => setInteractionMode("pan")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none",
                  interactionMode === "pan"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
                aria-label="Pan mode"
              >
                <Hand className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Pan</span>
              </button>
            </div>

            {/* Toggle Panel */}
            <button
              type="button"
              onClick={() => setShowPanel(!showPanel)}
              className="hidden md:flex items-center justify-center w-9 h-9 bg-accent/50 border border-border rounded-xl text-muted-foreground hover:text-foreground transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              title={showPanel ? "Hide directory panel" : "Show directory panel"}
              aria-label={showPanel ? "Hide directory panel" : "Show directory panel"}
            >
              {showPanel ? (
                <PanelRightClose className="w-4 h-4" />
              ) : (
                <PanelRightOpen className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <div className="flex-1 flex min-h-0 overflow-hidden relative @container">
          {/* Left: ReactFlow Tree Canvas */}
          <div className="flex-1 relative min-w-0 transition-all duration-300">
            <MapCanvas
              mapLinksData={mapLinksData}
              searchQuery={searchQuery}
              interactionMode={interactionMode}
              selectedUrl={selectedUrl}
              onInit={(instance) => {
                flowRef.current = instance;
              }}
            />

            {/* Bottom-left status badge */}
            <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 px-3 py-1.5 bg-card border border-border rounded-lg text-xs font-medium text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span>Interactive Graph</span>
            </div>
          </div>

          {/* Right: DirectoryPanel */}
          <div
            className={cn(
              "flex flex-col min-h-0 h-full overflow-hidden bg-card border-l border-border transition-all duration-300 shrink-0 z-20",
              "absolute inset-y-0 right-0",
              "@2xl:relative",
              showPanel
                ? "w-full max-w-md @2xl:w-90 @3xl:w-100"
                : "w-0 border-l-0"
            )}
          >
            {showPanel && (
              <DirectoryPanel
                mapLinksData={mapLinksData}
                searchQuery={searchQuery}
                selectedUrl={selectedUrl}
                onNodeSelect={(url) => {
                  setSelectedUrl(url);
                }}
              />
            )}
          </div>
        </div>

        {/* ── Mobile: Panel Toggle FAB ── */}
        <button
          type="button"
          onClick={() => setShowPanel(!showPanel)}
          className="md:hidden fixed bottom-[calc(4.75rem+env(safe-area-inset-bottom))] right-4 z-50 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary-hover transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none cursor-pointer"
          aria-label={showPanel ? "Hide directory panel" : "Show directory panel"}
        >
          {showPanel ? (
            <Target className="w-5 h-5" />
          ) : (
            <PanelRightOpen className="w-5 h-5" />
          )}
        </button>
      </div>
    </ReactFlowProvider>
  );
}
