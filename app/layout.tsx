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

const TITLE = "Oleksii Samarskyi — Performance Creative & Growth";
const DESCRIPTION =
  "Performance creative and growth for paid acquisition. Static, motion and AI-assisted creative across Meta, TikTok, Native and Display. Founder of Velar Studio.";
const SITE = "https://oleksiisamarskyi.com";

export const metadata: Metadata = {
  /* Absolute URLs for the social card. Without a metadataBase, Next emits
     relative og:image paths, which no unfurler will resolve. */
  metadataBase: new URL(SITE),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE,
    siteName: "Oleksii Samarskyi",
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export const viewport: Viewport = {
  /* The ground colour. This was #d5cfbe — a leftover from the light palette
     the site had before it was inverted, so mobile browser chrome rendered a
     bone-coloured bar above a near-black page. */
  themeColor: "#14120f",
  colorScheme: "dark",
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
