import React from "react";

interface KeywordStat {
  word: string;
  count: number;
  percentage: string;
}

interface KeywordContextProps {
  topKeywords: KeywordStat[] | null;
  onAnalyzeKeywords?: () => void;
  isScraping?: boolean;
}

export const KeywordContext = ({ topKeywords, onAnalyzeKeywords, isScraping }: KeywordContextProps) => {
  return (
    <div className="bg-card border border-border p-5 sm:p-6 rounded-2xl shadow-xs">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-base font-semibold text-foreground flex items-center gap-2.5">
          <span className="w-1.5 h-5 bg-primary rounded-full" />
          Keyword Frequency
        </h3>
      </div>
      
      {!topKeywords ? (
        <div className="py-8 flex flex-col items-center text-center space-y-4">
          <p className="text-sm text-muted-foreground max-w-sm">Extract page content to see the most frequent terms detected on this page.</p>
          <button 
            type="button"
            onClick={onAnalyzeKeywords}
            disabled={isScraping}
            className="bg-primary hover:brightness-110 text-primary-foreground font-semibold text-xs px-5 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-40"
          >
            {isScraping ? "Extracting..." : "Extract Keywords"}
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {topKeywords.map((kw, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <div className="w-24 text-xs font-medium text-foreground truncate text-right">{kw.word}</div>
              <div className="flex-1 h-2 bg-accent rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all" 
                  style={{ width: `${Math.min(parseFloat(kw.percentage) * 10, 100)}%` }}
                />
              </div>
              <div className="w-12 text-xs font-mono font-medium text-muted-foreground text-right">{kw.percentage}%</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
