import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, MapPin, Star, ArrowUpRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import { PageHero, SectionHeading, PrimaryButton } from "@/components/UI";
import { trustItems, industries, suppliers } from "@/lib/data";

export const metadata: Metadata = { title: "Suppliers" };

export default function SuppliersPage() {
  return (
    <div className="overflow-x-hidden">
      <PageHero
        kicker="Verified Suppliers"
        title="Thousands of suppliers, one verification standard."
        description="Every supplier on FAST completes business verification and KYC before they can list. Trade with confidence, at any scale."
      />

      <section className="border-b border-line bg-bone">
        <div className="container-x py-12 sm:py-16 md:py-20">
          <SectionHeading eyebrow="Trust Layer" title="What verification covers." />
          <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-px bg-line border border-line">
            {trustItems.map((t, i) => (
              <Reveal key={t} delay={(i % 5) * 0.05}>
                <div className="bg-paper p-5 sm:p-6 h-full flex flex-col gap-3">
                  <ShieldCheck size={18} className="shrink-0" />
                  <span className="text-sm font-medium break-words">{t}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-bone">
        <div className="container-x py-14 sm:py-20 md:py-24">
          <SectionHeading
            eyebrow="Featured This Week"
            title="A sample of verified suppliers."
            description="Illustrative listings — connect a live catalog to populate this directory with your own supplier data."
          />
          <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-line border border-line">
            {suppliers.map((s, i) => (
              <Reveal key={s.slug} delay={(i % 3) * 0.05}>
                <Link
                  href={`/suppliers/${s.slug}`}
                  className="group block bg-paper p-5 sm:p-6 h-full card-hover border border-transparent flex flex-col"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 bg-ink text-paper flex items-center justify-center font-display font-bold">
                      {s.name.charAt(0)}
                    </div>
                    {s.verified && (
                      <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-mono uppercase tracking-wide border border-line px-2 py-1 whitespace-nowrap">
                        <ShieldCheck size={12} className="shrink-0" /> Verified
                      </span>
                    )}
                  </div>
                  <h3 className="mt-5 font-display font-semibold text-base sm:text-lg break-words">
                    {s.name}
                  </h3>
                  <p className="mt-1 text-sm text-smoke">{s.industry}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-ash font-mono">
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={13} className="shrink-0" /> {s.country}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Star size={13} className="shrink-0" /> {s.rating}
                    </span>
                    <span>{s.years} yrs</span>
                  </div>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest2 text-ink opacity-0 group-hover:opacity-100 transition-opacity">
                    View profile <ArrowUpRight size={13} />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper">
        <div className="container-x py-14 sm:py-20 md:py-24">
          <SectionHeading eyebrow="Coverage" title="Suppliers across every category." />
          <div className="mt-6 sm:mt-8 flex flex-wrap gap-2 sm:gap-3">
            {industries.map((ind) => (
              <span
                key={ind.slug}
                className="text-xs sm:text-sm font-medium border border-line px-3 sm:px-4 py-1.5 sm:py-2 break-words"
              >
                {ind.name}
              </span>
            ))}
          </div>
          <div className="mt-8 sm:mt-10">
            <PrimaryButton href="/sell" icon={ArrowUpRight}>
              List Your Company
            </PrimaryButton>
          </div>
        </div>
      </section>
    </div>
  );
}