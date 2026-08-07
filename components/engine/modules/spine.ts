/**
 * TIMELINE SPINE
 *
 * Draws a curve THROUGH the milestones rather than down a fixed column, so
 * the line always matches wherever the magnetically-positioned cards actually
 * landed. Nothing about the path is authored — it is generated from measured
 * positions, which means changing a milestone's x/y in the markup reshapes the
 * curve with no other edit.
 *
 * The viewBox is set to the container's pixel size so one SVG unit is one
 * pixel: stroke width and node radii stay true at any viewport, without the
 * distortion `preserveAspectRatio="none"` would introduce.
 *
 * Milestones activate from the drawn length, not from their own
 * ScrollTriggers — one scrub owns the progress, so a node can never light up
 * before the line physically reaches it.
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Utils, isMobile, prefersReducedMotion } from "../core";

const NS = "http://www.w3.org/2000/svg";

export const TimelineSpine = {
  tween: null as gsap.core.Tween | null,

  init() {
    if (isMobile()) return;
    this.build();
  },

  /** ScrollTriggers created for the collapsed layout's per-card reveal. */
  cardTriggers: [] as ScrollTrigger[],

  /**
   * Collapsed layout: there is no spine (the timeline wrap is display:none and
   * the cards are a plain stack), but .is-revealed still owns the card's
   * arrival — without this every card would sit at opacity 0 forever. Each
   * card gets its own one-shot trigger, which is also the per-card reveal the
   * stacked layout never had.
   */
  /** Hand the hidden-until-revealed state to CSS, but only once we can honour it. */
  arm() {
    Utils.$(".about-card-container")?.classList.add("is-armed");
  },

  /**
   * Reserve a run tall enough for the cards it has to hold.
   *
   * The two dimensions pull in opposite directions: a card's WIDTH is on the vw
   * grid so its height grows as the viewport widens (554px at 1920), while the
   * container was sized in vh so the gap between milestones grew with viewport
   * HEIGHT instead (only 340px at 1920x900). On a wide, short window the cards
   * were therefore 214px taller than the step between them, and consecutive
   * cards overlapped.
   *
   * No CSS expression can reconcile that, because card height depends on how
   * the copy wraps. So it is measured: take the tallest card, add clearance,
   * and size the container so the milestone spacing clears it. The spacing
   * fraction is read from the anchors themselves rather than hard-coded, so
   * changing the layout in Journey.tsx cannot desynchronise this.
   *
   * Must run BEFORE MagneticPositions solves — it changes where every anchor is.
   */
  reserve() {
    if (isMobile()) return;
    const container = Utils.$(".about-card-container");
    const anchors = Utils.$$(".about-anchor");
    const cards = Utils.$$(".about-card-wrap");
    if (!container || anchors.length < 2 || !cards.length) return;

    const tops = anchors.map((a) => parseFloat(a.style.top) || 0);
    let minGapPct = Infinity;
    for (let i = 1; i < tops.length; i++) {
      minGapPct = Math.min(minGapPct, Math.abs(tops[i] - tops[i - 1]));
    }
    if (!isFinite(minGapPct) || minGapPct <= 0) return;

    const tallest = Math.max(...cards.map((c) => c.offsetHeight));
    if (!tallest) return;

    /* Air between one card's bottom and the next card's top. Enough that the
       run reads as a sequence rather than a stack, without reopening the
       half-empty scroll the 470vh version had. */
    const CLEARANCE = 110;
    const needed = (tallest + CLEARANCE) / (minGapPct / 100);
    container.style.height = `${Math.round(Math.max(needed, window.innerHeight * 2.6))}px`;
  },

  buildCollapsed() {
    const cards = Utils.$$(".about-card-wrap");
    if (!cards.length) return;
    this.arm();

    if (prefersReducedMotion()) {
      cards.forEach((c) => c.classList.add("is-revealed"));
      return;
    }

    cards.forEach((card) => {
      this.cardTriggers.push(
        ScrollTrigger.create({
          trigger: card,
          start: "top 88%",
          once: true,
          onEnter: () => card.classList.add("is-revealed"),
        })
      );
    });
  },

  build() {
    if (isMobile()) {
      this.buildCollapsed();
      return;
    }

    const wrap = Utils.$(".about-timeline-wrap");
    const svg = document.querySelector<SVGSVGElement>(".about-spine");
    const track = document.querySelector<SVGPathElement>(".about-spine-track");
    const path = document.querySelector<SVGPathElement>(".about-spine-path");
    const nodeGroup = document.querySelector<SVGGElement>(".about-spine-nodes");
    const anchors = Utils.$$(".about-anchor");
    if (!wrap || !svg || !track || !path || !nodeGroup || anchors.length < 2) return;

    const box = wrap.getBoundingClientRect();
    svg.setAttribute("viewBox", `0 0 ${box.width} ${box.height}`);

    const pts = anchors.map((a) => {
      const b = a.getBoundingClientRect();
      return { x: b.left + b.width / 2 - box.left, y: b.top + b.height / 2 - box.top };
    });

    /* Lead-in and run-out so the line enters and leaves the frame instead of
       starting and stopping dead on the first and last node. */
    const lead = { x: pts[0].x, y: Math.max(0, pts[0].y - box.height * 0.07) };
    const tail = {
      x: pts[pts.length - 1].x,
      y: Math.min(box.height, pts[pts.length - 1].y + box.height * 0.06),
    };
    const all = [lead, ...pts, tail];

    /* Vertical control points: the tangent stays vertical at every node, so
       consecutive alternating milestones join as smooth S-curves rather than
       as corners. */
    let d = `M ${all[0].x} ${all[0].y}`;
    for (let i = 1; i < all.length; i++) {
      const a = all[i - 1];
      const b = all[i];
      const mid = (a.y + b.y) / 2;
      d += ` C ${a.x} ${mid}, ${b.x} ${mid}, ${b.x} ${b.y}`;
    }

    track.setAttribute("d", d);
    path.setAttribute("d", d);

    /* Where each milestone falls along the drawn length. Built by measuring
       the path truncated at that node — exact, rather than assuming segments
       are equal length (they are not, since the x-offsets differ). */
    const probe = document.createElementNS(NS, "path");
    const nodeAt: number[] = [];
    let partial = `M ${all[0].x} ${all[0].y}`;
    for (let i = 1; i < all.length; i++) {
      const a = all[i - 1];
      const b = all[i];
      const mid = (a.y + b.y) / 2;
      partial += ` C ${a.x} ${mid}, ${b.x} ${mid}, ${b.x} ${b.y}`;
      probe.setAttribute("d", partial);
      if (i >= 1 && i <= pts.length) nodeAt.push(probe.getTotalLength());
    }
    const total = path.getTotalLength();
    const nodeProgress = nodeAt.map((l) => l / total);

    // Milestone dots, drawn on the path itself so they cannot drift from it.
    nodeGroup.innerHTML = "";
    const circles = pts.map((p) => {
      const c = document.createElementNS(NS, "circle");
      c.setAttribute("cx", String(p.x));
      c.setAttribute("cy", String(p.y));
      c.setAttribute("r", "7");
      c.setAttribute("class", "about-spine-node");
      nodeGroup.appendChild(c);
      return c;
    });

    /* The CARDS ride the same progress as the nodes.
       Their reveals used to be hand-tuned percentages of the container
       (-42% to +33% of a 470vh box), which meant the first cards had already
       played before the section was on screen — they were simply THERE rather
       than arriving. Driving them from the drawn length instead means a card
       cannot appear before the line physically reaches its own milestone, so
       the run reads as the timeline drawing itself.

       One-way: once revealed a card stays revealed. Toggling it back off on
       the way up is the "everything replays when I scroll back" complaint. */
    const cards = Utils.$$(".about-card-wrap");
    this.arm();
    const revealCards = (p: number) => {
      // p > 0 guard: the first node sits only ~3% along, so any lead at all
      // would reveal card one before the line had started drawing — which is
      // the very thing this replaces.
      if (p <= 0.001) return;
      cards.forEach((card, i) => {
        if (nodeProgress[i] === undefined) return;
        // Slightly ahead of the node: the card is what the line arrives AT.
        if (p >= nodeProgress[i] - 0.03) card.classList.add("is-revealed");
      });
    };

    if (prefersReducedMotion()) {
      gsap.set(path, { strokeDasharray: "none", strokeDashoffset: 0 });
      circles.forEach((c) => c.classList.add("is-active"));
      cards.forEach((c) => c.classList.add("is-revealed"));
      return;
    }

    gsap.set(path, { strokeDasharray: total, strokeDashoffset: total });

    this.tween?.scrollTrigger?.kill();
    this.tween?.kill();
    this.tween = gsap.to(path, {
      strokeDashoffset: 0,
      ease: "none",
      scrollTrigger: {
        trigger: ".about-card-container",
        start: "top 78%",
        end: "bottom 88%",
        scrub: 0.9,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const p = self.progress;
          circles.forEach((c, i) =>
            c.classList.toggle("is-active", p >= nodeProgress[i] - 0.005)
          );
          revealCards(p);
        },
      },
    });

    /* Land the correct state immediately, not on the first scroll event — a
       reload partway down the page (or a resize rebuild) must not leave the
       cards the line has already passed sitting invisible. */
    const st = this.tween.scrollTrigger;
    if (st) {
      revealCards(st.progress);
      circles.forEach((c, i) =>
        c.classList.toggle("is-active", st.progress >= nodeProgress[i] - 0.005)
      );
    }
  },

  destroy() {
    this.tween?.scrollTrigger?.kill();
    this.tween?.kill();
    this.tween = null;
    this.cardTriggers.forEach((st) => st.kill());
    this.cardTriggers = [];
    const container = Utils.$(".about-card-container");
    container?.classList.remove("is-armed");
    // Let CSS own the height again, so the next reserve() measures cleanly.
    if (container) container.style.height = "";
    /* A rebuild re-runs the reveal from scratch, so the class has to go with
       it — otherwise a card that was revealed before a resize keeps the class
       while its trigger no longer exists, and the mirrored entrance never
       replays at the new size. */
    Utils.$$(".about-card-wrap").forEach((c) => c.classList.remove("is-revealed"));
  },
};
