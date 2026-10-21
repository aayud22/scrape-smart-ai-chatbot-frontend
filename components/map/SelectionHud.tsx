import React from "react";
import { X, Target, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { SelectedNode } from "@/types/map";

interface SelectionHudProps {
  selectedNodes: SelectedNode[];
  onClear: () => void;
}

const SelectionHud = ({ selectedNodes, onClear }: SelectionHudProps) => {
  if (selectedNodes.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-32 left-1/2 -translate-x-1/2 z-100 w-full max-w-2xl px-4 pointer-events-none"
      >
        <div className="bg-card border border-border rounded-xl p-5 pointer-events-auto overflow-hidden relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold leading-none">Selected Pages</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedNodes.length} {selectedNodes.length === 1 ? 'page' : 'pages'} selected
                </p>
              </div>
            </div>
            <button 
              onClick={onClear}
              aria-label="Clear selection"
              className="p-1.5 hover:bg-accent rounded-full transition-all text-muted-foreground hover:text-foreground group cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="max-h-48 overflow-y-auto custom-scrollbar space-y-2 pr-2">
            {selectedNodes.map((node) => (
              <div 
                key={node.id}
                className="flex items-center justify-between p-3 bg-muted/40 border border-border/50 rounded-xl group/item hover:border-primary/40 transition-all"
              >
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-xs font-medium text-primary">
                    /{node.data.label}
                  </span>
                  <p className="text-xs text-foreground truncate">
                    {node.data.title || node.data.label}
                  </p>
                </div>
                <a 
                  href={node.data.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label={`Open ${node.data.title || node.data.label} in new tab`}
                  className="p-1.5 hover:bg-primary/10 rounded-lg text-muted-foreground hover:text-primary transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SelectionHud;
