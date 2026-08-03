"use client";

import { useState } from "react";
import Reveal from "@/components/Reveal";

type Kind = "static" | "video";

type Item = {
  id: string;
  kind: Kind;
  title: string;
  vertical: string;
  tags: string[];
};

const items: Item[] = [
  { id: "01", kind: "video", title: "Sweepstakes — UGC hook", vertical: "Sweepstakes", tags: ["UGC", "Meta"] },
  { id: "02", kind: "static", title: "Crypto — paid static set", vertical: "Crypto", tags: ["Static", "Native"] },
  { id: "03", kind: "video", title: "iGaming — motion promo", vertical: "iGaming", tags: ["Motion", "TikTok"] },
  { id: "04", kind: "static", title: "Search — banner set", vertical: "Search", tags: ["Banners", "Display"] },
  { id: "05", kind: "video", title: "Velar Studio — brand reel", vertical: "Velar Studio", tags: ["Reels", "AI Video"] },
  { id: "06", kind: "static", title: "Sweepstakes — landing hero", vertical: "Sweepstakes", tags: ["Landing", "Static"] },
  { id: "07", kind: "video", title: "AI-assisted — UGC ad", vertical: "Performance", tags: ["AI Video", "UGC"] },
  { id: "08", kind: "static", title: "Crypto — carousel ad", vertical: "Crypto", tags: ["Carousel", "Meta"] },
];

const filters: { key: "all" | Kind; label: string }[] = [
  { key: "all", label: "All" },
  { key: "static", label: "Static" },
  { key: "video", label: "Video" },
];

export default function Portfolio() {
  const [filter, setFilter] = useState<"all" | Kind>("all");
  const activeIndex = filters.findIndex((f) => f.key === filter);

  return (
    <section id="portfolio" className="max-w-content mx-auto px-6 py-20 md:py-28 border-t hairline">
      <Reveal>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-14">
          <div>
            <p className="eyebrow eyebrow-data mb-4">Selected work</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight max-w-xl">
              Built for the feed,
              <br />
              made to perform.
            </h2>
          </div>

          <div className="portfolio-toggle relative">
            <div
              className="portfolio-toggle__pill-active"
              style={{
                width: `${100 / filters.length}%`,
                transform: `translateX(${activeIndex * 100}%)`,
              }}
            />
            {filters.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={`portfolio-toggle__btn ${filter === f.key ? "portfolio-toggle__btn--active" : ""}`}
              >
                <span>{f.label}</span>
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      <p className="text-lg text-muted max-w-xl mb-10">
        Vertical-format creative — 9:16 static and video — for paid
        acquisition across Sweepstakes, Crypto, iGaming and Search. Full
        case studies land here soon; this is the shape of what&apos;s
        coming.
      </p>

      <div className="portfolio-grid">
        {items.map((item, i) => {
          const visible = filter === "all" || filter === item.kind;
          return (
            <Reveal
              key={item.id}
              delay={(i % 4) * 60}
              className={visible ? "" : "portfolio-card--hidden"}
            >
              <div className="portfolio-card">
                <div className="portfolio-card__glyph">
                  {item.kind === "video" ? (
                    <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="11" stroke="#948FA6" strokeWidth="1.2" />
                      <path d="M10 8.5L16 12L10 15.5V8.5Z" fill="#948FA6" />
                    </svg>
                  ) : (
                    <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
                      <rect x="2.5" y="4" width="19" height="16" rx="2" stroke="#948FA6" strokeWidth="1.2" />
                      <circle cx="8.5" cy="9.5" r="1.5" stroke="#948FA6" strokeWidth="1.2" />
                      <path d="M4 16L9 11.5L13 14.5L16 12L20 16" stroke="#948FA6" strokeWidth="1.2" />
                    </svg>
                  )}
                </div>

                <span className="portfolio-card__badge">
                  {item.kind === "video" ? "Video" : "Static"} · {item.id}
                </span>

                <div className="portfolio-card__footer">
                  <p className="tag text-muted mb-1">{item.vertical}</p>
                  <p className="font-display text-sm font-medium leading-snug">
                    {item.title}
                  </p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
