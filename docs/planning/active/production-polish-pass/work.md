# Work — Production polish pass

**Status:** Phases 1–5 complete and verified. Phase 6 outstanding, then final QA.
**Next action:** Phase 6 — the visual sweep. Dead CSS (`.about-timeline-overflow`,
`.about-timeline-rail`, `.h2-style-white`, `.max-width-700`,
`.about-card-bottom-text`, `.mobile-hero-only`, `.t-display`, `.glass`,
`.is-preload-hidden`, plus the `.sevice_*` / `.testimonial_*` / `.swiper-*`
blocks for sections that do not exist), dead TS (`NavLink.narrow`,
`registerStyleEnginePlugins`), the contradictory `align-items` override on the
hero stat wraps, `.hero-profile-img`'s unexplained `-3vw`, `IconQuote` on the
Velar nav item, and the missing favicon / OG metadata.

**Established pattern for scroll-linked reveals** (used by the Journey spine
and the What You Get chips, and the model for anything similar):
 1. One scrub owns the progress.
 2. Dependent elements derive their state from that progress, so nothing can
    appear before the thing that leads to it.
 3. Reveal one-way — no toggling back, which is what reads as a replay.
 4. The hidden state is gated behind an `.is-armed` class the owning module
    sets once it is actually in charge, so any failure fails OPEN (elements
    visible but unanimated) rather than leaving content permanently invisible.

### Motion verification (resolved 2026-08-06)

The in-app Browser pane loads visible then goes hidden, which throttles
`requestAnimationFrame` to nothing: GSAP's ticker stops, Lenis stops,
ScrollTrigger never updates, and the Journey section renders empty at every
scroll offset. `gsap`/`ScrollTrigger` are bundled (not on `window`) and
`window.lenis` is not the Lenis instance, so the ticker cannot be pumped from
injected JS.

Resolved by adding **Playwright** as a devDependency (user-approved). Run the
dev server, then drive a real Chromium where rAF actually runs. Two rules that
matter:
 - Scroll in INCREMENTS (~220px per frame, then ~45 idle frames), never a
   single jump — scrub and inertia need frames to settle or every reading is
   a transient.
 - Wait ~4.5s after load: `CONFIG.introLockMs` locks scroll for 3s.
The harness lives in the scratchpad, not the repo. Node cannot resolve
`playwright` from outside the project, so copy it to the project root to run
it, then delete it.

**Breakpoints (Phase 3):** collapse point is **1100**. `MOBILE_BREAKPOINT` in
core.ts and the `max-width: 1099px` block in globals.css must always agree —
the ghost engine animates the rail's own elements and cannot run once the rail
has collapsed. Bands: phone <768, tablet 768–1099, desktop >=1100. Both
breakpoint blocks live at the END of globals.css; putting them earlier silently
kills their overrides against the component sections.

**Measured mark geometry (Phase 2):** Anton at 173px — `OLEKSII` 464.01 wide,
`SAMARSKYI` 737.19 wide, cap ascent 150.02 for both. Box is now 737 x 150,
aspect 4.9133, exported from `Wordmark.tsx` and mirrored in `--mark-aspect`.
Re-measure with canvas `measureText` against the loaded face if the name or
the display font ever changes.

**Toolchain:** Node v24.19.0 in `~/.local/node` (no sudo). Every shell command
needs `export PATH="$HOME/.local/node/bin:$PATH"` first, or use `zsh -lc`.
`npm run lint` is NOT usable — no ESLint config; `next lint` drops into
interactive setup. Use `npx tsc --noEmit` plus `npm run build`.

**Verification constraint:** the in-app Browser pane loads visible but goes
hidden immediately after, which freezes `requestAnimationFrame` — so GSAP's
ticker stops and no scroll-driven animation advances. Layout, hit-testing and
anything driven by `gsap.set` ARE verifiable; scrubbed states are not. Open a
fresh tab with `preview_start` (it loads visible) and measure straight away.
If the dev server ever serves a stale error, `rm -rf .next` and restart — a
failed compile poisons the cache and every later measurement with it.

**NEVER run `npm run build` while the dev server is up.** Both write the same
`.next`, so the production build strips the dev server's chunks; the server
then serves pages with no CSS and `Cannot find module './81.js'` on every
request. Symptoms are silent and misleading — custom properties resolve to
empty, fonts fall back to Times, and vh-based heights come out ~8x wrong, which
looks exactly like a layout regression. Stop the dev server, build, restart.

---

## Decisions (2026-08-06)

- **Verification:** Node gets installed so builds, lint and per-breakpoint
  visual checks are real rather than reasoned. Blocking for Phase 1.
