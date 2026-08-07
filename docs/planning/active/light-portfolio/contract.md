# Contract — Light portfolio site

## Goal

A personal portfolio site Oleksii can send to a prospective client cold, that
makes the case in one scroll and ends in his Telegram DMs. Light theme, soft
neutrals, restrained glassmorphism, premium minimal — the quality bar set by
derekherman.co and mark.skrypka.co, not their layouts.

## The visitor

A media buyer or founder who opened the link on a phone or a laptop, gives it
about eight seconds, and is deciding one thing: is this person good enough to
trust with a budget. Everything on the page serves that decision, and the only
action offered is Telegram.

## Scope — in

1. **Hero** — portrait cutout against an oversized SAMARSKYI wordmark, the
   role line, a glass nav pill, scroll cue, entrance animation.
2. **Velar Studio** — the agency, its six service lines, the logo.
3. **Career** — all seven roles from the brief, newest first, with dates,
   location, bullets, and employment type where the brief states one (it does
   not for the two ADPRODIGIES entries).
4. **Portfolio** — the eight 9:16 creatives, built to take video in the same
   slots without a rewrite.
5. **CTA** — the one conversion point, opening Telegram.
6. **Footer** — name, contact, credits.

Cross-cutting:
- Light theme on a soft neutral palette drawn from the reference screenshot.
- Three paired typefaces: Archivo (display), Inter Tight (UI/body),
  Instrument Serif (editorial accents).
- Every section animates on enter *and* on leave, combining opacity, blur,
  and small movement. Smooth scrolling (Lenis) driving GSAP ScrollTrigger.
- `prefers-reduced-motion` respected everywhere.
- Responsive 375 → 1920, no horizontal overflow, no overlaps.
- Metadata: title, description, Open Graph image, favicon, theme colour.

## Scope — out

- CMS, blog, case-study detail pages, contact form, analytics.
- Dark mode.
- Deployment (offered separately once the site is accepted).
- Producing or editing new media. The site consumes what exists; new video
  drops into named slots.

## Success criteria

1. The CTA — and every contact affordance — opens the correct Telegram DM.
2. All seven career roles render with correct dates and location, and with
   employment type wherever the brief supplies it.
3. Portfolio holds eight 9:16 items and accepts video in any slot without a
   component rewrite.
4. Every section animates entering and leaving the viewport; motion is
   opacity + blur + movement; reduced-motion collapses it to a plain fade.
5. Clean at 375 / 768 / 1024 / 1280 / 1440 / 1920 — no horizontal scroll, no
   overlap, no clipped text, walking the full page height at each width.
6. `next build` passes with no type errors.
7. Nothing on the page is Lorem or a stand-in except assets the user has been
   told are stand-ins.

## Open questions

- **Portfolio video.** Eight stills exist; the brief also asks for video. The
  slots take either, so this is a content drop, not a build change.
- **Two dates to confirm with Oleksii** (raised after the verification pass,
  neither blocking):
  - The current role reads "December 2025 — Present". The previous version of
    this site recorded it as ending June 2026, and today is August 2026. The
    brief is newer, so the brief is what shipped.
  - The two ADPRODIGIES roles carry no employment type because the brief gives
    none. Nothing was invented to fill the gap.

## Approvals

- 2026-08-07 — scope agreed in conversation; Telegram handle supplied
  (`t.me/o_samarskyi`) and wired into every contact affordance.
- 2026-08-07 — corrected "eight roles" to seven after an independent
  verification pass: the brief lists seven, the contract miscounted.
