import React from "react";

interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = "Processing your request..." }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in w-full text-center">
      <div className="relative flex justify-center items-center mb-5">
        <div className="animate-spin rounded-full h-9 w-9 border-2 border-primary border-t-transparent" />
      </div>
      <p className="text-muted-foreground text-sm font-medium animate-pulse">{message}</p>
    </div>
  );
}
