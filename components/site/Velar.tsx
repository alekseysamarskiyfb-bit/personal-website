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

      {/* The plate arrives as one object, then its contents cascade. Without
          this the section's only motion was the label and the lede, which is
          why it read as static next to its neighbours. */}
      <div
        className="velar-panel"
        data-tl-once
        data-tl-type="trigger"
        data-tl-trigger=".velar-panel"
        data-tl-start="top 82%"
        data-tl-from="{'y': 48, 'opacity': 0}"
        data-tl-to="{'y': 0, 'opacity': 1, 'duration': 1.1, 'ease': 'expo.out'}"
      >
        {/* The section's scroll-LINKED component: the bloom tracks scroll
            rather than firing once, so the panel keeps responding as you move
            through it instead of settling and going dead. */}
        <div
          className="velar-glow"
          aria-hidden
          data-tl-desktop
          data-tl-type="scroll"
          data-tl-trigger=".velar-panel"
          data-tl-start="top 90%"
          data-tl-end="bottom 60%"
          data-tl-from="{'opacity': 0.25, 'scale': 0.72}"
          data-tl-to="{'opacity': 1, 'scale': 1.08}"
        />

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
              /* Rises from behind its own box — the same mask grammar the
                 headings use, so the venture's mark arrives like the rest of
                 the page's type rather than just being present. */
              data-tl-once
              data-tl-type="trigger"
              data-tl-trigger=".velar-panel"
              data-tl-start="top 78%"
              data-tl-from="{'yPercent': 105}"
              data-tl-to="{'yPercent': 0, 'duration': 1.05, 'delay': 0.15, 'ease': 'expo.out'}"
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

        <div
          className="velar-panel-foot"
          data-tl-once
          data-tl-type="trigger"
          data-tl-trigger=".velar-pillars"
          data-tl-start="top 72%"
          data-tl-from="{'opacity': 0, 'y': 22}"
          data-tl-to="{'opacity': 1, 'y': 0, 'duration': 0.9, 'delay': 0.2, 'ease': 'expo.out'}"
        >
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
