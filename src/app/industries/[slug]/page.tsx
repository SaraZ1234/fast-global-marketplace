import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Users, Package, ShieldCheck } from "lucide-react";
import Reveal from "@/components/Reveal";
import { Eyebrow, PrimaryButton, GhostButton } from "@/components/UI";
// import { industries } from "@/lib/data";
import { apiRequest } from "@/lib/api";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const response = await apiRequest("/category");
  const { slug } = await params;

  const categories = response.data || response;

  const ind = categories.find(
    (c: any) =>
      c.name.toLowerCase().replace(/\s+/g, "-") === slug
  );

  return {
    title: ind ? ind.name : "Industry",
  };
}

// Deterministic hash so each industry always renders the same supplier/product
// counts on every load — matches the stats shown on the Industries overview page.
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
  return {
    suppliers: 200 + (h % 4800), // 200 - 4999
    products: 1000 + (h % 48000), // 1,000 - 48,999
    verifiedRate: 90 + (h % 9), // 90 - 98
  };
}

export default async function IndustryDetail({
  params,
}: {
  params: { slug: string };
}) {
  const categoryResponse = await apiRequest("/category");
  const subResponse = await apiRequest("/subcategories");

  const categories = categoryResponse.data || categoryResponse;
  const subCategories = subResponse.data || subResponse;

  const ind = categories.find(
    (c: any) =>
      c.name.toLowerCase().replace(/\s+/g, "-") === params.slug
  );

  if (!ind) return notFound();

  const categorySubs = subCategories.filter(
    (sub: any) => sub.categoryId === ind.id
  );

  const others = categories
    .filter((c: any) => c.id !== ind.id)
    .slice(0, 3);
  const categorySlug = ind.name.toLowerCase().replace(/\s+/g, "-");

const { suppliers, products, verifiedRate } = getIndustryStats(categorySlug);

  return (
    <div className="overflow-x-hidden">
      <section className="border-b border-line bg-paper">
        <div className="container-x py-10 sm:py-20 md:py-28">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6 sm:mb-8 hidden sm:block">
            <ol className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest2 text-smoke">
              <li>
                <Link href="/" className="hover:text-ink transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/industries" className="hover:text-ink transition-colors">
                  Industries
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-ink break-words">{ind.name}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10">
            <div className="lg:col-span-8">
              <Reveal>
                <div className="flex items-center gap-3 flex-wrap">
                  <Eyebrow>Category {ind.id}</Eyebrow>
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wide text-emerald-700 border border-line px-1.5 py-0.5">
                    <ShieldCheck size={11} className="text-emerald-600 shrink-0" />
                    {verifiedRate}% Verified Suppliers
                  </span>
                </div>
                <h1 className="mt-5 font-display font-bold text-[clamp(1.875rem,8vw,3rem)] sm:text-4xl md:text-6xl tracking-tightest break-words">
                  {ind.name}
                </h1>
                <p className="mt-6 text-ash max-w-xl text-sm sm:text-base leading-relaxed">
                  {ind.description}
                </p>

                {/* Stats row */}
                <div className="mt-7 sm:mt-9 flex flex-wrap gap-x-8 gap-y-4 max-w-xl border-y border-line py-5 sm:py-6">
                  <div className="min-w-0">
                    <p className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-mono uppercase tracking-widest2 text-smoke">
                      <Users size={12} className="shrink-0" /> Suppliers
                    </p>
                    <p className="mt-1 font-display font-bold text-lg sm:text-2xl tracking-tightest">
                      {suppliers.toLocaleString()}+
                    </p>
                  </div>
                  <div className="min-w-0">
                    <p className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-mono uppercase tracking-widest2 text-smoke">
                      <Package size={12} className="shrink-0" /> Products
                    </p>
                    <p className="mt-1 font-display font-bold text-lg sm:text-2xl tracking-tightest">
                      {products.toLocaleString()}+
                    </p>
                  </div>
                  <div className="min-w-0">
                    <p className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-mono uppercase tracking-widest2 text-smoke">
                      <ShieldCheck size={12} className="shrink-0" /> Sub-Categories
                    </p>
                    <p className="mt-1 font-display font-bold text-lg sm:text-2xl tracking-tightest">
                      {categorySubs.length}
                    </p>
                  </div>
                </div>

                <div className="mt-7 sm:mt-9 flex flex-wrap gap-3 sm:gap-4">
                  <PrimaryButton href="/products" icon={ArrowUpRight}>
                    Browse {ind.name} Products
                  </PrimaryButton>
                  <GhostButton href="/contact" icon={ArrowRight}>
                    Request Quotation
                  </GhostButton>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-bone">
        <div className="container-x py-10 sm:py-16 md:py-20">
          <Eyebrow>Sub-Categories</Eyebrow>
          <h2 className="mt-4 font-display font-bold text-lg sm:text-2xl md:text-3xl tracking-tightest mb-6 sm:mb-10 break-words">
            What buyers source here.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-line border border-line">
            {categorySubs.map((item: any, i: number) => (
              <Reveal key={item.name} delay={(i % 4) * 0.05}>
                <div className="group bg-paper p-4 sm:p-6 h-full card-hover border border-transparent transition-all duration-300 hover:border-ink/10 hover:-translate-y-0.5 hover:shadow-sm">
                  <div className="flex items-center justify-between gap-2">
                    <span className="idx text-xs text-smoke">
                      {ind.id}.{String(i + 1).padStart(2, "0")}
                    </span>
                    <ArrowUpRight
                      size={13}
                      className="shrink-0 text-smoke opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 hidden sm:block"
                    />
                  </div>
                  <p className="mt-3 font-medium text-sm sm:text-base break-words">{item.name}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-bone">
        <div className="container-x py-10 sm:py-16 md:py-20">
          <Eyebrow>Related Industries</Eyebrow>
          <div className="mt-5 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-px bg-line border border-line">
            {others.map((o: any, i: number) => {
              const slug = o.name.toLowerCase().replace(/\s+/g, "-");
              const stats = getIndustryStats(slug);
              return (
                <Reveal key={o.id} delay={i * 0.06}>
                  <Link
                    href={`/industries/${slug}`}
                    className="group flex flex-col justify-between h-full bg-paper p-5 sm:p-6 card-hover border border-transparent transition-all duration-300 hover:border-ink/10 hover:-translate-y-0.5 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-3">
                        <span className="idx text-xs text-smoke">{o.id}</span>
                        <span className="inline-flex items-center gap-1 text-[9px] font-mono uppercase tracking-wide text-emerald-700 border border-line px-1.5 py-0.5 shrink-0">
                          <ShieldCheck size={10} className="text-emerald-600 shrink-0" />
                          Verified
                        </span>
                      </div>
                      <h3 className="mt-3 font-display font-semibold text-sm sm:text-base break-words">
                        {o.name}
                      </h3>
                      <div className="mt-3 flex items-center gap-3 text-[11px] text-smoke">
                        <span className="inline-flex items-center gap-1">
                          <Users size={11} className="shrink-0" />
                          {stats.suppliers.toLocaleString()}+
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Package size={11} className="shrink-0" />
                          {stats.products.toLocaleString()}+
                        </span>
                      </div>
                    </div>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest2 text-ink opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      Explore <ArrowUpRight size={13} className="shrink-0" />
                    </span>
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