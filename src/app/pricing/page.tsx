import type { Metadata } from "next";
import { Check, ArrowUpRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import { PageHero, SectionHeading, PrimaryButton, GhostButton } from "@/components/UI";
import { plans } from "@/lib/data";

export const metadata: Metadata = { title: "Pricing" };

export default function PricingPage() {
  return (
    <>
      <PageHero
        kicker="Membership Plans"
        title="Grow your reach at every stage."
        description="Start free and upgrade as your catalog and order volume grow. No hidden fees, cancel anytime."
      />

      <section className="border-b border-line">
        <div className="container-x py-16 md:py-24">
          <div className="grid lg:grid-cols-3 gap-px bg-line border border-line">
            {plans.map((plan, i) => (
              <Reveal key={plan.name} delay={i * 0.08}>
                <div
                  className={`p-8 h-full flex flex-col ${
                    plan.highlighted ? "bg-ink text-paper" : "bg-paper"
                  }`}
                >
                  <span
                    className={`idx text-xs ${
                      plan.highlighted ? "text-smoke" : "text-smoke"
                    }`}
                  >
                    {plan.code}
                  </span>
                  <h3 className="mt-4 font-display font-bold text-2xl tracking-tightest">
                    {plan.name}
                  </h3>
                  <p
                    className={`mt-2 text-sm ${
                      plan.highlighted ? "text-bone" : "text-ash"
                    }`}
                  >
                    {plan.description}
                  </p>
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="font-display font-bold text-4xl tracking-tightest">
                      {plan.price}
                    </span>
                    <span className="text-sm text-smoke">{plan.cadence}</span>
                  </div>
                  <ul className="mt-8 space-y-3 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-3 text-sm">
                        <Check size={15} strokeWidth={2.5} className="shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    {plan.highlighted ? (
                      <a
                        href="/sell"
                        className="inline-flex w-full justify-center items-center gap-2 bg-paper text-ink px-6 py-3.5 text-sm font-medium hover:bg-bone transition-colors"
                      >
                        Choose {plan.name} <ArrowUpRight size={15} />
                      </a>
                    ) : (
                      <a
                        href="/sell"
                        className="inline-flex w-full justify-center items-center gap-2 border border-ink px-6 py-3.5 text-sm font-medium hover:bg-ink hover:text-paper transition-colors"
                      >
                        Choose {plan.name} <ArrowUpRight size={15} />
                      </a>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="container-x py-16 md:py-24 text-center">
          <SectionHeading
            eyebrow="Need More"
            title="Looking for a custom enterprise agreement?"
            align="center"
          />
          <div className="mt-8 flex justify-center gap-4">
            <PrimaryButton href="/contact" icon={ArrowUpRight}>
              Talk to Sales
            </PrimaryButton>
            <GhostButton href="/faq">Read FAQs</GhostButton>
          </div>
        </div>
      </section>
    </>
  );
}
