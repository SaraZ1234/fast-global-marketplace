import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowUpRight,
  ShieldCheck,
  MapPin,
  Star,
  MessageCircle,
  Award,
  BadgeCheck,
  Building2,
  CalendarCheck,
  Clock3,
  FileCheck2,
  Boxes,
  Percent,
  Users,
  Factory,
  DollarSign,
  Globe2,
  Gauge,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import { Eyebrow, PrimaryButton, GhostButton, StatBlock } from "@/components/UI";
import SupplierActions from "@/components/supplier/SupplierActions";
import FactoryGallery from "@/components/supplier/FactoryGallery";
import SupplierReviews from "@/components/supplier/SupplierReviews";
import ProductShowcase from "@/components/supplier/ProductShowcase";
import { suppliers, products } from "@/lib/data";

export function generateStaticParams() {
  return suppliers.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const supplier = suppliers.find((s) => s.slug === params.slug);
  return { title: supplier ? supplier.name : "Supplier" };
}

// --- Deterministic trust / credential signals (no client state required) ---

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

const BUSINESS_TYPES = ["Manufacturer", "Manufacturer & Exporter", "Trading Company", "Distributor"];
const ALL_CERTIFICATIONS = ["ISO 9001", "ISO 14001", "CE Certified", "BSCI Audited", "SGS Verified", "Sedex Member"];

function getSupplierCredentials(slug: string, rating: number | string, years: number) {
  const h = hashString(slug);
  const numericRating = typeof rating === "string" ? parseFloat(rating) : rating;
  const businessType = BUSINESS_TYPES[h % BUSINESS_TYPES.length];
  const establishedYear = new Date().getFullYear() - years;
  const responseTimeHours = 1 + (h % 6);
  const tier = numericRating >= 4.6 ? "Gold Supplier" : "Verified Supplier";

  // Pick 3 deterministic, non-repeating certifications
  const certs: string[] = [];
  let seed = h;
  while (certs.length < 3) {
    const cert = ALL_CERTIFICATIONS[seed % ALL_CERTIFICATIONS.length];
    if (!certs.includes(cert)) certs.push(cert);
    seed = Math.floor(seed / 3) + 7;
  }

  return { businessType, establishedYear, responseTimeHours, tier, certs };
}

// --- New mock data: company overview, gallery, reviews ---

const EXPORT_REGIONS = [
  ["North America", "Europe", "Southeast Asia"],
  ["Middle East", "Africa", "South Asia"],
  ["Europe", "Oceania", "East Asia"],
  ["North America", "Latin America", "Middle East"],
];

function getCompanyOverview(slug: string, years: number) {
  const h = hashString(slug);
  const employeeBands = ["50-100", "100-200", "200-500", "500-1000", "1000+"];
  const factorySizeBands = ["1,000-3,000 m²", "3,000-10,000 m²", "10,000-30,000 m²", "30,000-50,000 m²"];
  const revenueBands = ["$2.5M - $5M", "$5M - $10M", "$10M - $25M", "$25M - $50M", "$50M+"];
  const capacityBands = ["10,000 units/month", "25,000 units/month", "50,000 units/month", "100,000+ units/month"];

  return {
    employees: employeeBands[h % employeeBands.length],
    factorySize: factorySizeBands[(h + years) % factorySizeBands.length],
    annualRevenue: revenueBands[(h + 3) % revenueBands.length],
    exportMarkets: EXPORT_REGIONS[h % EXPORT_REGIONS.length],
    productionCapacity: capacityBands[(h + 5) % capacityBands.length],
  };
}

function getGalleryItems(slug: string) {
  const h = hashString(slug);
  const seedImg = (n: number) => `https://picsum.photos/seed/${slug}-${n}/600/450`;
  return [
    { type: "factory" as const, src: seedImg(1), label: "Factory Floor" },
    { type: "factory" as const, src: seedImg(2), label: "Production Line" },
    { type: "factory" as const, src: seedImg(3), label: "Warehouse" },
    { type: "certificate" as const, src: seedImg(4), label: "ISO 9001 Certificate" },
    { type: "certificate" as const, src: seedImg(5), label: "CE Certificate" },
    {
      type: "video" as const,
      src: seedImg(6),
      label: "Factory Tour",
      videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    },
    { type: "factory" as const, src: seedImg(7), label: "Quality Control" },
    { type: "factory" as const, src: seedImg(8), label: "Packing Area" },
  ];
}

