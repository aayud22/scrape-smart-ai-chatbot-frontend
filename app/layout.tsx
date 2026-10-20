import "./globals.css";
import type { Metadata } from "next";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://scrape-smart-ai.vercel.app"
).replace(/\/$/, "");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ScrapeSmart AI",
    template: "%s | ScrapeSmart AI",
  },
  description:
    "Paste any website URL and ask questions. ScrapeSmart AI reads the page and answers with concise, helpful responses.",
  applicationName: "ScrapeSmart AI",
  alternates: {
    canonical: `${siteUrl}/`,
  },
  openGraph: {
    type: "website",
    title: "ScrapeSmart AI — Website Q&A Chatbot",
    description:
      "Paste any website URL and ask questions. ScrapeSmart AI reads the page and answers with concise, helpful responses.",
    url: `${siteUrl}/`,
    siteName: "ScrapeSmart AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "ScrapeSmart AI — Website Q&A Chatbot",
    description:
      "Ask questions about any website. ScrapeSmart AI reads the page and answers in seconds.",
  },
};

import { ThemeProvider } from "@/components/providers/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full antialiased">
      <body className="min-h-screen flex flex-col bg-background text-foreground font-sans">
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
