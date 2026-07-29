import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import { PageHero, SectionHeading, PrimaryButton } from "@/components/UI";
import { businessServices, advertisingSolutions, supportChannels } from "@/lib/data";
import { ArrowUpRight, LifeBuoy } from "lucide-react";

export const metadata: Metadata = { title: "Services" };

export default function ServicesPage() {
  return (
    <div className="overflow-x-hidden">
      <PageHero
        kicker="Business Services"
        title="Beyond the transaction."
        description="Sourcing, manufacturing, quality, and logistics services that support your business from first sample to final delivery."
      />

      <section className="border-b border-line">
        <div className="container-x py-12 sm:py-16 md:py-24">
          <SectionHeading
            eyebrow="Sourcing & Manufacturing"
            title="End-to-end production support."
          />
          <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px bg-line border border-line">
            {businessServices.map((s, i) => (
              <Reveal key={s} delay={(i % 5) * 0.05}>
                <div className="group bg-paper p-5 sm:p-6 h-full transition-colors duration-300 hover:bg-bone">
                  <span className="idx text-xs text-smoke">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-3 font-medium leading-snug text-sm sm:text-base break-words">
                    {s}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-ink text-paper">
        <div className="container-x py-12 sm:py-16 md:py-24">
          <SectionHeading eyebrow="Advertising" title="Get discovered by the right buyers." />
          <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-paper/15">
            {advertisingSolutions.map((a, i) => (
              <Reveal key={a} delay={(i % 4) * 0.05}>
                <div className="bg-ink p-5 sm:p-6 h-full transition-colors duration-300 hover:bg-paper/[0.04]">
                  <span className="idx text-xs text-smoke">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-3 font-medium text-sm sm:text-base break-words">{a}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="container-x py-12 sm:py-16 md:py-24">
          <SectionHeading eyebrow="Support" title="Help whenever you need it." />
          <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-line border border-line">
            {supportChannels.map((s, i) => (
              <Reveal key={s} delay={(i % 4) * 0.05}>
                <div className="flex items-start gap-3 bg-paper p-5 sm:p-6 h-full transition-colors duration-300 hover:bg-bone">
                  <LifeBuoy size={16} className="shrink-0 mt-0.5 text-smoke" />
                  <p className="font-medium text-sm sm:text-base break-words">{s}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="container-x py-14 sm:py-20 md:py-24 text-center">
          <Reveal>
            <SectionHeading
              eyebrow="Get Started"
              title="Talk to our trade consulting team."
              align="center"
            />
            <div className="mt-7 sm:mt-8 flex justify-center">
              <PrimaryButton href="/contact" icon={ArrowUpRight}>
                Request Quotation
              </PrimaryButton>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}