const REVIEW_NAMES = ["James Whitfield", "Amara Chen", "Diego Fernandez", "Fatima Al-Sayed", "Lucas Meyer", "Priya Nair", "Oliver Grant", "Sophia Rossi"];
const REVIEW_COUNTRIES = ["United States", "Germany", "UAE", "Brazil", "Australia", "India", "United Kingdom", "Italy"];
const REVIEW_COMMENTS = [
  "Professional communication from first inquiry to final shipment. Products arrived exactly as specified.",
  "Solid manufacturer with good QC. Minor delay on the second order but they kept us informed throughout.",
  "Factory audit checked out and product quality has been consistent across three repeat orders.",
  "Competitive pricing at volume and the sample process was fast. Would recommend for bulk sourcing.",
  "Good documentation support for customs clearance. Packaging was export-grade and well protected.",
  "Responsive account manager and transparent about lead times. No surprises on delivery.",
];

function getSupplierReviews(slug: string) {
  const h = hashString(slug);
  const count = 5 + (h % 4); // 5-8 reviews
  return Array.from({ length: count }).map((_, i) => {
    const seed = h + i * 17;
    return {
      name: REVIEW_NAMES[seed % REVIEW_NAMES.length],
      country: REVIEW_COUNTRIES[seed % REVIEW_COUNTRIES.length],
      rating: 3 + (seed % 3), // 3-5
      date: `${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"][seed % 7]} 2026`,
      comment: REVIEW_COMMENTS[seed % REVIEW_COMMENTS.length],
      helpful: seed % 24,
      verifiedBuyer: seed % 3 !== 0,
    };
  });
}

