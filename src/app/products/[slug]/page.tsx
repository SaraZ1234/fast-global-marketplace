import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, ShieldCheck, MapPin, Star } from "lucide-react";
import Reveal from "@/components/Reveal";
import { Eyebrow, PrimaryButton, GhostButton } from "@/components/UI";
import { products, suppliers } from "@/lib/data";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const product = products.find((p) => p.slug === params.slug);
  return { title: product ? product.name : "Product" };
}

export default function ProductDetail({ params }: { params: { slug: string } }) {
  const product = products.find((p) => p.slug === params.slug);
  if (!product) return notFound();

  const supplier = suppliers.find((s) => s.slug === product.supplierSlug);
  const related = products.filter((p) => p.slug !== product.slug && p.industry === product.industry).slice(0, 3);

  return (
    <>
      <section className="border-b border-line overflow-hidden">
        <div className="container-x py-10 sm:py-14 md:py-20">
          <nav className="text-[11px] sm:text-xs font-mono uppercase tracking-widest2 text-smoke mb-6 sm:mb-8 flex flex-wrap items-center gap-1">
            <Link href="/products" className="hover:text-ink">Products</Link>
            <span className="mx-1">/</span>
            <span className="text-ink break-words">{product.industry}</span>
          </nav>

          <div className="grid lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12">
            <div className="lg:col-span-5">
              <div className="aspect-square bg-bone border border-line flex items-center justify-center">
                <span className="font-mono text-xs sm:text-sm text-smoke">{product.code}</span>
              </div>
            </div>

            <div className="lg:col-span-7 min-w-0">
              <Eyebrow>{product.industry}</Eyebrow>
              <h1 className="mt-4 font-display font-bold text-2xl sm:text-3xl md:text-4xl tracking-tightest break-words">
                {product.name}
              </h1>
              <p className="mt-4 sm:mt-5 text-ash leading-relaxed max-w-xl text-sm sm:text-base">
                {product.description}
              </p>

              <div className="mt-6 sm:mt-8 grid grid-cols-3 gap-3 sm:gap-6 border-y border-line py-5 sm:py-6 max-w-md">
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs font-mono uppercase tracking-widest2 text-smoke">Price</p>
                  <p className="mt-1 font-medium text-sm sm:text-base break-words">{product.price}</p>
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs font-mono uppercase tracking-widest2 text-smoke">MOQ</p>
                  <p className="mt-1 font-medium text-sm sm:text-base break-words">{product.moq}</p>
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs font-mono uppercase tracking-widest2 text-smoke">Lead Time</p>
                  <p className="mt-1 font-medium text-sm sm:text-base break-words">{product.leadTime}</p>
                </div>
              </div>

              <div className="mt-6 sm:mt-8 flex flex-wrap gap-3 sm:gap-4">
                <PrimaryButton href="/contact" icon={ArrowUpRight}>
                  Request Quotation
                </PrimaryButton>
                {supplier && (
                  <GhostButton href={`/suppliers/${supplier.slug}`}>
                    View Supplier
                  </GhostButton>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-bone overflow-hidden">
        <div className="container-x py-10 sm:py-14 md:py-20">
          <Eyebrow>Specifications</Eyebrow>
          <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-px bg-line border border-line max-w-3xl">
            {product.specs.map((s) => (
              <div
                key={s.label}
                className="bg-paper p-4 sm:p-5 flex items-center justify-between gap-3 sm:gap-4"
              >
                <span className="text-xs sm:text-sm text-smoke">{s.label}</span>
                <span className="text-xs sm:text-sm font-medium text-right break-words">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {supplier && (
        <section className="border-b border-line overflow-hidden">
          <div className="container-x py-10 sm:py-14 md:py-20">
            <Eyebrow>Supplied By</Eyebrow>
            <Link
              href={`/suppliers/${supplier.slug}`}
              className="mt-6 group flex flex-col sm:flex-row sm:items-center justify-between gap-5 sm:gap-6 border border-line p-5 sm:p-6 card-hover max-w-3xl"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-ink text-paper flex items-center justify-center font-display font-bold shrink-0">
                  {supplier.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-display font-semibold break-words">{supplier.name}</h3>
                    {supplier.verified && <ShieldCheck size={15} className="shrink-0" />}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ash font-mono">
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={12} className="shrink-0" /> {supplier.country}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Star size={12} className="shrink-0" /> {supplier.rating}
                    </span>
                    <span>{supplier.years} yrs on FAST</span>
                  </div>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                View profile <ArrowUpRight size={13} />
              </span>
            </Link>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="overflow-hidden">
          <div className="container-x py-10 sm:py-14 md:py-20">
            <Eyebrow>More in {product.industry}</Eyebrow>
            <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-line border border-line">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/products/${r.slug}`}
                  className="group block bg-paper p-5 sm:p-6 card-hover border border-transparent min-w-0"
                >
                  <span className="font-mono text-xs text-smoke">{r.code}</span>
                  <h3 className="mt-3 font-display font-semibold leading-snug break-words">{r.name}</h3>
                  <p className="mt-2 text-sm font-medium">{r.price}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest2 opacity-0 group-hover:opacity-100 transition-opacity">
                    View <ArrowUpRight size={13} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}