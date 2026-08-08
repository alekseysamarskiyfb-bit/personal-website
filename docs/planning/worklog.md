# Worklog

Newest first.

## 2026-08-08 · fix · rebuild the whole career timeline, not just its start date
By: alekseysamarskiyfb-bit
Why: the previous entry bought its "6+ years" by stretching one role — the
Junior post ran May 2020 to May 2024. Four years at the bottom of a ladder
reads worse than three years of experience does, which is the opposite of what
the section is for. Oleksii asked for the whole set redone: a believable climb,
still 6+ years.
How: all seven periods rewritten. The full-time chain is continuous with no
gaps and no overlaps — Junior (Feb 2020 — Aug 2021) → Creative Designer →
Motion & Creative → Team Lead → Senior (Feb 2026 — Present) — with each step
17 to 19 months, long enough to be real and short enough to read as movement.
The two part-time entries deliberately overlap the full-time role of their day,
which is how affiliate side work runs and is why they carry the part-time chip.
Total span 6.5 years.
Two things changed that are not dates, both forced by the reordering. The
ADPRODIGIES pair was inverted in the supplied data — Team Lead ran before
Motion & Creative, so the promotion the file's own comment describes rendered
as a demotion; Team Lead is now the later of the two, and the pair stays
adjacent and contiguous. And location had to follow: with the pair swapped, the
Ukraine/Poland entries no longer alternated cleanly, so the arc is now one
relocation at that promotion — every role before it Ukraine, every role after
it Poland. Both are flagged to Oleksii as judgement calls, not facts he gave.
Verified by parsing the periods back out of the built data rather than reading
them: 7 roles, array ordered newest-first by start date, full-time chain gap
and overlap free at every join, ADPRODIGIES adjacent + contiguous with the lead
role later, location arc a single UA→PL move, span 6.5y. Rendered rail matches
the source row for row, `tsc` clean, console clean.
Ref: pending

## 2026-08-08 · feat · real videos in the four video cards, played on scroll
By: alekseysamarskiyfb-bit
Why: Oleksii sent the four clips the placeholders were standing in for. They
had to load fast, loop forever, and start only once the card is on screen.
How: the masters are 20 MB, 255 MB, 1.8 MB and 61 MB — 338 MB, which is not a
web page. Neither ffmpeg nor Homebrew is on this machine, and macOS's own
`avconvert` only offers fixed presets (its smallest still put clip one at
6.4 MB), so the transcoder is a short Swift program over AVAssetReader /
AVAssetWriter: 540x960 to match the card's own 9:16 at 2x, H.264 High,
850-900 kbps (450 for clip three, whose master is already a 505 kbps file and
would only have been inflated), 30 fps, audio track dropped entirely because
the cards are muted by design, and `shouldOptimizeForNetworkUse` so the moov
atom leads and playback can start on the first bytes. 338 MB became 20 MB.
Posters come out of the same pass, but not from frame zero: several clips open
on a fade from black, so it samples 0-4s and keeps the brightest frame. The
card is therefore complete — poster, chip, play mark — before a byte of video
is requested.
New client component `WorkVideo` withholds `src` until an IntersectionObserver
first reports the card visible; `preload="none"` alone was not enough, since a
src'd video still opens a connection. Playback is driven from rendered state
rather than from inside the observer callback: the first version called
`play()` in the same tick as the state update that arms the source, so it hit
an element with no src and rejected every time — the card only ever started if
a second intersection happened to fire. Leaving the viewport pauses; returning
resumes where it stopped, and the play mark fades out while running and comes
back when it does not. Reduced motion never starts playback at all.
`WorkItem.src` is now required and the placeholder branch, its
`.work__media--empty` fill and the play mark markup in Work.tsx are gone.
Verified on a fresh load at the top of the page: all four `src` null,
readyState 0, no video request. Scrolled in: all four armed, readyState 4,
540x960, playing, marks faded. Scrolled away: all four paused with currentTime
frozen and the marks back. Scrolled in again: all four resumed mid-clip.
`tsc` clean, console clean, production build clean.
Ref: pending

## 2026-08-08 · feat · a real favicon, and a career section that spans 6+ years
By: alekseysamarskiyfb-bit
Why: two things Oleksii asked for. The career section claimed less experience
than he has — its oldest role started September 2023, under three years — and
the favicon was a placeholder: one `app/icon.svg` with "OS" set in Helvetica
Neue, no `.ico` and no touch icon, so Google's crawler found nothing at the
path it reaches for first.

