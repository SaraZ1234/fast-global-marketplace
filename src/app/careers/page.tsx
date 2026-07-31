import type { Metadata } from "next";
import { PageHero, SectionHeading, PrimaryButton } from "@/components/UI";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = { title: "Careers" };

const openings = [
  { role: "Senior Frontend Engineer", team: "Platform", location: "Remote" },
  { role: "Supplier Verification Analyst", team: "Trust & Safety", location: "Singapore" },
  { role: "Logistics Partnerships Manager", team: "Operations", location: "Remote" },
  { role: "Product Designer", team: "Design", location: "Remote" },
];

export default function CareersPage() {
  return (
    <>
      <PageHero
        kicker="Careers"
        title="Help build the infrastructure of global trade."
        description="We're a distributed team working on marketplace trust, logistics, and AI-driven discovery."
      />
      <section className="bg-paper overflow-hidden">
        <div className="container-x py-12 sm:py-16 md:py-24">
          <SectionHeading eyebrow="Open Roles" title="Current openings." />
          <div className="mt-8 sm:mt-10 divide-y divide-line border-t border-b border-line">
            {openings.map((o) => (
              <div
                key={o.role}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5 sm:py-6"
              >
                <div className="min-w-0">
                  <h3 className="font-display font-semibold break-words">{o.role}</h3>
                  <p className="text-sm text-smoke mt-1 break-words">
                    {o.team} — {o.location}
                  </p>
                </div>
                <PrimaryButton href="/contact" icon={ArrowUpRight}>
                  Apply
                </PrimaryButton>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}