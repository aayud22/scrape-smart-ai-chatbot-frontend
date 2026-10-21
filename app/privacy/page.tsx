import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://scrape-smart-ai.vercel.app"
).replace(/\/$/, "");

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How ScrapeSmart AI handles submitted URLs and processing requests.",
  alternates: {
    canonical: `${siteUrl}/privacy`,
  },
  openGraph: {
    title: "Privacy Policy | ScrapeSmart AI",
    description:
      "How ScrapeSmart AI handles submitted URLs and processing requests.",
    url: `${siteUrl}/privacy`,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-background text-foreground">
      <main className="mx-auto w-full max-w-3xl px-6 py-16 flex-1">
        <div className="mb-8">
          <Link
            href="/"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
          >
            ← Back to ScrapeSmart AI
          </Link>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-normal tracking-tight text-foreground">Privacy policy</h1>
        <p className="mt-2 text-xs text-muted-foreground">Last updated: October 20, 2026</p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-foreground/90">
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-foreground">1. Overview</h2>
            <p>
              ScrapeSmart AI is an open-source developer project that reads publicly
              available web pages you submit and answers questions about their content.
              This Privacy Policy explains how information is handled when you use the tool.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-foreground">2. Information you submit</h2>
            <p>
              When you use ScrapeSmart AI, you provide a publicly accessible website URL
              and optional questions. The URL is sent to a backend service that fetches
              the page content, which is then processed by a third-party large language
              model (LLM) provider to generate answers.
            </p>
            <p>
              The tool does not require an account, does not collect personal identity
              information, and does not maintain a user database. Content is processed
              in-memory or ephemerally to fulfill your immediate requests.
              {/* TODO: verify against backend behavior */}
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-foreground">3. Third-party services and previews</h2>
            <p>
              Requests are processed using a backend API service and third-party LLM
              providers. In addition, to generate screenshots and social link previews,
              the browser sends analyzed page URLs to <code className="font-mono text-xs bg-accent px-1.5 py-0.5 rounded border border-border">api.microlink.io</code>, and
              preview images are proxied through <code className="font-mono text-xs bg-accent px-1.5 py-0.5 rounded border border-border">wsrv.nl</code>. These external services
              process data in accordance with their respective privacy policies.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-foreground">4. Contact</h2>
            <p>
              For questions or feedback, visit the project repository on{" "}
              <a
                href="https://github.com/aayud22/scrape-smart-ai-chatbot-frontend"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
              >
                GitHub
              </a>.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
