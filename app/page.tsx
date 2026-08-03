import Nav from "@/components/Nav";
import Marquee from "@/components/Marquee";
import Reveal from "@/components/Reveal";
import StatCounter from "@/components/StatCounter";
import TiltCard from "@/components/TiltCard";
import VelarBlock from "@/components/VelarBlock";
import ScrollReset from "@/components/ScrollReset";
import JourneyTimeline from "@/components/JourneyTimeline";
import Portfolio from "@/components/Portfolio";
import Footer from "@/components/Footer";
import HeroPortrait from "@/components/HeroPortrait";
import SmoothScroll from "@/components/SmoothScroll";
import TextReveal from "@/components/TextReveal";

const traits = ["Performance Creative", "Growth-minded", "Team Lead", "Reliable", "Builder"];

export default function Home() {
  return (
    <main id="top" className="font-body">
      <ScrollReset />
      <SmoothScroll />
      <Nav />

      {/* HERO */}
      <section className="hero-shell relative overflow-hidden px-6">
        <p aria-hidden className="hero-bigname grad-text">
          OLEKSII
        </p>

        <div className="relative z-10 max-w-content mx-auto w-full pb-8">
          <div className="hero-portrait-frame">
            <div className="hero-portrait-glow" />
            <HeroPortrait />
            <div className="hero-portrait-fade" />

            {/* Floating cards — left */}
            <div
              className="hero-float-card glass rounded-2xl px-4 py-3 md:px-5 md:py-4 md:absolute md:left-0 lg:left-4 md:top-[42%] hidden md:block"
              style={{ animationDelay: "0.5s" }}
            >
              <p className="font-display text-3xl font-semibold tracking-tight leading-none">
                3<span className="text-signal">+</span>
              </p>
              <p className="eyebrow mt-1.5 whitespace-nowrap">Years in performance creative</p>
            </div>
            <div
              className="hero-float-card glass rounded-2xl px-4 py-3 md:px-5 md:py-4 md:absolute md:left-0 lg:left-4 md:top-[62%] hidden md:block"
              style={{ animationDelay: "0.65s" }}
            >
              <p className="font-display text-3xl font-semibold tracking-tight leading-none">
                10<span className="text-signal">+</span>
              </p>
              <p className="eyebrow mt-1.5 whitespace-nowrap">Platforms &amp; AI tools</p>
            </div>

            {/* Floating traits card — right */}
            <div
              className="hero-float-card glass rounded-2xl px-4 py-3 md:px-5 md:py-4 md:absolute md:right-0 lg:right-4 md:top-[38%] hidden md:block"
              style={{ animationDelay: "0.8s" }}
            >
              {traits.map((t) => (
                <div key={t} className="hero-trait-row">
                  <span className="hero-trait-dot" />
                  <span className="tag text-text whitespace-nowrap">{t}</span>
                </div>
              ))}
            </div>

            {/* Headline overlay — sits on the portrait like the reference */}
            <div className="hero-overlay">
              <h1 className="font-display text-[2.9rem] md:text-7xl lg:text-8xl leading-[0.92] font-bold tracking-tight">
                <span className="hero-name-line block"><span>Performance creative,</span></span>
                <span className="hero-name-line block"><span>built to convert.</span></span>
              </h1>

              <div className="hero-ctas mt-7 flex flex-wrap items-center justify-center gap-3">
                <a href="#journey" className="button button-primary focus-ring">
                  My Journey
                </a>
                <a href="#contact" className="button button-secondary focus-ring">
                  Get in Touch
                </a>
              </div>
            </div>

            {/* Ground row — reads over the bottom of the portrait */}
            <div className="hero-ground hero-bio">
              <p className="text-muted text-sm leading-relaxed max-w-[13rem] hidden md:block">
                Oleksii Samarskyi.
                <br />
                Poland · Remote.
              </p>
              <p className="eyebrow eyebrow-signal">
                Performance Creative &amp; Growth
              </p>
              <p className="text-muted text-sm leading-relaxed max-w-[17rem] text-right hidden md:block">
                3+ years of static, motion &amp; AI-assisted creative for paid
                acquisition. Founder of{" "}
                <a href="#velar" className="text-text underline decoration-signal underline-offset-4">
                  Velar Studio
                </a>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Marquee />

      {/* STATS */}
      <section className="max-w-content mx-auto px-6 py-12 md:py-16 border-b hairline">
        <div className="stats-grid grid grid-cols-2 md:grid-cols-4 overflow-hidden rounded-2xl border hairline bg-line">
          <Reveal className="stat-card">
            <StatCounter value={3} suffix="+" label="Years in performance creative" />
          </Reveal>
          <Reveal delay={80} className="stat-card">
            <StatCounter value={4} label="Designers led" />
          </Reveal>
          <Reveal delay={160} className="stat-card">
            <StatCounter value={10} suffix="+" label="Platforms & AI tools" />
          </Reveal>
          <Reveal delay={240} className="stat-card">
            <StatCounter value={1} label="Studio founded — Velar" />
          </Reveal>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="max-w-content mx-auto px-6 py-20 md:py-28">
        <Reveal>
          <p className="eyebrow mb-4">About</p>
        </Reveal>
        <div className="grid md:grid-cols-[1fr_1.4fr] gap-10">
          <TextReveal className="font-display text-3xl md:text-5xl font-bold tracking-tight">
            From ad creative to growth.
          </TextReveal>
          <Reveal delay={100} className="space-y-5 text-muted text-lg leading-relaxed">
            <p>
              I started as a designer — UI/UX, branding, logo and identity
              work, creative direction. That background is still the base
              of everything I do: I think in systems, not just screens.
            </p>
            <p>
              For the past 3+ years I&apos;ve worked inside performance
              marketing — producing static, motion and AI-assisted
              creatives for paid acquisition on Meta, TikTok, Native and
              Display, running A/B-tests alongside media buyers, and
              leading a team of designers through that process. That&apos;s
              where design and growth actually meet: not in theory, in the
              daily loop of create → test → read the numbers → iterate.
            </p>
            <p>
              That same loop is what I&apos;m now building into{" "}
              <a href="#velar" className="text-text underline decoration-signal underline-offset-4">
                Velar Studio
              </a>
              , my own creative production venture.
            </p>
          </Reveal>
        </div>
      </section>

      {/* JOURNEY */}
      <JourneyTimeline />

      {/* PORTFOLIO */}
      <Portfolio />

      {/* VELAR STUDIO */}
      <section id="velar" className="max-w-content mx-auto px-6 py-20 md:py-28 border-t hairline">
        <Reveal>
          <p className="eyebrow eyebrow-data mb-4">My venture</p>
        </Reveal>
        <TextReveal className="font-display text-3xl md:text-5xl font-bold tracking-tight mb-14 max-w-2xl">
          Velar Studio
        </TextReveal>

        <Reveal>
          <VelarBlock />
        </Reveal>
      </section>

      {/* CAPABILITIES */}
      <section id="capabilities" className="max-w-content mx-auto px-6 py-20 md:py-28 border-t hairline">
        <Reveal>
          <p className="eyebrow mb-4">Capabilities</p>
        </Reveal>
        <TextReveal className="font-display text-3xl md:text-5xl font-bold tracking-tight mb-14 max-w-2xl">
          What I bring to a product.
        </TextReveal>

        <div className="grid md:grid-cols-3 gap-6">
          <Reveal>
            <TiltCard className="bg-ink-2 border hairline rounded-2xl p-6 md:p-7 h-full">
              <div className="flex items-center justify-between mb-6">
                <p className="eyebrow eyebrow-signal">Growth & performance</p>
                <span className="tag text-muted">01</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  "Growth audits & analytics",
                  "A/B testing with media buyers",
                  "Paid acquisition — Meta, TikTok, Google",
                  "SEO",
                ].map((t) => (
                  <span
                    key={t}
                    className="tag text-muted border hairline rounded-full px-3 py-1.5 transition-colors duration-300 hover:text-text hover:border-signal/50"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </TiltCard>
          </Reveal>

          <Reveal delay={80}>
            <TiltCard className="bg-ink-2 border hairline rounded-2xl p-6 md:p-7 h-full">
              <div className="flex items-center justify-between mb-6">
                <p className="eyebrow eyebrow-data">Brand & creative</p>
                <span className="tag text-muted">02</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  "Logo & brand identity",
                  "Static, motion & AI-assisted ad creatives",
                  "Creative direction",
                  "Midjourney",
                  "Runway",
                  "HeyGen",
                  "After Effects",
                ].map((t) => (
                  <span
                    key={t}
                    className="tag text-muted border hairline rounded-full px-3 py-1.5 transition-colors duration-300 hover:text-text hover:border-signal/50"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </TiltCard>
          </Reveal>

          <Reveal delay={160}>
            <TiltCard className="bg-ink-2 border hairline rounded-2xl p-6 md:p-7 h-full">
              <div className="flex items-center justify-between mb-6">
                <p className="eyebrow">Product & team</p>
                <span className="tag text-muted">03</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {["UI/UX design", "Design systems", "Leading creative teams"].map(
                  (t) => (
                    <span
                      key={t}
                      className="tag text-muted border hairline rounded-full px-3 py-1.5 transition-colors duration-300 hover:text-text hover:border-signal/50"
                    >
                      {t}
                    </span>
                  )
                )}
              </div>
            </TiltCard>
          </Reveal>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="relative max-w-content mx-auto px-6 py-20 md:py-28 border-t hairline overflow-hidden">
        <div className="orb-field">
          <span className="orb orb--c" />
        </div>
        <Reveal className="relative">
          <p className="eyebrow mb-4">Contact</p>
          <TextReveal className="font-display text-3xl md:text-5xl font-bold tracking-tight max-w-2xl mb-6">
            Building a product? Let&apos;s talk.
          </TextReveal>
          <p className="text-lg text-muted max-w-xl mb-10">
            Open to conversations about growth, brand and creative — for my
            own work or for Velar Studio.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="mailto:oleksii.samarskyii@gmail.com"
              className="button button-primary focus-ring"
            >
              oleksii.samarskyii@gmail.com
            </a>
            <a
              href="https://www.linkedin.com/in/oleksii-samarskyi"
              target="_blank"
              rel="noopener noreferrer"
              className="button button-secondary focus-ring"
            >
              LinkedIn
            </a>
          </div>
        </Reveal>
      </section>

      <Footer />
    </main>
  );
}
