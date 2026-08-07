import Reveal from "@/components/motion/Reveal";
import { CAREER } from "@/data/career";

/**
 * A single rail with the roles hanging off it, newest first. Each role is its
 * own reveal rather than the section being one — a seven-item list animating
 * as a block would put most of it off screen before it finished.
 */
export default function Career() {
  return (
    <section className="section career" id="career">
      <div className="shell">
        <Reveal className="section-head">
          <h2 className="display">
            Career <span className="serif">so far</span>
          </h2>
          <p className="eyebrow">2023 — Present · {CAREER.length} roles</p>
        </Reveal>

        <ol className="career__list">
          {CAREER.map((role, i) => (
            <Reveal
              as="li"
              className="career__item"
              key={`${role.company}-${role.period}`}
              index={i % 3}
              strength={0.8}
            >
              <div className="career__rail" aria-hidden="true">
                <span className="career__node" />
              </div>

              <div className="career__meta">
                <p className="career__period">{role.period}</p>
                <p className="career__where">{role.location}</p>
                {role.type ? (
                  <p className="career__type">{role.type}</p>
                ) : null}
              </div>

              <div className="career__body glass">
                <header>
                  <h3>{role.title}</h3>
                  <p className="career__company">{role.company}</p>
                </header>
                <ul>
                  {role.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
