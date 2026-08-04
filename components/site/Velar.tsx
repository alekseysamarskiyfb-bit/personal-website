/**
 * VELAR STUDIO — the venture block.
 *
 * Built as the page's one deliberate crescendo: a single full-bleed panel
 * that breaks the rhythm of the sections around it. The violet is allowed to
 * carry more weight here than anywhere else on the site, because this is the
 * only place the accent IS the subject rather than a highlight.
 *
 * The wordmark art is white-on-transparent, so it sits on its own darker
 * plate rather than on the section ground.
 */

import { IconArrowUpRight, IconChip, IconPen, IconTeam, IconTrendUp } from "./icons";

const PILLARS = [
  {
    Icon: IconPen,
    title: "Creative production",
    body: "Static, motion and AI-assisted advertising built as testable variants, not as one-off deliverables.",
  },
  {
    Icon: IconChip,
    title: "AI pipelines",
    body: "Prompt-built scenes, talent and voice folded into the daily workflow — finished by hand where the model shows.",
  },
  {
    Icon: IconTrendUp,
    title: "Performance loop",
    body: "Test structures agreed before production, so every asset answers a question the numbers can settle.",
  },
  {
    Icon: IconTeam,
    title: "Team & systems",
    body: "The templates, review process and internal tooling that keep output consistent as volume grows.",
  },
];

export default function Velar() {
  return (
    <section className="velar_section section-inset" id="velar">
      <div className="column" id="velar_column">
        <p
          className="label"
          data-tl-once
          data-tl-type="trigger"
          data-tl-trigger="#velar_column"
          data-tl-start="top 88%"
          data-tl-from="{'width': '0vw', 'opacity': 0}"
          data-tl-to="{'width': 'auto', 'opacity': 1, 'duration': 0.7, 'ease': 'expo.inOut'}"
        >
          My venture
        </p>
      </div>

      <div className="velar-panel">
        <div className="velar-glow" aria-hidden />

        <div className="velar-panel-top">
          <div className="velar-lockup">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="velar-wordmark"
              src="/velar-wordmark.png"
              alt="Velar Studio"
              width={4320}
              height={1816}
              loading="lazy"
              decoding="async"
            />
          </div>

          <p
            className="velar-lede"
            data-tl-once
            data-tl-type="trigger"
            data-tl-trigger=".velar-panel"
            data-tl-start="top 80%"
            data-tl-split="lines"
            data-tl-from="{'yPercent': 100}"
            data-tl-to="{'yPercent': 0, 'duration': 0.7, 'stagger': 0.09, 'delay': 0.25, 'ease': 'expo.out'}"
          >
            The same loop — create, test, read the numbers, iterate — run as a
            studio instead of as one freelancer. Velar is where the pipelines,
            the systems and the people come together.
          </p>
        </div>

        <ul className="velar-pillars">
          {PILLARS.map((p, i) => (
            <li
              className="velar-pillar"
              key={p.title}
              data-tl-once
              data-tl-type="trigger"
              data-tl-trigger=".velar-panel"
              data-tl-start="top 68%"
              data-tl-from="{'opacity': 0, 'y': 26, 'filter': 'blur(10px)'}"
              data-tl-to={`{'opacity': 1, 'y': 0, 'filter': 'blur(0px)', 'duration': 1.1, 'delay': ${
                0.1 + i * 0.09
              }, 'ease': 'expo.out'}`}
            >
              <span className="velar-pillar-icon" aria-hidden>
                <p.Icon />
              </span>
              <h3 className="velar-pillar-title">{p.title}</h3>
              <p className="velar-pillar-body">{p.body}</p>
            </li>
          ))}
        </ul>

        <div className="velar-panel-foot">
          <p className="velar-foot-note">
            Taking on a small number of studio engagements at a time.
          </p>
          <a className="velar-cta" href="#contact" data-button-hover>
            <p>Start a project</p>
            <IconArrowUpRight className="velar-cta-arrow" />
          </a>
        </div>
      </div>
    </section>
  );
}
