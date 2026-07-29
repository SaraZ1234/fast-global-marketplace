import type { Metadata } from "next";
import { PageHero, PrimaryButton } from "@/components/UI";
import Reveal from "@/components/Reveal";
import Accordion from "@/components/Accordion";
import { faqs } from "@/lib/data";
import { ArrowUpRight, MessageCircleQuestion, Mail, Phone } from "lucide-react";

export const metadata: Metadata = { title: "FAQ" };

export default function FaqPage() {
  return (
    <div className="overflow-x-hidden">
      <PageHero
        kicker="Help Center"
        title="Frequently asked questions."
        description="Everything you need to know about buying, selling, and trading on FAST Global Marketplace."
      />

      <section className="border-b border-line">
        <div className="container-x py-10 sm:py-12 md:py-20">
          <div className="max-w-3xl mx-auto">
            <Reveal>
              <div className="flex items-center justify-between gap-4 mb-8 sm:mb-10 pb-6 border-b border-line">
                <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest2 text-smoke">
                  <MessageCircleQuestion size={15} className="shrink-0" />
                  {faqs.length} Questions Answered
                </span>
              </div>
            </Reveal>
            <Accordion items={faqs} />
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-bone">
        <div
          aria-hidden
          className="motion-safe:animate-pulse pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-ink/[0.06] blur-3xl"
        />
        <div className="container-x relative py-14 sm:py-20 md:py-24 text-center">
          <Reveal>
            <h2 className="font-display font-bold text-2xl sm:text-3xl tracking-tightest">
              Still have questions?
            </h2>
            <p className="mt-4 text-ash text-sm sm:text-base max-w-md mx-auto leading-relaxed">
              Our support team is available 24/7 across live chat, phone, and email.
            </p>

            <div className="mt-8 sm:mt-9 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-ash">
              <span className="inline-flex items-center gap-2">
                <Mail size={15} className="shrink-0 text-smoke" /> support@fastmarketplace.com
              </span>
              <span className="inline-flex items-center gap-2">
                <Phone size={15} className="shrink-0 text-smoke" /> +1 (800) 555-0199
              </span>
            </div>

            <div className="mt-8 flex justify-center">
              <PrimaryButton href="/contact" icon={ArrowUpRight}>
                Contact Support
              </PrimaryButton>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}