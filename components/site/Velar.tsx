import Image from "next/image";
import Reveal from "@/components/motion/Reveal";
import { VELAR_SERVICES } from "@/data/velar";

/**
 * The studio gets the site's one dark surface. That is partly composition — a
 * light page needs somewhere for the eye to land — and partly practical: the
 * Velar wordmark is white artwork on transparency, so it only reads on ink.
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

        <Reveal className="velar__panel" strength={0.8}>
          <div className="velar__glow" aria-hidden="true" />
          <div className="velar__mark">
            <Image
              src="/velar-wordmark.webp"
              alt="Velar Studio"
              width={1600}
              height={673}
              sizes="(max-width: 900px) 70vw, 34vw"
            />
          </div>
          <div className="velar__pitch">
            <p>
              A small creative agency built around one question every media
              buyer actually asks: <span className="serif">did it convert?</span>
            </p>
            <p className="velar__pitch-sub">
              Velar makes the creative that answers it — static, motion, and
              AI-assisted, produced at the volume paid traffic needs and held to
              the standard a brand deserves.
            </p>
          </div>
        </Reveal>

        <ul className="velar__grid">
          {VELAR_SERVICES.map((service, i) => (
            <Reveal
              as="li"
              className="velar__card glass"
              key={service.title}
              index={i}
              strength={0.7}
            >
              <span className="velar__num">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3>{service.title}</h3>
              <p>{service.blurb}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
