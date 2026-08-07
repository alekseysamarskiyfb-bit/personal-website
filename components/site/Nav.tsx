"use client";

import { useEffect, useState } from "react";
import { NAV, SITE } from "@/data/site";
import { ArrowUpRight } from "./icons";

/**
 * A single glass pill, fixed to the top. It is the only persistent chrome on
 * the site, so it stays quiet: it lifts slightly once the hero is behind it
 * and otherwise does nothing.
 */
export default function Nav() {
  const [lifted, setLifted] = useState(false);

  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="nav" data-lifted={lifted ? "" : undefined}>
      <div className="nav__pill glass">
        <a className="nav__mark" href="#top" aria-label="Back to top">
          <span className="nav__mark-glyph display">OS</span>
          <span className="nav__mark-name">
            {SITE.firstName} <strong>{SITE.lastName}</strong>
          </span>
        </a>

        <nav className="nav__links" aria-label="Sections">
          {NAV.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <a
          className="cta nav__cta"
          href={SITE.telegram}
          target="_blank"
          rel="noreferrer noopener"
        >
          Hire me
          <ArrowUpRight className="arrow" />
        </a>
      </div>
    </header>
  );
}
