import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import { PageHero } from "@/components/UI";
import { industries } from "@/lib/data";

export const metadata: Metadata = { title: "Industries" };

export default function IndustriesPage() {
  return (
    <div className="overflow-x-hidden">
      <PageHero
        kicker="Browse Categories"
        title="Every industry, verified end to end."
        description="Ten sourcing categories covering the full spread of global trade — from raw materials to finished consumer goods."
      />
      <section>
        <div className="container-x py-10 sm:py-16 md:py-24">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-line border border-line">
            {industries.map((ind, i) => (
              <Reveal key={ind.slug} delay={(i % 6) * 0.05}>
                <Link
                  href={`/industries/${ind.slug}`}
                  className="group block bg-paper p-6 sm:p-7 md:p-8 h-full card-hover border border-transparent"
                >
                  <span className="idx text-xs text-smoke">{ind.code}</span>
                  <h2 className="mt-4 font-display font-semibold text-lg sm:text-xl tracking-tight">
                    {ind.name}
                  </h2>
                  <p className="mt-3 text-sm text-ash leading-relaxed">{ind.blurb}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {ind.items.slice(0, 3).map((it) => (
                      <span
                        key={it}
                        className="text-[11px] font-mono uppercase tracking-wide text-smoke border border-line px-2 py-1 break-words"
                      >
                        {it}
                      </span>
                    ))}
                  </div>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest2 opacity-0 group-hover:opacity-100 transition-opacity">
                    View category <ArrowUpRight size={13} />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}