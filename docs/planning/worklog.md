# Worklog

Newest first.

## 2026-08-06 · change · Phase 2 — SAMARSKYI mark rename
By: alekseysamarskiyfb-bit
Why: the decorative wordmark had to read SAMARSKYI rather than OLEKSII, in the
hero, the rail lockup and the footer. Not a find-and-replace: the mark's SVG
geometry was calibrated to the seven-glyph string, and several CSS values were
derived from it by hand.
How:
 - Measured the real advance width with canvas measureText against the loaded
   Anton face. The method reproduces the old mark's 464 to within 0.01, which
   is what makes it trustworthy; SAMARSKYI sets 737 at the same 150 cap height.
   New box 737 x 150, aspect 4.9133.
 - `Wordmark.tsx` now exports WORD / WORD_LABEL / MARK_W / MARK_H /
   MARK_ASPECT, and `SiteFooter.tsx` imports them — the footer had the string
   and the geometry hardcoded twice, so the two copies could drift.
 - `--mark-aspect` updated; both `aspect-ratio: 3.0933` literals replaced with
   `var(--mark-aspect)` so the derivation cannot go stale again.
 - Cap height held constant rather than footprint: the rail lockup goes 3.7vw
   -> 5.9vw (pill 5.9 -> 8.1vw) and the mobile bar mark 24vw -> 34vw. Holding
   the widths instead would have shrunk the rail mark's cap from 1.2vw to
   0.75vw and the mobile one from ~29px to ~18px.
 - Preloader letter rise now spreads a fixed 0.6s budget across however many
   letters exist, instead of a fixed 0.2 stagger. At nine glyphs the old value
   ran 1.6s of stagger plus a 1s tween inside a 1s window, so the last letters
   were still rising as the mark climbed away. It already overran at seven.
 - Fixed a pre-existing defect found while verifying: ButtonHover parked each
   label's hover clone at a measured `offsetHeight` taken before the label had
   settled, so the clone sat ~12px below an 18px word — visible inside the
   mask, rendering every nav item with a second copy struck through it. Now
   `yPercent: 100`, resolved against the element's own box at tween time, so it
   is exactly one line at any size and needs no measurement.
Verified: `tsc --noEmit` clean; `next build` clean, first-load JS unchanged at
151 kB. In-browser: `--mark-aspect` 4.9133, hero ghost measured ratio 4.913,
mark text SAMARSKYI in real Anton, 9 preloader letters, footer viewBox
`0 0 737 150`; hover clone now exactly one line below the original on all six
nav items, and the doubled labels are gone from the rendered rail.
Ref: pending

## 2026-08-06 · fix · Phase 1 — hero interaction correctness
By: alekseysamarskiyfb-bit
Why: the navigation looked live but nothing clicked, any window resize left
the page permanently blank, the rail never inverted over the light Work
section, anchor scrolling fought Lenis, and the FAQ link landed on the
decorative wordmark instead of the questions.
How:
 - Ghosts are no longer hit-testable. `.main-wrap` is pointer-transparent with
   each section re-enabling itself (the hero excepted), the hero's ghost
   containers are explicitly `pointer-events: none`, and the rail's menu rows
   and `.nav-item-bg` panels are decoration — only the anchor (plus its
   full-pill `::after`) is a target. Verified: all 8 hero targets hit-test to
   themselves, and each link lands on its OWN id rather than a neighbour's.
 - Split "play the intro" from "be in the intro's end state". `Preloader.rest()`
   applies the end state idempotently; `STATE.introPlayed` makes every rebuild
   after the first take that path instead of leaving `.nav-container` at
   `opacity: 0` with nothing to turn it on. Reduced motion now uses the same
   path. `ButtonHover` guards its one-time DOM rewrite (was stacking a clone
   per resize) and binds natively so its listeners outlive the teardown;
   `TextReveal` re-attaches its scroll tween when already split.
 - Wired `ThemeSwitcher.init()` (215 lines, written but never called) and put
   the `data-theme="dark"` it watches on `.work_section`. Its init now
   re-applies the dark state, because it tweens inline colours that survive a
   teardown.
 - `AnchorLinks` scrolls through `lenis.scrollTo` instead of native
   `scrollIntoView`, with a measured offset for the mobile top bar.
 - `id="faq"` moved from `<footer>` to `.faq-column-main`; footer keeps
   `id="footer"`.
 - Hero buttons were `<span>`s — visible, styled and dead below 768 where the
   ghost engine early-returns. Now real anchors, hidden with autoAlpha on
   desktop so they leave the tab order.
Verified: `tsc --noEmit` clean; `next build` clean, first-load JS unchanged at
151 kB; hit-testing confirmed in-browser before and after a resize; no
duplicate hover clones after rebuild.
Note: `npm run lint` cannot run — the project has no ESLint config and
`next lint` drops into interactive setup. `next build` type-checks regardless.
Ref: 44d3ee6

## 2026-08-06 · chore · user-local Node toolchain
By: alekseysamarskiyfb-bit
Why: no Node on the machine, so the project could not be built, linted or run
— and the polish pass cannot be verified without running it.
How: installed Node v24.19.0 LTS (darwin-x64, checksum verified against
nodejs.org SHASUMS256) into `~/.local/node`, no sudo; added the PATH export to
`~/.zprofile`; pointed `.claude/launch.json` at the absolute node binary.
Baseline `next build` is clean (151 kB first load, 4 static pages).
Ref: 44d3ee6

## 2026-08-06 · chore · plant planning docs
By: alekseysamarskiyfb-bit
Why: first stem session in this repo; the production polish pass needs a place
to carry state across sessions.
How: created `docs/planning/` with this worklog and the
"Production polish pass" initiative, and planted the managed block in
`CLAUDE.md`.
Ref: 44d3ee6
