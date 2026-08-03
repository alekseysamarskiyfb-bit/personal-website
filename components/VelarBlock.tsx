import Image from "next/image";
import TiltCard from "@/components/TiltCard";

const capabilities = [
  {
    title: "Paid ad creative",
    body: "Static & video ad creatives across traffic-arbitrage verticals — Sweepstakes, Crypto, iGaming, Search, Native.",
  },
  {
    title: "Content editing",
    body: "Regular video editing, Reels & Shorts, YouTube content — cut and formatted for every platform.",
  },
  {
    title: "Brand & product",
    body: "Static creative and promo video for brands, streamers, businesses and e-commerce — built for the product, not a template.",
  },
];

export default function VelarBlock() {
  return (
    <TiltCard className="velar-block glass">
      <div className="orb-field">
        <span className="orb orb--a" />
      </div>

      <div className="relative grid md:grid-cols-[0.9fr_1.1fr] gap-8 md:gap-12 items-center mb-10">
        <div className="velar-logo-plate rounded-2xl p-6 md:p-10 flex items-center justify-center">
          <div className="relative w-full aspect-[16/7]">
            <Image
              src="/velar-wordmark.jpg"
              alt="Velar Studio"
              fill
              sizes="(min-width: 768px) 420px, 90vw"
              className="velar-logo-img object-contain"
            />
          </div>
        </div>

        <div>
          <p className="eyebrow eyebrow-signal mb-4">Founder &amp; creative director</p>
          <h3 className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-4 max-w-lg">
            Full-service ad creative, built to perform.
          </h3>
          <p className="text-muted leading-relaxed max-w-xl mb-6">
            Alongside my own path, I run Velar Studio — a small creative
            production team making static and video assets in every format,
            for every need: performance ad creative for paid acquisition,
            and regular video editing &amp; content for brands, businesses
            and product.
          </p>
          <div className="flex flex-wrap gap-2">
            {["Video", "Static", "UGC", "Motion", "AI-assisted"].map((t) => (
              <span
                key={t}
                className="tag text-muted border hairline rounded-full px-3 py-1.5"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="relative grid sm:grid-cols-3 gap-4 mb-8">
        {capabilities.map((c, i) => (
          <div
            key={c.title}
            className="rounded-xl border hairline bg-ink/40 p-5"
          >
            <span className="tag text-muted">{`0${i + 1}`}</span>
            <p className="font-display text-base font-semibold mt-3 mb-2">
              {c.title}
            </p>
            <p className="text-muted text-sm leading-relaxed">{c.body}</p>
          </div>
        ))}
      </div>

      <a href="#contact" className="button button-secondary focus-ring relative">
        Ask about Velar Studio
      </a>
    </TiltCard>
  );
}
