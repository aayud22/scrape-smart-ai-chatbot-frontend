import React from "react";

export function Footer() {
  return (
    <footer className="shrink-0 w-full border-t border-border bg-background px-6 py-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-center">
      <span className="text-sm font-bold whitespace-nowrap">
        ScrapeSmart AI
      </span>
      <span className="text-xs text-muted-foreground">
        © 2026 ScrapeSmart AI. Read any website, ask anything.
      </span>
      <div className="flex items-center gap-5 text-xs text-muted-foreground">
        <a
          href="https://github.com/aayud22/scrape-smart-ai-chatbot-frontend"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors"
        >
          GitHub
        </a>
        <a
          href="https://github.com/aayud22"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors"
        >
          Developer
        </a>
        <a
          href="/privacy"
          className="hover:text-foreground transition-colors"
        >
          Privacy Policy
        </a>
        <a
          href="/terms"
          className="hover:text-foreground transition-colors"
        >
          Terms of Service
        </a>
      </div>
    </footer>
  );
}
