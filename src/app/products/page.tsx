import type { Metadata } from "next";
import Link from "next/link";
import { Search, SlidersHorizontal, ArrowUpRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import { PageHero } from "@/components/UI";
import { industries, products } from "@/lib/data";

export const metadata: Metadata = { title: "Products" };

export default function ProductsPage() {
  return (
    <div className="overflow-x-hidden">
      <PageHero
        kicker="Product Catalog"
        title="Millions of products, sourced directly."
        description="Filter by industry, MOQ, and price to shortlist products from verified manufacturers and wholesalers."
      />

      <section>
        <div className="container-x py-10 sm:py-12 md:py-16">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-10">
            <div className="flex-1 flex items-center gap-3 border border-ink px-4 py-3">
              <Search size={18} className="text-smoke shrink-0" />
              <input
                placeholder="Search products, e.g. 'CNC lathe machine'"
                className="w-full min-w-0 bg-transparent outline-none text-sm placeholder:text-smoke"
              />
            </div>
            <button className="inline-flex items-center justify-center gap-2 border border-ink px-5 py-3 text-sm font-medium hover:bg-ink hover:text-paper transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40 shrink-0">
              <SlidersHorizontal size={16} /> Filters
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10">
            <aside className="lg:col-span-3">
              <div className="lg:sticky lg:top-24">
                <h3 className="font-mono text-xs uppercase tracking-widest2 text-smoke mb-4">
                  Industries
                </h3>
                <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-x-4 gap-y-1 lg:gap-y-0 lg:space-y-1 lg:divide-y lg:divide-line">
                  {industries.map((ind) => (
                    <li key={ind.slug}>
                      <label className="flex items-center gap-3 py-2 text-sm cursor-pointer hover:text-ink transition-colors">
                        <input
                          type="checkbox"
                          className="accent-black w-4 h-4 shrink-0 cursor-pointer"
                        />
                        <span className="break-words">{ind.name}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            <div className="lg:col-span-9">
              <div className="flex items-center justify-between mb-4 sm:mb-5 text-xs text-smoke font-mono uppercase tracking-widest2">
                <span>{products.length} Products</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-px bg-line border border-line">
                {products.map((p, i) => (
                  <Reveal key={p.slug} delay={(i % 6) * 0.04}>
                    <Link
                      href={`/products/${p.slug}`}
                      className="group block bg-paper p-5 sm:p-6 h-full card-hover border border-transparent flex flex-col transition-all duration-300 hover:border-ink/10 hover:-translate-y-0.5 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40"
                    >
                      <div className="aspect-[4/3] bg-bone border border-line flex items-center justify-center mb-5 overflow-hidden">
                        <span className="font-mono text-xs text-smoke">{p.code}</span>
                      </div>
                      <span className="text-[11px] font-mono uppercase tracking-wide text-smoke">
                        {p.industry}
                      </span>
                      <h3 className="mt-2 font-display font-semibold leading-snug text-sm sm:text-base break-words">
                        {p.name}
                      </h3>
                      <div className="mt-4 flex items-center justify-between gap-2 text-sm">
                        <span className="font-medium">{p.price}</span>
                        <span className="text-smoke whitespace-nowrap">MOQ {p.moq}</span>
                      </div>
                      <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest2 text-ink opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                        View product <ArrowUpRight size={13} />
                      </span>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}