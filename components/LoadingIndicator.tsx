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
    <div className={`flex w-full justify-start items-center gap-3 ${className} animate-pulse`}>
      {/* Avatar Container */}
      <div className="shrink-0 relative">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
          <Cpu className="w-4 h-4 text-primary-foreground" />
        </div>
      </div>

      {/* Message Container */}
      <div className="flex flex-col gap-1">
        {/* Typing Dots Container */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-2xl rounded-tl-none shadow-sm">
          <div className="flex gap-1.5">
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-duration:1s]" />
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-duration:1s] [animation-delay:0.2s]" />
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-duration:1s] [animation-delay:0.4s]" />
          </div>
        </div>
        
        {/* Status Text */}
        <div className="text-xs text-muted-foreground ml-1">
          {message}
        </div>
      </div>
    </div>
  );
}
