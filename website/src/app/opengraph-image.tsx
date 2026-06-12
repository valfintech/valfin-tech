import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";

/**
 * Dynamically-generated Open Graph image for the site root.
 *
 * Generated at build/request time via `next/og` rather than shipped as a
 * static asset — keeps the share-card visually consistent with the brand's
 * dark ink/accent palette without depending on a designed file existing.
 * Nested routes can override this by adding their own `opengraph-image.tsx`;
 * until they do, this is the card every page shares when linked out.
 */
export const runtime = "edge";
export const alt = siteConfig.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          backgroundColor: "#06070a",
          backgroundImage:
            "radial-gradient(circle at 18% 22%, rgba(37,99,235,0.28), transparent 42%), radial-gradient(circle at 82% 86%, rgba(29,78,216,0.22), transparent 46%)",
          fontFamily: "Helvetica, Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 9999,
              backgroundColor: "#2563eb",
            }}
          />
          <span style={{ fontSize: 30, color: "#f5f6f8", fontWeight: 600, letterSpacing: -0.5 }}>
            {siteConfig.name.toLowerCase()}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 920 }}>
          <span
            style={{
              fontSize: 58,
              lineHeight: 1.15,
              color: "#f5f6f8",
              fontWeight: 600,
              letterSpacing: -1.5,
            }}
          >
            Never lose another customer to slow follow-up.
          </span>
          <span style={{ marginTop: 28, fontSize: 26, lineHeight: 1.5, color: "#a0a6b0", maxWidth: 760 }}>
            Always-on systems that answer, qualify, follow up, and book, automatically, day and night.
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 22, color: "#38bdf8", fontWeight: 500 }}>valfintech.com</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
