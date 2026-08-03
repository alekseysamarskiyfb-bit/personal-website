"use client";

import { useEffect, useState } from "react";

const leftLinks = [
  { href: "#about", label: "About" },
  { href: "#journey", label: "Journey" },
  { href: "#portfolio", label: "Portfolio" },
];

const rightLinks = [
  { href: "#velar", label: "Velar Studio" },
  { href: "#capabilities", label: "Capabilities" },
  { href: "#contact", label: "Contact" },
];

const allLinks = [...leftLinks, ...rightLinks];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [docked, setDocked] = useState(false);

  // The in-hero nav scrolls away with the hero; once it is gone, dock a slim
  // bar at the top so navigation stays reachable. Driven by scroll position
  // rather than IntersectionObserver: observer callbacks are tied to the
  // rendering lifecycle, so they stall wherever frames are throttled.
  useEffect(() => {
    const onScroll = () => {
      const hero = document.querySelector(".hero-shell");
      const threshold = hero
        ? hero.getBoundingClientRect().height * 0.75
        : window.innerHeight * 0.75;
      setDocked(window.scrollY > threshold);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      {/* Desktop: plain links laid across the hero, split around the portrait */}
      <nav className={`hero-nav ${docked ? "hero-nav--docked" : ""}`}>
        <ul className="hero-nav__group">
          {leftLinks.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="hero-nav__link focus-ring">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a href="#top" className="hero-nav__brand focus-ring">
          <span className="text-signal">~</span>oleksii.samarskyi
        </a>

        <ul className="hero-nav__group hero-nav__group--right">
          {rightLinks.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="hero-nav__link focus-ring">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile bar */}
      <div className={`mobile-bar md:hidden ${docked ? "mobile-bar--docked" : ""}`}>
        <a
          href="#top"
          className="logo-mark font-mono text-sm text-text focus-ring rounded"
          onClick={() => setOpen(false)}
        >
          <span className="text-signal">~</span>oleksii.samarskyi
        </a>
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className={`burger focus-ring ${open ? "burger--open" : ""}`}
        >
          <span className="burger__bar" />
          <span className="burger__bar" />
          <span className="burger__bar" />
        </button>
      </div>

      {/* Mobile panel */}
      <div className={`mobile-panel md:hidden ${open ? "mobile-panel--open" : ""}`}>
        <ul className="mobile-panel__list">
          {allLinks.map((l, i) => (
            <li
              key={l.href}
              className="mobile-panel__item"
              style={{ transitionDelay: open ? `${80 + i * 55}ms` : "0ms" }}
            >
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-display text-2xl font-semibold tracking-tight"
              >
                {l.label}
              </a>
            </li>
          ))}
          <li
            className="mobile-panel__item mobile-panel__item--cta"
            style={{ transitionDelay: open ? `${80 + allLinks.length * 55}ms` : "0ms" }}
          >
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="button button-primary focus-ring"
            >
              Get in touch
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}
