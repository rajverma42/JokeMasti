import { ImageResponse } from "next/og";
import { getJokeBySlug } from "@/data/jokes";
import { siteConfig } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: { slug: string } }) {
  const joke = getJokeBySlug(params.slug);
  const title = joke?.title || siteConfig.name;
  const text = joke?.text || siteConfig.tagline;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "70px 80px",
          background: "linear-gradient(135deg, #FF6B35 0%, #FF3D77 55%, #7C3AED 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 28,
            fontWeight: 700,
            marginBottom: 28,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 48,
              height: 48,
              borderRadius: 14,
              background: "rgba(255,255,255,0.2)",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
            }}
          >
            😄
          </div>
          {siteConfig.name}
        </div>
        <div style={{ display: "flex", fontSize: 40, fontWeight: 800, lineHeight: 1.2, maxWidth: 980 }}>
          {title}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 24,
            fontSize: 26,
            lineHeight: 1.5,
            color: "rgba(255,255,255,0.92)",
            maxWidth: 960,
            whiteSpace: "pre-wrap",
          }}
        >
          {text.length > 180 ? `${text.slice(0, 180)}…` : text}
        </div>
      </div>
    ),
    { ...size }
  );
}
