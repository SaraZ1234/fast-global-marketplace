import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import { PageHero, SectionHeading, FeatureRow, PrimaryButton, StatBlock } from "@/components/UI";
import { sellerFeatures } from "@/lib/data";

export const metadata: Metadata = { title: "Become a Seller" };

const steps = [
  { step: "01", title: "Register", body: "Create your account and select your primary industry." },
  { step: "02", title: "Verify", body: "Complete business verification and KYC to earn your badge." },
  { step: "03", title: "List", body: "Build your company profile and upload your product catalog." },
  { step: "04", title: "Sell", body: "Receive RFQs and orders from buyers around the world." },
];

export default function SellPage() {
  return (
    <div className="overflow-x-hidden">
      <PageHero
        kicker="Become a Seller"
        title="Put your catalog in front of global buyers."
        description="List once and reach B2B and B2C buyers across 190 countries, with tools for inventory, orders, and advertising built in."
      />

      <section className="border-b border-line bg-bone">
        <div className="container-x py-10 sm:py-14 md:py-16">
          <Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:divide-x md:divide-line">
              <div className="md:pl-8 first:md:pl-0">
                <StatBlock value="182K+" label="Active Sellers" />
              </div>
              <div className="md:pl-8">
                <StatBlock value="9.6M" label="Live Listings" />
              </div>
              <div className="md:pl-8">
                <StatBlock value="64.2K" label="Monthly RFQs" />
              </div>
              <div className="md:pl-8">
                <StatBlock value="190" label="Buyer Countries" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="container-x py-12 sm:py-16 md:py-24">
          <SectionHeading eyebrow="Onboarding" title="Four steps to your first order." />
          <div className="mt-10 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-line border border-line">
            {steps.map((s, i) => (
              <Reveal key={s.step} delay={i * 0.05}>
                <div className="relative bg-paper p-6 sm:p-7 h-full transition-colors duration-300 hover:bg-bone">
                  <span className="idx text-xs text-smoke">{s.step}</span>
                  <h3 className="mt-4 font-display font-semibold text-base sm:text-lg">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm text-ash leading-relaxed">{s.body}</p>
                  {i < steps.length - 1 && (
                    <span
                      aria-hidden
                      className="hidden lg:block absolute top-6 right-0 translate-x-1/2 text-smoke/40 text-lg font-display"
                    >
                      →
                    </span>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="container-x py-12 sm:py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-14 items-start">
            <Reveal>
              <SectionHeading
                eyebrow="Seller Toolkit"
                title="Everything you need to run your storefront."
              />
            </Reveal>
            <Reveal delay={0.1}>
              <ul>
                {sellerFeatures.map((f) => (
                  <FeatureRow key={f} label={f} />
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="motion-safe:animate-pulse pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-ink/[0.06] blur-3xl"
        />
        <div className="container-x relative py-14 sm:py-20 md:py-24 text-center">
          <Reveal>
            <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl tracking-tightest">
              List your first product today.
            </h2>
            <div className="mt-7 sm:mt-9 flex justify-center gap-4">
              <PrimaryButton href="/pricing" icon={ArrowUpRight}>
                View Membership Plans
              </PrimaryButton>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}