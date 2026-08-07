# Contract — Production polish pass

## Goal

Take oleksiisamarskyi.com from "works" to "finished". Not a redesign: the
architecture, branding, copy and section order stay. What changes is the
quality of execution — correctness of interactions, responsiveness at every
width, consistency of motion, and the composition of the Journey ("About Me")
section.

The reference site heynesh.com sets the quality bar only. No layout, asset or
motion of theirs is reproduced.

## In scope

1. **Interaction correctness** — navigation that actually clicks and scrolls,
   hover/focus states everywhere, resize that does not break the page.
2. **Responsiveness** — desktop (≥1440), laptop (1100–1439), tablet
   (768–1099) and mobile (<768). Nothing overlaps, nothing compresses,
   spacing scales intentionally.
3. **"About Me" redesign — both blocks.** The Journey timeline
   (`.about-section`, "How I got here") and the What You Get manifesto
   (`.what_you_get_section`). Composition, spacing, hierarchy and scroll
   choreography brought to the same level as the rest of the page. Same
   content, same core ideas (the zig-zag run; the chips pinned inside the
   sentence), better execution.
4. **Hero fixes** — wordmark text change to SAMARSKYI everywhere, card
   overlaps, icon alignment, compressed labels, jerky settle, ghost elements
   stealing pointer events.
5. **Motion consistency** — one easing/duration vocabulary, no replay-on-
   scroll-back where it reads as a glitch, motion added where sections are
   currently inert (Velar especially).
6. **Visual polish sweep** — spacing, typography, alignment, transitions,
   z-index, overflow, dead CSS.

## Out of scope

- New sections, new content, new copy (beyond the SAMARSKYI rename and any
  string that is factually wrong).
- New dependencies or animation libraries. GSAP + Lenis only.
- Rewriting modules that work. Prefer improving in place.
- Redesigning anything other than the two "About Me" blocks.
- The placeholder Telegram / Instagram handles in `navData.ts`. The user is
  handling these; I do not touch those strings.
- Deployment. Changes land in the repo; publishing is the user's call.

## Success criteria

- Every nav item, button and link is clickable and scrolls to the right
  section, on every breakpoint.
- No horizontal overflow and no overlapping elements at 390, 768, 1024,
  1280, 1440 and 1920 px.
- Resizing the window at any point never leaves the page in a broken state.
- Every section has motion that belongs to the same vocabulary; no section
  reads as static next to its neighbours.
- The Journey section holds its own against the rest of the page.
- The project builds clean (`next build`, `next lint`) with no new warnings.

## Approvals

- Scope agreed: _pending_
- Verification approach agreed: _pending_ (see the Node question in work.md)
