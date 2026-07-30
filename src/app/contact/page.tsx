import type { Metadata } from "next";
import { Mail, Phone, MessageCircle, Briefcase, Users, Clock3, Globe2, ShieldCheck, ArrowUpRight } from "lucide-react";
import { PageHero, Eyebrow } from "@/components/UI";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = { title: "Contact" };

const channels = [
  { icon: Mail, label: "Email Support", value: "support@fastmarketplace.com", href: "mailto:support@fastmarketplace.com" },
  { icon: Phone, label: "Phone Support", value: "+1 (800) 555-0139", href: "tel:+18005550139" },
  { icon: MessageCircle, label: "Live Chat", value: "Available 24/7", href: null, live: true },
  { icon: Briefcase, label: "Business Inquiry", value: "partnerships@fastmarketplace.com", href: "mailto:partnerships@fastmarketplace.com" },
];

const stats = [
  { icon: Users, value: "10,000+", label: "Verified Suppliers" },
  { icon: Clock3, value: "24 Hrs", label: "Avg. Response Time" },
  { icon: Globe2, value: "150+", label: "Countries Served" },
  { icon: ShieldCheck, value: "98%", label: "Satisfaction Rate" },
];

const supportHours = [
  { days: "Monday – Friday", hours: "8:00 AM – 8:00 PM (GMT+5)" },
  { days: "Saturday", hours: "9:00 AM – 5:00 PM (GMT+5)" },
  { days: "Sunday", hours: "Live Chat & Email Only" },
];

export default function ContactPage() {
  return (
    <div className="overflow-x-hidden">
      <PageHero
        kicker="Request a Quotation"
        title="Tell us what you're sourcing."
        description="Share your requirements once and receive competing quotations from verified suppliers matched to your category."
      />

      {/* Trust stats strip */}
      <section className="border-b border-line bg-bone">
        <div className="container-x py-6 sm:py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-line border border-line">
            {stats.map((s, idx) => (
              <Reveal key={s.label} delay={idx * 0.06}>
                <div className="bg-bone px-3 py-4 sm:px-5 sm:py-5 flex flex-col items-center text-center gap-1.5 sm:gap-2">
                  <s.icon size={16} className="text-ink shrink-0 sm:size-[18px]" />
                  <p className="font-display font-bold text-base sm:text-xl tracking-tightest">{s.value}</p>
                  <p className="text-[9px] sm:text-[11px] font-mono uppercase tracking-widest2 text-smoke leading-tight">
                    {s.label}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="container-x py-10 sm:py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-14">
            <div className="lg:col-span-7">
              <Reveal>
                <ContactForm />
              </Reveal>
            </div>
            <div className="lg:col-span-5">
              <Reveal delay={0.1}>
                <Eyebrow>Direct Contact</Eyebrow>
                <ul className="mt-5 sm:mt-6 space-y-1">
                  {channels.map((c, idx) => {
                    const Content = (
                      <div className="group flex items-start gap-3 sm:gap-4 py-4 sm:py-5 border-b border-line transition-colors duration-300 hover:border-ink/30">
                        <div className="relative w-9 h-9 sm:w-10 sm:h-10 shrink-0 flex items-center justify-center border border-line transition-all duration-300 group-hover:border-ink group-hover:scale-105 group-hover:bg-ink">
                          <c.icon
                            size={16}
                            className="text-ink transition-colors duration-300 group-hover:text-paper"
                          />
                          {c.live && (
                            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                            </span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] sm:text-xs font-mono uppercase tracking-widest2 text-smoke">
                            {c.label}
                          </p>
                          <p className="mt-1 font-medium text-sm sm:text-base break-words">
                            {c.value}
                          </p>
                        </div>
                        {c.href && (
                          <ArrowUpRight
                            size={15}
                            className="shrink-0 text-smoke opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-ink transition-all duration-300 mt-1 hidden sm:block"
                          />
                        )}
                      </div>
                    );
                    return (
                      <Reveal key={c.label} delay={0.15 + idx * 0.05}>
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
                      </Reveal>
                    );
                  })}
                </ul>

                <Reveal delay={0.35}>
                  <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-bone border border-line">
                    <p className="text-[10px] sm:text-xs font-mono uppercase tracking-widest2 text-smoke">
                      Response Time
                    </p>
                    <p className="mt-2 text-xs sm:text-sm text-ash leading-relaxed">
                      Quotation requests are typically matched with verified suppliers within
                      24 hours.
                    </p>
                  </div>
                </Reveal>

                <Reveal delay={0.4}>
                  <div className="mt-4 sm:mt-5 border border-line">
                    <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-line bg-bone">
                      <p className="text-[10px] sm:text-xs font-mono uppercase tracking-widest2 text-smoke">
                        Support Hours
                      </p>
                    </div>
                    <ul className="divide-y divide-line">
                      {supportHours.map((h) => (
                        <li
                          key={h.days}
                          className="px-4 sm:px-6 py-3 flex items-center justify-between gap-3 text-xs sm:text-sm"
                        >
                          <span className="text-ash">{h.days}</span>
                          <span className="font-medium text-right break-words">{h.hours}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}