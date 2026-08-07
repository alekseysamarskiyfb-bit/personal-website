import type { Metadata, Viewport } from "next";
import { Archivo, Inter_Tight, Instrument_Serif } from "next/font/google";
import "./globals.css";

/**
 * Three typefaces, each with one job.
 *
 * Archivo carries the display voice. It is loaded with its width axis so the
 * hero wordmark can be compressed to a poster weight without a second family.
 * Inter Tight handles every UI and body string. Instrument Serif italic is the
 * editorial accent — used for a handful of words, never a paragraph.
 */
const display = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-serif",
  display: "swap",
});

const DESCRIPTION =
  "Creative and motion designer building high-converting static, motion and " +
  "AI-assisted advertising creatives. Founder of Velar Studio.";

export const metadata: Metadata = {
  metadataBase: new URL("https://oleksiisamarskyi.com"),
  title: {
    default: "Oleksii Samarskyi — Creative & Motion Designer",
    template: "%s — Oleksii Samarskyi",
  },
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    title: "Oleksii Samarskyi — Creative & Motion Designer",
    description: DESCRIPTION,
    siteName: "Oleksii Samarskyi",
  },
  twitter: {
    card: "summary_large_image",
    title: "Oleksii Samarskyi — Creative & Motion Designer",
    description: DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#dcdfe0",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${serif.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
