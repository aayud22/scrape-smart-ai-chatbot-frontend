import React from "react";
import { useReactFlow } from "@xyflow/react";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";

export const ZoomControls = () => {
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5 p-0.5 bg-accent/50 border border-border rounded-xl">
        <button
          type="button"
          onClick={() => zoomIn()}
          className="p-2 hover:bg-card rounded-lg transition-all text-muted-foreground hover:text-foreground cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          title="Zoom in"
          aria-label="Zoom in"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => zoomOut()}
          className="p-2 hover:bg-card rounded-lg transition-all text-muted-foreground hover:text-foreground cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          title="Zoom out"
          aria-label="Zoom out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
      </div>
      <button
        type="button"
        onClick={() => fitView({ padding: 0.3, duration: 500 })}
        className="flex items-center gap-1.5 h-9 px-3 bg-accent/50 border border-border rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
        aria-label="Reset zoom and center graph"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Reset</span>
      </button>
    </div>
  );
};
