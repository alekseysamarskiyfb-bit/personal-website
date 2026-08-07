import SmoothScroll from "@/components/motion/SmoothScroll";
import Nav from "@/components/site/Nav";
import Hero from "@/components/site/Hero";
import Velar from "@/components/site/Velar";
import Career from "@/components/site/Career";
import Work from "@/components/site/Work";
import Cta from "@/components/site/Cta";
import SiteFooter from "@/components/site/SiteFooter";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Nav />
      <main>
        <Hero />
        {/* Studio before career: the visitor asks "who is this" before
            "what have they done", and the studio answers it fastest. */}
        <Velar />
        <Career />
        <Work />
        <Cta />
      </main>
      <SiteFooter />
    </>
  );
}
