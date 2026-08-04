import AnimationEngine from "@/components/engine/AnimationEngine";
import Sidebar from "@/components/site/Sidebar";
import Hero from "@/components/site/Hero";
import Journey from "@/components/site/Journey";
import Work from "@/components/site/Work";
import WhatYouGet from "@/components/site/WhatYouGet";
import Ways from "@/components/site/Ways";
import Cta from "@/components/site/Cta";
import Clients from "@/components/site/Clients";
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
        <Ways />
        <Cta />
        <Clients />
      </main>

      <SiteFooter />
    </div>
  );
}
