import React from "react";
import { cn } from "@/utils/helpers";

interface SeoGaugeProps {
  score: number;
}

export const SeoGauge = ({ score }: SeoGaugeProps) => {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  let color = "text-destructive";
  if (score >= 80) color = "text-success";
  else if (score >= 50) color = "text-warning";

  return (
    <div className="relative flex items-center justify-center w-44 aspect-square shrink-0">
      <svg
        viewBox="0 0 192 192"
        preserveAspectRatio="xMidYMid meet"
        className="w-full h-full transform -rotate-90"
      >
        <circle
          cx="96"
          cy="96"
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth="12"
          className="text-border"
        />
        <circle
          cx="96"
          cy="96"
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={cn(color, "transition-all duration-700 ease-out")}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold tracking-tight text-foreground">{score}</span>
        <span className="text-xs font-medium text-muted-foreground mt-0.5">SEO Score</span>
      </div>
    </div>
  );
};
