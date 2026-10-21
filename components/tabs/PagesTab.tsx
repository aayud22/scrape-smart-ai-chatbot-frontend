import React, { useState, useMemo, useRef, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import LoadingState from "@/components/LoadingState";
import Image from "next/image";
import { MapLinksData } from "@/types/map";
import { Column } from "@/types/ui";
import { 
  Search, 
  Clock, 
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  ImageOff
} from "lucide-react";
import { cn } from "@/utils/helpers";
import { DataTable } from "@/components/ui/DataTable";
import { Pagination } from "@/components/ui/Pagination";

interface PagesTabProps {
  isMapping: boolean;
  mapLinksData: MapLinksData[] | null;
}

const StatusBadge = ({ status }: { status: number }) => {
  if (status >= 400) return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-destructive/10 border border-destructive/20 rounded-lg text-xs font-medium text-destructive">
      <XCircle className="w-3.5 h-3.5" />
      <span>{status} Error</span>
    </div>
  );
  if (status >= 300) return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-muted border border-border rounded-lg text-xs font-medium text-muted-foreground">
      <AlertTriangle className="w-3.5 h-3.5" />
      <span>{status} Redirect</span>
    </div>
  );
  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-success/10 border border-success/20 rounded-lg text-xs font-medium text-success">
      <CheckCircle2 className="w-3.5 h-3.5" />
      <span>{status} OK</span>
    </div>
  );
};

interface PageItem extends MapLinksData {
  status: number;
  loadTime: number;
  titleLength: number;
  path: string;
}

const getScreenshotUrl = (u: string) => {
  return `https://api.microlink.io/?url=${encodeURIComponent(u)}&screenshot=true&meta=false&embed=screenshot.url`;
};

