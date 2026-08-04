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

  build() {
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

    if (prefersReducedMotion()) {
      gsap.set(path, { strokeDasharray: "none", strokeDashoffset: 0 });
      circles.forEach((c) => c.classList.add("is-active"));
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
        },
      },
    });
  },

  destroy() {
    this.tween?.scrollTrigger?.kill();
    this.tween?.kill();
    this.tween = null;
  },
};
