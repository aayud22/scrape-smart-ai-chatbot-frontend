import React from "react";
import { X } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message: string;
  onClose?: () => void;
}

export default function ErrorState({
  title = "Something went wrong",
  message,
  onClose,
}: ErrorStateProps) {
  return (
    <div
      className="relative rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 shadow-xs animate-fade-in"
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-destructive mb-1">{title}</p>
          <div className="max-h-[120px] overflow-y-auto custom-scrollbar pr-2">
            <p className="text-xs font-normal text-destructive/90 leading-relaxed wrap-break-word whitespace-pre-wrap">
              {message}
            </p>
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-destructive/15 rounded-md transition-colors text-destructive/70 hover:text-destructive cursor-pointer shrink-0 focus-visible:ring-2 focus-visible:ring-destructive focus-visible:outline-none"
            title="Dismiss error"
            aria-label="Dismiss error"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
