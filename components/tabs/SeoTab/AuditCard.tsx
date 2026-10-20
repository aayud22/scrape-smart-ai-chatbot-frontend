import React from "react";
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { cn } from "@/utils/helpers";
import { AuditStatus } from "@/types/seo";

interface AuditCardProps {
  icon: React.ElementType;
  title: string;
  content: string;
  status: AuditStatus;
  extra?: string;
}

export const AuditCard = ({ 
  icon: Icon, 
  title, 
  content, 
  status, 
  extra 
}: AuditCardProps) => {
  const statusStyles = {
    passed: { 
      bg: "bg-primary/10", 
      border: "border-primary/20", 
      text: "text-primary", 
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
      label: "Passed"
    },
    warning: { 
      bg: "bg-amber-500/10", 
      border: "border-amber-500/20", 
      text: "text-amber-500", 
      icon: <AlertCircle className="w-3.5 h-3.5" />,
      label: "Warning"
    },
    error: { 
      bg: "bg-red-500/10", 
      border: "border-red-500/20", 
      text: "text-red-500", 
      icon: <XCircle className="w-3.5 h-3.5" />,
      label: "Missing"
    }
  };

  const style = statusStyles[status];

  return (
    <div className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-3.5 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center text-primary">
          <Icon className="w-4 h-4" />
        </div>
        <div className={cn("px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 border", style.bg, style.text, style.border)}>
          {style.icon}
          <span>{style.label}</span>
        </div>
      </div>
      
      <div className="space-y-1">
        <div className="text-xs font-medium text-muted-foreground">{title}</div>
        <div className="text-sm font-semibold text-foreground leading-snug line-clamp-2">{content}</div>
        {extra && <div className="text-xs font-normal text-muted-foreground">{extra}</div>}
      </div>
    </div>
  );
};
