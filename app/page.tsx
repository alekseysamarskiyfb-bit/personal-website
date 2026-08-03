import Image from "next/image";
import Nav from "@/components/Nav";
import Marquee from "@/components/Marquee";
import Reveal from "@/components/Reveal";
import StatCounter from "@/components/StatCounter";
import TiltCard from "@/components/TiltCard";
import JourneyItem from "@/components/JourneyItem";
import VelarBlock from "@/components/VelarBlock";
import ScrollReset from "@/components/ScrollReset";

const traits = ["Performance Creative", "Growth-minded", "Team Lead", "Reliable", "Builder"];

export default function Home() {
  return (
    <main id="top" className="font-body">
      <ScrollReset />
      <Nav />

      {/* HERO */}
      <section className="relative max-w-content mx-auto px-6 pt-16 pb-14 md:pt-20 md:pb-20 overflow-hidden">
        <div className="orb-field">
          <span className="orb orb--a" />
        </div>

        <div className="relative grid md:grid-cols-[1.15fr_0.85fr] gap-12 md:gap-16 items-center">
          <div>
            <p className="hero-eyebrow eyebrow eyebrow-signal mb-7">
              Performance Creative &amp; Growth
            </p>

            <h1 className="font-display text-5xl md:text-7xl leading-[0.98] font-semibold tracking-tight">
              <span className="hero-name-line"><span>Oleksii</span></span>
              <span className="hero-name-line"><span>Samarskyi</span></span>
            </h1>

            <p className="hero-bio mt-6 text-lg text-muted max-w-xl leading-relaxed">
              3+ years producing performance creative for paid acquisition —
              Meta, TikTok, Native, Display. Founder of{" "}
              <a href="#velar" className="text-text underline decoration-signal underline-offset-4">
                Velar Studio
              </a>.
            </p>

            <div className="hero-ctas mt-8 flex flex-wrap items-center gap-2">
              {traits.map((t) => (
                <span
                  key={t}
                  className="tag text-muted border hairline rounded-full px-3 py-1.5"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="hero-ctas mt-8 flex flex-wrap items-center gap-4">
              <a href="#journey" className="button button-primary focus-ring">
                My Journey
              </a>
              <a href="#contact" className="button button-secondary focus-ring">
                Get in Touch
              </a>
            </div>
          </div>

          <div className="hero-visual portrait-wrap relative w-full max-w-sm mx-auto md:mx-0 md:ml-auto">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border hairline">
              <Image
                src="/avatar-4k.jpeg"
                alt="Oleksii Samarskyi"
                fill
                sizes="(min-width: 768px) 380px, 90vw"
                className="portrait object-cover"
                priority
              />
              <div className="portrait-overlay absolute inset-0 pointer-events-none" />
            </div>
            <div className="portrait-badge absolute -bottom-4 left-4 md:-left-4 border hairline rounded-xl px-4 py-3">
              <p className="eyebrow">Based in</p>
              <p className="font-display text-sm font-medium">Poland · Remote</p>
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
          <Reveal>
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight">
              From ad creative
              <br />
              to growth.
            </h2>
          </Reveal>
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
      <section id="journey" className="max-w-content mx-auto px-6 py-20 md:py-28 border-t hairline">
        <Reveal>
          <p className="eyebrow eyebrow-signal mb-4">My Journey</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight mb-6 max-w-2xl">
            How I got here.
          </h2>
          <p className="text-lg text-muted max-w-xl mb-14">
            Not a resume — the actual path. Click into any year for the
            longer story.
          </p>
        </Reveal>

        <div>
          <Reveal>
            <JourneyItem
              year="2023"
              teaser="First real campaigns."
              tags={["UGC Advertising", "Motion Design"]}
            >
              I started as a Junior Performance Designer, producing static,
              video and animated creatives for Search, Sweepstakes and
              Crypto paid campaigns. No mentor telling me the rules — just a
              lot of creatives that didn&apos;t work, until some did.
            </JourneyItem>
          </Reveal>

          <Reveal>
            <JourneyItem
              year="2024"
              teaser="Learning to lead."
              tags={["Team Leadership", "Performance Marketing"]}
            >
              I was handed a team of 4 designers at ADPRODIGIES and put in
              charge of the iGaming creative pipeline. Running weekly
              reviews with media buyers taught me more about what actually
              converts than a year of solo production ever did.
            </JourneyItem>
          </Reveal>

          <Reveal>
            <JourneyItem
              year="2025"
              teaser="Scaling with AI in the pipeline."
              tags={["AI Creative", "Prompt Engineering"]}
            >
              Tools like Midjourney, Runway and HeyGen went from novelty to
              part of the daily workflow. I kept producing for affiliate and
              performance teams — Traffic Place, and a senior role producing
              creative for paid campaigns across Meta, TikTok and Display —
              while the volume and speed of what one person could ship kept
              climbing.
            </JourneyItem>
          </Reveal>

          <Reveal>
            <JourneyItem
              year="2026"
              teaser="Building something of my own."
              now
              tags={["Founder", "Velar Studio"]}
            >
              Everything up to this point — the failed creatives, the team
              lead seat, the AI-assisted pipelines — became the foundation
              for Velar Studio: a creative production venture built on
              actual production experience, not just a portfolio.
            </JourneyItem>
          </Reveal>
        </div>
      </section>

      {/* VELAR STUDIO */}
      <section id="velar" className="max-w-content mx-auto px-6 py-20 md:py-28 border-t hairline">
        <Reveal>
          <p className="eyebrow eyebrow-data mb-4">My venture</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight mb-14 max-w-2xl">
            Velar Studio
          </h2>
        </Reveal>

        <Reveal>
          <VelarBlock />
        </Reveal>
      </section>

      {/* CAPABILITIES */}
      <section id="capabilities" className="max-w-content mx-auto px-6 py-20 md:py-28 border-t hairline">
        <Reveal>
          <p className="eyebrow mb-4">Capabilities</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight mb-14 max-w-2xl">
            What I bring to a product.
          </h2>
        </Reveal>

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
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight max-w-2xl mb-6">
            Building a product?
            <br />
            Let&apos;s talk.
          </h2>
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

      <footer className="border-t hairline">
        <div className="max-w-content mx-auto px-6 py-8 flex flex-col md:flex-row justify-between gap-2 text-muted tag">
          <p>Oleksii Samarskyi — Founder, Velar Studio</p>
          <p>© 2026</p>
        </div>
      </footer>
    </main>
  );
}
