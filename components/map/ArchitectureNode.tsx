import React from "react";
import { Handle, Position, NodeProps, Node } from "@xyflow/react";
import { Folder, ExternalLink, Globe } from "lucide-react";
import { cn } from "@/utils/helpers";
import { ArchitectureNodeData } from "@/types/map";

const ArchitectureNode = ({ data, selected }: NodeProps<Node>) => {
  const nodeData = data as unknown as ArchitectureNodeData;
  const isRoot = nodeData.isRoot;

  return (
    <div className="relative">
      <Handle
        type="target"
        position={Position.Left}
        className="invisible"
      />

      <div
        className={cn(
          "w-60 bg-card border rounded-xl p-3.5 transition-colors relative overflow-hidden group outline-none",
          isRoot
            ? "border-primary/60 bg-card"
            : "border-border hover:border-primary/40",
          (nodeData.isHighlighted || selected) &&
            "border-primary ring-2 ring-primary/40 bg-accent/40"
        )}
      >
        {isRoot && (
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary" />
        )}

        <div className="space-y-2.5 relative z-10">
          {/* Header row */}
          <div className="flex items-center justify-between">
            <div
              className={cn(
                "w-7 h-7 rounded-lg flex items-center justify-center transition-colors",
                isRoot
                  ? "bg-primary/15 text-primary"
                  : "bg-accent text-primary"
              )}
            >
              {isRoot ? (
                <Globe className="w-3.5 h-3.5" />
              ) : (
                <Folder className="w-3.5 h-3.5" />
              )}
            </div>
            <div
              className={cn(
                "flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border",
                isRoot
                  ? "bg-primary/10 border-primary/20 text-primary"
                  : "bg-accent border-border text-muted-foreground"
              )}
            >
              {isRoot
                ? `${nodeData.linksCount} Nodes`
                : nodeData.status || 200}
            </div>
          </div>

          {/* Title / path */}
          <div className="space-y-0.5">
            <h4 className="text-xs font-semibold truncate text-foreground">
              {nodeData.title}
            </h4>
            <div className="text-xs font-normal text-muted-foreground truncate">
              {isRoot ? "Root URL" : `/${nodeData.label.toLowerCase()}`}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2.5 border-t border-border">
            <span className="text-xs font-normal text-muted-foreground">
              {isRoot ? `${nodeData.linksCount || 0} pages` : `${nodeData.linksCount || 0} links`}
            </span>
            {!isRoot && (
              <a
                href={nodeData.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1 rounded-md text-muted-foreground hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                aria-label={`Open ${nodeData.title} in new tab`}
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="invisible"
      />
    </div>
  );
};

export default React.memo(ArchitectureNode);