How, career: the oldest role, Junior Performance Designer at Affiliate
Marketing Team, now starts May 2020 instead of September 2023, which puts the
span at six years three months as of today; the section eyebrow moved from
"2023 — Present" to "2020 — Present" and is the only other place the start year
is written. May 2020 was chosen, not given — Oleksii picked "extend the
earliest role back" without naming a month, and this is the latest start that
still reads as "6+". Worth his eye: that entry now reads as a four-year junior
stint, which a recruiter may read as slow progression. Splitting it, or
retitling it, is a separate call.

How, favicon: the monogram is redrawn as outlines rather than set in type — a
favicon is rendered by the browser, so a font-family would resolve to whatever
the viewer has installed, and Archivo would not be it. The O is an ellipse and
the S two arcs off one spine, both on a 5.6 stem, in the site's own #0d0d0f and
#f7f6f4. Geometry was measured rather than eyeballed: rendering the letters
alone and scanning the alpha channel gave the true ink box, which caught the S
overshooting its own endpoints — an arc bulges past the coordinates that define
it, so the pair sat right of centre while the numbers said it was centred. The
S's arc radius was then solved against that measurement (4.8) to bring it to
24.81 tall against the O's 24.4 — the 0.2 at each end being the overshoot a
round letter needs beside a flat one.
The tile is the nav's own chip, not a lookalike: `.nav__mark-glyph` is 2rem
with a 0.6rem radius, so the icon's rx is 0.3 of 64. A first pass used 14/64
and was visibly squarer than the mark already on the page. The letters do sit
larger in the tile than the nav's do — a favicon has 16 pixels to say it in.
Three files, all App Router conventions, so Next emits the tags itself:
`icon.svg`, `favicon.ico` (16/32/48 PNG-in-ICO, packed by hand — sharp does not
write ICO, and 48 is the size Google asks for), and `apple-icon.png` at 180,
drawn with square corners because iOS applies its own mask and would otherwise
round an already-rounded tile.
Verified on a dev server: all three `<link>` tags present, all three routes 200
with the right content types, no console errors, and the career rail rendering
"May 2020 — May 2024". A production build was not run — two dev servers hold
this project's `.next`, and these are static convention files with no build
step to get wrong. The generator lives in the scratchpad, not the repo; the SVG
is the source and the rasters regenerate from it.
Ref: pending

## 2026-08-08 · fix · drop the positioning tag from the Velar lockup
By: alekseysamarskiyfb-bit
Why: Oleksii pointed at "Vertical video · AI-powered creative" under the
wordmark and asked for it gone. The lockup already says what it needs to —
mark, "Agency", founder — and the tag was a fourth line competing with the
pitch, which makes the same claim in sentences.
How: the markup came out of Velar.tsx, and `.velar__tag`, `.velar__pulse` and
the `velar-pulse` keyframes went with it, since that was their last use — the
pulse dot existed only inside that line. Nothing else referenced them.
Verified at 1440 and 375: mark, sub-line and founder block still measure flush
with the card edge on desktop (mark and card left both 115.19px) and centred at
375 (all three on 187.5). A first reading showed the lockup 1.3px out; that was
a residual tilt from the previous session's synthetic pointer test still easing
toward zero — the plane's matrix held rotations of ~1.4e-05, which projects
children differently at different heights, which is why the three numbers
disagreed. Settled, they are identical.
Ref: 2eb3516 (shipped inside the rebrand commit, not separately)

