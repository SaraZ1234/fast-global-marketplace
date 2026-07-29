import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import { PageHero, SectionHeading, StatBlock, Eyebrow } from "@/components/UI";
import { whyChooseUs } from "@/lib/data";

export const metadata: Metadata = { title: "About" };

const timeline = [
  { year: "2016", label: "Founded as a regional B2B directory." },
  { year: "2019", label: "Launched cross-border Trade Assurance." },
  { year: "2022", label: "Expanded to B2C retail and consumer categories." },
  { year: "2026", label: "AI-powered search and recommendations across 10 industries." },
];

export default function AboutPage() {
  return (
    <div className="overflow-x-hidden">
      <PageHero
        kicker="About FAST"
        title="Making global trade faster, safer, and more transparent."
        description="FAST Global Marketplace connects manufacturers, suppliers, wholesalers, distributors, retailers, and consumers through one secure platform."
      />

      <section className="border-b border-line bg-bone">
        <div className="container-x py-10 sm:py-16 md:py-20">
          <Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:divide-x md:divide-line">
              <div className="md:pl-8 first:md:pl-0">
                <StatBlock value="2016" label="Founded" />
              </div>
              <div className="md:pl-8">
                <StatBlock value="190" label="Countries" />
              </div>
              <div className="md:pl-8">
                <StatBlock value="182K+" label="Suppliers" />
              </div>
              <div className="md:pl-8">
                <StatBlock value="9.6M" label="Products" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="container-x py-12 sm:py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-14">
            <Reveal>
              <Eyebrow>Our Mission</Eyebrow>
              <h2 className="mt-4 font-display font-bold text-xl sm:text-2xl md:text-3xl tracking-tightest">
                One trusted layer between every buyer and seller.
              </h2>
              <p className="mt-6 text-ash text-sm sm:text-base leading-relaxed">
                We simplify international sourcing, wholesale purchasing, retail shopping,
                logistics, secure payments, and business networking. Whether you are a
                factory shipping a container a week or a shopper placing a single order,
                FAST is built to make the transaction simple and the trust automatic.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <Eyebrow>Timeline</Eyebrow>
              <ol className="mt-4 relative">
                {timeline.map((t, i) => (
                  <li key={t.year} className="relative flex gap-4 sm:gap-6 py-4 sm:py-5 border-b border-line last:border-b-0">
                    <div className="flex flex-col items-center shrink-0 w-12 sm:w-14">
                      <span className="idx text-xs sm:text-sm text-smoke font-medium">
                        {t.year}
                      </span>
                      {i < timeline.length - 1 && (
                        <span className="mt-2 flex-1 w-px bg-line" aria-hidden />
                      )}
                    </div>
                    <span className="text-sm leading-relaxed pb-1">{t.label}</span>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </div>
      </section>

      <section>
        <div className="container-x py-12 sm:py-16 md:py-24">
          <SectionHeading
            eyebrow="Why FAST"
            title="What sets the platform apart."
            align="center"
          />
          <div className="mt-10 sm:mt-14 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
            {whyChooseUs.map((w, i) => (
              <Reveal key={w} delay={(i % 5) * 0.05} className="text-center">
                <div className="font-mono text-xs text-smoke mb-3">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <p className="text-xs sm:text-sm font-medium leading-snug break-words">{w}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}