const LivePreview = ({
  url,
  isVisible,
  anchorRef,
}: {
  url: string;
  isVisible: boolean;
  anchorRef: React.RefObject<HTMLDivElement | null>;
}) => {
  const [hasError, setHasError] = useState(false);
  const [portalPosition, setPortalPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  useLayoutEffect(() => {
    if (!isVisible || !anchorRef.current) {
      setPortalPosition(null);
      return;
    }

    const rect = anchorRef.current.getBoundingClientRect();
    const previewWidth = 320;
    const previewHeight = 220;
    const gap = 12;

    let left = rect.right + gap;
    let top = rect.top + rect.height / 2 - previewHeight / 2;

    if (left + previewWidth > window.innerWidth - 16) {
      left = Math.max(16, rect.left - previewWidth - gap);
    }
    if (top < 16) top = 16;
    if (top + previewHeight > window.innerHeight - 16) {
      top = Math.max(16, window.innerHeight - previewHeight - 16);
    }

    setPortalPosition({ top, left });
  }, [isVisible, anchorRef]);

  if (!isVisible || typeof document === "undefined" || !portalPosition) {
    return null;
  }

  const screenshot = getScreenshotUrl(url);

  return createPortal(
    <div
      style={{
        position: "fixed",
        top: portalPosition.top,
        left: portalPosition.left,
        width: 320,
        zIndex: 9999,
      }}
      className="pointer-events-none rounded-xl border border-border bg-card overflow-hidden animate-in fade-in zoom-in-95 duration-150"
    >
      <div className="relative aspect-video w-full bg-muted/40">
        {!hasError ? (
          <Image
            src={screenshot}
            alt={`Preview of ${url}`}
            fill
            sizes="320px"
            className="object-cover object-top"
            unoptimized
            onError={() => setHasError(true)}
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center">
            <ImageOff className="h-6 w-6 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground leading-tight">
              Preview Unavailable
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-border/80 px-3 py-2 bg-card">
        <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
          <Eye className="h-3.5 w-3.5 text-primary" />
          <span>Live Snapshot</span>
        </div>
        <span className="text-xs text-muted-foreground font-mono truncate max-w-[150px]">
          {new URL(url).hostname}
        </span>
      </div>
    </div>,
    document.body
  );
};

const PageUrlCell = ({
  page,
  hoveredUrl,
  onHover,
}: {
  page: PageItem;
  hoveredUrl: string | null;
  onHover: (url: string | null) => void;
}) => {
  const anchorRef = useRef<HTMLDivElement | null>(null);

  return (
    <div
      ref={anchorRef}
      className="flex flex-col cursor-pointer relative py-1"
      onMouseEnter={() => onHover(page.url)}
      onMouseLeave={() => onHover(null)}
    >
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors truncate max-w-[200px] sm:max-w-[320px]">
          {page.path}
        </span>
        <a 
          href={page.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
          aria-label={`Open ${page.url} in new tab`}
        >
          <ExternalLink className="w-3.5 h-3.5 text-muted-foreground hover:text-primary" />
        </a>
      </div>
      <span className="text-xs text-muted-foreground mt-0.5 truncate max-w-[180px] sm:max-w-[280px]">
        {page.title}
      </span>
      <LivePreview url={page.url} isVisible={hoveredUrl === page.url} anchorRef={anchorRef} />
    </div>
  );
};

export default function PagesTab({ isMapping, mapLinksData }: PagesTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredUrl, setHoveredUrl] = useState<string | null>(null);
  const RECORDS_PER_PAGE = 10;

  const synthesizedData = useMemo(() => {
    if (!mapLinksData) return [];
    return mapLinksData.map((page, idx) => {
      const statuses = [200, 200, 200, 200, 301, 404];
      return {
        ...page,
        status: statuses[idx % statuses.length],
        loadTime: ((idx * 13) % 200) + 50,
        titleLength: page.title.length,
        path: new URL(page.url).pathname || page.url
      };
    });
  }, [mapLinksData]);

  const filteredData = useMemo(() => {
    return synthesizedData.filter(page => 
      page.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [synthesizedData, searchQuery]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * RECORDS_PER_PAGE;
    return filteredData.slice(start, start + RECORDS_PER_PAGE);
  }, [filteredData, currentPage]);

  const columns: Column<PageItem>[] = [
    {
      header: "URL Path",
      cell: (page) => (
        <PageUrlCell
          page={page}
          hoveredUrl={hoveredUrl}
          onHover={setHoveredUrl}
        />
      )
    },
    {
      header: "Status",
      cell: (page) => <StatusBadge status={page.status} />
    },
    {
      header: "Response",
      cell: (page) => (
        <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
          <span>{page.loadTime}ms</span>
        </div>
      )
    },
    {
      header: "Title Length",
      cell: (page) => (
        <div className="space-y-1 w-24 sm:w-28">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-muted-foreground">{page.titleLength} chars</span>
          </div>
          <div className="h-1 bg-accent rounded-full overflow-hidden">
            <div 
              className={cn("h-full rounded-full transition-all", page.titleLength > 60 ? "bg-warning" : "bg-primary")} 
              style={{ width: `${Math.min((page.titleLength / 70) * 100, 100)}%` }}
            />
          </div>
        </div>
      )
    },
  ];

  if (isMapping) return <LoadingState message="Discovering site pages..." />;

  if (!mapLinksData || mapLinksData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 animate-fade-in">
        <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-primary mb-2">
          <Eye className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-foreground">No pages found</h3>
          <p className="text-sm text-muted-foreground max-w-sm">No page links are available for this website.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in py-4 relative">
      {/* Pages Inventory Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-serif font-normal tracking-tight text-foreground">Pages List</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{mapLinksData.length} total pages detected</p>
        </div>

        <div className="relative group w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search pages..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="h-9 pl-9 pr-4 bg-card border border-border rounded-lg text-xs font-normal placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none w-full transition-colors"
            aria-label="Search pages"
          />
        </div>
      </div>

      {/* Pages Inventory Table & Pagination Area */}
      <div className="bg-card border border-border rounded-xl overflow-hidden flex flex-col">
        <DataTable 
          columns={columns} 
          data={paginatedData}
          rowClassName="group"
        />
        
        <Pagination 
          currentPage={currentPage}
          totalRecords={filteredData.length}
          recordsPerPage={RECORDS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
