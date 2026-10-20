# ScrapeSmart AI

ScrapeSmart AI is a web application frontend for analyzing websites. Given a target URL, it allows users to ask questions about the page content through an interactive chat interface, run technical SEO audits with PDF report export, extract page content to Markdown or JSON, and view internal link structures through an interactive site map in graph or table view.

## Screenshots

![Chat](docs/chat.png)

![SEO Audit](docs/seo.png)

![Scrape](docs/scrape.png)

![Site Map](docs/sitemap.png)

## Features

- **Website Content Chat**: Ask natural language questions about any public website and receive conversational answers generated from page content.
- **Technical SEO Audit**: Inspect on-page elements including title tags, meta descriptions, heading structure, images missing alt text, response time, and link distribution, with client-side PDF export.
- **Web Scraping**: Extract clean Markdown and structured JSON from web pages with one-click download buttons.
- **Interactive Site Map**: Explore internal website navigation with both a dynamic node graph visualization (powered by React Flow and Dagre) and a searchable, paginated list view.

## Architecture

This repository is a frontend-only Next.js application. All page scraping, link mapping, SEO scoring, and LLM processing are handled by a separate backend API specified by the `NEXT_PUBLIC_API_URL` environment variable.

The frontend communicates with the following backend endpoints:

| Endpoint | Method | Purpose |
| --- | --- | --- |
| `/score` | `POST` | Generates a technical SEO audit score and details for the provided URL. |
| `/chat` | `POST` | Sends a prompt and target URL to receive contextual answers from the backend LLM. |
| `/scrape` | `POST` | Extracts page content into structured data and Markdown. |
| `/map` | `POST` | Discovers internal and external links to build the site map hierarchy. |

> **TODO: Backend Repository & Stack**
> - Backend repository URL: [TODO: Add backend repository link]
> - Backend stack details: [TODO: Add backend runtime/framework and LLM integration details]

## Tech Stack

The application uses the following libraries declared in `package.json`:

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack)
- **UI Library**: [React](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Graph & Visualization**: [@xyflow/react](https://reactflow.dev/), [dagre](https://github.com/dagrejs/dagre)
- **Animations**: [framer-motion](https://www.framer.com/motion/)
- **Icons**: [lucide-react](https://lucide.dev/)
- **Markdown & PDF**: [react-markdown](https://github.com/remarkjs/react-markdown), [html2pdf.js](https://github.com/eKoopmans/html2pdf.js)
- **Theme Support**: [next-themes](https://github.com/pacocoursey/next-themes)
- **Utilities**: [cheerio](https://cheerio.js.org/), [clsx](https://github.com/lukeed/clsx), [tailwind-merge](https://github.com/dcastil/tailwind-merge)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 20 or higher recommended)
- `npm` (packaged with Node.js)
- A running ScrapeSmart AI backend service URL

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/aayud22/scrape-smart-ai-chatbot-frontend.git
   cd scrape-smart-ai-chatbot-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Open `.env.local` and set `NEXT_PUBLIC_API_URL` to your backend server URL (e.g., `http://localhost:8000` or a deployed backend endpoint):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```text
├── app/
│   ├── globals.css          # Theme tokens, styles, and animation keyframes
│   ├── layout.tsx           # Root layout with theme provider and metadata
│   ├── opengraph-image.tsx  # Dynamic OpenGraph and Twitter card image
│   ├── page.tsx             # Main page entry rendering HomePageClient
│   ├── privacy/page.tsx     # Privacy policy page
│   └── terms/page.tsx       # Terms of service page
├── components/
│   ├── landing/             # URL input hero and preset example sites
│   ├── layout/              # Shell, sidebar, bottom navigation, and footer
│   ├── map/                 # Graph nodes, directory panel, selection HUD
│   ├── providers/           # Theme provider wrapper
│   ├── tabs/                # Chat, SEO audit, Scrape, and Site Map tabs
│   ├── ui/                  # Reusable data table, pagination, tooltip
│   └── HomePageClient.tsx   # Core application state controller
├── types/                   # TypeScript interfaces (API contracts, chat, SEO, map)
└── utils/                   # API client helper, graph layout, domain normalization
```

## Known Limitations

- **Plain text answers**: Responses are generated by the backend LLM as text and do not include citations or direct source links back to individual webpage sections.
- **Backend dependency**: All data fetching, scraping, mapping, and chat features require a functioning backend service at `NEXT_PUBLIC_API_URL`.
- **No persistent storage**: Analysis results, chat sessions, and scrape outputs are kept in client state and reset when refreshing or starting a new extraction; there are no user accounts or database backups.
