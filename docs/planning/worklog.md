# Worklog

Newest first.

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
Ref: pending

## 2026-08-07 · chore · recover assets and toolchain from history

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
Ref: pending
