"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useRef, useState, Dispatch, SetStateAction } from "react";
import { getErrorMessage, postJson } from "@/utils/api";
import { isValidUrl, cn, normalizeDomainInput, makeId } from "@/utils/helpers";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { LandingHero } from "@/components/landing/LandingHero";
import ChatTab from "@/components/tabs/ChatTab";
import SeoTab from "@/components/tabs/SeoTab";
import ScrapeTab from "@/components/tabs/ScrapeTab";
import SiteMapTab from "@/components/tabs/SiteMapTab";
import ErrorState from "@/components/ErrorState";
import { SidebarItemType } from "@/types/common";
import { ChatItem } from "@/types/chat";
import { SeoData } from "@/types/seo";
import { ScrapeData, ScrapeView } from "@/types/scrape";
import { MapLinksData } from "@/types/map";
import { 
  ScoreResponse, 
  MapResponse, 
  ScrapeResponse, 
  ChatResponse 
} from "@/types/api";


const SUGGESTED_QUESTIONS = [
  "Provide a brief summary of this website.",
  "What are the main services or products offered?",
  "Who is the target audience for this site?",
];

export default function HomePageClient() {
  const [url, setUrl] = useState("");
  const [isAppActive, setIsAppActive] = useState(false);
  const [activeTab, setActiveTab] = useState<SidebarItemType>("chat");
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isMapping, setIsMapping] = useState(false);
  const [isScraping, setIsScraping] = useState(false);
  const [urlError, setUrlError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [seoScoreData, setSeoScoreData] = useState<SeoData | null>(null);
  const [seoError, setSeoError] = useState("");
  const [mapLinksData, setMapLinksData] = useState<MapLinksData[] | null>(null);
  const [mapError, setMapError] = useState("");
  const [scrapeData, setScrapeData] = useState<ScrapeData | null>(null);
  const [scrapeView, setScrapeView] = useState<ScrapeView>("markdown");
  const [scrapeError, setScrapeError] = useState("");
  const [protocol, setProtocol] = useState("https://");
  const [domainInput, setDomainInput] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab === "chat") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, isLoading, activeTab]);

  const resetAnalysisState = () => {
    setChatHistory([]); setSeoScoreData(null); setSeoError(""); setQuestion(""); setGeneralError("");
    setMapLinksData(null); setMapError(""); setScrapeData(null); setScrapeError("");
    setScrapeView("markdown");
  };

  const handleStartAnalysis = async () => {
    if (!domainInput.trim()) { setUrlError("Please enter a website address"); return; }
    const { cleanValue } = normalizeDomainInput(domainInput);
    const fullUrl = `${protocol}${cleanValue}`;
    if (!isValidUrl(fullUrl)) { setUrlError("Please enter a valid format (e.g., example.com)"); return; }
    resetAnalysisState(); setUrlError(""); setUrl(fullUrl); setIsAppActive(true); setActiveTab("chat");
    await analyzeWebsiteSeo(fullUrl);
  };

  const handleChangeUrl = () => {
    setIsAppActive(false); resetAnalysisState(); setActiveTab("chat");
  };

  const handleDownload = (format: "json" | "markdown") => {
    if (!scrapeData) return;
    const content = format === "markdown" ? scrapeData.markdown || "" : JSON.stringify(scrapeData, null, 2);
    const blob = new Blob([content], { type: format === "markdown" ? "text/markdown" : "application/json" });
    const blobUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a"); anchor.href = blobUrl;
    anchor.download = format === "markdown" ? "scraped_document.md" : "scraped_data.json";
    document.body.appendChild(anchor); anchor.click(); document.body.removeChild(anchor); URL.revokeObjectURL(blobUrl);
  };

  const analyzeWebsiteSeo = async (targetUrl: string) => {
    setIsAnalyzing(true); setSeoError("");
    try {
      const data = await postJson<ScoreResponse>("/score", { url: targetUrl }, "Failed to fetch SEO score.");
      if (data.status === "success") setSeoScoreData(data);
    } catch (error) { setSeoError(getErrorMessage(error, "Failed to fetch SEO score.")); }
    finally { setIsAnalyzing(false); }
  };

  const fetchMapLinks = async (targetUrl: string) => {
    if (mapLinksData || isMapping) return;
    setIsMapping(true); setMapError("");
    try {
      const data = await postJson<MapResponse>("/map", { url: targetUrl }, "Failed to fetch internal links.");
      if (data.status === "success") setMapLinksData(data.links);
    } catch (error) { setMapError(getErrorMessage(error, "Failed to fetch internal links.")); }
    finally { setIsMapping(false); }
  };

  const fetchScrapeData = async (targetUrl: string) => {
    if (scrapeData || isScraping) return;
    setIsScraping(true); setScrapeError("");
    try {
      const data = await postJson<ScrapeResponse>("/scrape", { url: targetUrl }, "Failed to extract data.");
      if (data.status === "success") setScrapeData(data);
    } catch (error) { setScrapeError(getErrorMessage(error, "Failed to extract data.")); }
    finally { setIsScraping(false); }
  };

  const handleAskQuestion = async (selectedQuestion?: string) => {
    const queryToAsk = (selectedQuestion || question).trim();
    if (!queryToAsk || isLoading) return;
    const userMsgId = makeId();
    setChatHistory((prev) => [...prev, { id: userMsgId, role: "user", text: queryToAsk, timestamp: Date.now() }]);
    setIsLoading(true); setQuestion(""); setGeneralError("");
    try {
      const data = await postJson<ChatResponse>("/chat", { url, question: queryToAsk }, "Server connection failed.");
      if (data.status === "success") {
        const botMsgId = makeId();
        setChatHistory((prev) => [...prev, { id: botMsgId, role: "bot", text: data.bot_reply, timestamp: Date.now() }]);
      }
    } catch (error) { setGeneralError(getErrorMessage(error, "Server connection failed.")); }
    finally { setIsLoading(false); }
  };

  const handleTabChange: Dispatch<SetStateAction<SidebarItemType>> = (value) => {
    const tab = typeof value === 'function' ? (value as (prev: SidebarItemType) => SidebarItemType)(activeTab) : value;
    setActiveTab(tab);
    if (tab === "map" && url) void fetchMapLinks(url);
    if (tab === "scrape" && url) void fetchScrapeData(url);
  };

  return (
    <DashboardShell
      activeTab={activeTab}
      setActiveTab={handleTabChange}
      isAppActive={isAppActive}
      headerContent={url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
      targetUrl={url}
      onBack={handleChangeUrl}
    >
      {!isAppActive ? (
        <LandingHero
          protocol={protocol} setProtocol={setProtocol} domainInput={domainInput} setDomainInput={setDomainInput}
          urlError={urlError} setUrlError={setUrlError} handleStartAnalysis={handleStartAnalysis} normalizeDomainInput={normalizeDomainInput}
        />
      ) : (
        <div className={cn("space-y-6 md:pb-0", activeTab === "chat" || activeTab === "map" ? "h-full flex flex-col space-y-0 overflow-hidden" : "h-full pb-28")}>
          {activeTab === "chat" && <ChatTab chatHistory={chatHistory} isLoading={isLoading} suggestedQuestions={SUGGESTED_QUESTIONS} handleAskQuestion={handleAskQuestion} messagesEndRef={messagesEndRef} />}
          {activeTab === "seo" && (
            <SeoTab 
              url={url} 
              isScraping={isScraping} 
              scrapeData={scrapeData} 
              isAnalyzing={isAnalyzing} 
              seoScoreData={seoScoreData} 
              error={seoError}
              onAnalyzeKeywords={() => fetchScrapeData(url)} 
              onReAnalyze={() => analyzeWebsiteSeo(url)}
            />
          )}
          {activeTab === "scrape" && (
            <ScrapeTab 
              isScraping={isScraping} 
              scrapeData={scrapeData} 
              scrapeView={scrapeView} 
              setScrapeView={setScrapeView} 
              handleDownload={handleDownload} 
              error={scrapeError} 
              targetUrl={url}
            />
          )}
          {activeTab === "map" && (
            <SiteMapTab
              isMapping={isMapping}
              mapLinksData={mapLinksData}
              error={mapError}
            />
          )}

          {activeTab === "chat" && (
            <div className="w-full shrink-0 pb-[max(5rem,env(safe-area-inset-bottom))] md:pb-6 pt-2 px-4 md:px-8 bg-background flex flex-col relative z-40 border-t border-border/10">
              {generalError && (
                <div className="w-full mb-4 animate-slide-up">
                  <ErrorState 
                    title="Error" 
                    message={generalError} 
                    onClose={() => setGeneralError("")}
                  />
                </div>
              )}

              <div className="max-w-3xl mx-auto w-full space-y-4">
                <div className="relative flex items-center bg-background border border-border rounded-full p-2 pl-4 transition-colors focus-within:border-primary group">
                  <input 
                    type="text" 
                    className="flex-1 bg-transparent px-4 py-2 outline-none text-sm font-normal text-foreground placeholder:text-muted-foreground/60 w-full" 
                    placeholder="Ask a question about this website..." 
                    value={question} 
                    onChange={(e) => {
                      setQuestion(e.target.value);
                      if (generalError) setGeneralError("");
                    }} 
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        if (!isLoading && question.trim()) {
                          handleAskQuestion();
                        }
                      }
                    }} 
                  />
                  <button 
                    onClick={() => handleAskQuestion()} 
                    disabled={isLoading || !question.trim()} 
                    aria-label="Send message"
                    className="w-10 h-10 bg-primary hover:bg-primary-hover text-primary-foreground rounded-full transition-colors flex items-center justify-center disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed shrink-0"
                  >
                    <ArrowUp className="w-4 h-4 stroke-2" />
                  </button>
                </div>
                
                {/* AI Disclaimer */}
                <p className="text-xs text-center text-muted-foreground font-normal">
                  ScrapeSmart AI can make mistakes. Please verify important information.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </DashboardShell>
  );
}
