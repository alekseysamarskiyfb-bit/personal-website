# Worklog

Newest first.

## 2026-08-07 · feat · add the mobile burger menu
By: alekseysamarskiyfb-bit
Why: below 820px the nav links were simply hidden and nothing replaced them,
so on a phone the site had no navigation at all — only the mark and the CTA.
How: a burger in the nav pill (≤820px only; the desktop nav is untouched) and
a glass sheet that unrolls from the top on the same material and radius as the
pill. The pill deliberately stays above the sheet, so the burger is still there
as the X that closes it. Rows arrive on the site's one gesture — opacity, blur,
a small rise — staggered by index, then a chartreuse hairline draws itself along
the sheet's bottom edge; closing drops the stagger so it leaves as one object.
The burger's two lines match width first, then travel and rotate. Escape closes
and returns focus to the burger, Tab loops through the burger and the sheet, the
veil and every link close it, and closed the sheet is `visibility: hidden` so
nothing inside it is tabbable. SmoothScroll now exports `getLenis()`: the sheet
freezes the page through Lenis, because `overflow: hidden` under Lenis locks a
document Lenis is still scrolling. Crossing 820px while open drops the state, or
the sheet would vanish and leave the page frozen. Verified at 375, 768 and 1280:
open/close, Escape, veil, link navigation (Lenis scrolls after the sheet closes),
scroll lock and release, the resize guard, no horizontal overflow, `tsc` clean
and no page console errors.
Ref: 3e7d0f6

## 2026-08-07 · feat · rebuild the Velar section as one immersive dark plane
By: alekseysamarskiyfb-bit
Why: the six service cards sat on the light field below the dark panel, so they
read as a footnote to the studio rather than as what the studio sells, and the
block as a whole felt like two stacked elements instead of one composition.
How: mark, pitch and all six cards now live inside a single dark plane. Cards
are deliberately almost nothing — a 3% white fill to group each entry's three
lines, no border, no backdrop blur, no hover; the first pass gave them glass
edges and a lift and Oleksii read them as heavy and off-concept, so the cursor
light is now the only thing that moves across them. The plane carries no ring
either — dark against a light field is edge enough. Depth is stated once, as
translateZ on three full-bleed background layers (ambient violet wash,
technical grid masked out before it reaches the text, film grain), so the
pointer tilt produces the parallax for free. Those layers are not scaled back
up to cancel the perspective shrink: doing that pushed violet past the rounded
corners and drew a purple rim around the section. New client component
`VelarStage` owns the interaction: ±2.6° tilt, smoothed, and a cursor light
written straight to the frame with no easing — it was given a 0.35s trail
first and the lag read as lag, not weight. Both are gated behind
`(hover: hover) and (pointer: fine)`
and reduced-motion, so touch gets the still composition and nothing else. The
layers carry no `filter: blur()` — softness lives in the gradient stops, which
keeps an expensive off-screen buffer out of the 3D context. Palette unchanged:
the existing `--velar-glow` / `--velar-2` violets, white alphas, near-black.
Kept the light section head, the pitch copy, and the staggered card entrance.
Ref: 3e7d0f6