- **"About Me" means both blocks** — the Journey timeline *and* What You Get.
  Scope widened in the contract accordingly; What You Get is now Phase 4b.
- **Placeholder social handles:** out of scope. The user is replacing
  `t.me/oleksii` and `instagram.com/oleksii` before the next deploy. I leave
  those strings alone. (Was finding 1.6 — now closed as "user owns".)

---

## Findings and plan

Grouped by phase. Each phase ends in a state the site can sit in.

### Phase 1 — Correctness (things that are actually broken)

**1.1 Navigation links are not clickable during the hero**
*What:* the six nav items are visible in the hero row but do nothing.
*Why:* the real `<a>` elements live in `.navigation` (`z-index: 9`), which is
a sibling of `.main-wrap` (`z-index: 20`) — so the whole hero paints above the
rail until the `53%` swap raises it to 100. On top of that, the transparent
ghost row `.hero-navigation-wrap` is a direct child of `.hero-sticky`, and
`.hero-sticky > * { pointer-events: auto }` re-enables pointer events on it at
`z-index: 30`. The ghosts sit exactly where the flown links appear and eat
every click. The same trap catches the two hero buttons:
`.hero-cards-wrap > * { pointer-events: auto }` (specificity 0,2,0) overrides
`.hero-content-layout { pointer-events: none }` (0,1,0), so the ghost buttons
swallow clicks meant for the real rail buttons.
*Fix:* mark every ghost container `pointer-events: none` explicitly
(`.hero-navigation-wrap`, `.hero-mark-slot`, `.hero-cards-left`,
`.hero-buttons-wrap`, `.hero-content-layout`), and keep `.navigation` above
`.main-wrap` from the first frame by raising its resting z-index — the 9→100
swap exists so hero *cards* paint over the rail, which the cards' own z-index
already achieves once the rail is out of the flow conflict.
*Why this way:* it fixes the cause (ghosts are measurement targets and should
never be hit-testable) rather than patching each click site.

**1.2 A window resize permanently breaks the page**
*What:* changing the window width during or after the intro leaves the sidebar
invisible and the hero half-dressed. Reproduced live on the deployed site.
*Why:* `.nav-container` is `opacity: 0` in CSS and is only turned on by the
preloader timeline at t=1.4s. A width change fires `destroyAll()` +
`initAll()`; `destroyAll()` kills the preloader timeline, and `initAll()` never
re-runs `Preloader.init()`. Nothing restores the opacity. Secondary damage on
every re-init: `ButtonHover.init()` wraps each label in a fresh mask and clone
(duplicates stack), and `Preloader`'s nav-link mask wrapping repeats.
*Fix:* add an idempotent "resting state" pass that `initAll()` runs when the
intro has already played (rail visible, links live, ghosts hidden), and make
`ButtonHover` / the link-mask wrapping guard against re-entry with a marker
attribute. Keep the intro itself first-load-only — replaying it on resize is
worse than not replaying it.
*Why this way:* the intro is a one-time narrative; re-running it on every
resize would be its own defect. Separating "play the intro" from "be in the
post-intro state" is the smallest change that makes both correct.

**1.3 The rail never inverts over the light Work section**
*What:* `ThemeSwitcher` (215 lines in `scroll.ts`) is fully written and never
imported or called; and `Work.tsx` never sets the `data-theme` attribute its
own header comment says the switcher watches. So the dark glass rail sits on
top of the near-white work island.
*Fix:* add `data-theme="dark"` to `.work_section` and call
`ThemeSwitcher.init()` in `initAll()` — the code is already correct, it was
just never wired.
*Why this way:* the feature is written and designed for; deleting it would
lose real work, and the visual defect is plain at the Work section.

**1.4 Anchor scrolling fights Lenis**
*What:* nav clicks land short or feel abrupt.
*Why:* `AnchorLinks` calls native `scrollIntoView({behavior:'smooth'})` while
Lenis owns the scroll position. Two authorities, one scrollbar. The module's
own header admits it "lands short".
*Fix:* route anchors through `STATE.lenis.scrollTo(target, { offset, duration,
easing })` with a native fallback when Lenis is absent (reduced motion,
mobile). Add a small negative offset on mobile so the fixed top bar does not
cover the section heading.
*Why this way:* one authority over scroll is the rule the rest of the engine
already follows (`HeroSnap` does exactly this).

**1.5 The FAQ nav item lands on the wrong thing**
*What:* `#faq` is on `<footer class="footer" id="faq">`, whose top is the giant
decorative wordmark. Clicking FAQ scrolls to the wordmark, not the questions.
*Fix:* move the `id="faq"` onto the `.faq-column-main` block and give the
footer its own id.

