import type { Metadata } from "next";
import { PageHero, SectionHeading } from "@/components/UI";

export const metadata: Metadata = { title: "Press" };

const releases = [
  { date: "Jun 2026", title: "FAST Global Marketplace surpasses 180,000 verified suppliers." },
  { date: "Feb 2026", title: "Platform launches AI-powered image and voice search." },
  { date: "Oct 2025", title: "Trade Assurance expands to cover ten industry categories." },
];

export default function PressPage() {
  return (
    <>
      <PageHero
        kicker="Press"
        title="News and announcements."
        description="Updates on product launches, milestones, and company news."
      />
      <section className="overflow-hidden">
        <div className="container-x py-12 sm:py-16 md:py-24">
          <SectionHeading eyebrow="Newsroom" title="Latest releases." />
          <div className="mt-8 sm:mt-10 divide-y divide-line border-t border-b border-line max-w-2xl">
            {releases.map((r) => (
              <div
                key={r.title}
                className="flex flex-col sm:flex-row gap-1 sm:gap-6 py-5 sm:py-6"
              >
                <span className="idx text-xs text-smoke w-20 shrink-0 sm:mt-1">{r.date}</span>
                <h3 className="font-display font-semibold text-sm sm:text-base break-words">
                  {r.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}