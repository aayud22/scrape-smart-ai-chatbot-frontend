import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://scrape-smart-ai.vercel.app"
).replace(/\/$/, "");

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms governing your use of the ScrapeSmart AI website Q&A tool.",
  alternates: {
    canonical: `${siteUrl}/terms`,
  },
  openGraph: {
    title: "Terms of Service | ScrapeSmart AI",
    description:
      "Terms governing your use of the ScrapeSmart AI website Q&A tool.",
    url: `${siteUrl}/terms`,
  },
};

export default function TermsOfServicePage() {
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
        <h1 className="text-3xl sm:text-4xl font-serif font-normal tracking-tight text-foreground">Terms of service</h1>
        <p className="mt-2 text-xs text-muted-foreground">Last updated: August 3, 2026</p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-foreground/90">
          <section className="space-y-3">
            <h2 className="text-base font-semibold text-foreground">1. Acceptance of terms</h2>
            <p>
              By accessing or using ScrapeSmart AI (&quot;the Service&quot;), you agree to be bound
              by these Terms of Service. If you do not agree to these terms, do not use
              the Service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-foreground">2. Description of the service</h2>
            <p>
              The Service allows you to submit a publicly accessible website URL to analyze
              its structure, SEO signals, and ask questions about its content. Answers are
              generated using external large language model (LLM) APIs and are provided
              for informational purposes only. Responses may be inaccurate or incomplete.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-foreground">3. Acceptable use</h2>
            <p>You agree not to use the Service to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Submit URLs that you do not have permission or legal right to access or inspect.</li>
              <li>Violate any applicable laws, regulations, or third-party rights.</li>
              <li>Attempt to overload, abuse, or disrupt the Service or related backend infrastructure.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-foreground">4. Disclaimers and limitation of liability</h2>
            <p>
              The Service is provided on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of
              any kind. To the maximum extent permitted by law, the maintainers shall not be liable
              for any damages or losses arising from your use of the Service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-base font-semibold text-foreground">5. Contact</h2>
            <p>
              For questions regarding these Terms, visit the project repository on{" "}
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
