import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, ShieldCheck, MapPin, Star, MessageCircle } from "lucide-react";
import Reveal from "@/components/Reveal";
import { Eyebrow, PrimaryButton, GhostButton, StatBlock } from "@/components/UI";
import { suppliers, products } from "@/lib/data";

export function generateStaticParams() {
  return suppliers.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const supplier = suppliers.find((s) => s.slug === params.slug);
  return { title: supplier ? supplier.name : "Supplier" };
}

export default function SupplierDetail({ params }: { params: { slug: string } }) {
  const supplier = suppliers.find((s) => s.slug === params.slug);
  if (!supplier) return notFound();

  const catalog = products.filter((p) => p.supplierSlug === supplier.slug);
  const others = suppliers.filter((s) => s.slug !== supplier.slug).slice(0, 3);

  return (
    <div className="overflow-x-hidden">
      <section className="border-b border-line">
        <div className="container-x py-10 sm:py-14 md:py-20">
          <nav className="text-xs font-mono uppercase tracking-widest2 text-smoke mb-6 sm:mb-8 overflow-x-auto whitespace-nowrap">
            <Link
              href="/suppliers"
              className="hover:text-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40 rounded-sm"
            >
              Suppliers
            </Link>
            <span className="mx-2 text-line">/</span>
            <span className="text-ink">{supplier.industry}</span>
          </nav>

          <Reveal>
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 sm:gap-8">
              <div className="flex items-start gap-4 sm:gap-5">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-ink text-paper flex items-center justify-center font-display font-bold text-lg sm:text-xl shrink-0">
                  {supplier.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="font-display font-bold text-xl sm:text-2xl md:text-3xl tracking-tightest break-words">
                      {supplier.name}
                    </h1>
                    {supplier.verified && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-wide border border-line px-2 py-1 whitespace-nowrap text-ash">
                        <ShieldCheck size={12} className="shrink-0" /> Verified
                      </span>
                    )}
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 sm:gap-5 text-sm text-ash">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin size={15} className="shrink-0 text-smoke" /> {supplier.country}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Star size={15} className="shrink-0 text-smoke" /> {supplier.rating} rating
                    </span>
                    <span>{supplier.years} years on FAST</span>
                  </div>
                  <p className="mt-5 text-ash text-sm sm:text-base leading-relaxed max-w-xl">
                    {supplier.description}
                  </p>
                </div>
              </div>

              <div className="flex flex-col xs:flex-row md:flex-col gap-3 shrink-0 w-full md:w-auto">
                <PrimaryButton href="/contact" icon={ArrowUpRight}>
                  Request Quotation
                </PrimaryButton>
                <GhostButton href="/contact" icon={MessageCircle}>
                  Chat with Supplier
                </GhostButton>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-line bg-bone">
        <div className="container-x py-10 sm:py-12 md:py-16">
          <Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:divide-x md:divide-line">
              <div className="md:pl-8 first:md:pl-0">
                <StatBlock value={supplier.responseRate} label="Response Rate" />
              </div>
              <div className="md:pl-8">
                <StatBlock value={`${supplier.years}`} label="Years on FAST" />
              </div>
              <div className="md:pl-8">
                <StatBlock value={supplier.rating} label="Buyer Rating" />
              </div>
              <div className="md:pl-8">
                <StatBlock
                  value={`${catalog.length || supplier.mainProducts.length}`}
                  label="Listed Products"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="container-x py-10 sm:py-14 md:py-20">
          <Reveal>
            <Eyebrow>Main Products</Eyebrow>
            <div className="mt-6 flex flex-wrap gap-2 sm:gap-3">
              {supplier.mainProducts.map((mp) => (
                <span
                  key={mp}
                  className="text-xs sm:text-sm font-medium border border-line px-3 sm:px-4 py-1.5 sm:py-2 break-words transition-colors hover:border-ink/30 hover:bg-bone"
                >
                  {mp}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {catalog.length > 0 && (
        <section className="border-b border-line">
          <div className="container-x py-10 sm:py-14 md:py-20">
            <Reveal>
              <Eyebrow>Catalog</Eyebrow>
            </Reveal>
            <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-line border border-line">
              {catalog.map((p, i) => (
                <Reveal key={p.slug} delay={(i % 3) * 0.05}>
                  <Link
                    href={`/products/${p.slug}`}
                    className="group block bg-paper p-5 sm:p-6 h-full card-hover border border-transparent transition-all duration-300 hover:border-ink/10 hover:-translate-y-0.5 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40"
                  >
                    <span className="font-mono text-xs text-smoke">{p.code}</span>
                    <h3 className="mt-3 font-display font-semibold leading-snug text-sm sm:text-base break-words">
                      {p.name}
                    </h3>
                    <p className="mt-2 text-sm font-medium">{p.price}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest2 text-ink opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                      View product <ArrowUpRight size={13} />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section>
        <div className="container-x py-10 sm:py-14 md:py-20">
          <Reveal>
            <Eyebrow>Other Suppliers</Eyebrow>
          </Reveal>
          <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-px bg-line border border-line">
            {others.map((o, i) => (
              <Reveal key={o.slug} delay={i * 0.05}>
                <Link
                  href={`/suppliers/${o.slug}`}
                  className="group block bg-paper p-5 sm:p-6 h-full card-hover border border-transparent transition-all duration-300 hover:border-ink/10 hover:-translate-y-0.5 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40"
                >
                  <div className="w-9 h-9 bg-ink text-paper flex items-center justify-center font-display font-bold text-sm shrink-0">
                    {o.name.charAt(0)}
                  </div>
                  <h3 className="mt-4 font-display font-semibold text-sm sm:text-base break-words">
                    {o.name}
                  </h3>
                  <p className="mt-1 text-xs text-smoke break-words">
                    {o.country} · {o.industry}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest2 text-ink opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                    View profile <ArrowUpRight size={13} />
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