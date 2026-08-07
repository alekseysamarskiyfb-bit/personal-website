/**
 * SIDEBAR
 *
 * The fixed rail — and, structurally, the whole point of the design: this is
 * not "the nav". It is the hero, folded up. Every element in here has an
 * oversized invisible twin in the hero, and the ghost engine transforms these
 * real elements onto those twins on load, then scrubs them home as you
 * scroll. Nothing appears or disappears; it relocates.
 *
 * Consequences for this markup:
 *   - The real <a> links live HERE, not in the hero. The hero only holds
 *     transparent ghosts for them to be measured against.
 *   - Each .nav-menu-item carries data-flip-start/end; the ghost engine reads
 *     those off the nearest ancestor when it animates the link inside.
 *   - .nav-*-bg panels start as the big hero glass cards and fade to nothing
 *     as they land, revealing the sidebar's own panel underneath.
 *   - .nav-container starts at opacity 0; the preloader reveals it at t=1.4.
 */

import { WordmarkSVG } from "./Wordmark";
import { EMAIL, INSTAGRAM, LINKEDIN, NAV_LINKS, TELEGRAM } from "./navData";
import {
  IconArrowUpRight,
  IconCopy,
  IconCheck,
  IconCreatives,
  IconInstagram,
  IconLinkedIn,
  IconMail,
  IconRegistered,
  IconTelegram,
} from "./icons";

