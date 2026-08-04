/**
 * WAYS TO WORK — the three-tier slab.
 *
 * One glass slab holding three cards, with the featured tier as a NESTED,
 * inset, darker panel — a card inside the card. The asymmetric outer padding
 * (.9vw left vs 2.36vw right) exists so the inset card sits nearly flush left
 * while the plain tiers keep air on the right.
 *
 * PLACEHOLDER CONTENT: the engagement shapes are real, the rates are not.
 * Every value marked data-placeholder is for you to replace — nothing here
 * is a commitment, and no figure was invented as if it were.
 */

const TIERS = [
  {
    key: "ongoing",
    name: "Ongoing creative",
    price: "$0,000",
    unit: "/ month",
    featured: true,
    blurb:
      "A standing creative partner for a paid channel. Fixed monthly output, agreed test plan, rolling iteration on what the numbers say.",
    items: [
      "Monthly static + motion volume",
      "Test structures agreed with your buyer",
      "Iteration on live performance data",
      "Async reviews and shared source files",
      "Unused volume rolls over one month",
    ],
    footnote: "For teams running paid consistently and needing creative to keep up.",
  },
  {
    key: "sprint",
    name: "Creative sprint",
    price: "$0,000",
    unit: "one-off",
    featured: false,
    blurb:
      "A fixed-scope block to rebuild a funnel's creative from hook to landing hero, delivered in two to three weeks.",
    items: [
      "Concept and hook development",
      "Static set + motion cutdowns",
      "Landing hero art direction",
      "Handover with editable sources",
      "Two revision rounds included",
    ],
    footnote: "For a launch, a new vertical, or a channel that's gone stale.",
  },
  {
    key: "custom",
    name: "Brand & systems",
    price: "Let's talk",
    unit: "",
    featured: false,
    blurb:
      "Identity, creative direction and the internal systems that keep output consistent as a team scales.",
    items: [
      "Logo and brand identity",
      "Creative direction and guidelines",
      "Template and component systems",
      "Team onboarding and review process",
      "AI pipeline setup where it earns its place",
    ],
    footnote: "For teams whose creative problem is structural, not volume.",
  },
];

export default function Ways() {
  return (
    <section className="sevice_section section-inset" id="ways">
      <div className="column" id="services_column">
        <p
          className="label"
          data-tl-type="trigger"
          data-tl-trigger="#services_column"
          data-tl-start="top 90%"
          data-tl-from="{'width': '0vw', 'opacity': 0}"
          data-tl-to="{'width': 'auto', 'opacity': 1, 'duration': 0.7, 'ease': 'expo.inOut'}"
        >
          Ways to work
        </p>
        <h2
          className="h2-style margin-bottom-s"
          data-tl-type="trigger"
          data-tl-trigger="#services_column"
          data-tl-start="top 90%"
          data-tl-split="lines"
          data-tl-from="{'yPercent': 100}"
          data-tl-to="{'yPercent': 0, 'duration': 0.6, 'stagger': 0.1, 'delay': 0.3, 'ease': 'power2.out'}"
        >
          Three shapes,
          <br />
          same standard
        </h2>
        <p
          className="max-width-389 op80"
          data-tl-type="trigger"
          data-tl-trigger="#services_column"
          data-tl-start="top 90%"
          data-tl-split="lines"
          data-tl-from="{'yPercent': 100}"
          data-tl-to="{'yPercent': 0, 'duration': 0.6, 'stagger': 0.1, 'delay': 0.3, 'ease': 'power2.out'}"
        >
          Same attention to detail either way. The only real difference is the
          size of the commitment and what you need right now.
        </p>
      </div>

      <div className="service-wrap">
        {TIERS.map((tier) => (
          <div
            className={`service-card${tier.featured ? " is-first" : ""}`}
            key={tier.key}
          >
            <div className="service-top-content">
              <div className="service-card-top-item">
                <h3 className="service-card-heading">{tier.name}</h3>
              </div>

              <div className="service-price-item">
                <span className="service-price" data-placeholder="rate">
                  {tier.price}
                </span>
                {tier.unit && <span className="services-hours-text">{tier.unit}</span>}
              </div>

              <p className="op80 service-blurb">{tier.blurb}</p>

              <ul className="service-list">
                {tier.items.map((item) => (
                  <li className="service-list-item" key={item}>
                    <span className="service-list-bullet-icon" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="service-bottom-content">
              <p className="service-footnote op80">{tier.footnote}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="service-placeholder-note">
        Rates shown are placeholders — replace the <code>price</code> values in{" "}
        <code>components/site/Ways.tsx</code> before publishing.
      </p>
    </section>
  );
}
