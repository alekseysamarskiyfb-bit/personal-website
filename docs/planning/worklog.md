# Worklog

Newest first.

## 2026-08-07 · change · Phase 4b — What You Get redesign
By: alekseysamarskiyfb-bit
Why: the idea (capability chips pinned inside the sentence) is good, the
execution was not. It overflowed the page at every tablet width, the chip gaps
did not match the chips, the panel could leave the viewport, the chips had no
affordance, the section had no heading, and the reveals had no relationship to
the reading.
How:
 - `.what_you_get-text` width `clamp(760px, 62.24vw, 1120px)` -> `min(100%,
   21ch)`. The 760px FLOOR was wider than the room the section leaves at 1024
   (744px), so the paragraph broke out of the page. A measure, not a pixel
   count.
 - Restored the label -> heading -> lede component every other section runs.
 - Inline gaps are MEASURED from their chip (`CardInteractions.sizeAnchors()`,
   run before the solver because rewriting an anchor's width reflows the
   paragraph). Verified all five anchors match their chip exactly; the flat 9vw
   gap left holes after short chips and overhang after long ones.
 - Chips right of centre open their panel leftwards, plus a viewport-aware
   max-width, so a 23rem panel no longer runs off the page.
 - Affordance: `cursor: pointer`, hover and focus-visible states. They were
   `role="button" tabIndex=0` with `cursor: default` and no hover.
 - Chip reveals now derive from the tonal scrub's own progress: each chip's
   position in the character run is measured, and it arrives as the reveal
   reaches the words it sits between. Replaces hard-coded 80/63/47/39/25
   percentages that had no relationship to the sentence. Fail-open behind
   `.is-armed`, same rule as the timeline.
 - Tonal scrub stagger scaled by character count. A flat 0.1 across ~200 chars
   asked for 20s of stagger in one scrub window, so the opening carried all the
   motion and the tail barely moved.
Two defects found while verifying, both pre-existing and both wider than this
section:
 - `TextReveal` wrapped every character in an inline-block with no word
   grouping, so the browser could break a line between any two letters —
   "brand thin / king", "repeat / ed." Latent until the measure narrowed.
   Characters are now grouped per word inside a nowrap box, with real text
   nodes between words as the only break points.
 - `StyleEngine` never set `immediateRender`, and GSAP defaults it to FALSE
   for a ScrollTrigger tween with no scrub. So every trigger-type reveal on the
   page sat at its natural appearance, then SNAPPED to its from-state the
   moment the trigger fired and animated up from there. That snap is a direct
   cause of the reported "noticeable jumps". Now rendered at creation, so an
   element starts hidden and only ever moves one way.
Verified with a real ticker at 1440 / 1280 / 1024 / 390: zero horizontal
overflow everywhere; measure capped (880 of 1046 at 1440, 782 of 929 at 1280);
heading present; anchors match chips exactly where inline; panel inside the
viewport; no console errors. Chip reveal order confirmed progressive —
`00000` before the section, `11100` mid-paragraph, `11111` after. Tonal scrub
confirmed even (lead reaches full ink while tail is still at 0.12, then
catches up). Journey re-checked for regression from the StyleEngine change:
still `0000000` -> `1111111` in lockstep with the spine.
`tsc --noEmit` clean; `next build` clean at 152 kB.
Ref: pending

## 2026-08-06 · change · Phase 4 — Journey redesign
By: alekseysamarskiyfb-bit
Why: the timeline worked but read thin. Reveals fired off-screen, all seven
cards made the same move, everything replayed on scroll-back, the drawn spine
was decorative, and the run was half empty space.
How:
 - Cards reveal FROM the spine's own drawn length. `TimelineSpine` already lit
   its nodes from path progress (plan item 4.5 was half wrong — that part
   existed); it now drives the cards from the same progress, so a card cannot
   appear before the line reaches its milestone. This replaced the hand-tuned
   `-42%`-to-`+33%` starts rather than re-tuning them.
 - Reveal is one-way, plus `data-tl-once` on the inner elements — no replay.
 - Inner elements trigger off the CARD's own box (`.ac-N`, `top 80%`) instead
   of a percentage of the container, cascading 0.25 / 0.34 / 0.46 / 0.74.
 - Mirrored entrances via `data-side`, as a CSS transition on the inner card —
   MagneticPositions re-solves the wrap's transform every frame and would
   overwrite a tween there.
 - Container height 470vh -> `max(330vh, 2700px)`. 470vh left 575px between
   280px cards: half the scroll was void. ~400px now, and the px floor stops a
   short window collapsing the step below card height into an overlap.
 - Story popup: the summary recedes as the story lifts.
 - `.about-wrap` top margin --s144 -> --s72, binding the run to its header.
 - Collapsed layout gained a per-card reveal it never had (`buildCollapsed()`).
 - FAIL-OPEN gate: the hidden state applies only under `.is-armed`, set once
   the spine has taken charge, so a failure to build leaves cards visible
   rather than permanently invisible.