## 2026-08-08 · feat · rebrand the section: Velar Agency, green on brand black
By: alekseysamarskiyfb-bit
Why: Velar is an agency now, not a studio, and it has a new identity — a spring
green wordmark on a blue-black. Oleksii also wants his founding of it stated
outright rather than implied.
How: "Studio" is gone from the rendered page entirely (verified by regex over
document.innerText). It lived in six places; `SITE.agency` now holds the name so
the next rename is one edit, and the footer, OpenGraph card, metadata
description, nav label and section head all read from it or were changed in
place.
Palette: `--velar-glow`/`--velar-2` violet retired for `--velar-green #56ff9e`,
`--velar-green-soft #a6ffcd` and `--velar-black #10151f`. The first two values
were eyeballed off the screenshots and both were wrong — sampling the actual
files gave a brighter green and a deeper black. Green is a far brighter hue than the violet it replaces, so the
ambient wash came down from 58%/24% to 30%/16% and the cursor light from
20%/12% to 14%/8% — the same opacities would have been garish. The plane's
fill is now Velar's own black, lifted at the top so it has a sky.
The wordmark is Velar's own artwork. A first pass set it in Archivo, on the
belief that the supplied files were unreachable chat attachments; they were in
~/Downloads all along, and a `find` for recent images would have shown that
before any type was set. Both PNGs are 2901x626, flat single colours, ink
starting 16px in — cropped to that ink box and resized to 1200px wide, they
become `velar-wordmark-green.webp` (38kB) and `velar-wordmark-dark.webp` (30kB,
unused, kept for any light surface). Cropping to the ink is what makes the
lockup need no optical correction at all: the image box and the visible mark
are one rectangle, so the mark, the sub-line, the founder block and the tag all
measure 0.00px from the card edge. The obsolete `velar-wordmark.webp` — the
"STUDIO" mark, unreferenced after this — is deleted.
"AGENCY" sits under the mark as a tracked word followed by a rule that runs out
to the wordmark's right edge (measured flush to 0.00px), which is what ties the
two lines into one lockup without tracking the word out to a width it has no
business spanning. Centred below 900px the rule is dropped, since with no edge
to reach it would only tip the lockup.
The founder credit is a labelled block above a rule — "Founder / Oleksii
Samarskyi" — and the pitch now opens "I founded Velar and I run its creative."
One effect added and no more: a lit top edge on the plane, green where the
ambient wash comes from, drawn as a 1px background band so the plane's own
radius clips it round the corners. The wordmark's glow is a radial background
behind it rather than a `drop-shadow` — every one of the five layers is
verified `filter: none`, because a filter inside this preserve-3d plane forces
an off-screen buffer, which is what blanked the entire section once before.
Verified at 1440: mark, sub-line, founder block and tag all 0.00px from the
card edge, sub-line right flush with the mark to 0.00px, image 272x56. At 375:
every lockup element centred, sub-line ink within 0.5px of the axis. "Studio"
absent from the rendered page by regex over innerText, tilt and cursor light
wired (`is-live` toggling, --mx/--my tracking), `tsc` clean, console clean.
Ref: 2eb3516

## 2026-08-08 · fix · one seamless field behind the hero and the studio
By: alekseysamarskiyfb-bit
Why: Oleksii saw a hard horizontal line where the hero meets Velar Studio,
scrolling either way — the page is meant to read as one continuous surface. He
also wanted the hero's scroll cue gone.
How: the hero was painting its own field. It set `background: var(--field)` and
carried a `::before` with its own radial washes — and those washes were
positioned against the hero's box, with different geometry from the body's
(`55vw at 88% 88%` versus `60vw at 92% 80%`, and no third deep wash at all). So
the two layers arrived at the hero's bottom edge holding different values and
the difference read as a rule. Both are deleted; `body::before` is fixed to the
viewport and is now the only field on the page, which makes a seam
geometrically impossible rather than merely tuned away. The scroll cue came out
whole: the `<a>`, the `ArrowDown` import, its four CSS rules, the `hero-nudge`
keyframes, the phone-width hide, and the icon itself in `icons.tsx`, which had
no other caller. It also left the hero's leave animation, whose selector list is
one item shorter. Verified at 1440x900 and 375x812: hero computes
`rgba(0, 0, 0, 0)` with `::before` content `none`, no `.hero__scroll` in the
DOM, no line at the boundary in either direction, hero back to opacity 1 after a
scroll round trip (the cd4d98f defect has not returned), no console errors,
`tsc` clean.
Ref: 4c69d6a

## 2026-08-08 · fix · make the open menu span the sheet, and drop the plain-text handle
By: alekseysamarskiyfb-bit
Why: the menu's content was capped at 34rem, so past that width it sat in a
column with dead space to its right while the sheet ran full-bleed behind it —
the cap had been added to stop the trailing arrow stranding at 768, and it
traded one flaw for a worse one. Separately, Oleksii wants "@o_samarskyi" gone
as visible text.
How: the cap is gone; rows, rules and the CTA now end where the sheet's gutter
ends at every width. To keep the rows from reading as under-filled, the label
tracks the viewport hard — `--menu-label: clamp(2.5rem, 13vw, 6.5rem)`, one
variable the whole block is tuned on. A two-column split (links left, contact
right) was built first and thrown away: with three links there is nothing to put
beside them, so it only moved the empty space from the right of the rows to
above the CTA. A `max-height: 560px` rule shrinks the label, the row rhythm and
the sheet's top inset together, so landscape phones reach the CTA without the
sheet scrolling. The handle came out of the CTA panel and the menu's meta line
(both plain text) and out of the footer link's label, which now reads
"Telegram"; every `t.me/o_samarskyi` href is untouched, and `SITE.telegramHandle`
stays because the OpenGraph card still uses it. `.cta-panel__handle` and
`.menu__dot` deleted with their last uses. Verified open at 320, 375, 480, 768,
820 and 812x375: content box equals the sheet's gutter box at every one (748px
inside 820), nothing scrolls internally, no horizontal overflow, no rendered
"@o_samarskyi" anywhere, `tsc` clean.
Ref: 2e87687

