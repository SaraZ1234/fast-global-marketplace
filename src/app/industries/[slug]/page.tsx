import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import { Eyebrow, PrimaryButton, GhostButton } from "@/components/UI";
import { industries } from "@/lib/data";

export function generateStaticParams() {
  return industries.map((ind) => ({ slug: ind.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const ind = industries.find((i) => i.slug === params.slug);
  return { title: ind ? ind.name : "Industry" };
}

export default function IndustryDetail({ params }: { params: { slug: string } }) {
  const ind = industries.find((i) => i.slug === params.slug);
  if (!ind) return notFound();

  const others = industries.filter((i) => i.slug !== ind.slug).slice(0, 3);

  return (
    <div className="overflow-x-hidden">
      <section className="border-b border-line">
        <div className="container-x py-14 sm:py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10">
            <div className="lg:col-span-8">
              <Eyebrow>Category {ind.code}</Eyebrow>
              <h1 className="mt-5 font-display font-bold text-[clamp(1.875rem,8vw,3rem)] sm:text-4xl md:text-6xl tracking-tightest break-words">
                {ind.name}
              </h1>
              <p className="mt-6 text-ash max-w-xl text-sm sm:text-base leading-relaxed">
                {ind.blurb}
              </p>
              <div className="mt-7 sm:mt-9 flex flex-wrap gap-3 sm:gap-4">
                <PrimaryButton href="/products" icon={ArrowUpRight}>
                  Browse {ind.name} Products
                </PrimaryButton>
                <GhostButton href="/contact" icon={ArrowRight}>
                  Request Quotation
                </GhostButton>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-bone">
        <div className="container-x py-12 sm:py-16 md:py-20">
          <Eyebrow>Sub-Categories</Eyebrow>
          <h2 className="mt-4 font-display font-bold text-xl sm:text-2xl md:text-3xl tracking-tightest mb-8 sm:mb-10">
            What buyers source here.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-line border border-line">
            {ind.items.map((item, i) => (
              <Reveal key={item} delay={(i % 4) * 0.05}>
                <div className="bg-paper p-5 sm:p-6 h-full card-hover border border-transparent">
                  <span className="idx text-xs text-smoke">
                    {ind.code}.{String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-3 font-medium text-sm sm:text-base break-words">{item}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="container-x py-12 sm:py-16 md:py-20">
          <Eyebrow>Related Industries</Eyebrow>
          <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-px bg-line border border-line">
            {others.map((o) => (
              <Link
                key={o.slug}
                href={`/industries/${o.slug}`}
                className="group block bg-paper p-5 sm:p-6 card-hover border border-transparent"
              >
                <span className="idx text-xs text-smoke">{o.code}</span>
                <h3 className="mt-3 font-display font-semibold text-sm sm:text-base break-words">
                  {o.name}
                </h3>
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest2 opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore <ArrowUpRight size={13} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}