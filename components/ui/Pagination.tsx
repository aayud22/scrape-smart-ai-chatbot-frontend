import React from "react";
import { cn } from "@/utils/helpers";
import { ChevronLeft, ChevronRight, ArrowRight, ArrowLeft } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalRecords: number;
  recordsPerPage: number;
  onPageChange: (page: number) => void;
  className?: string;
  variant?: "table" | "minimal";
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalRecords,
  recordsPerPage,
  onPageChange,
  className,
  variant = "table"
}) => {
  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  const startRecord = totalRecords > 0 ? (currentPage - 1) * recordsPerPage + 1 : 0;
  const endRecord = Math.min(currentPage * recordsPerPage, totalRecords);

  if (totalPages <= 1 && totalRecords <= recordsPerPage) {
    if (variant === "minimal") return null;
    return (
      <div className={cn("px-6 py-4 bg-accent/10 border-t border-border flex items-center justify-between", className)}>
        <div className="text-xs text-muted-foreground">
          Showing {totalRecords} records
        </div>
      </div>
    );
  }

  const getPageRange = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    
    if (currentPage <= 3) return [1, 2, 3, 4, "...", totalPages];
    if (currentPage >= totalPages - 2) return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    
    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  };

  const pages = getPageRange();

  if (variant === "minimal") {
    return (
      <div className={cn("flex items-center justify-center gap-3 py-6", className)}>
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          aria-label="Previous page"
          className="p-2.5 bg-card border border-border rounded-lg text-muted-foreground hover:text-foreground transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1.5 px-4 py-2 bg-card rounded-lg border border-border">
          {pages.map((p, i) => (
            <React.Fragment key={i}>
              {p === "..." ? (
                <span className="text-xs text-muted-foreground px-1 select-none">...</span>
              ) : (
                <button
                  onClick={() => onPageChange(p as number)}
                  aria-label={`Page ${p}`}
                  className={cn(
                    "w-7 h-7 rounded-md text-xs font-medium transition-all cursor-pointer",
                    currentPage === p 
                      ? "bg-primary text-primary-foreground shadow-sm" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {p}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          className="p-2.5 bg-card border border-border rounded-lg text-muted-foreground hover:text-foreground transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center gap-1.5 px-4"
        >
          <span className="text-xs font-medium">Next</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className={cn("px-4 sm:px-6 py-4 bg-accent/10 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4", className)}>
      {/* Showing records count */}
      <div className="text-xs text-muted-foreground text-center sm:text-left">
        Showing <span className="text-foreground font-medium">{startRecord}-{endRecord}</span> of <span className="text-foreground font-medium">{totalRecords}</span> records
      </div>

      {/* Responsive Pagination Controls */}
      <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          aria-label="Previous page"
          className="flex items-center justify-center h-8 px-3 gap-1.5 bg-card border border-border rounded-lg text-xs font-medium transition-colors hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Prev</span>
        </button>

        {/* Compact design for mobile */}
        <div className="flex sm:hidden items-center gap-1.5 text-xs font-medium">
          <span className="text-foreground font-semibold">{currentPage}</span>
          <span className="text-muted-foreground">/</span>
          <span className="text-muted-foreground">{totalPages}</span>
        </div>

        {/* Full numbered design for desktop */}
        <div className="hidden sm:flex items-center gap-1 mx-1">
          {pages.map((p, i) => (
            <React.Fragment key={i}>
              {p === "..." ? (
                <span className="text-xs text-muted-foreground px-1">...</span>
              ) : (
                <button
                  onClick={() => onPageChange(p as number)}
                  aria-label={`Page ${p}`}
                  className={cn(
                    "w-8 h-8 rounded-lg text-xs font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    currentPage === p 
                      ? "bg-primary text-primary-foreground font-semibold" 
                      : "bg-card border border-border text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  {p}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          className="flex items-center justify-center h-8 px-3 gap-1.5 bg-card border border-border rounded-lg text-xs font-medium transition-colors hover:bg-accent disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <span>Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
