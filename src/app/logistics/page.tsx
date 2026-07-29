import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import { PageHero, SectionHeading, StatBlock, PrimaryButton } from "@/components/UI";
import { logisticsItems, paymentMethods } from "@/lib/data";
import { ArrowUpRight, Plane, Ship, Warehouse, Truck, CreditCard } from "lucide-react";

export const metadata: Metadata = { title: "Logistics" };

const icons = [Plane, Truck, Ship, Warehouse];

export default function LogisticsPage() {
  return (
    <div className="overflow-x-hidden">
      <PageHero
        kicker="Logistics Network"
        title="From factory floor to final mile."
        description="Air, sea, and land freight, warehousing, and customs support coordinated through a single shipment view."
      />

      <section className="border-b border-line bg-bone">
        <div className="container-x py-10 sm:py-14 md:py-16">
          <Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:divide-x md:divide-line">
              <div className="md:pl-8 first:md:pl-0">
                <StatBlock value="190" label="Countries" />
              </div>
              <div className="md:pl-8">
                <StatBlock value="4.2 Days" label="Avg. Air Transit" />
              </div>
              <div className="md:pl-8">
                <StatBlock value="620+" label="Port Partners" />
              </div>
              <div className="md:pl-8">
                <StatBlock value="99.1%" label="On-Time Rate" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="container-x py-12 sm:py-16 md:py-24">
          <SectionHeading eyebrow="Shipping Modes" title="Every route, coordinated for you." />
          <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-line border border-line">
            {logisticsItems.map((l, i) => {
              const Icon = icons[i % icons.length];
              return (
                <Reveal key={l} delay={(i % 4) * 0.05}>
                  <div className="group bg-paper p-6 sm:p-7 h-full flex flex-col gap-5 transition-all duration-300 hover:bg-bone">
                    <div className="w-11 h-11 shrink-0 flex items-center justify-center border border-line transition-colors duration-300 group-hover:border-ink">
                      <Icon size={19} className="text-ink" />
                    </div>
                    <span className="font-medium text-sm sm:text-base leading-snug break-words">
                      {l}
                    </span>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-ink text-paper">
        <div className="container-x py-12 sm:py-16 md:py-24">
          <SectionHeading eyebrow="Payments" title="Move money as easily as goods." />
          <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-paper/15">
            {paymentMethods.map((p, i) => (
              <Reveal key={p} delay={(i % 4) * 0.05}>
                <div className="group bg-ink p-6 sm:p-7 h-full flex flex-col justify-between gap-6 transition-colors duration-300 hover:bg-paper/[0.04]">
                  <div className="flex items-center justify-between">
                    <span className="idx text-xs text-smoke">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <CreditCard
                      size={16}
                      className="text-smoke opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  </div>
                  <p className="font-medium text-sm sm:text-base break-words">{p}</p>
                </div>
              </Reveal>
            ))}
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
            <SectionHeading
              eyebrow="Ship With FAST"
              title="Get a freight quote in minutes."
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