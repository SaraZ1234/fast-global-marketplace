import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { PageHero, SectionHeading, PrimaryButton } from "@/components/UI";
import { businessServices, advertisingSolutions, supportChannels } from "@/lib/data";
import {
  ArrowUpRight,
  LifeBuoy,
  Factory,
  PackageCheck,
  Truck,
  ClipboardCheck,
  Wrench,
  Megaphone,
  TrendingUp,
  Target,
  Sparkles,
  MessageCircle,
  Clock3,
  ShieldCheck,
  Award,
  Globe2,
  Users,
} from "lucide-react";

export const metadata: Metadata = { title: "Services" };

// Icon pools cycled by index — deterministic, no guessing at string content,
// just gives each info card a distinct visual anchor instead of text-only.
const sourcingIcons = [Factory, PackageCheck, Truck, ClipboardCheck, Wrench];
const advertisingIcons = [Megaphone, TrendingUp, Target, Sparkles];
const supportIcons = [LifeBuoy, MessageCircle, Clock3, ShieldCheck];

const overviewStats = [
  { icon: Award, value: "15+ Yrs", label: "Trade Experience" },
  { icon: Users, value: "10,000+", label: "Suppliers Supported" },
  { icon: Globe2, value: "150+", label: "Countries Served" },
  { icon: Clock3, value: "24/7", label: "Support Availability" },
];

export default function ServicesPage() {
  return (
    <div className="overflow-x-hidden">
      <PageHero
        kicker="Business Services"
        title="Beyond the transaction."
        description="Sourcing, manufacturing, quality, and logistics services that support your business from first sample to final delivery."
      />

      {/* Overview stats strip */}
      <section className="border-b border-line bg-bone">
        <div className="container-x py-6 sm:py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-line border border-line">
            {overviewStats.map((s, idx) => (
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

      {/* Breadcrumb */}
      <div className="container-x pt-6 sm:pt-8 hidden sm:block">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest2 text-smoke">
            <li>
              <Link href="/" className="hover:text-ink transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-ink">Services</li>
          </ol>
        </nav>
      </div>

      <section className="border-b border-line">
        <div className="container-x py-10 sm:py-16 md:py-24">
          <SectionHeading
            eyebrow="Sourcing & Manufacturing"
            title="End-to-end production support."
          />
          <div className="mt-7 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px bg-line border border-line">
            {businessServices.map((s, i) => {
              const Icon = sourcingIcons[i % sourcingIcons.length];
              return (
                <Reveal key={s} delay={(i % 5) * 0.05}>
                  <div className="group bg-paper p-4 sm:p-6 h-full transition-all duration-300 hover:bg-bone hover:-translate-y-0.5 hover:shadow-sm">
                    <div className="flex items-center justify-between gap-2">
                      <span className="idx text-xs text-smoke">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <Icon
                        size={16}
                        className="shrink-0 text-smoke transition-colors duration-300 group-hover:text-ink"
                      />
                    </div>
                    <p className="mt-3 font-medium leading-snug text-sm sm:text-base break-words">
                      {s}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-ink text-paper">
        <div className="container-x py-10 sm:py-16 md:py-24">
          <SectionHeading eyebrow="Advertising" title="Get discovered by the right buyers." />
          <div className="mt-7 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-paper/15">
            {advertisingSolutions.map((a, i) => {
              const Icon = advertisingIcons[i % advertisingIcons.length];
              return (
                <Reveal key={a} delay={(i % 4) * 0.05}>
                  <div className="group bg-ink p-4 sm:p-6 h-full transition-all duration-300 hover:bg-paper/[0.04]">
                    <div className="flex items-center justify-between gap-2">
                      <span className="idx text-xs text-paper/50">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <Icon
                        size={16}
                        className="shrink-0 text-paper/50 transition-colors duration-300 group-hover:text-paper"
                      />
                    </div>
                    <p className="mt-3 font-medium text-sm sm:text-base break-words">{a}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="container-x py-10 sm:py-16 md:py-24">
          <SectionHeading eyebrow="Support" title="Help whenever you need it." />
          <div className="mt-7 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-line border border-line">
            {supportChannels.map((s, i) => {
              const Icon = supportIcons[i % supportIcons.length];
              return (
                <Reveal key={s} delay={(i % 4) * 0.05}>
                  <div className="group flex items-start gap-3 bg-paper p-4 sm:p-6 h-full transition-all duration-300 hover:bg-bone hover:-translate-y-0.5 hover:shadow-sm">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 flex items-center justify-center border border-line transition-colors duration-300 group-hover:border-ink group-hover:bg-ink">
                      <Icon
                        size={14}
                        className="text-smoke transition-colors duration-300 group-hover:text-paper"
                      />
                    </div>
                    <p className="font-medium text-sm sm:text-base break-words pt-1 sm:pt-1.5">{s}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden">
        {/* Ambient glow blobs — consistent with your established CTA pattern */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 left-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-ink/[0.04] rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-24 right-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-ink/[0.03] rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        </div>

        <div className="container-x py-14 sm:py-20 md:py-24 text-center relative">
          <Reveal>
            <SectionHeading
              eyebrow="Get Started"
              title="Talk to our trade consulting team."
              align="center"
            />
            <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-x-4 gap-y-2 text-[11px] sm:text-xs font-mono uppercase tracking-widest2 text-smoke">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-emerald-600 shrink-0" /> Verified Process
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 size={13} className="shrink-0" /> 24 Hr Response
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Globe2 size={13} className="shrink-0" /> Global Coverage
              </span>
            </div>
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