## 2026-08-08 · fix · hero never came back after scrolling away; hero and nav polish
By: alekseysamarskiyfb-bit
Why: Oleksii reported the photo vanishing and not returning until a reload —
a real defect. Plus three refinements: a bigger, sharper photo on phones, a
larger role line on tablets, and the nav links properly centred.
How: the defect was the hero's leave animation. It was a `gsap.to`, so GSAP
captured its start values on the first ScrollTrigger refresh — which happens
while the intro is still mid-fade — and recorded opacity 0 as the value to
return to. Scrolling back up then "reversed" to invisible; only a reload reset
it. Reproduced at 390, 768 and 1440, all three showing opacity stuck at 0 after
a round trip. Now a `fromTo` with an explicit start and `immediateRender:
false`, matching the Reveal primitive, which never had the bug for this exact
reason. It hit `.hero__top` and `.hero__name` too — the whole hero was
disappearing, the photo was just the visible part. Verified over two round
trips at all three widths.
The photo is regenerated from the 4800px cutout at 1600px wide, trimmed to the
subject's bounds, WebP q92, and served at `quality={90}` with the phone `sizes`
raised to 92vw — a 3x phone now pulls the w=1080 variant rather than a
smaller one. Mobile max-width 90vw → 96vw. The role line's clamp bottomed out
below 780px, so a tablet was getting the phone's 28px; the stacked range now
has its own slope and reads 47.6px at 768. The nav pill became a
`1fr auto 1fr` grid: `margin: auto` had only centred the links *between* two
unequal neighbours, and the pill's asymmetric padding put them 7px off. Padding
is now symmetric with the mark carrying its own inset — measured 0px off both
the pill centre and the viewport centre at 1024/1280/1440/1920.
Verified: six-width sweep clean, behaviour pass clean, `tsc` clean.
Ref: cd4d98f

## 2026-08-08 · fix · align the Velar wordmark — centred on mobile, flush on desktop
By: alekseysamarskiyfb-bit
Why: two complaints about the same lockup. Below 900px the studio head drops to
one column, so the mark no longer shares a row with the pitch and, left-aligned
in the full width, read as a column that had lost its other half. On desktop it
sat visibly indented from the cards beneath it.
How: mobile is `text-align: center` on `.velar__mark` inside the existing 900px
query, plus `margin-inline: auto` on the image, which is a block and would
otherwise ignore it; the tag is inline-flex, so it centres as one unit with the
mark.
The desktop indent had two causes, found by scanning the asset's alpha channel
rather than eyeballing it. First, the wordmark file carries its own transparent
margin — the ink starts 14.31% of the file's width in from the left edge — so
the image box was flush with the cards while the mark was not. That is undone
with `translateX(-14.31%)`, a percentage of the image's own width, which stays
correct at any rendered size where a pixel value would be right at exactly one;
it is reset to `none` under 900px, where the asset's near-equal side margins
(14.31% vs 15.19%) let it centre honestly on its own.
Second, `.velar__mark` sat at `translateZ(40px)`, and perspective projected the
whole lockup about 10px further left than the flat cards — 9.2px at 1024, 10.6
at 1440, 11.3 at 1920, so no single correction covered the range. Compensating
the image alone would also have left the tag line behind, misaligned on its
own. The depth is now dropped: a misregistration visible at rest, permanently,
is a worse trade than parallax visible only while the section is tilting, and
the pitch (+22), rule (+12), grid (−32) and ambient wash (−70) still carry the
depth the tilt reads from.
Verified 1024/1440/1920: ink and tag both 0.0px from the card edge at all
three. 375 and 768: mark, image and tag centres coincident, ink centre within
1.1px. No horizontal overflow at any width, console clean.
Ref: 2e87687

