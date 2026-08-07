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
                  AI-assisted creative studio
                </p>
              </div>
              <div className="velar__pitch">
                <p>
                  A small creative agency built around one question every media
                  buyer actually asks:{" "}
                  <span className="serif">did it convert?</span>
                </p>
                <p className="velar__pitch-sub">
                  Velar makes the creative that answers it — static, motion, and
                  AI-assisted, produced at the volume paid traffic needs and
                  held to the standard a brand deserves.
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
