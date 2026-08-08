import Image from "next/image";
import Reveal from "@/components/motion/Reveal";
import VelarStage from "@/components/site/VelarStage";
import { VELAR_SERVICES } from "@/data/velar";

/**
 * The studio gets the site's one dark surface. That is partly composition — a
 * light page needs somewhere for the eye to land — and partly practical: the
 * Velar wordmark is white artwork on transparency, so it only reads on ink.
 *
 * The whole studio — mark, pitch and the six services — sits inside that one
 * surface. Splitting the services off onto the light field, as this section
 * used to, made them read as a footnote to the studio rather than as what the
 * studio sells. One plane, one reveal, one light source.
 */
export default function Velar() {
  return (
    <section className="section velar" id="velar">
      <div className="shell">
        <Reveal className="section-head">
          <h2 className="display">
            Velar <span className="serif">Studio</span>
          </h2>
          <p className="eyebrow">The studio · 2026</p>
        </Reveal>

        <Reveal className="velar__reveal" strength={0.8}>
          <VelarStage>
            <div className="velar__head">
              <div className="velar__mark">
                <Image
                  src="/velar-wordmark.webp"
                  alt="Velar Studio"
                  width={1600}
                  height={673}
                  sizes="(max-width: 900px) 62vw, 30vw"
                />
                <p className="velar__tag">
                  <span className="velar__pulse" aria-hidden="true" />
                  Vertical video · AI-powered creative
                </p>
              </div>
              <div className="velar__pitch">
                <p>
                  A creative studio built around vertical video — ads for
                  businesses, short-form for the people building an audience,{" "}
                  <span className="serif">made to be watched.</span>
                </p>
                <p className="velar__pitch-sub">
                  Static comes with it: Instagram Stories, social posts and ad
                  creatives cut to any platform&rsquo;s format. AI is used
                  wherever it genuinely earns its place — volume, variation,
                  speed — and nowhere it would cost the work its finish.
                </p>
              </div>
            </div>

            <div className="velar__rule" aria-hidden="true" />

            <ul className="velar__grid">
              {VELAR_SERVICES.map((service, i) => (
                <li className="velar__card" key={service.title}>
                  <span className="velar__num">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3>{service.title}</h3>
                  <p>{service.blurb}</p>
                </li>
              ))}
            </ul>
          </VelarStage>
        </Reveal>
      </div>
    </section>
  );
}
