import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="shrink-0 w-full border-t border-border bg-card px-6 py-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-center">
      <span className="text-sm font-semibold whitespace-nowrap text-foreground">
        ScrapeSmart AI
      </span>
      <span className="text-xs text-muted-foreground">
        © 2026 ScrapeSmart AI. Website analysis and content exploration tool.
      </span>
      <div className="flex items-center gap-5 text-xs text-muted-foreground">
        <a
          href="https://github.com/aayud22/scrape-smart-ai-chatbot-frontend"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
        >
          GitHub
        </a>
        <a
          href="https://github.com/aayud22"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
        >
          Developer
        </a>
        <Link
          href="/privacy"
          className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
        >
          Privacy Policy
        </Link>
        <Link
          href="/terms"
          className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
        >
          Terms of Service
        </Link>
      </div>
    </footer>
  );
}
