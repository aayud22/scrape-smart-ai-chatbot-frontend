import React, { useState, useMemo, Dispatch, SetStateAction } from "react";
import LoadingState from "../LoadingState";
import ErrorState from "../ErrorState";
import { 
  Copy, 
  Download, 
  FileJson, 
  FileText, 
  Table as TableIcon,
  Maximize2,
  Check
} from "lucide-react";
import { cn } from "@/utils/helpers";
import { ScrapeData, ScrapeView } from "@/types/scrape";

interface ScrapeTabProps {
  isScraping: boolean;
  scrapeData: ScrapeData | null;
  scrapeView: ScrapeView;
  setScrapeView: Dispatch<SetStateAction<ScrapeView>>;
  handleDownload: (format: "json" | "markdown") => void;
  error: string;
  targetUrl?: string;
}

const ConfidenceDots = ({ percentage }: { percentage: number }) => {
  return (
    <div className="flex gap-1 shrink-0">
      {[1, 2, 3].map((i) => (
        <div 
          key={i} 
          className={cn(
            "w-1.5 h-1.5 rounded-full",
            percentage > (i * 30) ? "bg-emerald-500" : "bg-muted"
          )} 
        />
      ))}
    </div>
  );
};

const DataTable = ({ data }: { data: ScrapeData | null }) => {
  const tableRows = useMemo(() => {
    if (!data) return [];
    
    return [
      { id: "metadata.title", content: "Main Page Title", confidence: 99 },
      { id: "metadata.desc", content: "Primary meta description for domain visibility", confidence: 98 },
      { id: "content.h1", content: "Page heading and primary content", confidence: 99 },
      { id: "content.cta", content: "Primary calls to action and links", confidence: 95 },
    ];
  }, [data]);

  return (
    <div className="w-full overflow-hidden rounded-xl border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-accent/40 border-b border-border">
              <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">Field</th>
              <th className="px-4 py-3 text-xs font-semibold text-muted-foreground">Extracted Value</th>
              <th className="px-4 py-3 text-xs font-semibold text-muted-foreground text-right">Confidence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {tableRows.map((row, idx) => (
              <tr key={idx} className="hover:bg-accent/20 transition-colors">
                <td className="px-4 py-3 text-xs font-mono font-medium text-primary">{row.id}</td>
                <td className="px-4 py-3 text-xs font-normal text-foreground truncate max-w-[200px] sm:max-w-none">{row.content}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2 text-xs font-medium text-muted-foreground">
                    <span>{row.confidence}%</span>
                    <ConfidenceDots percentage={row.confidence} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default function ScrapeTab({
  isScraping,
  scrapeData,
  scrapeView,
  setScrapeView,
  handleDownload,
  error,
  targetUrl
}: ScrapeTabProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = scrapeView === "markdown"
      ? scrapeData?.markdown || ""
      : JSON.stringify(scrapeData, null, 2);
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (isScraping) return <LoadingState message="Extracting page content..." />;
  if (error) return <ErrorState title="Failed to extract content" message={error} />;
  if (!scrapeData) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 animate-fade-in">
        <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center text-muted-foreground mb-2">
          <FileText className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-foreground">No extracted content</h3>
          <p className="text-sm text-muted-foreground max-w-sm">No scraped data is available for this page yet.</p>
        </div>
      </div>
    );
  }

  const contentLines = (scrapeView === "markdown" ? scrapeData.markdown : JSON.stringify(scrapeData, null, 2))?.split("\n") || [];

  return (
    <div className="flex flex-col gap-6 py-4 animate-fade-in">
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-semibold tracking-tight text-foreground">Scraped Content</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {targetUrl ? targetUrl.replace(/^https?:\/\//, "") : "Extracted page structure"}
          </p>
        </div>

        {/* View Selection Tabs */}
        <div className="flex items-center gap-1 bg-accent/60 p-1 rounded-xl border border-border">
          {[
            { id: "markdown", label: "Markdown", icon: FileText },
            { id: "json", label: "JSON", icon: FileJson },
            { id: "table", label: "Table", icon: TableIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setScrapeView(tab.id as ScrapeView)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer",
                scrapeView === tab.id 
                  ? "bg-card text-foreground shadow-xs" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-label={`View as ${tab.label}`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Workspace Area */}
      <div>
        {scrapeView !== "table" ? (
          <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xs flex flex-col">
            {/* Editor Top Bar */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/40">
              <span className="text-xs font-medium text-muted-foreground font-mono">
                {scrapeView === "markdown" ? "content.md" : "data.json"}
              </span>

              <div className="flex items-center gap-2">
                <button 
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1 bg-card hover:bg-accent text-foreground text-xs font-medium rounded-lg border border-border transition-all cursor-pointer"
                  aria-label="Copy content"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? "Copied" : "Copy"}</span>
                </button>
                <button 
                  type="button"
                  onClick={() => handleDownload(scrapeView as "json" | "markdown")}
                  className="flex items-center gap-1.5 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:brightness-110 transition-all cursor-pointer shadow-xs"
                  aria-label="Download file"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            {/* Code Content */}
            <div className="p-4 sm:p-6 overflow-auto max-h-[600px] font-mono text-xs leading-relaxed">
              <div className="flex gap-4">
                <div className="hidden sm:flex flex-col text-right text-muted-foreground/60 select-none pr-3 border-r border-border">
                  {Array.from({ length: Math.min(contentLines.length, 500) }).map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>
                <pre className="text-foreground whitespace-pre-wrap break-words flex-1">
                  {scrapeView === "markdown" 
                    ? scrapeData.markdown 
                    : JSON.stringify(scrapeData, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <DataTable data={scrapeData} />
            <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
              <button 
                type="button"
                onClick={() => handleDownload("json")}
                className="flex items-center gap-1.5 px-3 py-2 bg-card border border-border text-foreground text-xs font-medium rounded-lg hover:bg-accent transition-all cursor-pointer"
              >
                <FileJson className="w-3.5 h-3.5" />
                <span>Download JSON</span>
              </button>
              <button 
                type="button"
                onClick={() => handleDownload("markdown")}
                className="flex items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-lg hover:brightness-110 transition-all cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Markdown</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Data Table Preview at Bottom if in code view */}
      {scrapeView !== "table" && (
        <div className="space-y-3 pt-6 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TableIcon className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Extracted Fields Summary</h3>
            </div>
            <button 
              type="button"
              onClick={() => setScrapeView("table")}
              className="text-xs font-medium text-primary hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>View full table</span>
              <Maximize2 className="w-3 h-3" />
            </button>
          </div>
          <DataTable data={scrapeData} />
        </div>
      )}
    </div>
  );
}
