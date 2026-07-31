import Link from "next/link";
import { ArrowUpRight, ArrowRight, ShieldCheck, Globe2, Search } from "lucide-react";
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
  marketplaceFeatures,
  whyChooseUs,
  faqs,
} from "@/lib/data";
import {
  machineryProducts,
  medicalProducts,
  electronicsProducts,
  fashionProducts,
  homeFurnitureProducts,
} from "@/lib/homeProducts";
import {
  Eyebrow,
  SectionHeading,
  FeatureRow,
  StatBlock,
  PrimaryButton,
  GhostButton,
} from "@/components/UI";

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      {/* HERO */}
      <section className="relative bg-paper border-b border-line overflow-hidden">
        <div className="absolute inset-0 grid-paper opacity-[0.035] pointer-events-none" />
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
                    <Link href="/contact" className="underline underline-offset-4 hover:text-ink">
                      Request Quotation
                    </Link>
                    <Link href="/industries" className="underline underline-offset-4 hover:text-ink">
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
                  <div className="border border-ink p-6">
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
              <Eyebrow>About FAST</Eyebrow>
              <h2 className="mt-4 font-display font-bold text-xl sm:text-2xl md:text-3xl tracking-tightest">
                One platform for global trade.
              </h2>
            </div>
            <div className="md:col-span-8">
              <p className="text-ash leading-relaxed text-sm sm:text-base md:text-lg">
                FAST Global Marketplace is an international digital marketplace designed to
                connect manufacturers, suppliers, wholesalers, distributors, retailers, and
                consumers through one secure platform. We simplify international sourcing,
                wholesale purchasing, retail shopping, logistics, secure payments, and
                business networking — making global trade faster, safer, and more
                transparent for businesses of every size.
              </p>
              <div className="mt-6 sm:mt-8 flex flex-wrap gap-x-6 gap-y-3 sm:gap-8">
                <div className="flex items-center gap-2 text-sm text-ash">
                  <ShieldCheck size={18} className="shrink-0" /> Trade Assurance
                </div>
                <div className="flex items-center gap-2 text-sm text-ash">
                  <Globe2 size={18} className="shrink-0" /> 190 Countries
                </div>
                <div className="flex items-center gap-2 text-sm text-ash">
                  <Search size={18} className="shrink-0" /> AI Product Search
                </div>
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
              className="hidden md:inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4"
            >
              View all industries <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-px bg-line border border-line">
            {industries.map((ind, i) => (
              <Reveal key={ind.slug} delay={(i % 5) * 0.05}>
                <Link
                  href={`/industries/${ind.slug}`}
                  className="group block bg-paper p-5 sm:p-6 h-full card-hover border border-transparent"
                >
                  <span className="idx text-xs text-smoke">{ind.code}</span>
                  <h3 className="mt-4 font-display font-semibold text-base sm:text-lg tracking-tight">
                    {ind.name}
                  </h3>
                  <p className="mt-2 text-sm text-ash leading-relaxed">{ind.blurb}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest2 text-ink opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore <ArrowUpRight size={13} />
                  </span>
                </Link>
              </Reveal>
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
        viewAllHref="/industries/machinery"
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

      <ProductSection
        eyebrow="Home & Furniture"
        title="Home & Furniture Essentials"
        description="Furniture, decor, and household goods for every space."
        products={homeFurnitureProducts}
        viewAllHref="/industries/home-furniture"
      />

      {/* BUYER / SELLER FEATURES */}
      <section className="bg-paper border-b border-line">
        <div className="container-x py-14 sm:py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16">
            <Reveal>
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
            </Reveal>

            <Reveal delay={0.1}>
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
            </Reveal>
          </div>
        </div>
      </section>

      {/* MARKETPLACE FEATURES */}
      <section className="border-b border-line bg-ink text-paper">
        <div className="container-x py-14 sm:py-20 md:py-28">
          <SectionHeading
            eyebrow="Marketplace Intelligence"
            title="Built with AI at the core."
            description="Discovery, negotiation, and merchandising tools that help the right buyers find the right suppliers, faster."
          />
          <div className="mt-10 sm:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-paper/15">
            {marketplaceFeatures.map((f, i) => (
              <Reveal key={f} delay={(i % 4) * 0.05}>
                <div className="bg-ink p-5 sm:p-6 h-full">
                  <span className="idx text-xs text-smoke">{String(i + 1).padStart(2, "0")}</span>
                  <p className="mt-3 font-medium text-sm sm:text-base">{f}</p>
                </div>
              </Reveal>
            ))}
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
          <SectionHeading
            eyebrow="Why FAST"
            title="Why businesses choose us."
            align="center"
          />
          <div className="mt-10 sm:mt-14 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
            {whyChooseUs.map((w, i) => (
              <Reveal key={w} delay={(i % 5) * 0.05} className="text-center">
                <div className="font-mono text-xs text-smoke mb-2 sm:mb-3">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <p className="text-xs sm:text-sm font-medium leading-snug">{w}</p>
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
              <SectionHeading eyebrow="Answers" title="Frequently asked." />
              <div className="mt-6 sm:mt-8">
                <GhostButton href="/faq" icon={ArrowRight}>
                  View all FAQs
                </GhostButton>
              </div>
            </div>
            <div className="lg:col-span-8">
              {faqs.slice(0, 4).map((f, i) => (
                <Reveal key={f.q} delay={i * 0.05}>
                  <div className="py-5 sm:py-6 border-b border-line">
                    <h4 className="font-display font-semibold text-base sm:text-lg">{f.q}</h4>
                    <p className="mt-2 text-sm sm:text-base text-ash leading-relaxed">{f.a}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-paper">
        <div className="container-x py-14 sm:py-20 md:py-28 text-center">
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