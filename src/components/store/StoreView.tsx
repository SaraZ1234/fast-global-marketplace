"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Mail,
  MapPin,
  Package,
  Phone,
  Share2,
  ShieldCheck,
  Store as StoreIcon,
} from "lucide-react";

import Reveal from "@/components/Reveal";
import { Eyebrow, SectionHeading, GhostButton } from "@/components/UI";

import {
  getStoreBySlug,
  type Seller,
  type StoreData,
  type StoreProduct,
} from "@/lib/storeData";

type ViewState =
  | { status: "loading" }
  | { status: "notfound" }
  | { status: "ready"; data: StoreData };

const btnBase =
  "inline-flex items-center justify-center gap-2 min-h-[44px] px-5 sm:px-6 text-sm font-medium border transition-all duration-200 group";

const btnPrimary = `${btnBase} bg-ink text-paper border-ink hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]`;

const btnGhost = `${btnBase} bg-transparent text-ink border-ink hover:bg-ink hover:text-paper`;

export default function StoreView({ slug }: { slug: string }) {
  const [state, setState] = useState<ViewState>({
    status: "loading",
  });

  const [forceEmpty, setForceEmpty] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const preview = new URLSearchParams(
      window.location.search
    ).get("preview");

    if (preview === "loading") {
      return;
    }

    if (preview === "empty") {
      setForceEmpty(true);
    }

    getStoreBySlug(
      preview === "notfound" ? "__missing__" : slug
    ).then((data) => {
      if (cancelled) return;

      setState(
        data
          ? { status: "ready", data }
          : { status: "notfound" }
      );
    });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (state.status === "loading") {
    return <StoreSkeleton />;
  }

  if (state.status === "notfound") {
    return <StoreNotFound />;
  }

  const seller = state.data?.seller;

  if (!seller) {
    return <StoreNotFound />;
  }

  const products = forceEmpty
    ? []
    : state.data?.products ?? [];

  return (
    <div className="overflow-x-hidden">
      <StoreHeader seller={seller} />
      <AboutStore seller={seller} />
      <StoreProducts
        seller={seller}
        products={products}
      />
      <StoreInformation seller={seller} />
    </div>
  );
}

/* ---------------------------------- HEADER --------------------------------- */