**1.6 Placeholder social handles in production** — see open question 3.

### Phase 2 — The SAMARSKYI rename

**2.1** `WORD` in `Wordmark.tsx`, two hardcoded `OLEKSII` strings in
`SiteFooter.tsx` (the fill text and the clip-path text), and three
`aria-label="Oleksii"` values.
**2.2** *The part that is not a find-and-replace:* the mark's SVG is
calibrated to the seven-glyph string — `viewBox="0 0 464 150"` and
`textLength="464"` are the measured advance width of `OLEKSII` in Anton at
173px, and `--mark-aspect: 3.0933` (=464/150), `aspect-ratio: 3.0933` on
`.nav-logo-item`, `.nav-logo { width: 5.9vw }` and `.nav-logo-item
{ width: 3.7vw }` all derive from it. `SAMARSKYI` is nine glyphs and sets
considerably wider; keeping `textLength="464"` would compress it into an
unreadable slab.
*Fix:* measure the real advance width of `SAMARSKYI` at Anton 173px, set the
viewBox and `textLength` to it, and propagate the new aspect ratio through
every derived value above.
**2.3** The preloader staggers the per-letter rise at `0.2` over a `1.0s`
tween. Seven letters already overran (1.2s + 1.0s); nine letters push the last
glyph to 1.6s + 1.0s — well past the mark's climb at t=1.0, so the final
letters are still rising as the mark leaves. Reduce the stagger so the run
completes inside its window regardless of letter count.

### Phase 3 — Responsiveness

**3.1 There is no tablet or laptop design.** Two media queries exist:
`max-width: 767px` (a full mobile design, in good shape) and a five-rule
`768–1100px` patch. Everything from 768 to 1440 is the desktop layout scaled
down on the vw grid. That produces exactly the reported symptom: body copy
hits its `clamp()` px floor (12px) and stops shrinking while its vw container
keeps shrinking, so text compresses and overflows. At 768px the fixed rail is
142px wide and still holds a 24-character email address.
*Fix:* introduce a real tablet band (768–1023) that collapses the rail to the
mobile top-bar + drawer pattern already built, and a laptop band (1024–1279)
that keeps the rail but widens it and relaxes the type floors. Raise the
mobile-design breakpoint used by JS (`MOBILE_BREAKPOINT = 768`) to match
whichever boundary we settle on, so the ghost engine, preloader and horizontal
scroll opt out on the same line the CSS does.
*Why this way:* the mobile design is already good. Reusing it up to 1023 is far
less work and far less risk than inventing a third rail layout, and it is what
the vw system can actually support.

**3.2** `Sidebar.scale()` compensates for viewport *height* only. On short-and-
narrow viewports the rail overflows horizontally with no compensation at all.
Fold width into the scale factor.

**3.3** `.hero-container` is `width: 93.06vw` inside a `.hero-sticky` padded by
`--s40` on both sides — it is wider than its own content box, which is why the
ground paragraphs sit under the rail at narrow widths. Change to
`width: 100%`.

**3.4** `.about-card-wrap` has `min-width: 370px` (from `clamp(370px,
29.58vw, 600px)`) while milestones sit at 26% and 74%. Below roughly 1250px
the cards cross the centre line, overlap each other and cover the spine.
Narrow the clamp floor and pull the milestone swing in as the viewport
narrows.

**3.5** `.hero-card-2 / .hero-card-1` are a fixed `13vw` wide while their text
is clamped with px floors — below ~1100px "Years in performance" wraps to
three lines and overflows the box. Give the cards a min-width and let them
grow.

### Phase 4 — Journey ("About Me") redesign

The section currently works but reads thin next to the rest of the page. Six
specific weaknesses, and what I want to do about each:

**4.1 The header is orphaned.** Label, heading and lede sit in a left column at
the top; then `.about-wrap` has `margin-top: var(--s144)` (144px) and the run
of cards begins with no visual link between them. *Fix:* bind the header to
the spine — the spine should start at the header, not below it, so the
timeline reads as growing out of the introduction.

**4.2 Card reveals fire off-screen.** Reveal starts run from `-42% top` to
`+33% top` against a 470vh container. The first two cards have already played
before the section is in view, so they are simply *there* rather than arriving.
*Fix:* re-derive the starts from each card's own position so every card reveals
as it enters, and let the spine's draw progress lead each card slightly.

