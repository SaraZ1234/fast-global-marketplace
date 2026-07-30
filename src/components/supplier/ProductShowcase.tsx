"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

type ShowcaseProduct = {
  slug: string;
  code?: string;
  name: string;
  price: string;
};

const PAGE_SIZE = 6;

export default function ProductShowcase({ products }: { products: ShowcaseProduct[] }) {
  const [page, setPage] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const totalPages = Math.ceil(products.length / PAGE_SIZE);
  const paged = products.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const scrollCarousel = (dir: 1 | -1) => {
    scrollRef.current?.scrollBy({ left: dir * 280, behavior: "smooth" });
  };

  return (
    <div>
      {/* Mobile: horizontal carousel */}
      <div className="sm:hidden relative">
        <div ref={scrollRef} className="flex gap-3 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory -mx-4 px-4">
          {products.map((p) => (
            <Link
              key={p.slug}
              href={`/products/${p.slug}`}
              className="group shrink-0 w-[70%] xs:w-[60%] snap-start bg-paper border border-line p-4 card-hover flex flex-col justify-between"
            >
              <div>
                {p.code && <span className="font-mono text-xs text-smoke">{p.code}</span>}
                <h3 className="mt-2 font-display font-semibold leading-snug text-sm break-words">{p.name}</h3>
              </div>
              <div className="mt-4 pt-3 border-t border-line flex items-center justify-between gap-2">
                <p className="text-xs font-medium">{p.price}</p>
                <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </div>
            </Link>
          ))}
        </div>
        <div className="flex items-center justify-center gap-3 mt-3">
          <button
            type="button"
            onClick={() => scrollCarousel(-1)}
            className="w-8 h-8 border border-line flex items-center justify-center hover:border-ash transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            type="button"
            onClick={() => scrollCarousel(1)}
            className="w-8 h-8 border border-line flex items-center justify-center hover:border-ash transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Tablet/Desktop: paginated grid */}
      <div className="hidden sm:block">
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-px bg-line border border-line">
          {paged.map((p) => (
            <Link
              key={p.slug}
              href={`/products/${p.slug}`}
              className="group block bg-paper p-5 lg:p-6 h-full card-hover border border-transparent transition-all duration-300 hover:border-ink/10 hover:-translate-y-0.5 hover:shadow-sm"
            >
              {p.code && <span className="font-mono text-xs text-smoke">{p.code}</span>}
              <h3 className="mt-3 font-display font-semibold leading-snug text-sm sm:text-base break-words">
                {p.name}
              </h3>
              <p className="mt-2 text-sm font-medium">{p.price}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest2 text-ink opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                View product <ArrowUpRight size={13} />
              </span>
            </Link>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="w-8 h-8 border border-line flex items-center justify-center hover:border-ash transition-colors disabled:opacity-30 disabled:pointer-events-none"
              aria-label="Previous page"
            >
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPage(i)}
                className={`w-8 h-8 font-mono text-xs border transition-colors ${
                  i === page ? "border-ink bg-ink text-paper" : "border-line text-ash hover:border-ash"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              className="w-8 h-8 border border-line flex items-center justify-center hover:border-ash transition-colors disabled:opacity-30 disabled:pointer-events-none"
              aria-label="Next page"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}