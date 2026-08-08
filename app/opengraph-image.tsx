import { ImageResponse } from "next/og";
import { SITE } from "@/data/site";

export const alt = `${SITE.firstName} ${SITE.lastName} — ${SITE.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * The link preview is the first thing a client sees when the URL lands in a
 * chat, so it carries the same two things the hero does: the name, large, and
 * what he does. It renders once at build time on the system stack — no web
 * fonts to fetch, and no server needed to serve it.
 */
/**
 * Satori ships only a regular-weight fallback, which renders the name thin and
 * off-brand. Asking the Google Fonts CSS endpoint without a User-Agent gets a
 * TrueType URL back (a modern UA would get woff2, which Satori cannot read).
 * If the network is unavailable at build time the card still renders — just in
 * the fallback face — so this can never break a deploy.
 */
async function archivo(weight: number): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      `https://fonts.googleapis.com/css2?family=Archivo:wght@${weight}`,
    ).then((r) => r.text());
    const url = css.match(/src: url\((.+?)\) format\('truetype'\)/)?.[1];
    if (!url) return null;
    return await fetch(url).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

export default async function OpengraphImage() {
  const [bold, regular] = await Promise.all([archivo(800), archivo(400)]);
  const fonts = [
    bold && { name: "Archivo", data: bold, weight: 800 as const, style: "normal" as const },
    regular && { name: "Archivo", data: regular, weight: 400 as const, style: "normal" as const },
  ].filter(Boolean) as NonNullable<
    ConstructorParameters<typeof ImageResponse>[1]
  >["fonts"];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#dcdfe0",
          padding: "72px 80px",
          fontFamily: "Archivo",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "rgba(13,13,15,0.5)",
          }}
        >
          {SITE.role}
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            color: "#0d0d0f",
          }}
        >
          <div style={{ display: "flex", fontSize: 44, letterSpacing: 14 }}>
            {SITE.firstName.toUpperCase()}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 148,
              fontWeight: 800,
              letterSpacing: -6,
              lineHeight: 1,
              marginTop: 8,
            }}
          >
            {SITE.lastName.toUpperCase()}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 26,
            color: "rgba(13,13,15,0.5)",
          }}
        >
          <span>{SITE.agency}</span>
          <span>{SITE.telegramHandle}</span>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