function StoreHeader({ seller }: { seller: Seller }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: seller.storeName,
          url,
        });
        return;
      }

      await navigator.clipboard.writeText(url);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      // User cancelled share.
    }
  }

  return (
    <section className="relative bg-paper border-b border-line overflow-hidden">
      {seller.banner ? (
        <div className="relative h-28 sm:h-36 md:h-44 lg:h-52 bg-bone border-b border-line overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={seller.banner}
            alt={`${seller.storeName} banner`}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      ) : (
        <>
          <div className="absolute inset-0 grid-paper opacity-[0.035] pointer-events-none" />

          <div className="absolute -top-24 -right-24 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-ink/[0.04] blur-3xl pointer-events-none" />

          <div className="absolute top-1/3 -left-24 w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-ink/[0.03] blur-3xl pointer-events-none" />
        </>
      )}

      <div
        className={`container-x relative pb-8 sm:pb-10 ${
          seller.banner ? "" : "pt-10 sm:pt-14"
        }`}
      >
        <div
          className={`flex flex-col md:flex-row gap-4 sm:gap-6 ${
            seller.banner
              ? "md:items-start -mt-10 sm:-mt-14"
              : "md:items-end"
          }`}
        >
          <Reveal>
            <div className="shrink-0 w-24 h-24 sm:w-32 sm:h-32 border border-ink bg-paper flex items-center justify-center overflow-hidden">
              {seller.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={seller.logo}
                  alt={`${seller.storeName} logo`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="font-display font-bold text-3xl sm:text-4xl tracking-tightest">
                  {seller.storeName
                    .split(" ")
                    .map((w) => w[0])
                    .slice(0, 2)
                    .join("")}
                </span>
              )}
            </div>
          </Reveal>

          <div
            className={`flex-1 min-w-0 ${
              seller.banner
                ? "md:pt-[4.5rem]"
                : "md:pb-1"
            }`}
          >
            <Reveal delay={0.05}>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <Eyebrow>{seller.businessType}</Eyebrow>

                {seller.verified && (
                  <span className="inline-flex items-center gap-1.5 border border-ink px-2.5 py-1 text-xs font-mono uppercase tracking-widest2">
                    <ShieldCheck size={13} />
                    Verified Seller
                  </span>
                )}
              </div>

              <h1 className="mt-3 font-display font-bold leading-[0.95] tracking-tightest text-[clamp(2rem,7vw,3rem)] md:text-5xl lg:text-6xl break-words">
                {seller.storeName}
              </h1>

              <p className="mt-3 flex items-center gap-2 text-sm text-ash">
                <MapPin size={15} className="shrink-0" />
                {seller.location}, {seller.country}
              </p>
            </Reveal>
          </div>
        </div>

        <Reveal delay={0.15}>
          <div className="mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:items-end">
            <p className="lg:col-span-7 text-ash text-base sm:text-lg leading-relaxed max-w-2xl">
              {seller.description
                .split(". ")[0]
                .replace(/\.$/, "")}
              .
            </p>

            <div className="lg:col-span-5 flex flex-wrap gap-3 sm:gap-4 lg:justify-end">
              <a
                href="#store-information"
                className={btnPrimary}
              >
                Contact Seller
                <ArrowUpRight
                  size={16}
                  className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>

              <button
                type="button"
                onClick={share}
                className={btnGhost}
                aria-live="polite"
              >
                {copied ? (
                  <Check size={16} />
                ) : (
                  <Share2 size={16} />
                )}

                {copied ? "Link copied" : "Share Store"}
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ----------------------------------- ABOUT --------------------------------- */

function AboutStore({ seller }: { seller: Seller }) {
  const facts = [
    {
      label: "Business type",
      value: seller.businessType,
    },
    {
      label: "Based in",
      value: `${seller.location}, ${seller.country}`,
    },
    ...(seller.yearsInBusiness
      ? [
          {
            label: "In business",
            value: `${seller.yearsInBusiness} years`,
          },
        ]
      : []),
    {
      label: "Verification",
      value: seller.verified
        ? "Verified Seller"
        : "Not yet verified",
    },
  ];

  return (
    <section className="bg-paper border-b border-line">
      <div className="container-x py-12 sm:py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-10">
          <div className="md:col-span-4">
            <Reveal>
              <Eyebrow>About the Store</Eyebrow>

              <h2 className="mt-4 font-display font-bold text-xl sm:text-2xl md:text-3xl tracking-tightest">
                Who you are buying from.
              </h2>
            </Reveal>
          </div>

          <div className="md:col-span-8">
            <Reveal delay={0.1}>
              <p className="text-ash leading-relaxed text-sm sm:text-base md:text-lg">
                {seller.description}
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <dl className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 border-t border-line pt-6">
                {facts.map((f) => (
                  <div key={f.label}>
                    <dt className="text-xs font-mono uppercase tracking-widest2 text-smoke">
                      {f.label}
                    </dt>

                    <dd className="mt-1.5 font-display font-semibold text-sm sm:text-base">
                      {f.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- PRODUCTS -------------------------------- */

function StoreProducts({
  seller,
  products,
}: {
  seller: Seller;
  products: StoreProduct[];
}) {
  return (
    <section className="border-b border-line bg-bone">
      <div className="container-x py-14 sm:py-20 md:py-28">
        <div className="mb-10 sm:mb-14">
          <SectionHeading
            eyebrow="Products"
            title={`Listed by ${seller.storeName}.`}
            description={
              products.length
                ? `${products.length} approved ${
                    products.length === 1
                      ? "listing"
                      : "listings"
                  } from this seller.`
                : undefined
            }
          />
        </div>

        {products.length === 0 ? (
          <Reveal>
            <div className="bg-paper border border-line px-6 py-14 sm:py-20 text-center">
              <Package
                size={28}
                className="mx-auto text-smoke"
              />

              <p className="mt-4 font-display font-semibold text-lg">
                This seller hasn&apos;t listed any products
                yet.
              </p>

              <p className="mt-2 text-sm text-ash">
                Browse the marketplace for similar suppliers.
              </p>

              <div className="mt-6 flex justify-center">
                <GhostButton
                  href="/products"
                  icon={ArrowRight}
                >
                  Browse products
                </GhostButton>
              </div>
            </div>
          </Reveal>
        ) : (
          <div className="grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-line border border-line">
            {products.map((p, i) => (
              <Reveal
                key={p.slug}
                delay={(i % 4) * 0.05}
              >
                <StoreProductCard product={p} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function stockInfo(stock: number) {
  if (stock <= 0) {
    return {
      label: "Out of stock",
      dim: true,
    };
  }

  if (stock <= 10) {
    return {
      label: `Only ${stock} left`,
      dim: false,
    };
  }

  return {
    label: "In stock",
    dim: false,
  };
}

function StoreProductCard({
  product: p,
}: {
  product: StoreProduct;
}) {
  const stock = stockInfo(p.stock);

  return (
    <Link
      href={`/products/${p.slug}`}
      className="group flex flex-col bg-paper h-full card-hover border border-transparent transition-all duration-300 hover:border-ink/15 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(0,0,0,0.05)]"
    >
      <div className="relative aspect-square bg-bone overflow-hidden border-b border-line">
        {p.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={p.image}
            alt={p.name}
            loading="lazy"
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04] ${
              stock.dim ? "opacity-60" : ""
            }`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-smoke">
            <Package size={28} />
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-4 sm:p-5">
        <span className="text-xs font-mono uppercase tracking-widest2 text-smoke">
          {p.category}
        </span>

        <h3 className="mt-2 font-display font-semibold text-base tracking-tight leading-snug">
          {p.name}
        </h3>

        <div className="mt-auto pt-4 flex items-end justify-between gap-3">
          <p className="font-display font-bold text-lg tracking-tight">
            <span className="text-xs font-mono font-normal text-ash mr-1.5">
              {p.currency}
            </span>

            {p.price.toLocaleString(undefined, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            })}
          </p>

          <span
            className={`text-xs ${
              stock.dim ? "text-smoke" : "text-ash"
            }`}
          >
            {stock.label}
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ----------------------------- STORE INFORMATION --------------------------- */

function StoreInformation({
  seller,
}: {
  seller: Seller;
}) {
  const rows = [
    {
      icon: MapPin,
      label: "Location",
      value: `${seller.location}, ${seller.country}`,
    },
    {
      icon: Phone,
      label: "Phone",
      value: seller.phone,
      href: `https://wa.me/${seller.phone.replace(/\D/g, "")}`,
    },
    {
      icon: Mail,
      label: "Email",
      value: seller.email,
      href: `mailto:${seller.email}`,
    },
    {
      icon: StoreIcon,
      label: "Business type",
      value: seller.businessType,
    },
  ];

  return (
    <section
      id="store-information"
      className="bg-paper border-b border-line scroll-mt-4"
    >
      <div className="container-x py-14 sm:py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12">
          <div className="lg:col-span-4">
            <Reveal>
              <SectionHeading
                eyebrow="Store Information"
                title="Get in touch."
              />

              {seller.verified && (
                <p className="mt-5 flex items-center gap-2 text-sm text-ash">
                  <ShieldCheck
                    size={18}
                    className="shrink-0 text-ink"
                  />
                  Identity verified by FAST.
                </p>
              )}
            </Reveal>
          </div>

          <div className="lg:col-span-8">
            <Reveal delay={0.1}>
              <ul className="border border-line divide-y divide-line">
                {rows.map(
                  ({
                    icon: Icon,
                    label,
                    value,
                    href,
                  }) => {
                    const inner = (
                      <>
                        <Icon
                          size={18}
                          className="shrink-0 mt-0.5 text-ash transition-colors duration-200 group-hover:text-ink"
                        />

                        <div className="min-w-0">
                          <div className="text-xs font-mono uppercase tracking-widest2 text-smoke">
                            {label}
                          </div>

                          <div className="mt-1 text-sm sm:text-base font-medium break-words">
                            {value}
                          </div>
                        </div>
                      </>
                    );

                    return (
                      <li key={label}>
                        {href ? (
                          <a
                            href={href}
                            className="group flex gap-4 p-5 sm:p-6 min-h-[44px] transition-colors duration-200 hover:bg-bone"
                          >
                            {inner}
                          </a>
                        ) : (
                          <div className="group flex gap-4 p-5 sm:p-6">
                            {inner}
                          </div>
                        )}
                      </li>
                    );
                  }
                )}
              </ul>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="mt-6 sm:mt-8 flex flex-wrap gap-3 sm:gap-4">
                <a
                  href={`mailto:${seller.email}`}
                  className={btnPrimary}
                >
                  Contact Seller
                  <ArrowUpRight size={16} />
                </a>

                <GhostButton
                  href="/products"
                  icon={ArrowRight}
                >
                  Browse all products
                </GhostButton>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- LOADING / NOT FOUND ------------------------- */

function StoreSkeleton() {
  return (
    <div
      className="overflow-x-hidden"
      aria-busy="true"
      aria-label="Loading store"
    >
      <div className="h-28 sm:h-36 md:h-44 lg:h-52 bg-bone border-b border-line animate-pulse" />

      <div className="container-x">
        <div className="-mt-12 sm:-mt-16 flex flex-col md:flex-row md:items-end gap-5 sm:gap-8">
          <div className="w-24 h-24 sm:w-32 sm:h-32 border border-line bg-paper" />

          <div className="flex-1 space-y-3 pb-1">
            <div className="h-3 w-40 bg-line animate-pulse" />
            <div className="h-10 w-3/4 max-w-md bg-line animate-pulse" />
            <div className="h-3 w-48 bg-line animate-pulse" />
          </div>
        </div>

        <div className="mt-14 mb-20 grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-px bg-line border border-line">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-paper p-4 sm:p-5"
            >
              <div className="aspect-square bg-bone animate-pulse" />
              <div className="mt-4 h-3 w-1/3 bg-line animate-pulse" />
              <div className="mt-2 h-4 w-3/4 bg-line animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StoreNotFound() {
  return (
    <section className="relative bg-paper border-b border-line overflow-hidden">
      <div className="absolute inset-0 grid-paper opacity-[0.035] pointer-events-none" />

      <div className="container-x relative py-20 sm:py-28 md:py-36 text-center">
        <Reveal>
          <Eyebrow>Store not found</Eyebrow>

          <h1 className="mt-5 font-display font-bold tracking-tightest text-3xl sm:text-4xl md:text-6xl max-w-3xl mx-auto">
            We couldn&apos;t find this store.
          </h1>

          <p className="mt-5 text-ash text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            The link may be wrong, or the seller is no longer listed on FAST Global Marketplace.
          </p>

          <div className="mt-8 flex flex-wrap gap-3 sm:gap-4 justify-center">
            <Link
              href="/products"
              className={btnPrimary}
            >
              Browse products
              <ArrowUpRight size={16} />
            </Link>

            <Link
              href="/"
              className={btnGhost}
            >
              Back to home
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}