**4.3 The reveal is one move repeated seven times.** Every card does the same
`y + opacity + scale + blur` at the same duration. *Fix:* give the left-side
and right-side cards mirrored entrances (they arrive from the side they live
on), and let the year odometer, heading, teaser and button cascade rather than
share one delay ramp. The choreography should read as the timeline drawing
itself.

**4.4 Everything replays on scroll-back.** `data-tl-type="trigger"` without
`data-tl-once` resolves to `toggleActions: "restart none none reverse"`, so
scrolling up re-runs all seven cards. That is the "jumps" the user is feeling.
*Fix:* `data-tl-once` on the card reveals.

**4.5 The spine is decorative, not structural.** It is drawn on scroll but
nothing responds to it. *Fix:* light each milestone node as the drawn path
reaches it, and hold the current card slightly brighter than its neighbours —
one cheap scroll-linked signal that makes the whole run feel authored.

**4.6 The expanded story is a scale-up in place.** `.popup-card-wrap` goes
`scale(0.8) → scale(1.02)` with the card underneath still painted. *Fix:* have
the summary card recede as the story lifts, so the swap reads as one object
turning over rather than two objects stacked.

Mobile keeps the current static stacked layout — it is correct — but gains a
per-card enter reveal, which it does not have today.

### Phase 4b — What You Get redesign

Added to scope 2026-08-06. The idea — capability chips pinned inside the
sentence rather than listed beside it — is good and stays. Seven problems with
the execution:

**4b.1 It overflows horizontally below ~1290px.** `.what_you_get-text` is
`width: clamp(760px, 62.24vw, 1120px)` — a hard 760px floor — inside a section
padded `var(--gutter)` (21vw) left and 6.39vw right. At 1024px that leaves
744px of room for a 760px minimum. The paragraph breaks out of its container
at every tablet and small-laptop width. *Fix:* drop the px floor, size the
measure in `ch`, and let the section's own padding define the bound.

**4b.2 The chip gaps don't match the chips.** `.capa-anchor` reserves a fixed
`9vw` hole for every chip, but the chips are auto-width and their labels run
from "Team" to "AI pipeline". Short chips leave a visible gap in the sentence;
long ones overhang the next word. *Fix:* measure each chip and write its
anchor's width from the solver, so the hole is always the chip's own width
plus a fixed optical gap.

**4b.3 The expansion panel can leave the page.** `.capa-card-bottom` is
absolutely positioned at `left: 0` under its chip and is up to 23rem wide.
For the rightmost chips that runs past the section's right edge. *Fix:* flip
the panel's origin to the right for chips in the right half, and clamp it to
the viewport.

**4b.4 No affordance.** `.capa-card-item` is `role="button" tabIndex={0}` with
`cursor: default` and no hover treatment on the chip itself — only the panel
reacts. Nothing tells you the chips do anything. *Fix:* give the chip a real
resting → hover → open progression (border, accent, cursor) and a focus state
distinct from the global ring.

**4b.5 The section has no heading.** Journey, Work, Velar and FAQ all run
label → h2 → lede. This section has a label and then jumps straight into the
manifesto — which is why it reads as a stray paragraph rather than a section.
The CSS comment at `.label` even claims the header component "repeats
identically for … What You Get". *Fix:* restore the component. The manifesto
becomes the lede's payoff rather than the section's opening.

**4b.6 Chip reveals don't track the reading.** The five chips fire at
hard-coded scroll percentages (80/63/47/39/25) that have nothing to do with
where each chip sits in the sentence. *Fix:* derive each chip's trigger from
its own anchor's position, so a chip arrives as the text reveal reaches it.
That is the whole point of pinning them inline.

**4b.7 The tonal scrub is front-loaded.** `TextReveal` staggers ~200
characters at `0.1` — 20s of stagger mapped onto one scrub window, so the
opening characters carry almost all the visible motion and the tail barely
moves. *Fix:* scale the stagger to the character count so the reveal
distributes evenly across the scroll window.

*Dependency:* `.capa-card` is `visibility: hidden` until `MagneticPositions`
solves, so 4b.2 and 4b.6 land after the solver change in 5.1.

### Phase 5 — Motion consistency

**5.1 `MagneticPositions` runs an unbounded rAF loop.** Twelve pairs
re-solved every frame, forever, each doing a `getBoundingClientRect()` plus a
`DOMMatrix(getComputedStyle().transform)`. It never idles, even when nothing is
on screen. This is the single largest source of the "not smooth enough"
feeling. *Fix:* drive the solve from ScrollTrigger/Lenis updates and a
ResizeObserver instead of a free-running loop, and skip pairs whose section is
off screen. *Why this way:* the solver is correct; only its schedule is wrong.

