# Velar Studio — landing page

Next.js 14 (App Router) + TypeScript + Tailwind CSS.

## Run locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000

## What's in this design

- **Palette** — near-black purple-tinted base (`ink`), single AI-style
  gradient accent running violet → magenta (`grad-text`, `grad-line`,
  `button-primary`), used consistently instead of multiple competing colors.
- **Glass** — `.glass` / `.glass-strong` utility classes (blurred,
  semi-transparent panels) used on cards throughout.
- **Ambient depth** — `.orb-field` + `.orb` are large, slowly-drifting
  blurred gradient blobs behind the Hero and Contact sections, for an "AI
  studio" atmosphere without overloading every section.
- **3D** — `components/TiltCard.tsx` is a lightweight CSS-only tilt-on-hover
  effect (rotates toward the cursor + a moving light shine) used on the
  Services and "Who we work with" cards. Chosen over a full WebGL/Three.js
  setup to keep the bundle light and reliable; can be upgraded later.
- **Logo** — `public/velar-mark.jpg` (icon) and `public/velar-lockup.jpg`
  (full lockup, unused on the page currently but kept in `public/` in case
  it's needed for social previews/favicons). The mark is rendered with
  `mix-blend-mode: screen` so its black background disappears against the
  dark UI, leaving only the glowing V.
- **Motion** — all scroll reveals (`Reveal.tsx`), the process graphic
  (`ProcessFlow.tsx`) and the founder timeline (`TimelineItem.tsx`) replay
  in both scroll directions via `IntersectionObserver`, and everything
  respects `prefers-reduced-motion`.
- **Mobile** — animated hamburger (morphs to an X) with a full-screen glass
  panel and staggered link entrance, in `components/Nav.tsx`.

## Content still to fill in

- Founder bio / stats are Oleksii's real production background — update if
  anything changes.
- No client logos or testimonials were added since Velar Studio is a new
  brand — add a "Selected work" section once there's real client work to
  show, rather than fabricating placeholder case studies.
- `oleksii.samarskyii@gmail.com` and the LinkedIn link in Contact — swap for
  a dedicated Velar Studio inbox if/when one exists.
