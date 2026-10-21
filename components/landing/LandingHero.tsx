"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowRight, 
  ChevronDown,
  Cpu,
  Moon,
  Sun
} from "lucide-react";
import { cn } from "@/utils/helpers";
import { useTheme } from "next-themes";
import { Footer } from "@/components/layout/Footer";

interface LandingHeroProps {
  protocol: string;
  setProtocol: (protocol: string) => void;
  domainInput: string;
  setDomainInput: (value: string) => void;
  urlError: string;
  setUrlError: (error: string) => void;
  handleStartAnalysis: () => void;
  normalizeDomainInput: (value: string) => { cleanValue: string; nextProtocol: "http://" | "https://" | null };
}

const EXAMPLE_URLS = [
  { label: "example.com", value: "example.com" },
  { label: "wikipedia.org", value: "en.wikipedia.org/wiki/Web_scraping" },
  { label: "developer.mozilla.org", value: "developer.mozilla.org" },
];

export function LandingHero({
  protocol,
  setProtocol,
  domainInput,
  setDomainInput,
  urlError,
  setUrlError,
  handleStartAnalysis,
  normalizeDomainInput,
}: LandingHeroProps) {
  const [isProtocolOpen, setIsProtocolOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProtocolOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectExample = (value: string) => {
    setProtocol("https://");
    setDomainInput(value);
    setUrlError("");
    inputRef.current?.focus();
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300 overflow-x-hidden pt-20">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-12 py-4 md:py-6 bg-background border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shrink-0">
            <Cpu className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-base font-semibold tracking-tight whitespace-nowrap">
            ScrapeSmart <span className="text-primary">AI</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-lg border border-border hover:bg-accent transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none cursor-pointer"
            aria-label="Toggle color theme"
          >
            {!mounted ? (
              <div className="w-4 h-4" />
            ) : theme === "dark" ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 max-w-3xl mx-auto w-full py-20 sm:py-28">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="text-center space-y-8 w-full"
        >
          {/* Title & Description */}
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-normal tracking-tight leading-[1.15] text-balance text-foreground">
              Ask any website <br className="hidden sm:inline" />
              <span className="text-primary italic">a question.</span>
            </h1>

            <p className="max-w-lg mx-auto text-muted-foreground text-base sm:text-lg font-normal leading-relaxed">
              Paste a URL to explore page structure, technical signals, and chat with page content.
            </p>
          </div>

          {/* Command Bar Area */}
          <div className="w-full max-w-2xl mx-auto space-y-4 pt-2">
            <div className={cn(
              "group relative z-20 flex flex-col sm:flex-row items-stretch p-1.5 rounded-xl border bg-card transition-colors focus-within:ring-2 focus-within:ring-primary focus-within:border-primary",
              urlError ? "border-destructive" : "border-border"
            )}>
              {/* Protocol Dropdown */}
              <div 
                ref={dropdownRef}
                className="relative flex items-center"
              >
                <button
                  type="button"
                  aria-label="Select protocol"
                  aria-expanded={isProtocolOpen}
                  className="flex items-center gap-1.5 px-4 h-12 border-b sm:border-b-0 sm:border-r border-border cursor-pointer hover:bg-accent/50 rounded-t-lg sm:rounded-l-lg sm:rounded-tr-none transition-colors text-xs font-medium text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
                  onClick={() => setIsProtocolOpen(!isProtocolOpen)}
                >
                  <span>{protocol}</span>
                  <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", isProtocolOpen && "rotate-180")} />
                </button>
                
                <AnimatePresence>
                  {isProtocolOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-[52px] -left-1 w-32 bg-card border border-border rounded-lg shadow-xs z-50 overflow-hidden py-1"
                    >
                      {["https://", "http://"].map((p) => (
                        <button 
                          key={p}
                          type="button"
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            setProtocol(p as "https://" | "http://"); 
                            setIsProtocolOpen(false); 
                            inputRef.current?.focus(); 
                          }}
                          className={cn(
                            "w-full text-left px-3.5 py-2 text-xs font-medium transition-colors cursor-pointer",
                            protocol === p ? "text-primary bg-accent font-semibold" : "text-foreground hover:bg-accent"
                          )}
                        >
                          {p}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Input */}
              <input
                ref={inputRef}
                type="text"
                placeholder="Enter domain (e.g. example.com)"
                value={domainInput}
                onChange={(e) => {
                  const { cleanValue, nextProtocol } = normalizeDomainInput(e.target.value);
                  if (nextProtocol) setProtocol(nextProtocol);
                  setDomainInput(cleanValue);
                  setUrlError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleStartAnalysis()}
                className="flex-1 px-4 py-3 bg-transparent outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0 text-sm sm:text-base font-normal w-full placeholder:text-muted-foreground/60"
                aria-label="Website domain or URL"
              />

              {/* Action Button */}
              <button
                type="button"
                onClick={handleStartAnalysis}
                disabled={!domainInput.trim() || !!urlError}
                aria-label="Analyze Website"
                className="h-11 sm:h-auto px-6 bg-primary hover:bg-primary-hover text-primary-foreground rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed shrink-0 mt-1 sm:mt-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <span>Analyze</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Error Message */}
            {urlError && (
              <p className="text-destructive text-xs font-medium text-center">
                {urlError}
              </p>
            )}

            {/* Clickable Example URLs */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
              <span className="text-xs text-muted-foreground">Examples:</span>
              {EXAMPLE_URLS.map((example) => (
                <button
                  key={example.value}
                  type="button"
                  onClick={() => handleSelectExample(example.value)}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg border border-border bg-card hover:bg-accent text-muted-foreground hover:text-foreground transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {example.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