**5.2 `HeroSnap` fires mid-inertia.** It waits 90ms of scroll idle before
taking over, but Lenis at `lerp: 0.1` is still visibly moving at 90ms, so the
settle competes with the tail of the user's own scroll. That is the jerk in the
hero. *Fix:* gate on Lenis's own velocity dropping below a threshold rather
than on a fixed timer.

**5.3 One motion vocabulary.** The page currently uses `power1.inOut`,
`power2.out`, `power3.out`, `expo.out` and `expo.inOut` interchangeably for the
same class of move, with durations at 0.6 / 0.7 / 1.05 / 1.1 / 1.45. *Fix:*
define the vocabulary as tokens (enter, scrub, hover, exit) and apply it. Only
where it changes nothing structural — this is a values pass, not a rewrite.

**5.4 Replay-on-scroll-back is the default.** Any `data-tl-type="trigger"`
without `data-tl-once` restarts on re-entry. Journey and CTA are affected;
Work, Velar and FAQ already opt out. *Fix:* make `once` the default in
`StyleEngine` and let elements opt back in, so the two behaviours cannot drift
apart again.

**5.5 Velar is inert.** Only the label and lede animate; the wordmark, the
glow plate, the pillar grid frame and the foot never move, and there is no
scroll-linked component at all. *Fix:* give the panel a scroll-linked entrance
(the plate rises and the glow blooms as it enters), reveal the wordmark with
the same mask grammar the rest of the page uses, stagger the pillars from the
panel's own progress rather than one fixed trigger, and add a hover state to
the pillars, which currently have none.

**5.6 Work section:** cards already animate, but the section header replays and
the horizontal track has no easing at its ends. Minor.

### Phase 6 — Visual sweep

- `.hero-cards-wrap > * { pointer-events: auto }` is declared twice, verbatim
  (globals.css:1281 and 1285).
- `.hero-stat-icon-wrap` / `.hero-stat-numb-wrap` set `align-items: flex-end`
  at line 1347 and then `center` at line 1397 — a leftover override, and the
  cause of the reported icon misalignment.
- `.hero-profile-img { margin-left: -3vw }` is an unexplained magic offset that
  pushes the portrait off the mark's optical centre.
- Dead CSS: `.about-timeline-overflow` and `.about-timeline-rail` (superseded
  by the SVG spine, no markup uses them), `.h2-style-white`, `.max-width-700`,
  `.about-card-bottom-text`, `.mobile-hero-only`, `.t-display`, `.glass`,
  `.is-preload-hidden`.
- Dead TS: `NavLink.narrow` is in the type and read in `Sidebar.tsx` but no
  entry ever sets it. `registerStyleEnginePlugins()` is exported and never
  called.
- `.capa-card-item` and `.nav-email-item` are `role="button" tabIndex={0}` with
  no hover/focus treatment of their own beyond the global focus ring.
- `IconQuote` is used for the "Velar Studio" nav item — a quotation-mark glyph
  for a studio link.
- `layout.tsx` has no favicon, no `openGraph`/`twitter` metadata and no
  canonical URL. The site's main distribution channel is a link pasted into
  Telegram, where the unfurled card *is* the first impression.

---

## Sequencing

1. Phase 1 (correctness) — highest risk, and everything else is easier to
   judge once the page stops breaking.
2. Phase 2 (rename) — self-contained, touches the mark's geometry.
3. Phase 3 (responsiveness) — establishes the breakpoints the rest sits in.
4. Phase 4 + 4b (the two "About Me" blocks) — the biggest single design
   change; wants a stable layout underneath it. 4b partly depends on 5.1, so
   the solver change may be pulled forward.
5. Phase 5 (motion) — tuning, best done when nothing structural is moving.
6. Phase 6 (sweep) + final QA pass.

Each step gets its own worklog entry and a check that the other breakpoints
still hold.

---

## Follow-ups (out of scope unless promoted)

- Real portfolio case studies behind the Work cards (they are currently
  non-interactive).
- Image optimisation: the eight work creatives and the 4K portrait are served
  as raw `<img>` with no `next/image`.
- An OG image.
- **Next 14.2.35 has 21 open high-severity advisories** (`npm audit`), all in
  server-side surfaces: Image Optimizer, Server Actions, RSC cache poisoning,
  middleware/rewrite SSRF and request smuggling. The fix is Next 16 — a major
  upgrade, squarely outside a polish pass. Worth its own initiative. Exposure
  is limited on a fully static site (all 4 routes prerender as static), but it
  depends on how the host runs it.