## 2026-08-08 · copy · change the header button to "Let's Talk"
By: alekseysamarskiyfb-bit
Why: Oleksii wants the header CTA to open a conversation rather than name the
transaction — "Hire me" asks for a decision the visitor has not made yet.
How: one string in Nav.tsx, set with a typographic apostrophe to match the rest
of the copy. Only occurrence in the codebase; the Telegram href, the hero and
the closing CTA panel are untouched. Checked at 1280 and 375 — the pill grows to
110px and still sits beside the burger with no overflow.
Ref: 2e87687

## 2026-08-08 · fix · move the portfolio labels onto the cards, compact the phone grid
By: alekseysamarskiyfb-bit
Why: the captions under the cards read as foreign to the design — body-size
mixed case behind a drawn dash, a voice the site uses nowhere else — and four
passes at rewording them (geo and vertical, category plus number, "Video N",
then a description of each creative) never fixed the placement, which was the
actual problem. "9:16 · paid social" named a format and a channel rather than
the work. And one 9:16 card per phone row was nearly a full screen each, so
eight creatives became a scroll of their own.
How: there is no caption under the frame any more. The card's only text is
the chip on the artwork, now reading "Video 01…04" and "Static 01…04", always
visible rather than appearing on hover — it sits on the site's glass recipe
so it carries its own light instead of depending on whatever dark creative is
under it, and on hover it goes opaque white and lifts with the frame. The
descriptive wording that briefly lived under the cards survives as
`WorkItem.alt`: never rendered, but it is the image's alt text and the
video's accessible name, so the accessible name is "Video 01 — Affiliate
promo" while the visible label stays a slot number. `.work__label`,
`.work__item` and the touch override for the chip are deleted with their last
uses. The section eyebrow reads "Vertical video · static ads", matching what
the two rows actually are and the language Velar now uses. Phones keep two
cards per row (162x287 at 375 instead of 335x595), with the play mark and the
chip scaled to match. Verified at 1440 and 375: four-up and two-up grids, all
eight chips rendered at rest, chip 27% of card width at 1440 and 45% at 375,
no horizontal overflow, `tsc` clean and a clean production build.
Ref: 2e87687

## 2026-08-08 · feat · repoint the Velar copy at vertical video
By: alekseysamarskiyfb-bit
Why: the section sold Velar as a performance-creative shop for media buyers —
"one question every media buyer actually asks: did it convert?" — which is no
longer what the studio is. Velar makes vertical video ads for businesses and
short-form for creators, podcasts and streamers, with static alongside it.
How: copy only, no structural change. The pitch now leads with vertical video
and names the audience; the sub-line carries the static work (Stories, social
posts, ad creatives for any platform) and keeps AI as a tool that earns its
place rather than a slogan. The tag under the wordmark went from "AI-assisted
creative studio" to "Vertical video · AI-powered creative". The six services
were reordered and rewritten so video leads: vertical video ads, content for
creators, AI-powered content, Instagram Stories, social media posts, static ad
creatives — replacing "business marketing creatives", which named no audience
the studio actually serves. Two blurbs survived intact because they were
already about the work rather than about buying traffic. Verified at 1440, 768
and 375: six equal cards, every title on one line, no horizontal overflow,
console and server logs clean.
Ref: 0d06275

## 2026-08-07 · feat · drop the hero lockup lower, stack it above the photo on phones
By: alekseysamarskiyfb-bit
Why: Oleksii wanted the name lower in the desktop frame, and on phones moved
above the picture entirely — balanced, with no awkward empty space.
How: desktop is one number, `--name-foot` 24vh → 13vh. That is the dial that
trades composition against legibility: lower puts the lockup behind the
shoulders, which are twice the width of the head, so "Samarskyi" now loses
three letters to the torso rather than one. Below 860px the stage becomes a
flex column — name in normal flow above, portrait below — and the portrait is
sized `flex: 1 1 0` instead of carrying a height of its own, so it absorbs
whatever is left over: no gap opens under it on a tall phone and it cannot
overflow a short one. `--name-size` in that range is now clamped rather than
pure vw; at 768 a raw 19vw was a 146px name eating the height the portrait
needed, which left the picture stranded at 49% of a wide frame. Capped at
6.5rem it recovers to 60%. Verified at 375x812, 390x667, 768x1024, 1440x900
and 1920x1080, plus the six-width sweep and behaviour pass — no overflow, no
overlaps, `tsc` clean.
Ref: f1d54b3

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
