import type { Metadata, Viewport } from "next";
import { Anton, Instrument_Sans, Inter } from "next/font/google";
import "./globals.css";

/* Display face — the "TR 3 A" role: a tight editorial grotesque carrying
   every structural element (headings, buttons, card headings, prices,
   numerals, nav links).
   Instrument Sans over Archivo: Archivo's letterforms widen and soften above
   ~60px, which is exactly where this design does its talking. Instrument Sans
   stays narrow and precise at display size, which is what makes the reference's
   headings read editorial rather than merely large. */
const display = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

/* Wordmark face. The preloader/hero mark spans 94.44vw; a 7-letter name can
   only reach that letter height at full width if the glyphs are condensed. */
const wordmark = Anton({
  subsets: ["latin"],
  variable: "--font-wordmark",
  weight: ["400"],
  display: "swap",
});

/* UI face — the "PP Neue Montreal" role: body copy, labels, nav menu items,
   testimonial headings, footer labels. */
const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Oleksii Samarskyi — Performance Creative & Growth",
  description:
    "Performance creative and growth for paid acquisition. Static, motion and AI-assisted creative across Meta, TikTok, Native and Display. Founder of Velar Studio.",
};

export const viewport: Viewport = {
  themeColor: "#d5cfbe",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${display.variable} ${wordmark.variable} ${body.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
