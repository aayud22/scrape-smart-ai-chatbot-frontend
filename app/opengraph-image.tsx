import { ImageResponse } from "next/og";

export const alt = "ScrapeSmart AI";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#FAF8F5",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "96px",
          fontFamily: "system-ui, -apple-system, sans-serif",
          border: "1px solid #E7E1D8",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "16px",
              height: "16px",
              borderRadius: "4px",
              background: "#B4532F",
            }}
          />
          <span
            style={{
              fontSize: "20px",
              fontWeight: 600,
              color: "#B4532F",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            Developer Portfolio Project
          </span>
        </div>
        <div
          style={{
            fontSize: 68,
            fontWeight: 700,
            color: "#2B2622",
            marginBottom: 24,
            letterSpacing: "-0.02em",
          }}
        >
          ScrapeSmart AI
        </div>
        <div
          style={{
            fontSize: 30,
            color: "#6B635A",
            maxWidth: 960,
            lineHeight: 1.5,
          }}
        >
          Explore page structure, audit technical SEO, scrape content, and chat with any website.
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
