"use client";

import Image from "next/image";
import { useRef } from "react";

export default function HeroPortrait() {
  const ref = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `translate3d(${px * -14}px, ${py * -10}px, 0)`;
  }

  function handleMouseLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "translate3d(0, 0, 0)";
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="hero-visual hero-portrait-mask relative h-full aspect-[2/3] mx-auto transition-transform duration-300 ease-out"
      style={{ animationDelay: "0.25s" }}
    >
      <Image
        src="/portrait-cutout.png"
        alt="Oleksii Samarskyi"
        fill
        sizes="(min-width: 768px) 520px, 85vw"
        className="hero-portrait-img"
        priority
      />
    </div>
  );
}
