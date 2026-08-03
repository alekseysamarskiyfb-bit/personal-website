const links = [
  { label: "Email", href: "mailto:oleksii.samarskyii@gmail.com", value: "oleksii.samarskyii@gmail.com" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/oleksii-samarskyi", value: "in/oleksii-samarskyi" },
  { label: "Velar Studio", href: "#velar", value: "See the studio" },
];

export default function Footer() {
  return (
    <footer className="site-footer border-t hairline">
      <div className="footer-marquee" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <span key={i}>OLEKSII SAMARSKYI •&nbsp;</span>
        ))}
      </div>

      <div className="max-w-content mx-auto px-6 pt-12 pb-8">
        <div>
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target={l.href.startsWith("http") ? "_blank" : undefined}
              rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="footer-link-row group focus-ring"
            >
              <span className="flex items-baseline gap-4">
                <span className="tag text-muted">{l.label}</span>
                <span className="footer-link-row__label">{l.value}</span>
              </span>
              <span className="footer-link-row__arrow eyebrow eyebrow-signal">↗</span>
            </a>
          ))}
        </div>

        <div className="flex items-center justify-between mt-10 pt-6 border-t hairline">
          <p className="tag text-muted">
            Oleksii Samarskyi — Founder, Velar Studio © 2026
          </p>
          <a href="#top" aria-label="Back to top" className="back-to-top focus-ring">
            <span className="text-signal text-lg">↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
