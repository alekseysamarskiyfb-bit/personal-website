import type { Metadata } from "next";
import { Anton, Archivo, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const display = Archivo({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800", "900"],
});

// Condensed face for the hero wordmark: a 7-letter name can only reach the
// reference's letter height at full width if the glyphs are narrow.
const wordmark = Anton({
  subsets: ["latin"],
  variable: "--font-wordmark",
  weight: ["400"],
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Oleksii Samarskyi — Performance Creative & Growth",
  description:
    "Performance creative and growth for paid acquisition. Founder of Velar Studio.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${display.variable} ${wordmark.variable} ${body.variable} ${mono.variable} font-body antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
