"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getLenis } from "@/components/motion/SmoothScroll";
import { NAV, SITE } from "@/data/site";
import { ArrowUpRight, Telegram } from "./icons";

/**
 * A single glass pill, fixed to the top. It is the only persistent chrome on
 * the site, so it stays quiet: it lifts slightly once the hero is behind it
 * and otherwise does nothing.
 *
 * Below 820px the inline links have nowhere to sit, so the burger takes over
 * and opens the sheet below. The sheet is always in the DOM — it has to
 * animate out, not vanish — and stays out of the tab order because `hidden`
 * visibility is inherited by everything inside it.
 */
export default function Nav() {
  const [lifted, setLifted] = useState(false);
  const [open, setOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /**
   * Above 820px the sheet is display:none and the inline links are back. If
   * the viewport crosses that line while the sheet is open — rotation, a
   * resized window — the sheet would vanish and leave the page frozen behind
   * it, so the state is dropped with it.
   */
  useEffect(() => {
    const wide = window.matchMedia("(min-width: 821px)");
    const onChange = () => {
      if (wide.matches) setOpen(false);
    };
    onChange();
    wide.addEventListener("change", onChange);
    return () => wide.removeEventListener("change", onChange);
  }, []);

  /**
   * Freeze the page while the sheet is open. Lenis owns scrolling when it
   * exists; under reduced motion it never does, and the document is locked
   * directly instead.
   */
  useEffect(() => {
    const lenis = getLenis();
    const root = document.documentElement;

    if (open) {
      if (lenis) lenis.stop();
      else root.style.overflow = "hidden";
    }

    return () => {
      if (lenis) lenis.start();
      else root.style.overflow = "";
    };
  }, [open]);

  /** Escape closes, and Tab stays inside the sheet while it is open. */
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        burgerRef.current?.focus();
        return;
      }
      if (event.key !== "Tab") return;

      // The burger is chrome, not sheet content, but while the sheet is open
      // it is the close button — so it belongs inside the loop.
      const sheetItems = sheetRef.current?.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled])",
      );
      const items = [burgerRef.current, ...Array.from(sheetItems ?? [])].filter(
        (el): el is HTMLElement => el !== null,
      );
      if (!items.length) return;

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;
      const inside = active !== null && items.includes(active);

      if (event.shiftKey && (active === first || !inside)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !inside)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  /** Move focus into the sheet once it is open, so the keyboard follows the eye. */
  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => {
      sheetRef.current?.querySelector<HTMLElement>("a[href]")?.focus();
    }, 420);
    return () => window.clearTimeout(id);
  }, [open]);

  /**
   * A section link closes the sheet and hands the scroll to Lenis. Lenis has
   * to be restarted here rather than in the effect above: SmoothScroll's own
   * document listener runs on this same click, before React has committed the
   * state change, and `scrollTo` on a stopped instance goes nowhere.
   */
  const onNavigate = useCallback(() => {
    getLenis()?.start();
    setOpen(false);
  }, []);

  return (
    <>
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

          <button
            ref={burgerRef}
            type="button"
            className="burger"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="site-menu"
            data-open={open ? "" : undefined}
            onClick={() => setOpen((was) => !was)}
          >
            <span className="burger__box" aria-hidden="true">
              <span className="burger__line" />
              <span className="burger__line" />
            </span>
          </button>
        </div>
      </header>

      <div className="menu" id="site-menu" data-open={open ? "" : undefined}>
        <button
          type="button"
          className="menu__veil"
          tabIndex={-1}
          aria-hidden="true"
          onClick={() => setOpen(false)}
        />

        <div
          ref={sheetRef}
          className="menu__sheet"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
        >
          <div className="menu__inner">
            <p className="eyebrow menu__eyebrow">{SITE.role}</p>

            <nav className="menu__links" aria-label="Sections">
              {NAV.map((item, i) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="menu__link"
                  style={{ "--i": i } as React.CSSProperties}
                  onClick={onNavigate}
                >
                  <span className="menu__index">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="menu__label display">{item.label}</span>
                  <ArrowUpRight className="menu__arrow" />
                </a>
              ))}
            </nav>

            <div
              className="menu__foot"
              style={{ "--i": NAV.length } as React.CSSProperties}
            >
              <a
                className="cta menu__cta"
                href={SITE.telegram}
                target="_blank"
                rel="noreferrer noopener"
                onClick={() => setOpen(false)}
              >
                <Telegram />
                Message me on Telegram
                <ArrowUpRight className="arrow" />
              </a>
              <p className="menu__meta">
                <span>{SITE.telegramHandle}</span>
                <span className="menu__dot" aria-hidden="true" />
                <span>{SITE.location}</span>
              </p>
            </div>
          </div>

          <span className="menu__edge" aria-hidden="true" />
        </div>
      </div>
    </>
  );
}
