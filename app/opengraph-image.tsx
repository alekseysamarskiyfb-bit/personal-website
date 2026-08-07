/**
 * The link-preview card.
 *
 * The site's primary distribution is a URL pasted into Telegram, so the unfurl
 * IS the first impression — previously there was none at all. Rendered with
 * next/og (part of Next, no new dependency) at build time, so it ships as a
 * static image.
 *
 * Deliberately uses system font stacks rather than the site's faces: pulling
 * Anton and Instrument Sans in here would mean fetching font binaries during
 * the build. The card carries the brand through colour, scale and layout.
 */
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Oleksii Samarskyi — Performance Creative & Growth";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#14120f",
          padding: "72px 80px",
          fontFamily: "Helvetica, Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#8f5cff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontSize: 34,
              fontWeight: 700,
            }}
          >
            S
          </div>
          <div style={{ color: "rgba(243,239,230,0.62)", fontSize: 26, letterSpacing: 2 }}>
            OLEKSII SAMARSKYI
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Two single-child divs rather than one with a <br>: satori
              requires an explicit display on any element with more than one
              child, and a line break counts. */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              color: "#f3efe6",
              fontSize: 82,
              fontWeight: 700,
              lineHeight: 1.04,
              letterSpacing: -2.5,
              maxWidth: 900,
            }}
          >
            <div>Performance Creative,</div>
            <div>That Converts.</div>
          </div>
          <div style={{ color: "rgba(243,239,230,0.62)", fontSize: 30, maxWidth: 820 }}>
            Static, motion and AI-assisted creative for paid acquisition.
            Founder of Velar Studio.
          </div>
        </div>
      </div>
    ),
    size
  );
}
