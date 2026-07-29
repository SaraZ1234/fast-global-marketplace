import type { Metadata } from "next";
import { PageHero, SectionHeading, StatBlock } from "@/components/UI";

export const metadata: Metadata = { title: "Investor Relations" };

export default function InvestorsPage() {
  return (
    <>
      <PageHero
        kicker="Investor Relations"
        title="Backing global trade infrastructure."
        description="Financial highlights and company information for current and prospective investors."
      />
      <section className="overflow-hidden">
        <div className="container-x py-12 sm:py-16 md:py-24">
          <SectionHeading eyebrow="Highlights" title="Company at a glance." />
          <div className="mt-8 sm:mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <StatBlock value="182K+" label="Verified Suppliers" />
            <StatBlock value="9.6M" label="Product Listings" />
            <StatBlock value="190" label="Countries Served" />
            <StatBlock value="1.2M" label="Trade Assurance Orders" />
          </div>
          <p className="mt-10 sm:mt-12 text-ash max-w-xl leading-relaxed text-sm sm:text-base">
            For investor inquiries, financial reports, or governance information, reach our
            investor relations team through the contact page.
          </p>
        </div>
      </section>
    </>
  );
}