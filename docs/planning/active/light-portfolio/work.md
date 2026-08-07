# Work — Light portfolio site

Status: **built and verified against the contract; awaiting Oleksii's
acceptance.** Nothing is committed yet — the whole site is untracked.

## Plan

All eight steps are done.

1. **Foundation** — done. Three fonts via `next/font`, palette and glass as
   custom properties in `app/globals.css`, Lenis on GSAP's ticker, reduced
   motion honoured by never constructing Lenis at all.
2. **Motion system** — done. `components/motion/Reveal.tsx` is the single
   gesture: opacity + blur + rise entering, mirrored leaving, both scrubbed.
   Amplitudes live in `motion.ts`.
3. **Hero** — done, and it needed two fixes found by looking at it:
   the wordmark is sized purely in vw so its fit ratio is constant at every
   width, and below 860px the portrait and the name stop overlapping and stack,
   because at phone widths the portrait covered all but two letters.
4. **Career** — done. Seven roles from `data/career.ts`.
5. **Portfolio** — done. Eight 9:16 frames; `kind: "video"` swaps a still for
   a looping muted video with no component change.
6. **Velar Studio** — done. The site's one dark surface, which is both the
   composition's anchor and the only background the white logo reads on.
7. **CTA + footer** — done. Four contact affordances, all `t.me/o_samarskyi`.
8. **Verify** — done. See below.

## Verification

- Width sweep at 375 / 768 / 1024 / 1280 / 1440 / 1920: no horizontal
  overflow, no clipped content outside deliberate frames, no overlapping
  cards, at every width, walking the full page height.
- Behaviour pass: all eight portfolio images load; nothing is left faded at
  the document's end; every Telegram link resolves to `t.me/o_samarskyi` with
  `target="_blank"` and `rel="noreferrer noopener"`; all three nav links land
  just clear of the fixed pill; reduced motion yields opacity-only with no
  blur or transform; a resize mid-life leaves the portrait centred and the
  page free of overflow.
- `next build` passes; `tsc --noEmit` clean; no console errors, no failed
  requests.
- Independent gate pass against the contract. It found the contract's own
  "eight roles" miscount (the brief has seven — contract corrected, data was
  right), that the source brief was missing from the repo (now at `brief.md`),
  and four minor cleanups, all applied: the role count is derived rather than
  typed, `REVEAL.enterStart` is actually read, dead CSS and an unused Tailwind
  font mapping are gone, and non-English portfolio titles carry `lang`.

## Next action

Oleksii reviews the site. On acceptance: commit, archive this folder to
`docs/planning/archive/2026/`, and offer deployment as its own piece of work.

## Follow-ups

Out of scope; each would be its own sizing if wanted.

- Real 9:16 video in the portfolio — the slots already take it.
- A mobile section menu. Below 820px the pill shows only the mark and the CTA;
  on a one-scroll page that is defensible, but it is a deliberate loss.
- Two career details to confirm with Oleksii — see the contract's open
  questions: the "Present" end date on the current role, and the two
  ADPRODIGIES roles that carry no employment type because the brief gives none.
