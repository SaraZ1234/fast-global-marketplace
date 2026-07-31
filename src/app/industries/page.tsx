import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Building2, Package, Globe2, ShieldCheck, Users } from "lucide-react";
import Reveal from "@/components/Reveal";
import { PageHero } from "@/components/UI";
import { industries } from "@/lib/data";

export const metadata: Metadata = { title: "Industries" };

// Deterministic hash so each industry always renders the same supplier/product
// counts on every load — no client state, no flicker between renders.
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getIndustryStats(slug: string) {
  const h = hashString(slug);
  const suppliers = 200 + (h % 4800); // 200 - 4999
  const products = 1000 + (h % 48000); // 1,000 - 48,999
  return { suppliers, products };
}

const overviewStats = [
  { icon: Building2, value: `${industries.length}`, label: "Sourcing Categories" },
  { icon: Users, value: "10,000+", label: "Verified Suppliers" },
  { icon: Package, value: "500,000+", label: "Product Listings" },
  { icon: Globe2, value: "150+", label: "Countries Served" },
];

export default function IndustriesPage() {
  return (
    <div className="overflow-x-hidden">
      <PageHero
        kicker="Browse Categories"
        title="Every industry, verified end to end."
        description="Ten sourcing categories covering the full spread of global trade — from raw materials to finished consumer goods."
      />

      {/* Overview stats strip */}
      <section className="border-b border-line bg-bone">
        <div className="container-x py-6 sm:py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-line border border-line">
            {overviewStats.map((s, idx) => (
              <Reveal key={s.label} delay={idx * 0.06}>
                <div className="bg-paper px-3 py-4 sm:px-5 sm:py-5 flex flex-col items-center text-center gap-1.5 sm:gap-2">
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

      <section className="bg-bone">
        <div className="container-x py-10 sm:py-16 md:py-24">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6 sm:mb-8 hidden sm:block">
            <ol className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest2 text-smoke">
              <li>
                <Link href="/" className="hover:text-ink transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-ink">Industries</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-line border border-line">
            {industries.map((ind, i) => {
              const { suppliers, products } = getIndustryStats(ind.slug);
              return (
                <Reveal key={ind.slug} delay={(i % 6) * 0.05}>
                  <Link
                    href={`/industries/${ind.slug}`}
                    className="group relative flex flex-col justify-between bg-paper p-5 sm:p-7 md:p-8 h-full card-hover border border-transparent transition-all duration-300 hover:border-ink/10 hover:-translate-y-0.5 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="idx text-xs text-smoke">{ind.code}</span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wide text-emerald-700 border border-line px-1.5 py-0.5 shrink-0">
                          <ShieldCheck size={11} className="text-emerald-600 shrink-0" />
                          Verified
                        </span>
                      </div>

                      <h2 className="mt-3 sm:mt-4 font-display font-semibold text-base sm:text-lg md:text-xl tracking-tight break-words">
                        {ind.name}
                      </h2>
                      <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm text-ash leading-relaxed">
                        {ind.blurb}
                      </p>

                      <div className="mt-4 sm:mt-5 flex flex-wrap gap-1.5 sm:gap-2">
                        {ind.items.slice(0, 3).map((it) => (
                          <span
                            key={it}
                            className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wide text-smoke border border-line px-2 py-1 break-words transition-colors duration-300 group-hover:border-ink/30 group-hover:text-ink"
                          >
                            {it}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      {/* Supplier / product count row */}
                      <div className="mt-5 sm:mt-6 flex items-center gap-4 text-[11px] sm:text-xs text-smoke border-t border-line pt-4">
                        <span className="inline-flex items-center gap-1.5">
                          <Users size={12} className="shrink-0" />
                          {suppliers.toLocaleString()}+ Suppliers
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Package size={12} className="shrink-0" />
                          {products.toLocaleString()}+ Products
                        </span>
                      </div>

                      <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest2 text-ink opacity-100 sm:opacity-0 -translate-x-0 sm:-translate-x-1 sm:group-hover:opacity-100 sm:group-hover:translate-x-0 transition-all duration-300">
                        View category <ArrowUpRight size={13} className="shrink-0" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}