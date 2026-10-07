"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { ArrowUpRight, ArrowRight, ShieldCheck, Globe2, Search, Plus } from "lucide-react";
import Reveal from "@/components/Reveal";
import Ticker from "@/components/Ticker";
import IndustrySidebar, { IndustrySidebarMobile } from "@/components/IndustrySidebar";
import ProductSection from "@/components/ProductSection";
import TradeConfidence from "@/components/TradeConfidence";
import LogisticsPartners from "@/components/LogisticsPartners";
import {
  industries,
  buyerFeatures,
  sellerFeatures,
  whyChooseUs,
  faqs,
} from "@/lib/data";
import {
  machineryProducts,
  medicalProducts,
  electronicsProducts,
  fashionProducts,
} from "@/lib/homeProducts";
import {
  Eyebrow,
  SectionHeading,
  FeatureRow,
  StatBlock,
  PrimaryButton,
  GhostButton,
} from "@/components/UI";

// Industries removed from the homepage grid
const HIDDEN_INDUSTRY = /food|beverage/i;

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    apiRequest("/admin/dashboard")
      .then((data) => {
        console.log("BACKEND RESPONSE:", data);
      })
      .catch((error) => {
        console.log("ERROR:", error);
      });
  }, []);

  const visibleIndustries = industries.filter(
    (ind) => !HIDDEN_INDUSTRY.test(ind.slug ?? "") && !HIDDEN_INDUSTRY.test(ind.name ?? "")
  );

  // Filler cells keep the divider-grid clean when the last row is incomplete
  const n = visibleIndustries.length;
  const smFill = (2 - (n % 2)) % 2;
  const mdFill = (3 - (n % 3)) % 3;
  const lgFill = (5 - (n % 5)) % 5;

  return (
    <div className="overflow-x-hidden">
      {/* HERO */}
      <section className="relative bg-paper border-b border-line overflow-hidden">
        <div className="absolute inset-0 grid-paper opacity-[0.035] pointer-events-none" />
        {/* Ambient glow accents */}
        <div className="absolute -top-24 -right-24 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-ink/[0.04] blur-3xl pointer-events-none animate-pulse [animation-duration:6s]" />
        <div className="absolute top-1/3 -left-24 w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-ink/[0.03] blur-3xl pointer-events-none animate-pulse [animation-duration:8s]" />

        <div className="container-x relative py-14 sm:py-20 md:py-28 lg:py-32">
          {/* Mobile / tablet: horizontal industry scroller above the hero copy */}
          <IndustrySidebarMobile />

          <div className="flex flex-col lg:flex-row gap-8 sm:gap-10 lg:items-stretch">
            {/* Desktop: vertical industry sidebar */}
            <IndustrySidebar />

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-end">
              <div className="lg:col-span-8">
                <Reveal>
                  <Eyebrow>Global B2B &amp; B2C Trade Network</Eyebrow>
                </Reveal>
                <Reveal delay={0.05}>
                  <h1 className="mt-5 sm:mt-6 font-display font-bold leading-[0.95] tracking-tightest text-[clamp(2.25rem,9vw,3.75rem)] sm:text-[clamp(2.75rem,7vw,4.5rem)] md:text-7xl lg:text-8xl break-words">
                    The Global
                    <br />
                    Wholesale
                    <br />
                    Marketplace.
                  </h1>
                </Reveal>
                <Reveal delay={0.15}>
                  <p className="mt-6 sm:mt-8 text-ash text-base sm:text-lg leading-relaxed max-w-xl">
                    Buy directly from verified manufacturers, exporters, wholesalers,
                    distributors, and trusted suppliers across ten industries. Source for
                    your business or shop for personal needs — one platform, worldwide.
                  </p>
                </Reveal>
                <Reveal delay={0.25}>
                  <div className="mt-8 sm:mt-10 flex flex-wrap gap-3 sm:gap-4">
                    <PrimaryButton href="/products" icon={ArrowUpRight}>
                      Start Buying
                    </PrimaryButton>
                    <GhostButton href="/sell" icon={ArrowRight}>
                      Become a Seller
                    </GhostButton>
                  </div>
                  <div className="mt-5 sm:mt-6 flex flex-wrap gap-x-6 sm:gap-x-8 gap-y-2 text-sm text-ash">
                    <Link
                      href="/industries"
                      className="underline underline-offset-4 decoration-line hover:decoration-ink hover:text-ink transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
                    >
                      Browse Categories
                    </Link>
                  </div>
                </Reveal>

                {/* Stat strip for mobile/tablet — mirrors the desktop panel so stats never disappear below lg */}
                <Reveal delay={0.3}>
                  <div className="mt-9 sm:mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 border-t border-line pt-6 lg:hidden">
                    <StatBlock value="9.6M" label="Products" />
                    <StatBlock value="182K+" label="Suppliers" />
                    <StatBlock value="190" label="Countries" />
                    <StatBlock value="10" label="Industries" />
                  </div>
                </Reveal>
              </div>

              <div className="lg:col-span-4 hidden lg:block">
                <Reveal delay={0.3}>
                  <div className="border border-ink p-6 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-0.5">
                    <div className="grid grid-cols-2 gap-6">
                      <StatBlock value="9.6M" label="Products" />
                      <StatBlock value="182K+" label="Suppliers" />
                      <StatBlock value="190" label="Countries" />
                      <StatBlock value="10" label="Industries" />
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Ticker />

      {/* ABOUT STRIP */}
      <section className="bg-paper border-b border-line">
        <div className="container-x py-12 sm:py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-10">
            <div className="md:col-span-4">
              <Reveal>
                <Eyebrow>About FAST</Eyebrow>
                <h2 className="mt-4 font-display font-bold text-xl sm:text-2xl md:text-3xl tracking-tightest">
                  One platform for global trade.
                </h2>
              </Reveal>
            </div>
            <div className="md:col-span-8">
              <Reveal delay={0.1}>
                <p className="text-ash leading-relaxed text-sm sm:text-base md:text-lg">
                  FAST Global Marketplace is an international digital marketplace designed to
                  connect manufacturers, suppliers, wholesalers, distributors, retailers, and
                  consumers through one secure platform. We simplify international sourcing,
                  wholesale purchasing, retail shopping, logistics, secure payments, and
                  business networking — making global trade faster, safer, and more
                  transparent for businesses of every size.
                </p>
              </Reveal>
              <div className="mt-6 sm:mt-8 flex flex-wrap gap-x-6 gap-y-3 sm:gap-8">
                <Reveal delay={0.15}>
                  <div className="group flex items-center gap-2 text-sm text-ash transition-colors duration-200 hover:text-ink">
                    <ShieldCheck
                      size={18}
                      className="shrink-0 transition-transform duration-200 group-hover:scale-110"
                    />
                    Trade Assurance
                  </div>
                </Reveal>
                <Reveal delay={0.2}>
                  <div className="group flex items-center gap-2 text-sm text-ash transition-colors duration-200 hover:text-ink">
                    <Globe2
                      size={18}
                      className="shrink-0 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-12"
                    />
                    190 Countries
                  </div>
                </Reveal>
                <Reveal delay={0.25}>
                  <div className="group flex items-center gap-2 text-sm text-ash transition-colors duration-200 hover:text-ink">
                    <Search
                      size={18}
                      className="shrink-0 transition-transform duration-200 group-hover:scale-110"
                    />
                    Product Search
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INDUSTRIES */}
      <section className="border-b border-line bg-bone">
        <div className="container-x py-14 sm:py-20 md:py-28">
          <div className="flex items-end justify-between flex-wrap gap-4 sm:gap-6 mb-10 sm:mb-14">
            <SectionHeading
              eyebrow="Sourcing Categories"
              title="Ten industries, one marketplace."
              description="From components to finished goods, find verified suppliers organized by the categories that matter to your business."
            />
            <Link
              href="/industries"
              className="hidden md:inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4 decoration-line hover:decoration-ink transition-colors duration-200 group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
            >
              View all industries
              <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-px bg-line border border-line">
            {visibleIndustries.map((ind, i) => (
              <Reveal key={ind.slug} delay={(i % 5) * 0.05}>
                <Link
                  href={`/industries/${ind.slug}`}
                  className="group block bg-paper p-5 sm:p-6 h-full card-hover border border-transparent transition-all duration-300 hover:border-ink/15 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(0,0,0,0.05)] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ink"
                >
                  <span className="idx text-xs text-smoke transition-colors duration-200 group-hover:text-ink">
                    {ind.code}
                  </span>
                  <h3 className="mt-4 font-display font-semibold text-base sm:text-lg tracking-tight">
                    {ind.name}
                  </h3>
                  <p className="mt-2 text-sm text-ash leading-relaxed">{ind.blurb}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest2 text-ink opacity-0 translate-x-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200">
                    Explore <ArrowUpRight size={13} />
                  </span>
                </Link>
              </Reveal>
            ))}

            {/* Filler cells (decorative) so the last row has no gray gaps */}
            {Array.from({ length: smFill }).map((_, k) => (
              <div key={`sf-${k}`} aria-hidden className="hidden sm:block md:hidden bg-paper" />
            ))}
            {Array.from({ length: mdFill }).map((_, k) => (
              <div key={`mf-${k}`} aria-hidden className="hidden md:block lg:hidden bg-paper" />
            ))}
            {Array.from({ length: lgFill }).map((_, k) => (
              <div key={`lf-${k}`} aria-hidden className="hidden lg:block bg-paper" />
            ))}
          </div>

          <div className="mt-6 sm:mt-8 md:hidden">
            <GhostButton href="/industries" icon={ArrowRight}>
              View all industries
            </GhostButton>
          </div>
        </div>
      </section>

      {/* INDUSTRY PRODUCT SECTIONS */}
      <ProductSection
        eyebrow="Machinery"
        title="Top Picks in Machinery"
        description="Industrial equipment and machine tools from verified manufacturers."
        products={machineryProducts}
        viewAllHref="/industries/industrial-machinery"
      />

      <ProductSection
        eyebrow="Medical"
        title="Recommended Medical Supplies"
        description="Devices and consumables sourced from trusted medical suppliers."
        products={medicalProducts}
        viewAllHref="/industries/medical"
      />

      <ProductSection
        eyebrow="Electronics"
        title="Trending Electronics"
        description="Consumer and industrial electronics moving fastest this week."
        products={electronicsProducts}
        viewAllHref="/industries/electronics"
      />

      <ProductSection
        eyebrow="Fashion"
        title="Popular Fashion"
        description="Apparel and accessories from garment manufacturers worldwide."
        products={fashionProducts}
        viewAllHref="/industries/fashion"
      />

      {/* BUYER / SELLER FEATURES */}
      <section className="bg-paper border-b border-line">
        <div className="container-x py-14 sm:py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16">
            <Reveal>
              <div className="h-full p-6 sm:p-8 border border-line transition-all duration-300 hover:border-ink/20 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
                <Eyebrow>For Buyers</Eyebrow>
                <h3 className="mt-4 font-display font-bold text-xl sm:text-2xl md:text-3xl tracking-tightest mb-5 sm:mb-6">
                  Source with confidence.
                </h3>
                <ul>
                  {buyerFeatures.map((f) => (
                    <FeatureRow key={f} label={f} />
                  ))}
                </ul>
                <div className="mt-6 sm:mt-8">
                  <GhostButton href="/products" icon={ArrowRight}>
                    Start Buying
                  </GhostButton>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="h-full p-6 sm:p-8 border border-line transition-all duration-300 hover:border-ink/20 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
                <Eyebrow>For Sellers</Eyebrow>
                <h3 className="mt-4 font-display font-bold text-xl sm:text-2xl md:text-3xl tracking-tightest mb-5 sm:mb-6">
                  Sell to the world.
                </h3>
                <ul>
                  {sellerFeatures.map((f) => (
                    <FeatureRow key={f} label={f} />
                  ))}
                </ul>
                <div className="mt-6 sm:mt-8">
                  <GhostButton href="/sell" icon={ArrowRight}>
                    Become a Seller
                  </GhostButton>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* TRADE WITH CONFIDENCE */}
      <TradeConfidence />

      {/* LOGISTICS PARTNERS */}
      <LogisticsPartners />

      {/* WHY CHOOSE US */}
      <section className="bg-paper border-b border-line">
        <div className="container-x py-14 sm:py-20 md:py-28">
          <Reveal>
            <SectionHeading
              eyebrow="Why FAST"
              title="Why businesses choose us."
              align="center"
            />
          </Reveal>
          <div className="mt-10 sm:mt-14 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
            {whyChooseUs.map((w, i) => (
              <Reveal key={w} delay={(i % 5) * 0.05} className="text-center">
                <div className="group transition-transform duration-300 hover:-translate-y-1">
                  <div className="font-mono text-xs text-smoke mb-2 sm:mb-3 transition-colors duration-200 group-hover:text-ink">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <p className="text-xs sm:text-sm font-medium leading-snug">{w}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ PREVIEW */}
      <section className="border-b border-line bg-bone">
        <div className="container-x py-14 sm:py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12">
            <div className="lg:col-span-4">
              <Reveal>
                <SectionHeading eyebrow="Answers" title="Frequently asked." />
                <div className="mt-6 sm:mt-8">
                  <GhostButton href="/faq" icon={ArrowRight}>
                    View all FAQs
                  </GhostButton>
                </div>
              </Reveal>
            </div>
            <div className="lg:col-span-8">
              {faqs.slice(0, 4).map((f, i) => {
                const isOpen = openFaq === i;
                return (
                  <Reveal key={f.q} delay={i * 0.05}>
                    <div className="border-b border-line">
                      <button
                        type="button"
                        id={`faq-btn-${i}`}
                        aria-expanded={isOpen}
                        aria-controls={`faq-panel-${i}`}
                        onClick={() => setOpenFaq(isOpen ? null : i)}
                        className="group w-full py-5 sm:py-6 flex items-start justify-between gap-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                      >
                        <h4 className="font-display font-semibold text-base sm:text-lg transition-colors duration-200 group-hover:text-ink">
                          {f.q}
                        </h4>

                        <Plus
                          size={16}
                          className={`shrink-0 mt-1 transition-all duration-300 ${
                            isOpen ? "rotate-45 text-ink" : "text-smoke group-hover:text-ink"
                          }`}
                        />
                      </button>

                      {/* Smooth expand/collapse without extra dependencies */}
                      <div
                        id={`faq-panel-${i}`}
                        role="region"
                        aria-labelledby={`faq-btn-${i}`}
                        className={`grid transition-all duration-300 ease-out ${
                          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <p className="pb-5 sm:pb-6 text-sm sm:text-base text-ash leading-relaxed">
                            {f.a}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative bg-paper overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 sm:w-[28rem] sm:h-[28rem] rounded-full bg-ink/[0.04] blur-3xl pointer-events-none animate-pulse [animation-duration:7s]" />
        <div className="absolute bottom-0 right-0 w-56 h-56 sm:w-72 sm:h-72 rounded-full bg-ink/[0.03] blur-3xl pointer-events-none" />
        <div className="container-x relative py-14 sm:py-20 md:py-28 text-center">
          <Reveal>
            <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-5xl tracking-tightest max-w-3xl mx-auto">
              Ready to trade on your terms?
            </h2>
            <p className="mt-4 sm:mt-5 text-ash text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
              Join thousands of verified suppliers and buyers already trading on FAST
              Global Marketplace.
            </p>
            <div className="mt-7 sm:mt-9 flex flex-wrap gap-3 sm:gap-4 justify-center">
              <PrimaryButton href="/products" icon={ArrowUpRight}>
                Start Buying
              </PrimaryButton>
              <GhostButton href="/sell" icon={ArrowRight}>
                Become a Seller
              </GhostButton>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}