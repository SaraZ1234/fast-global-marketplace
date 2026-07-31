import type { Metadata } from "next";
import { PageHero } from "@/components/UI";

export const metadata: Metadata = { title: "Legal" };

const docs = [
  { title: "Privacy Policy", body: "How FAST Global Marketplace collects, uses, and protects personal and business data across the platform." },
  { title: "Terms & Conditions", body: "The rules governing use of the marketplace for buyers, sellers, and visitors." },
  { title: "Refund Policy", body: "Conditions under which orders placed through Trade Assurance qualify for a refund." },
  { title: "Cookie Policy", body: "The categories of cookies used to operate and improve the platform, and how to manage preferences." },
  { title: "Intellectual Property Policy", body: "How FAST handles IP rights, takedown requests, and counterfeit listing reports." },
  { title: "Seller Agreement", body: "Obligations and protections for companies listing products on the marketplace." },
  { title: "Buyer Agreement", body: "Obligations and protections for companies and individuals purchasing on the marketplace." },
];

export default function LegalPage() {
  return (
    <>
      <PageHero
        kicker="Legal"
        title="Policies and agreements."
        description="Reference documents governing the use of FAST Global Marketplace. Placeholder summaries — replace with full legal text before launch."
      />
      <section className="bg-paper overflow-hidden">
        <div className="container-x py-12 sm:py-16 md:py-24">
          <div className="max-w-3xl">
            {docs.map((d) => (
              <div key={d.title} className="py-5 sm:py-6 border-b border-line">
                <h2 className="font-display font-semibold text-base sm:text-lg break-words">
                  {d.title}
                </h2>
                <p className="mt-2 text-ash leading-relaxed text-sm break-words">{d.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}