export default function Sidebar() {
  return (
    <header
      className="navigation"
      /* Below the hero content until 53%, above it after — so hero cards
         paint over the rail on the way in, and scroll under it on the way
         out. duration 0.1 makes it a hard swap, not a fade. */
      data-tl-desktop
      data-tl-type="trigger"
      data-tl-trigger=".hero"
      data-tl-start="53% top"
      data-tl-from="{'zIndex': 9}"
      data-tl-to="{'zIndex': 100, 'duration': 0.1}"
    >
      <div className="nav-container">
        {/* ---- panel 1: mark, socials, positioning line ------------------ */}
        <div className="nav-top-layout">
          <div
            className="nav-top-bg"
            data-tl-desktop
            data-tl-type="scroll"
            data-tl-trigger=".hero"
            data-tl-start="34% top"
            data-tl-end="38% top"
            data-tl-from="{'scale': 0.5, 'opacity': 0}"
            data-tl-to="{'scale': 1, 'opacity': 1}"
          />

          <div className="nav-top-item">
            <div
              className="nav-logo"
              data-tl-desktop
              data-tl-type="scroll"
              data-tl-trigger=".hero"
              data-tl-start="42% top"
              data-tl-end="44% top"
              data-tl-from="{'color': '#8f5cff', 'backgroundColor': 'rgba(143,92,255,0)'}"
              data-tl-to="{'color': '#ffffff', 'backgroundColor': '#8f5cff'}"
            >
              <div
                className="nav-logo-item"
                data-flip-trigger=".hero"
                data-flip-start="top top"
                data-flip-end="44% top"
              >
                <WordmarkSVG className="nav-mark" />
                <div className="mark-dot-wrap">
                  <span
                    className="mark-dot"
                    data-tl-desktop
                    data-tl-type="scroll"
                    data-tl-trigger=".hero"
                    data-tl-start="2% top"
                    data-tl-end="5% top"
                    data-tl-from="{'opacity': 0}"
                    data-tl-to="{'opacity': 1}"
                  >
                    <IconRegistered />
                  </span>
                </div>
              </div>
            </div>

            <div className="social-wrap">
              <a
                className="social-link"
                href={LINKEDIN}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                data-tl-type="scroll"
                data-tl-trigger=".hero"
                data-tl-start="44% top"
                data-tl-end="46% top"
                data-tl-from="{'scale': 0.3, 'opacity': 0}"
                data-tl-to="{'scale': 1, 'opacity': 1}"
              >
                <IconLinkedIn className="social-icon" />
              </a>
              <a
                className="social-link"
                href={TELEGRAM}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
                data-tl-type="scroll"
                data-tl-trigger=".hero"
                data-tl-start="45% top"
                data-tl-end="47% top"
                data-tl-from="{'scale': 0.3, 'opacity': 0}"
                data-tl-to="{'scale': 1, 'opacity': 1}"
              >
                <IconTelegram className="social-icon" />
              </a>
              <a
                className="social-link"
                href={INSTAGRAM}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                data-tl-type="scroll"
                data-tl-trigger=".hero"
                data-tl-start="46% top"
                data-tl-end="48% top"
                data-tl-from="{'scale': 0.3, 'opacity': 0}"
                data-tl-to="{'scale': 1, 'opacity': 1}"
              >
                <IconInstagram className="social-icon" />
              </a>
              <a
                className="social-link"
                href={`mailto:${EMAIL}`}
                aria-label="Email"
                data-tl-type="scroll"
                data-tl-trigger=".hero"
                data-tl-start="47% top"
                data-tl-end="49% top"
                data-tl-from="{'scale': 0.3, 'opacity': 0}"
                data-tl-to="{'scale': 1, 'opacity': 1}"
              >
                <IconMail className="social-icon" />
              </a>
            </div>

            {/* Mobile only — the rail collapses to a bar + drawer below 768. */}
            <button
              type="button"
              className="mobile-menu"
              aria-label="Menu"
              aria-controls="nav-menu-wrap"
            >
              <span className="mobile-menu-icons" />
              <span className="mobile-menu-icons" />
            </button>
          </div>

          <p
            className="nav-top-text"
            data-tl-desktop
            data-tl-type="scroll"
            data-tl-trigger=".hero"
            data-tl-split="lines"
            data-tl-start="38% top"
            data-tl-end="42% top"
            data-tl-from="{'y': '100%'}"
            data-tl-to="{'y': '0%'}"
          >
            Create. Test. Read the numbers. Iterate.
          </p>
        </div>

        {/* ---- panel 2: the two stats ------------------------------------ */}
        <div className="nav-stats-wrap">
          <div
            className="nav-top-bg"
            data-tl-desktop
            data-tl-type="scroll"
            data-tl-trigger=".hero"
            data-tl-start="35% top"
            data-tl-end="39% top"
            data-tl-from="{'scale': 0.5, 'opacity': 0}"
            data-tl-to="{'scale': 1, 'opacity': 1}"
          />

          <div className="nav-stats-card">
            <div
              className="nav-stat-a-bg"
              data-flip-trigger=".hero"
              data-flip-start="top top"
              data-flip-end="40% top"
            />
            <div className="nav-stat-icon-wrap">
              <IconCreatives
                className="nav-stat-a-icon"
                data-flip-trigger=".hero"
                data-flip-start="top top"
                data-flip-end="40% top"
              />
            </div>
            <p
              className="nav-stat-a-text"
              data-flip-trigger=".hero"
              data-flip-start="top top"
              data-flip-end="40% top"
            >
              20k+ Creatives
            </p>
          </div>

          <div
            className="nav-stats-sep"
            data-tl-type="scroll"
            data-tl-trigger=".hero"
            data-tl-start="39% top"
            data-tl-end="41% top"
            data-tl-from="{'opacity': 0}"
            data-tl-to="{'opacity': 1}"
          />

          <div className="nav-stats-card">
            <div
              className="nav-stat-b-bg"
              data-flip-trigger=".hero"
              data-flip-start="top top"
              data-flip-end="40% top"
            />
            <div className="nav-stat-numb-wrap">
              <span
                className="nav-stat-b-numb"
                data-flip-trigger=".hero"
                data-flip-start="top top"
                data-flip-end="40% top"
              >
                3+
              </span>
            </div>
            <p
              className="nav-stat-b-text"
              data-flip-trigger=".hero"
              data-flip-start="top top"
              data-flip-end="40% top"
            >
              Years in performance
            </p>
          </div>
        </div>

        {/* ---- panels 3–6: menu, platforms, email, actions --------------- */}
        <div className="nav-menu-wrap" id="nav-menu-wrap">
          <nav className="nav-menu" aria-label="Primary">
            <div
              className="nav-menu-bg"
              data-tl-desktop
              data-tl-type="scroll"
              data-tl-trigger=".hero"
              data-tl-start="31% top"
              data-tl-end="35% top"
              data-tl-from="{'scale': 0.5, 'opacity': 0}"
              data-tl-to="{'scale': 1, 'opacity': 1}"
            />

            {NAV_LINKS.map((link, i) => (
              <div
                className="nav-menu-item"
                key={link.id}
                /* Reverse-staggered windows: later items start earlier and
                   end later, so they travel further and the row unpacks into
                   the column in sequence rather than all at once. */
                data-flip-trigger=".hero"
                data-flip-start={`${7 - i}% top`}
                data-flip-end={`${30 + i}% top`}
              >
                <div
                  className="nav-item-bg"
                  data-tl-desktop
                  data-tl-type="scroll"
                  data-tl-trigger=".hero"
                  data-tl-start={`${28 + i}% top`}
                  data-tl-end={`${30 + i}% top`}
                  data-tl-from="{'scale': 0.5, 'opacity': 0}"
                  data-tl-to="{'scale': 1, 'opacity': 1}"
                />
                <link.Icon
                  className="nav-item-icon"
                  data-tl-desktop
                  data-tl-type="scroll"
                  data-tl-trigger=".hero"
                  data-tl-start={`${29 + i}% top`}
                  data-tl-end={`${31 + i}% top`}
                  data-tl-from="{'scale': 0.2, 'opacity': 0}"
                  data-tl-to="{'scale': 1, 'opacity': 1}"
                />
                {/* The <a> stretches over the whole pill via ::after, so the
                    entire row is the hit area and the hover target — hovering
                    the icon or the padding animates the label too. */}
                <a
                  className={`hero-navigation-link${link.feature ? " is-feature" : ""}`}
                  data-link-id={link.id}
                  href={link.href}
                  data-button-hover
                  data-hover-scope=".nav-menu-item"
                >
                  {link.label}
                </a>
              </div>
            ))}
          </nav>

          <div
            className="nav-platforms-wrap"
            data-tl-desktop
            data-tl-type="scroll"
            data-tl-trigger=".hero"
            data-tl-start="30% top"
            data-tl-end="35% top"
            data-tl-from="{'opacity': 0}"
            data-tl-to="{'opacity': 1}"
          >
            <span className="nav-platforms-label">Shipped on</span>
            <div className="nav-platforms-item">
              <span className="platform-name">Meta</span>
              <span className="platform-name">TikTok</span>
              <span className="platform-name">Google</span>
            </div>
          </div>

          <div
            className="nav-email-wrap"
            data-tl-desktop
            data-tl-type="scroll"
            data-tl-trigger=".hero"
            data-tl-start="33% top"
            data-tl-end="38% top"
            data-tl-from="{'opacity': 0}"
            data-tl-to="{'opacity': 1}"
          >
            <div className="nav-email-item" role="button" tabIndex={0} aria-label={`Copy ${EMAIL}`}>
              <span className="email-text">{EMAIL}</span>
              <span className="clipboard-item" aria-hidden>
                <IconCopy className="clipboard-glyph" />
                <p>Copy to clipboard</p>
                <IconCheck className="clipboard-icon" />
              </span>
            </div>
          </div>

          <div className="nav-button-wrap">
            {/* Each button gets its own pre-sized slot: the logo FLIP type
                lands every element at its parent's top-left, so two buttons
                sharing one parent would stack. */}
            <div className="nav-button-slot is-flip-slot">
              <a className="nav-button" href="#contact" data-button-hover>
                <p>Let&rsquo;s Talk</p>
              </a>
            </div>
            <div className="nav-button-slot is-flip-slot">
              <a className="nav-button-secondary" href="#portfolio" data-button-hover>
                <p>See Work</p>
                <IconArrowUpRight className="nav-button-arrow" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
