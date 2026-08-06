# Worklog

Newest first.

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
Ref: pending

## 2026-08-06 · chore · user-local Node toolchain
By: alekseysamarskiyfb-bit
Why: no Node on the machine, so the project could not be built, linted or run
— and the polish pass cannot be verified without running it.
How: installed Node v24.19.0 LTS (darwin-x64, checksum verified against
nodejs.org SHASUMS256) into `~/.local/node`, no sudo; added the PATH export to
`~/.zprofile`; pointed `.claude/launch.json` at the absolute node binary.
Baseline `next build` is clean (151 kB first load, 4 static pages).
Ref: pending

## 2026-08-06 · chore · plant planning docs
By: alekseysamarskiyfb-bit
Why: first stem session in this repo; the production polish pass needs a place
to carry state across sessions.
How: created `docs/planning/` with this worklog and the
"Production polish pass" initiative, and planted the managed block in
`CLAUDE.md`.
Ref: pending
