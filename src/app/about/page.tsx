import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { PageHero, SectionHeading, StatBlock, Eyebrow, PrimaryButton, GhostButton } from "@/components/UI";
import { whyChooseUs } from "@/lib/data";
import {
  ArrowUpRight,
  ArrowRight,
  ShieldCheck,
  Globe2,
  Users,
  TrendingUp,
  Zap,
  Award,
  Lock,
  Truck,
  HeartHandshake,
  Clock3,
  CalendarCheck,
  Boxes,
  MapPin,
} from "lucide-react";

export const metadata: Metadata = { title: "About" };

const timeline = [
  { year: "2016", label: "Founded as a regional B2B directory." },
  { year: "2019", label: "Launched cross-border Trade Assurance." },
  { year: "2022", label: "Expanded to B2C retail and consumer categories." },
  { year: "2026", label: "AI-powered search and recommendations across 10 industries." },
];

// Icon pool cycled by index — gives each "Why FAST" tile a visual anchor
// without needing to touch the underlying whyChooseUs string array.
const whyIcons = [ShieldCheck, Zap, Globe2, Users, TrendingUp, Award, Lock, Truck, HeartHandshake, Clock3];

export default function AboutPage() {
  const currentYear = timeline[timeline.length - 1].year;

  return (
    <div className="overflow-x-hidden">
      <PageHero
        kicker="About FAST"
        title="Making global trade faster, safer, and more transparent."
        description="FAST Global Marketplace connects manufacturers, suppliers, wholesalers, distributors, retailers, and consumers through one secure platform."
      />

      {/* Breadcrumb */}
      <div className="container-x pt-6 sm:pt-8 hidden sm:block">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest2 text-smoke">
            <li>
              <Link href="/" className="hover:text-ink transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-ink">About</li>
          </ol>
        </nav>
      </div>

      <section className="border-b border-line bg-bone">
        <div className="container-x py-8 sm:py-16 md:py-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:divide-x md:divide-line">
            {[
              { icon: CalendarCheck, value: "2016", label: "Founded" },
              { icon: Globe2, value: "190", label: "Countries" },
              { icon: Users, value: "182K+", label: "Suppliers" },
              { icon: Boxes, value: "9.6M", label: "Products" },
            ].map((stat, idx) => (
              <Reveal key={stat.label} delay={idx * 0.06}>
                <div className={`md:pl-8 ${idx === 0 ? "first:md:pl-0" : ""}`}>
                  <stat.icon size={15} className="text-smoke mb-1.5 sm:mb-2 shrink-0" />
                  <StatBlock value={stat.value} label={stat.label} />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-paper">
        <div className="container-x py-10 sm:py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-14">
            <Reveal>
              <Eyebrow>Our Mission</Eyebrow>
              <h2 className="mt-4 font-display font-bold text-lg sm:text-2xl md:text-3xl tracking-tightest break-words">
                One trusted layer between every buyer and seller.
              </h2>
              <p className="mt-5 sm:mt-6 text-ash text-xs sm:text-base leading-relaxed">
                We simplify international sourcing, wholesale purchasing, retail shopping,
                logistics, secure payments, and business networking. Whether you are a
                factory shipping a container a week or a shopper placing a single order,
                FAST is built to make the transaction simple and the trust automatic.
              </p>

              {/* Trust badge row */}
              <div className="mt-6 sm:mt-7 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono uppercase tracking-wide text-emerald-700 border border-line px-2 py-1">
                  <ShieldCheck size={12} className="text-emerald-600 shrink-0" /> Trade Assurance
                </span>
                <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono uppercase tracking-wide text-smoke border border-line px-2 py-1">
                  <Lock size={12} className="shrink-0" /> Secure Payments
                </span>
                <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono uppercase tracking-wide text-smoke border border-line px-2 py-1">
                  <Globe2 size={12} className="shrink-0" /> 190 Countries
                </span>
              </div>
            </Reveal>

            <div>
              <Reveal delay={0.1}>
                <Eyebrow>Timeline</Eyebrow>
              </Reveal>
              <ol className="mt-4 relative">
                {timeline.map((t, i) => (
                  <Reveal key={t.year} delay={0.12 + i * 0.07}>
                    <li className="relative flex gap-3 sm:gap-6 py-4 sm:py-5 border-b border-line last:border-b-0">
                      <div className="flex flex-col items-center shrink-0 w-11 sm:w-14">
                        <span className="idx text-[11px] sm:text-sm text-smoke font-medium flex items-center gap-1">
                          {t.year}
                        </span>
                        {i < timeline.length - 1 && (
                          <span className="mt-2 flex-1 w-px bg-line" aria-hidden />
                        )}
                      </div>
                      <div className="min-w-0 pb-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs sm:text-sm leading-relaxed break-words">{t.label}</span>
                          {t.year === currentYear && (
                            <span className="text-[9px] font-mono uppercase tracking-wide text-emerald-700 border border-line px-1.5 py-0.5 shrink-0">
                              Today
                            </span>
                          )}
                        </div>
                      </div>
                    </li>
                  </Reveal>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-bone">
        <div className="container-x py-10 sm:py-16 md:py-24">
          <SectionHeading
            eyebrow="Why FAST"
            title="What sets the platform apart."
            align="center"
          />
          <div className="mt-8 sm:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px bg-line border border-line">
            {whyChooseUs.map((w, i) => {
              const Icon = whyIcons[i % whyIcons.length];
              return (
                <Reveal key={w} delay={(i % 5) * 0.05}>
                  <div className="group bg-paper p-5 sm:p-6 h-full flex flex-col items-center text-center gap-3 transition-all duration-300 hover:bg-bone hover:-translate-y-0.5 hover:shadow-sm">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 flex items-center justify-center border border-line transition-colors duration-300 group-hover:border-ink group-hover:bg-ink">
                      <Icon
                        size={16}
                        className="text-smoke transition-colors duration-300 group-hover:text-paper"
                      />
                    </div>
                    <div className="font-mono text-[10px] sm:text-xs text-smoke">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    <p className="text-xs sm:text-sm font-medium leading-snug break-words">{w}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Global presence strip */}
      <section className="border-b border-line bg-ink text-paper">
        <div className="container-x py-10 sm:py-14 md:py-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 sm:gap-8">
            <Reveal>
              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-paper/60 shrink-0" />
                <div>
                  <p className="font-display font-bold text-lg sm:text-xl tracking-tightest">
                    Built for global reach.
                  </p>
                  <p className="mt-1 text-xs sm:text-sm text-paper/60 max-w-md">
                    Buyers and suppliers transact across every major trade corridor, backed
                    by local support teams and regional payment rails.
                  </p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="flex gap-6 sm:gap-8 shrink-0">
                <div className="text-center sm:text-left">
                  <p className="font-display font-bold text-xl sm:text-2xl tracking-tightest">190</p>
                  <p className="mt-1 text-[10px] sm:text-xs font-mono uppercase tracking-widest2 text-paper/60">
                    Countries
                  </p>
                </div>
                <div className="text-center sm:text-left">
                  <p className="font-display font-bold text-xl sm:text-2xl tracking-tightest">24/7</p>
                  <p className="mt-1 text-[10px] sm:text-xs font-mono uppercase tracking-widest2 text-paper/60">
                    Support
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="relative bg-paper overflow-hidden">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 left-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-ink/[0.04] rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-24 right-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-ink/[0.03] rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        </div>

        <div className="container-x py-14 sm:py-20 md:py-24 text-center relative">
          <Reveal>
            <SectionHeading
              eyebrow="Join FAST"
              title="Start sourcing or start selling today."
              align="center"
            />
            <div className="mt-7 sm:mt-8 flex flex-wrap justify-center gap-3 sm:gap-4">
              <PrimaryButton href="/products" icon={ArrowUpRight}>
                Browse Products
              </PrimaryButton>
              <GhostButton href="/contact" icon={ArrowRight}>
                Talk to Sales
              </GhostButton>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}