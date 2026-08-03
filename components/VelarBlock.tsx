import Image from "next/image";
import TiltCard from "@/components/TiltCard";

export default function VelarBlock() {
  return (
    <TiltCard className="velar-block glass">
      <div className="orb-field">
        <span className="orb orb--a" />
      </div>

      <div className="relative flex flex-col md:flex-row md:items-center gap-8 md:gap-12">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-5">
            <Image
              src="/velar-mark.jpg"
              alt=""
              width={46}
              height={46}
              className="velar-block__icon rounded-md"
            />
            <p className="font-display text-xl font-semibold tracking-tight">
              VELAR <span className="grad-text">STUDIO</span>
            </p>
          </div>

          <h3 className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-4 max-w-lg">
            My venture: video &amp; static ad creatives, built to perform.
          </h3>

          <p className="text-muted leading-relaxed max-w-xl mb-6">
            Alongside my own path, I run Velar Studio — producing video and
            static ad creatives for businesses, streamers, YouTubers and
            media-buying teams, built for every platform and format.
          </p>

          <div className="flex flex-wrap gap-2 mb-8">
            {["Video", "Static", "UGC", "Motion", "AI-assisted"].map((t) => (
              <span
                key={t}
                className="tag text-muted border hairline rounded-full px-3 py-1.5"
              >
                {t}
              </span>
            ))}
          </div>

          <a href="#contact" className="button button-secondary focus-ring">
            Ask about Velar Studio
          </a>
        </div>
      </div>
    </TiltCard>
  );
}
