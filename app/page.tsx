import AnimationEngine from "@/components/engine/AnimationEngine";
import Sidebar from "@/components/site/Sidebar";
import Hero from "@/components/site/Hero";
import Journey from "@/components/site/Journey";
import Work from "@/components/site/Work";
import WhatYouGet from "@/components/site/WhatYouGet";
import Cta from "@/components/site/Cta";
import Velar from "@/components/site/Velar";
import SiteFooter from "@/components/site/SiteFooter";

export default function Home() {
  return (
    <div className="page-wrap" id="top">
      <AnimationEngine />
      <Sidebar />

      <main className="main-wrap">
        <Hero />
        <Journey />
        <Work />
        <WhatYouGet />
        {/* Velar leads into the CTA: the venture makes the case, the CTA
            collects. Reversing them asked for the contact before the reason. */}
        <Velar />
        <Cta />
      </main>

      <SiteFooter />
    </div>
  );
}
