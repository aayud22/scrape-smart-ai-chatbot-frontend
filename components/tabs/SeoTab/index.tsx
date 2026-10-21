import React, { useState, useMemo, useRef } from "react";
import LoadingState from "@/components/LoadingState";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { ScrapeData } from "@/types/scrape";
import { SeoData } from "@/types/seo";
import { ChatResponse } from "@/types/api";
import { getErrorMessage, postJson } from "@/utils/api";
import { 
  RotateCcw,
  Sparkles,
  Download,
  PieChart,
  Copy,
  Check
} from "lucide-react";
import { cn } from "@/utils/helpers";
import { SeoGauge } from "./SeoGauge";
import { TechnicalBreakdown } from "./TechnicalBreakdown";
import { KeywordContext } from "./KeywordContext";
import ErrorState from "@/components/ErrorState";
import SocialPreview from "@/components/SocialPreview";

interface SeoTabProps {
  isAnalyzing: boolean;
  seoScoreData: SeoData | null;
  error?: string | null;
  url: string;
  scrapeData?: ScrapeData | null;
  isScraping?: boolean;
  onAnalyzeKeywords?: () => void;
  onReAnalyze?: () => void;
}


type KeywordStat = {
  word: string;
  count: number;
  percentage: string;
};

export default function SeoTab({
  isAnalyzing,
  seoScoreData,
  error,
  url,
  scrapeData,
  isScraping,
  onAnalyzeKeywords,
  onReAnalyze
}: SeoTabProps) {
  const reportRef = useRef<HTMLDivElement>(null);
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [isFetchingAdvice, setIsFetchingAdvice] = useState(false);

  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyAdvice = () => {
    if (!aiAdvice) return;
    navigator.clipboard.writeText(aiAdvice);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const parsedData = useMemo(() => {
    if (!seoScoreData) return null;
    
    const findDetail = (keyword: string) => 
      seoScoreData.details.find(d => d.toLowerCase().includes(keyword.toLowerCase()));
    
    const getStatus = (detail?: string): "passed" | "warning" | "error" => {
      if (!detail) return "error";
      if (detail.includes("✅")) return "passed";
      if (detail.includes("⚠️")) return "warning";
      return "error";
    };

    const titleDetail = findDetail("Title Tag");
    const metaDetail = findDetail("Meta Description");
    const h1Detail = findDetail("H1 Tag");
    const imgDetail = findDetail("Images without alt");

    return {
      title: { 
        content: titleDetail?.split(":")[1]?.trim() || "Missing Title Tag", 
        status: getStatus(titleDetail) 
      },
      meta: { 
        content: metaDetail?.includes("Missing") ? "Meta Description is missing from this page." : metaDetail?.split(":")[1]?.trim() || "Meta Description Issue", 
        status: getStatus(metaDetail) 
      },
      headings: { 
        content: h1Detail?.includes("Missing") ? "H1 Tag is missing" : "Multiple H1/H2 tags detected", 
        status: getStatus(h1Detail) 
      },
      images: { 
        content: imgDetail?.includes("✅") ? "All images have alternative text." : "Some images are missing alt tags.", 
        status: getStatus(imgDetail) 
      }
    };
  }, [seoScoreData]);

  const stats = useMemo(() => {
    if (!seoScoreData) return { passed: 0, warnings: 0, errors: 0 };
    return {
      passed: seoScoreData.details.filter(d => d.includes("✅")).length,
      warnings: seoScoreData.details.filter(d => d.includes("⚠️")).length,
      errors: seoScoreData.details.filter(d => d.includes("❌")).length,
    };
  }, [seoScoreData]);

  const handleGetAiSuggestions = async () => {
    const issues = seoScoreData?.details.filter(d => d.includes("❌") || d.includes("⚠️")) || [];
    if (issues.length === 0) return;
    setIsFetchingAdvice(true); setAiAdvice(null);
    try {
      const prompt = `Act as an Expert Technical SEO Consultant. I ran an audit on ${url} and found these specific issues:\n${issues.join("\n")}\n\nPlease provide a short, highly actionable step-by-step guide on how I can fix these exact issues. Keep it concise, professional, and use bullet points.`;
      const data = await postJson<ChatResponse>("/chat", { url, question: prompt }, "Failed to fetch advice.");
      if (data.status === "success") setAiAdvice(data.bot_reply);
      else throw new Error("Failed to fetch advice");
    } catch (error: unknown) {
      setAiAdvice(getErrorMessage(error, "AI is currently unavailable."));
    } finally { setIsFetchingAdvice(false); }
  };

  const handleExportPdf = async () => {
    if (!reportRef.current) return;
    setExportError(null);
    setIsExporting(true);
    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const opt = {
        margin: 10,
        filename: `SEO-Report-${new URL(url).hostname.replace("www.", "")}.pdf`,
        image: { type: "jpeg" as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: "#FAF8F5" },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" as const }
      };
      await html2pdf().from(reportRef.current).set(opt).save();
    } catch (err: unknown) {
      console.error("PDF Export failed:", err);
      setExportError(getErrorMessage(err, "Failed to export PDF report."));
    } finally { setIsExporting(false); }
  };

  const topKeywords = useMemo<KeywordStat[] | null>(() => {
    if (!scrapeData?.markdown) return null;
    const cleanText = scrapeData.markdown.toLowerCase().replace(/[^a-z\s]/g, " ");
    const words = cleanText.split(/\s+/).filter(w => w.length > 2);
    const stopWords = new Set(["the", "and", "for", "that", "this", "with", "you", "not", "are", "from", "your", "all", "have", "can", "was", "but", "our", "out", "has", "will", "what", "their", "how", "when", "one", "more", "about", "who", "which", "there", "some", "get", "make", "any", "like", "use", "new", "see"]);
    const validWords = words.filter(w => !stopWords.has(w));
    const counts: Record<string, number> = {};
    validWords.forEach(w => counts[w] = (counts[w] || 0) + 1);
    return Object.entries(counts)
      .map(([word, count]) => ({ word, count, percentage: ((count / validWords.length) * 100).toFixed(1) }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [scrapeData]);

  if (isAnalyzing) return <LoadingState message="Analyzing SEO signals..." />;

  if (error) {
    return (
      <div className="max-w-2xl mx-auto w-full py-16 px-4 space-y-6">
        <ErrorState title="Failed to fetch SEO score" message={error} />
        {onReAnalyze && (
          <div className="flex justify-center">
            <button
              onClick={onReAnalyze}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary-hover transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Audit</span>
            </button>
          </div>
        )}
      </div>
    );
  }

  if (!seoScoreData) return (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 animate-fade-in">
      <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-primary mb-2">
        <PieChart className="w-6 h-6" />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-foreground">No SEO audit data</h3>
        <p className="text-sm text-muted-foreground max-w-sm">Run an analysis to inspect technical SEO signals for this site.</p>
      </div>
      {onReAnalyze && (
        <button
          onClick={onReAnalyze}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary-hover transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Run SEO Audit</span>
        </button>
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-6 md:gap-8 py-4 animate-fade-in" ref={reportRef}>
      {/* Header Section */}
      <div className="bg-card border border-border p-4 md:p-6 rounded-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-lg md:text-xl font-serif font-normal tracking-tight text-foreground">SEO Audit</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">Technical analysis of page structure, headings, and meta tags.</p>
          </div>

          <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
            <div className="flex items-center gap-2.5">
              <button 
                type="button"
                onClick={onReAnalyze} 
                className="flex items-center gap-2 h-9 px-3.5 bg-primary hover:bg-primary-hover text-primary-foreground font-medium text-xs rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Re-run Audit</span>
              </button>
              <button 
                type="button"
                onClick={handleExportPdf} 
                disabled={isExporting} 
                aria-label="Export SEO report as PDF"
                className="flex items-center gap-2 h-9 px-3.5 border border-border bg-card rounded-lg hover:bg-accent text-foreground text-xs font-medium transition-colors cursor-pointer disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {isExporting ? (
                  <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-primary border-t-transparent" />
                ) : (
                  <Download className="w-3.5 h-3.5 text-muted-foreground" />
                )}
                <span>{isExporting ? "Exporting..." : "Export PDF"}</span>
              </button>
            </div>
            {exportError && (
              <p className="text-xs text-destructive font-medium">
                {exportError}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Score and Stats Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-stretch">
        <div className="bg-card border border-border p-5 md:p-6 rounded-xl">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 h-full">
            <SeoGauge score={seoScoreData.seo_score} />
            <div className="space-y-4 w-full sm:flex-1 text-center sm:text-left">
              <div className="space-y-1">
                <div className="text-xs font-medium text-muted-foreground">Overall Status</div>
                <div className={cn("text-xl font-bold", seoScoreData.seo_score >= 80 ? "text-success" : seoScoreData.seo_score >= 50 ? "text-warning" : "text-destructive")}>
                  {seoScoreData.seo_score >= 80 ? "Good" : seoScoreData.seo_score >= 50 ? "Needs Improvement" : "Poor"}
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Found {stats.errors} critical issue{stats.errors === 1 ? "" : "s"} and {stats.warnings} warning{stats.warnings === 1 ? "" : "s"}.
              </p>
              <div className="flex justify-center sm:justify-start gap-5 pt-1">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-semibold text-success">Passed</span>
                  <span className="text-lg font-bold text-foreground">{stats.passed}</span>
                </div>
                <div className="w-px h-7 bg-border mt-1" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-semibold text-warning">Warnings</span>
                  <span className="text-lg font-bold text-foreground">{stats.warnings}</span>
                </div>
                <div className="w-px h-7 bg-border mt-1" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-semibold text-destructive">Errors</span>
                  <span className="text-lg font-bold text-foreground">{stats.errors}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border p-5 md:p-6 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-sm font-semibold text-foreground">AI Recommendations</div>
            </div>
            {aiAdvice && !isFetchingAdvice && (
              <button 
                type="button"
                onClick={handleCopyAdvice} 
                className="flex items-center gap-1.5 px-2.5 py-1 bg-accent rounded-lg text-xs font-medium text-foreground hover:bg-accent/80 transition-colors cursor-pointer"
                aria-label="Copy recommendations"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? "Copied" : "Copy"}</span>
              </button>
            )}
          </div>

          <div className="flex-1 flex flex-col justify-center min-h-[140px]">
            {isFetchingAdvice ? (
              <div className="flex flex-col items-center justify-center space-y-3 py-6">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
                <span className="text-xs font-medium text-primary">Generating recommendations...</span>
              </div>
            ) : aiAdvice ? (
              <div className="overflow-y-auto max-h-[220px] text-xs leading-relaxed text-foreground pr-2">
                <MarkdownRenderer content={aiAdvice} />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center space-y-3 py-4">
                <p className="text-xs text-muted-foreground max-w-xs">
                  Generate actionable suggestions based on the audit results.
                </p>
                <button 
                  type="button"
                  onClick={handleGetAiSuggestions} 
                  className="bg-primary hover:bg-primary-hover text-primary-foreground font-medium text-xs px-4 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  Generate Recommendations
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <TechnicalBreakdown parsedData={parsedData} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <KeywordContext topKeywords={topKeywords} onAnalyzeKeywords={onAnalyzeKeywords} isScraping={isScraping} />
        <div className="bg-card border border-border p-5 sm:p-6 rounded-xl">
          <h3 className="text-base font-semibold text-foreground flex items-center gap-2.5 mb-4">
            <span className="w-1.5 h-5 bg-primary rounded-full" />
            Social Sharing Preview
          </h3>
          <SocialPreview url={url} />
        </div>
      </div>
    </div>
  );
}