Tooling: added Playwright as a devDependency (user-approved) because the
in-app browser pane freezes requestAnimationFrame once hidden, which stopped
GSAP's ticker and made all scroll-driven state unverifiable. Dev-only; the
shipped bundle is untouched.
Verified with a real ticker, scrolling in increments so scrub settles as it
would under a wheel:
 - 1440x900: cards and spine nodes advance in exact lockstep — 0%/`0000000`,
   14%/`1000000`, 45%/`1110000`, 76%/`1111100`, 100%/`1111111`. Nothing
   reveals before the section.
 - Scrolling back to the top leaves all seven revealed: no replay.
 - 390 / 834 / 1280: zero horizontal overflow, all cards reveal, no console
   errors.
 - Caught and fixed a regression this introduced: the ±51px mirrored offset
   pushed the stacked mobile cards off the right edge (26px overflow at 390).
   The lean is now zero in the collapsed layout, where a card has no side to
   lean in from.
`tsc --noEmit` clean; `next build` clean at 152 kB first load (+1 kB).
Ref: 1803f76

## 2026-08-06 · change · Phase 3 — responsiveness
By: alekseysamarskiyfb-bit
Why: there was no tablet or laptop design. Two media queries existed — a good
phone design under 768 and a five-rule patch for 768–1100 — so everything from
768 to 1440 was the desktop layout scaled on the vw grid. Body copy hit its
12px clamp floor and stopped shrinking while its vw container kept going, which
is the reported "compressed text"; at 768 the fixed rail was 142px wide and
still held a 24-character email.
How:
 - Raised the collapse point to 1100 and made CSS and JS agree on it:
   `MOBILE_BREAKPOINT` 768 -> 1100, and the phone block's boundary 767 -> 1099.
   They must match — the ghost engine flies the RAIL's elements into the hero,
   so it cannot run once the rail has collapsed.
 - The collapsed block is authored on a 375 reference. Proportional values are
   left to grow; fixed-purpose CHROME is now capped with `min()` (a 10.5vw
   burger is 39px on a phone and 115px at 1099). 9 chrome rules capped by hand,
   46 spacing declarations capped by sweep at 1.6x their phone rendering, plus
   `--band` for section rhythm and caps on the work card, the ® ghost and the
   story sheet.
 - New tablet band 768–1099: two-column FAQ, pillars, capability chips, work
   header, Velar header and hero traits; measure capped in `ch` so a paragraph
   never runs the full 1099px; buttons size to their labels.
 - `--bar-h` is now DECLARED (`min(16.8vw, 78px)`) and the bar is given exactly
   that height, so the drawer is correct by construction. The old hand-set 14vw
   was 52px against a 63px bar, so the drawer had always opened underneath the
   bar and clipped its own first item.
 - Fixed stylesheet ORDER: the breakpoint blocks sat before the Velar, Journey
   and CTA sections, so their overrides were dead — `.velar-pillars` rendered
   four 71px columns on a 390px phone. Both blocks now come last.
 - Fixed a resize defect this surfaced: killing a ScrollTrigger does not kill
   its tween, so `clearProps` was undone on the next tick and crossing from
   desktop into the collapsed layout stranded the rail's mark at hero size — a
   1048px wordmark in a 190px slot, 266px off the right edge. `GhostEngine`
   now kills tweens before clearing.
 - Desktop fixes: `.hero-container` 93.06vw -> 100% (it was wider than the
   padded box it sits in, pushing the ground paragraphs under the rail);
   `.hero-card-*` given a 168px floor so "Years in performance" stopped
   wrapping to three clipped lines; `.about-card-wrap` floor 370px -> 300px so
   the zig-zag stops crossing its own centre line; phone trait glyphs sized in
   `em` (they were 1.94vw — under 8px next to 17px labels); stat cards stretch
   to equal heights.
Not done: folding viewport WIDTH into `Sidebar.scale()`. Tried and reverted —
`scrollWidth` there is not the rail's own content width, because the ghost
engine has laid its children out at hero size, so the ratio evaluated to 0.19
and collapsed the rail to a fifth of itself. Moot anyway: with the breakpoint
at 1100 the rail is never narrower than 204px, and `.email-text` already
ellipsises.
Verified: `tsc --noEmit` clean; `next build` clean, first-load JS unchanged at
151 kB. In-browser at 390 / 768 / 834 / 1024 / 1099 / 1100 / 1280 / 1920 —
zero horizontal overflow and zero elements past the right edge at every width;
bar height matches drawer offset exactly at every collapsed width; the 1099 /
1100 boundary flips cleanly with the rail at 204px and the hero intact.
Ref: ceecf7a

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
Ref: 2d9625d

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
