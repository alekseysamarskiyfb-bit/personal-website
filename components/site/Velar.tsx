import Image from "next/image";
import Reveal from "@/components/motion/Reveal";
import VelarStage from "@/components/site/VelarStage";
import { SITE } from "@/data/site";
import { VELAR_SERVICES } from "@/data/velar";

/**
 * The agency gets the site's one dark surface. That is partly composition — a
 * light page needs somewhere for the eye to land — and partly brand: Velar's
 * own identity is a green wordmark on a near-black blue, and this is the one
 * place on the site that belongs to Velar rather than to Oleksii.
 *
 * The whole agency — wordmark, founder credit, pitch and the six services —
 * sits inside that one surface. Splitting the services off onto the light
 * field, as this section used to, made them read as a footnote to the agency
 * rather than as what the agency sells. One plane, one reveal, one light.
 *
 * The wordmark is Velar's own artwork, cropped to its ink so the image box and
 * the visible mark are the same rectangle — the previous file carried 14.31% of
 * transparent margin and never sat flush with anything without a hand-tuned
 * correction. `velar-wordmark-dark.webp` is the same mark in the brand black,
 * kept for any light surface that needs it later.
 */
export default function Velar() {
  return (
    <section className="section velar" id="velar">
      <div className="shell">
        <Reveal className="section-head">
          <h2 className="display">
            Velar <span className="serif">Agency</span>
          </h2>
          <p className="eyebrow">The agency · 2026</p>
        </Reveal>

        <Reveal className="velar__reveal" strength={0.8}>
          <VelarStage>
            <div className="velar__head">
              <div className="velar__mark">
                <div className="velar__wordmark">
                  <Image
                    src="/velar-wordmark-green.webp"
                    alt={SITE.agency}
                    width={1200}
                    height={248}
                    sizes="(max-width: 900px) 200px, 272px"
                    priority={false}
                  />
                </div>

                <p className="velar__lockup-sub">
                  <span>Agency</span>
                  <span className="velar__lockup-rule" aria-hidden="true" />
                </p>

                <p className="velar__founder">
                  <span className="velar__founder-label">Founder</span>
                  <span className="velar__founder-name">
                    {SITE.firstName} {SITE.lastName}
                  </span>
                </p>

              </div>

              <div className="velar__pitch">
                <p>
                  A creative agency built around vertical video — ads for
                  businesses, short-form for the people building an audience,{" "}
                  <span className="serif">made to be watched.</span>
                </p>
                <p className="velar__pitch-sub">
                  I founded Velar and I run its creative. Static comes with the
                  video: Instagram Stories, social posts and ad creatives cut to
                  any platform&rsquo;s format. AI is used wherever it genuinely
                  earns its place — volume, variation, speed — and nowhere it
                  would cost the work its finish.
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