## 2026-08-07 · feat · redesign the hero around the new portrait
By: alekseysamarskiyfb-bit
Why: Oleksii sent a new photo, an accent colour, and the Juliand reference —
he wanted the name treated as a stacked Title Case lockup with both words
animating, and the role and availability lines pulled into the composition
instead of sitting apart from it. He then sent a background-free version of the
photo and asked for it larger.
How: the name is now two Title Case lines, both animating per character out of
a per-line mask, staggered by a running `data-i` so the rise reads as one wave
across the whole lockup. The portrait is a transparent cutout standing on the
field, trimmed to the subject's own bounds so its rendered height IS the
subject's height with no padding to compensate for, and sized by
`min(82svh, 50rem, 46vw × 1160/1050)` — height and width capped in one
expression, because driving off viewport height alone computes a portrait wider
than a phone screen and buries the name behind it. The name sits behind the
cutout and is cropped by it; the lockup rides high enough that its first line
crosses the head rather than the shoulders, which is less than half the width,
so most of the name survives. The role line is display type up to 3.5rem;
availability became a glass pill. Accent #88f000 added as --accent, used only
as a shape and only twice: the availability dot and the current role's node.
Two earlier approaches were built and dropped, both for the same reason — the
first photo had a baked-in black background: an arch-topped card with the name
difference-blended over it (colour casts over skin and fabric), then the same
card with a second paper-white copy of the name clipped to it. The cutout made
both unnecessary. Verified at 375 / 768 / 1024 / 1280 / 1440 / 1920: no
overflow, no overlaps, behaviour pass clean, `tsc` clean.
Ref: 3e7d0f6 (superseded within the same commit by the cutout; see 101c046)

## 2026-08-07 · feat · rebuild the portfolio grid as video row + stills row
By: alekseysamarskiyfb-bit
Why: the section read as eight interchangeable stills with geo/vertical
captions nobody scans. Oleksii wants the video work leading, one row of
stills behind it, captions reduced to a name, and a hover worth hovering.
How: row one is four video slots (creative-8/2/1/6 as posters, play mark,
no src yet — adding `src` in data/work.ts makes them play); row two is the
four stills that led before. Captions are one line: "Video 1…4" and
"<category> · Creative 1…4"; the vertical/market pair is gone. Hover now
lifts 8px, scales and warms the media, sweeps one band of light across the
glass, reveals a slot-number chip, tightens the inner ring to accent-ghost,
opens the play mark, and draws the caption rule in chartreuse. Touch skips
the sweep and shows the chip at rest; reduced motion is covered by the
global transition clamp. Verified at 1440, 800 and 375 — grid, captions,
hover state and no horizontal overflow, console clean.
Ref: 3e7d0f6

## 2026-08-07 · feat · build the light portfolio site
By: alekseysamarskiyfb-bit
Why: Oleksii needs a site he can send a prospective client cold — one scroll
that makes the case and ends in his Telegram DMs. The repo was empty at HEAD
and the previous version was dark-theme, so the brief's light direction meant
a new build rather than a re-skin.
How: Next 14 App Router, one page, six sections (hero, Velar Studio, career,
portfolio, CTA, footer). GSAP and Lenis share one ticker so scroll-linked
motion never lags the content. Every section enters and leaves on the same
gesture — opacity, blur, a small rise — from a single `Reveal` primitive;
reduced motion collapses it to a fade and never constructs Lenis. Type is
Archivo, Inter Tight, and Instrument Serif italic. The hero wordmark is sized
in vw so its fit is identical at every width, and stacks below the portrait
under 860px where the two would otherwise collide. Portrait and logo
recompressed to WebP (3.6 MB → 75 kB, 220 kB → 58 kB) after Next's WASM
encoder took 36s on the PNG; `sharp` added so image optimisation is fast and
production-grade. Verified across six widths plus a behaviour and an
independent gate pass — details in the initiative's work.md.
Ref: 5d9f453

## 2026-08-07 · chore · recover assets and toolchain from history
By: alekseysamarskiyfb-bit
Why: HEAD (3630e72) had emptied the repository, but the previous site at
349133a still held the real media — portrait cutout, Velar logo, eight 9:16
creatives — and a working Next 14 + GSAP + Lenis + Tailwind toolchain.
Rebuying either would have been waste; the new brief changes the design, not
the stack or the media.
How: checked out public/* (portrait-cutout.png, velar-wordmark.png,
velar-v.png, avatar*.jpeg, work/creative-1..8.jpg) and the build config
(package.json, tsconfig, next/postcss/tailwind config, .gitignore,
.claude/launch.json) out of 349133a into the working tree. No design code
carried over — the previous site was dark-theme and the brief asks for light.
Ref: 5d9f453 (landed with the build)
