"use client";

import { Cpu } from "lucide-react";

interface LoadingIndicatorProps {
  message?: string;
  className?: string;
}

export default function LoadingIndicator({ 
  message = "Thinking...", 
  className = "" 
}: LoadingIndicatorProps) {
  return (
    <div className={`flex items-center gap-3 py-2 ${className}`}>
      <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
        <Cpu className="w-3.5 h-3.5" />
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse [animation-duration:900ms]" />
          <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse [animation-duration:900ms] [animation-delay:200ms]" />
          <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse [animation-duration:900ms] [animation-delay:400ms]" />
        </div>
        <span className="text-xs">{message}</span>
      </div>
    </div>
  );
}
