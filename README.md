# oleksiisamarskyi.com

Personal portfolio for Oleksii Samarskyi — creative and motion designer,
founder of Velar Studio. One scroll, one conversion point: the Telegram DM.

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

Note: `npm run build` writes to the same `.next/` the dev server is using.
Stop `npm run dev` before building, or the running server loses its chunks.

## How it is put together

Next 14 App Router, one page. GSAP drives every animation and Lenis drives
scrolling — both on GSAP's ticker so they advance on the same frame.

```
app/
  layout.tsx         fonts, metadata, Open Graph
  page.tsx           section order
  globals.css        the entire design system
  opengraph-image.tsx  link preview card, rendered at build time
components/
  motion/            Reveal (the one scroll animation), SmoothScroll (Lenis)
  site/              one file per section
data/                every string on the page
```

Tailwind is present for its preflight reset only. The design system is custom
properties in `globals.css`: colours, the fluid type scale, the glass recipe.

### Changing content

Everything a visitor reads lives in `data/`:

- `site.ts` — name, role, the Telegram link (used by all four contact points)
- `career.ts` — the roles
- `work.ts` — the portfolio grid
- `velar.ts` — the studio's services

### Adding a video to the portfolio

Drop the file in `public/work/` and change the entry in `data/work.ts`:

```ts
{ src: "/work/reel-1.mp4", kind: "video", poster: "/work/reel-1.jpg", ... }
```

Nothing else changes — the frame is 9:16 either way, and videos autoplay
muted, looped, inline.

### Motion

`components/motion/motion.ts` holds the amplitudes. Every section uses the
same gesture — opacity, blur, and a small rise on the way in, mirrored on the
way out — so changing a number there changes the whole site consistently.

Anything inside the last viewport of the document needs `noLeave` on its
`Reveal`: its bottom edge can never reach the leave range, so without it the
element would fade out and stay out.

`prefers-reduced-motion` is honoured throughout: Lenis is never constructed
and reveals collapse to a plain fade.
