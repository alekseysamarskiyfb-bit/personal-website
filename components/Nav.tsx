"use client";

import { useEffect, useRef, useState } from "react";

const links = [
  { href: "#about", label: "About" },
  { href: "#journey", label: "Journey" },
  { href: "#portfolio", label: "Portfolio" },
  { href: "#velar", label: "Velar Studio" },
  { href: "#capabilities", label: "Capabilities" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  // The hero sizes itself against the nav, which occupies flow. Publish the
  // real measured height so the two can't drift apart across breakpoints.
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const publish = () =>
      document.documentElement.style.setProperty(
        "--nav-h",
        `${el.getBoundingClientRect().height}px`
      );
    publish();
    const ro = new ResizeObserver(publish);
    ro.observe(el);
    return () => ro.disconnect();
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
    <header
      ref={headerRef}
      className="sticky top-0 z-50 bg-ink/80 backdrop-blur-xl border-b hairline"
    >
      <nav className="max-w-content mx-auto flex items-center justify-between px-6 py-4">
        <a
          href="#top"
          className="logo-mark font-mono text-sm text-text focus-ring rounded"
          onClick={() => setOpen(false)}
        >
          <span className="text-signal">~</span>oleksii.samarskyi
          <span className="logo-mark__cursor">_</span>
        </a>

        <ul className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="tag text-muted hover:text-text transition-colors focus-ring rounded no-underline"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:block">
          <a
            href="#contact"
            className="button button-primary button-nav focus-ring"
          >
            Get in touch
          </a>
        </div>

        {/* Burger — mobile only */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className={`burger md:hidden focus-ring ${open ? "burger--open" : ""}`}
        >
          <span className="burger__bar" />
          <span className="burger__bar" />
          <span className="burger__bar" />
        </button>
      </nav>

      {/* Mobile panel */}
      <div className={`mobile-panel md:hidden ${open ? "mobile-panel--open" : ""}`}>
        <ul className="mobile-panel__list">
          {links.map((l, i) => (
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
            style={{ transitionDelay: open ? `${80 + links.length * 55}ms` : "0ms" }}
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
    </header>
  );
}
