import type { Metadata } from "next";
import { Mail, Phone, MessageCircle, Briefcase } from "lucide-react";
import { PageHero, Eyebrow } from "@/components/UI";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = { title: "Contact" };

const channels = [
  { icon: Mail, label: "Email Support", value: "support@fastmarketplace.com", href: "mailto:support@fastmarketplace.com" },
  { icon: Phone, label: "Phone Support", value: "+1 (800) 555-0139", href: "tel:+18005550139" },
  { icon: MessageCircle, label: "Live Chat", value: "Available 24/7", href: null },
  { icon: Briefcase, label: "Business Inquiry", value: "partnerships@fastmarketplace.com", href: "mailto:partnerships@fastmarketplace.com" },
];

export default function ContactPage() {
  return (
    <div className="overflow-x-hidden">
      <PageHero
        kicker="Request a Quotation"
        title="Tell us what you're sourcing."
        description="Share your requirements once and receive competing quotations from verified suppliers matched to your category."
      />

      <section>
        <div className="container-x py-12 sm:py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-14">
            <div className="lg:col-span-7">
              <Reveal>
                <ContactForm />
              </Reveal>
            </div>
            <div className="lg:col-span-5">
              <Reveal delay={0.1}>
                <Eyebrow>Direct Contact</Eyebrow>
                <ul className="mt-6 space-y-1">
                  {channels.map((c) => {
                    const Content = (
                      <div className="group flex items-start gap-4 py-5 border-b border-line transition-colors duration-300 hover:border-ink/30">
                        <div className="w-10 h-10 shrink-0 flex items-center justify-center border border-line transition-colors duration-300 group-hover:border-ink">
                          <c.icon size={17} className="text-ink" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-mono uppercase tracking-widest2 text-smoke">
                            {c.label}
                          </p>
                          <p className="mt-1 font-medium text-sm sm:text-base break-words">
                            {c.value}
                          </p>
                        </div>
                      </div>
                    );
                    return (
                      <li key={c.label}>
                        {c.href ? (
                          <a
                            href={c.href}
                            className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40 rounded-sm"
                          >
                            {Content}
                          </a>
                        ) : (
                          Content
                        )}
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-8 p-5 sm:p-6 bg-bone border border-line">
                  <p className="text-xs font-mono uppercase tracking-widest2 text-smoke">
                    Response Time
                  </p>
                  <p className="mt-2 text-sm text-ash leading-relaxed">
                    Quotation requests are typically matched with verified suppliers within
                    24 hours.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}