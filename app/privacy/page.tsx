import type { Metadata } from "next";
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
    <div className="min-h-screen flex flex-col justify-between">
      <main className="mx-auto w-full max-w-3xl px-6 py-16 flex-1">
        <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: October 20, 2026</p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-foreground/90">
          <section className="space-y-3">
            <h2 className="text-lg font-bold">1. Overview</h2>
            <p>
              ScrapeSmart AI is an open-source developer project that reads publicly
              available web pages you submit and answers questions about their content.
              This Privacy Policy explains how information is handled when you use the tool.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold">2. Information You Submit</h2>
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
            <h2 className="text-lg font-bold">3. Third-Party Services and Previews</h2>
            <p>
              Requests are processed using a backend API service and third-party LLM
              providers. In addition, to generate screenshots and social link previews,
              the browser sends analyzed page URLs to <code>api.microlink.io</code>, and
              preview images are proxied through <code>wsrv.nl</code>. These external services
              process data in accordance with their respective privacy policies.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold">4. Contact</h2>
            <p>
              For questions or feedback, visit the project repository on{" "}
              <a
                href="https://github.com/aayud22/scrape-smart-ai-chatbot-frontend"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
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