export default function SupplierDetail({ params }: { params: { slug: string } }) {
  const supplier = suppliers.find((s) => s.slug === params.slug);
  if (!supplier) return notFound();

  // Products matching this supplier directly, plus same-industry fallback so the
  // showcase always has enough relevant items (6-8), never mixing in unrelated industries.
  const directCatalog = products.filter((p) => p.supplierSlug === supplier.slug);
  const sameIndustryCatalog = products.filter(
    (p) => p.supplierSlug !== supplier.slug && p.industry.toLowerCase() === supplier.industry.toLowerCase()
  );
  const catalog = [...directCatalog, ...sameIndustryCatalog].slice(0, 8);

  const others = suppliers.filter((s) => s.slug !== supplier.slug).slice(0, 3);
  const { businessType, establishedYear, responseTimeHours, tier, certs } = getSupplierCredentials(
    supplier.slug,
    supplier.rating,
    supplier.years
  );
  const overview = getCompanyOverview(supplier.slug, supplier.years);
  const galleryItems = getGalleryItems(supplier.slug);
  const reviews = getSupplierReviews(supplier.slug);
  const numericRating = typeof supplier.rating === "string" ? parseFloat(supplier.rating) : supplier.rating;

  return (
    <div className="overflow-x-hidden">
      <section className="border-b border-line bg-paper">
        <div className="container-x py-8 sm:py-14 md:py-20">
          <nav className="text-[11px] sm:text-xs font-mono uppercase tracking-widest2 text-smoke mb-5 sm:mb-8 overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-ink transition-colors">
              Home
            </Link>
            <span className="mx-2 text-line">/</span>
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
              <div className="flex items-start gap-3 sm:gap-5 min-w-0">
                <div className="w-11 h-11 sm:w-16 sm:h-16 bg-ink text-paper flex items-center justify-center font-display font-bold text-base sm:text-xl shrink-0">
                  {supplier.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="font-display font-bold text-lg sm:text-2xl md:text-3xl tracking-tightest break-words">
                      {supplier.name}
                    </h1>
                    {supplier.verified && (
                      <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-mono uppercase tracking-wide border border-line px-2 py-1 whitespace-nowrap text-ash">
                        <ShieldCheck size={12} className="shrink-0" /> Verified
                      </span>
                    )}
                  </div>

                  {/* Trust / tier badges */}
                  <div className="mt-2.5 sm:mt-3 flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-mono uppercase tracking-wide text-amber-700 border border-line px-1.5 py-1">
                      <Award size={11} className="text-amber-600 shrink-0" /> {tier}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-mono uppercase tracking-wide text-emerald-700 border border-line px-1.5 py-1">
                      <ShieldCheck size={11} className="text-emerald-600 shrink-0" /> Trade Assurance
                    </span>
                    <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-mono uppercase tracking-wide text-smoke border border-line px-1.5 py-1">
                      <Building2 size={11} className="shrink-0" /> {businessType}
                    </span>
                  </div>

                  <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-1.5 sm:gap-y-2 text-xs sm:text-sm text-ash">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin size={14} className="shrink-0 text-smoke" /> {supplier.country}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Star size={14} className="shrink-0 text-smoke" /> {supplier.rating} rating
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarCheck size={14} className="shrink-0 text-smoke" /> Since {establishedYear}
                    </span>
                  </div>

                  <p className="mt-4 sm:mt-5 text-ash text-xs sm:text-base leading-relaxed max-w-xl">
                    {supplier.description}
                  </p>

                  <p className="mt-3 flex items-center gap-1.5 text-[11px] sm:text-xs text-smoke">
                    <Clock3 size={12} className="shrink-0" />
                    Typically responds within {responseTimeHours} hour{responseTimeHours > 1 ? "s" : ""}
                  </p>

                  <div className="mt-4">
                    <SupplierActions supplierName={supplier.name} />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0 w-full md:w-auto">
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
        <div className="container-x py-8 sm:py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:divide-x md:divide-line">
            {[
              { icon: Percent, value: supplier.responseRate, label: "Response Rate" },
              { icon: CalendarCheck, value: `${supplier.years}`, label: "Years on FAST" },
              { icon: Star, value: supplier.rating, label: "Buyer Rating" },
              { icon: Boxes, value: `${catalog.length || supplier.mainProducts.length}`, label: "Listed Products" },
            ].map((stat, idx) => (
              <Reveal key={stat.label} delay={idx * 0.06}>
                <div className={`md:pl-8 ${idx === 0 ? "first:md:pl-0" : ""}`}>
                  <stat.icon size={15} className="text-smoke mb-1.5 sm:mb-2 shrink-0" />
                  <StatBlock value={stat.value} label={stat.label} />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="border-b border-line bg-bone">
        <div className="container-x py-8 sm:py-14 md:py-20">
          <Reveal>
            <Eyebrow>Company Overview</Eyebrow>
          </Reveal>
          <div className="mt-5 sm:mt-8 grid grid-cols-2 md:grid-cols-3 gap-px bg-line border border-line max-w-4xl">
            {[
              { icon: Users, label: "Employees", value: overview.employees },
              { icon: Factory, label: "Factory Size", value: overview.factorySize },
              { icon: DollarSign, label: "Annual Revenue", value: overview.annualRevenue },
              { icon: Gauge, label: "Production Capacity", value: overview.productionCapacity },
              { icon: Building2, label: "Business Type", value: businessType },
              { icon: CalendarCheck, label: "Established", value: `${establishedYear}` },
            ].map((item, idx) => (
              <Reveal key={item.label} delay={idx * 0.05}>
                <div className="bg-paper p-4 sm:p-5 h-full flex items-start gap-3">
                  <item.icon size={16} className="text-smoke shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-[9px] sm:text-xs font-mono uppercase tracking-widest2 text-smoke">
                      {item.label}
                    </p>
                    <p className="mt-1 text-xs sm:text-sm font-medium break-words">{item.value}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Export markets */}
          <div className="mt-6 sm:mt-8 max-w-4xl">
            <p className="text-[10px] sm:text-xs font-mono uppercase tracking-widest2 text-smoke mb-3 flex items-center gap-1.5">
              <Globe2 size={13} /> Export Markets
            </p>
            <div className="flex flex-wrap gap-2">
              {overview.exportMarkets.map((region) => (
                <span
                  key={region}
                  className="text-xs font-medium border border-line px-3 py-1.5 hover:border-ink/30 hover:bg-bone transition-colors"
                >
                  {region}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Factory & Company Gallery */}
      <section className="border-b border-line bg-bone">
        <div className="container-x py-8 sm:py-14 md:py-20">
          <Reveal>
            <Eyebrow>Factory & Company Gallery</Eyebrow>
            <p className="mt-2 text-xs sm:text-sm text-smoke max-w-xl">
              Facility photos, certification documents, and a factory walkthrough video.
            </p>
          </Reveal>
          <div className="mt-5 sm:mt-8">
            <FactoryGallery items={galleryItems} />
          </div>
        </div>
      </section>

      {/* Certifications & Credentials */}
      <section className="border-b border-line bg-bone">
        <div className="container-x py-8 sm:py-14 md:py-20">
          <Reveal>
            <Eyebrow>Certifications & Credentials</Eyebrow>
            <div className="mt-5 sm:mt-6 grid grid-cols-1 sm:grid-cols-3 gap-px bg-line border border-line max-w-3xl">
              {certs.map((cert, idx) => (
                <Reveal key={cert} delay={idx * 0.06}>
                  <div className="bg-paper p-4 sm:p-5 flex items-center gap-3">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 flex items-center justify-center border border-line">
                      <FileCheck2 size={15} className="text-emerald-600 shrink-0" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium break-words">{cert}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-line bg-paper">
        <div className="container-x py-8 sm:py-14 md:py-20">
          <Reveal>
            <Eyebrow>Main Products</Eyebrow>
            <div className="mt-5 sm:mt-6 flex flex-wrap gap-2 sm:gap-3">
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

      {/* Expanded Product Showcase (6-8 items, same industry, carousel on mobile / pagination on desktop) */}
      {catalog.length > 0 && (
        <section className="border-b border-line bg-paper">
          <div className="container-x py-8 sm:py-14 md:py-20">
            <Reveal>
              <Eyebrow>Catalog</Eyebrow>
              <p className="mt-2 text-xs sm:text-sm text-smoke max-w-xl">
                Products from {supplier.name} and other {supplier.industry.toLowerCase()} listings on FAST.
              </p>
            </Reveal>
            <div className="mt-5 sm:mt-8">
              <ProductShowcase
                products={catalog.map((p) => ({ slug: p.slug, code: p.code, name: p.name, price: p.price }))}
              />
            </div>
          </div>
        </section>
      )}

      {/* Customer Reviews & Buyer Feedback */}
      <section className="border-b border-line bg-bone">
        <div className="container-x py-8 sm:py-14 md:py-20">
          <Reveal>
            <Eyebrow>Customer Reviews & Buyer Feedback</Eyebrow>
          </Reveal>
          <div className="mt-5 sm:mt-8">
            <SupplierReviews reviews={reviews} averageRating={numericRating} reviewCount={reviews.length} />
          </div>
        </div>
      </section>

      <section className="bg-bone">
        <div className="container-x py-8 sm:py-14 md:py-20">
          <Reveal>
            <Eyebrow>Other Suppliers</Eyebrow>
          </Reveal>
          <div className="mt-5 sm:mt-8 grid grid-cols-1 sm:grid-cols-3 gap-px bg-line border border-line">
            {others.map((o, i) => (
              <Reveal key={o.slug} delay={i * 0.05}>
                <Link
                  href={`/suppliers/${o.slug}`}
                  className="group block bg-paper p-4 sm:p-6 h-full card-hover border border-transparent transition-all duration-300 hover:border-ink/10 hover:-translate-y-0.5 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 bg-ink text-paper flex items-center justify-center font-display font-bold text-sm shrink-0">
                      {o.name.charAt(0)}
                    </div>
                    {o.verified && (
                      <span className="inline-flex items-center gap-1 text-[9px] font-mono uppercase tracking-wide text-emerald-700 border border-line px-1.5 py-0.5 shrink-0">
                        <BadgeCheck size={10} className="text-emerald-600 shrink-0" /> Verified
                      </span>
                    )}
                  </div>
                  <h3 className="mt-3 sm:mt-4 font-display font-semibold text-sm sm:text-base break-words">
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

      {/* Spacer so fixed mobile CTA bar never overlaps the last section's content */}
      <div className="lg:hidden h-24" aria-hidden="true" />

      {/* Sticky mobile CTA bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-paper border-t border-line px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[9px] font-mono uppercase tracking-widest2 text-smoke">Supplier</p>
          <p className="text-xs sm:text-sm font-medium truncate">{supplier.name}</p>
        </div>
        <div className="shrink-0">
          <PrimaryButton href="/contact" icon={ArrowUpRight}>
            Get Quote
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}