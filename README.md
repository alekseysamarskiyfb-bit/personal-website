# Oleksii Samarskyi — personal site

Next.js 14 (App Router) + TypeScript + GSAP + Lenis.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

## The idea

The hero is not a hero — it is the sidebar in an exploded state. Every element
in the fixed left rail has an oversized, invisible twin ("ghost") laid out in
the hero. On load the real elements are transformed onto their ghosts; scrolling
scrubs them back home. Nothing on this page appears or disappears; it relocates.

That single decision drives the architecture: React renders declarative markup,
then one mount pass (`components/engine/AnimationEngine.tsx`) runs the modules
against the real DOM in a fixed order, because the whole system depends on
strict measure-then-mutate phase separation that React's lifecycle would
otherwise scramble.

## Design system

- **Ground** `#14120F` warm near-black — the warmth of the original bone
  palette carried to the dark end, so surfaces read as unlit paper rather
  than grey plastic. Ink is `#F3EFE6`, never pure white.
- **Accent** `#8F5CFF`, always flat, never a gradient (one exception: the
  text-clipped year in an expanded timeline card).
- **Uniformly dark.** No section alternates tone; contrast is carried by
  surface elevation and the accent, not by flipping the ground.
- **Depth** comes only from `backdrop-filter` + a translucent fill + a 1px
  top-light border. There are no box-shadows in the system.
- **Spacing** is a fluid 1440 vw grid — nothing is authored in px. Above 768px
  the layout zooms rather than reflowing; below it there is a separate design.
- **Motion** — text slides from behind a mask, objects arrive with blur +
  scale + alpha together. Nothing simply fades, and nothing simply cuts:
  hero elements that do not become part of the rail dissolve with blur as
  they leave. `expo.out` for arrivals, `power1.inOut` for scrubbed morphs,
  and a single shared easing token (`--ease-out`) for CSS transitions so
  hovers do not read as browser defaults beside GSAP curves.

## Engine modules

| Module | Does |
|---|---|
| `ghostEngine` | The three-phase FLIP that morphs hero ↔ rail |
| `preloader` | Intro timeline + the ~50% hero reveal cascade, portrait handoff |
| `styleEngine` | Declarative `data-tl-*` attribute animations |
| `scroll` | Magnetic timeline, pinned work track, rail theme inversion |
| `interactions` | Chip expansion, manifesto scrub, CTA chat, image trail, carousel |
| `sidebar` | Rail auto-scale, click-to-copy, word-swap button hover |
| `mobileMenu` | Drawer + timeline popups |

`prefers-reduced-motion` is honoured throughout — every scrub, reveal and loop
collapses to its resting state.

## Placeholder content — replace before publishing

- **`components/site/navData.ts`** — `TELEGRAM_HANDLE` and `INSTAGRAM_HANDLE`
  are placeholders (`oleksii`). Telegram is the site's primary conversion
  point, so these must be pointed at real accounts. They feed the sidebar
  socials, the footer, and the CTA button.

Everything else on the page is real: the Journey timeline is built from the
CV, and the Portfolio cards are actual campaign creatives.

## Sections

Hero → Journey → Portfolio → What You Get → Velar Studio → Contact → FAQ.

`Journey` reads one card per position. `TimelineSpine` generates the curve
THROUGH the measured milestones rather than drawing a fixed column, so moving
a milestone in the markup reshapes the path with no other edit.

`HeroSnap` makes the hero→rail morph scroll-completed rather than
scroll-length dependent: a short wheel gesture starts it and the remainder
settles itself, in either direction. It drives Lenis directly — ScrollTrigger's
own `snap` writes through its scroll setter and fights Lenis for ownership.
