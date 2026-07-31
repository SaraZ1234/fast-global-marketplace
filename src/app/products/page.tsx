"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  ArrowUpRight,
  X,
  BadgeCheck,
  Star,
  LayoutGrid,
  List as ListIcon,
  ChevronDown,
  Scale,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import { PageHero } from "@/components/UI";
import { industries, products as mainProducts } from "@/lib/data";
import {
  machineryProducts,
  medicalProducts,
  electronicsProducts,
  fashionProducts,
  homeFurnitureProducts,
} from "@/lib/homeProducts";

// Fallback images for products from lib/data.ts that lack explicit image paths
const PRODUCT_IMAGES: Record<string, string> = {
  "industrial-cnc-lathe-machine": "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
  "bluetooth-wireless-earbuds": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80",
  "organic-cotton-t-shirts": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80",
  "modular-office-desk-system": "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=600&q=80",
  "automotive-led-headlight-kit": "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80",
  "hyaluronic-acid-serum-oem": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80",
};

// Internal normalized type to integrate multiple dataset shapes seamlessly
interface NormalizedProduct {
  slug: string;
  code?: string;
  name: string;
  industry: string;
  price: string;
  moq?: string;
  supplier?: string;
  country?: string;
  verified?: boolean;
  image: string;
}

type SortOption = "best-match" | "price-asc" | "price-desc" | "name-asc";
type ViewMode = "grid" | "list";

const PRICE_RANGES = [
  { id: "under-100", label: "Under $100", min: 0, max: 100 },
  { id: "100-500", label: "$100 - $500", min: 100, max: 500 },
  { id: "500-2000", label: "$500 - $2,000", min: 500, max: 2000 },
  { id: "2000-plus", label: "$2,000 & Above", min: 2000, max: Infinity },
];

const PAGE_SIZE = 12;

// Simple deterministic hash so the same product always renders the same
// rating / order count / vendor-tenure instead of jumping around on re-render.
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getTrustSignals(slug: string) {
  const h = hashString(slug);
  const rating = 3.6 + (h % 15) / 10; // 3.6 - 5.0
  const reviewCount = 18 + (h % 480); // 18 - 497
  const yearsActive = 2 + (h % 14); // 2 - 15 years
  const responseRate = 88 + (h % 12); // 88% - 99%
  return {
    rating: Math.min(5, Math.round(rating * 10) / 10),
    reviewCount,
    yearsActive,
    responseRate,
  };
}

// Best-effort numeric extraction from strings like "$1,200 - $3,500" or "PKR 45,000"
function parsePriceValue(price: string): number | null {
  const match = price.replace(/,/g, "").match(/(\d+(\.\d+)?)/);
  return match ? parseFloat(match[1]) : null;
}

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("best-match");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [compareList, setCompareList] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Combine and normalize products from @/lib/data and @/lib/homeProduct
  const allProducts = useMemo<NormalizedProduct[]>(() => {
    const formattedMain = mainProducts.map((p) => ({
      slug: p.slug,
      code: p.code,
      name: p.name,
      industry: p.industry,
      price: p.price,
      moq: p.moq,
      image: PRODUCT_IMAGES[p.slug] || "https://picsum.photos/seed/default/600/600",
    }));

    const convertExtra = (list: any[], industryName: string) =>
      list.map((p) => ({
        slug: p.id || p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        code: p.id?.toUpperCase(),
        name: p.name,
        industry: industryName,
        price: p.price,
        moq: p.moq || "Negotiable",
        supplier: p.supplier,
        country: p.country,
        verified: p.verified,
        image: p.image,
      }));

    return [
      ...formattedMain,
      ...convertExtra(machineryProducts, "Machinery"),
      ...convertExtra(medicalProducts, "Medical"),
      ...convertExtra(electronicsProducts, "Electronics"),
      ...convertExtra(fashionProducts, "Fashion"),
      ...convertExtra(homeFurnitureProducts, "Home & Furniture"),
    ];
  }, []);

  // Toggle industry checkbox selection
  const handleIndustryToggle = (slug: string) => {
    setCurrentPage(1);
    setSelectedIndustries((prev) =>
      prev.includes(slug)
        ? prev.filter((item) => item !== slug)
        : [...prev, slug]
    );
  };

  const handlePriceRangeToggle = (id: string) => {
    setCurrentPage(1);
    setSelectedPriceRanges((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCompareToggle = (slug: string) => {
    setCompareList((prev) =>
      prev.includes(slug)
        ? prev.filter((item) => item !== slug)
        : prev.length < 4
          ? [...prev, slug]
          : prev
    );
  };

  // Clear all active search inputs and industry checkboxes
  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedIndustries([]);
    setSelectedPriceRanges([]);
    setVerifiedOnly(false);
    setCurrentPage(1);
  };

  // Dynamic filter logic based on active state
  const filteredProducts = useMemo(() => {
    const filtered = allProducts.filter((product) => {
      // 1. Search Query Filter (Matches product name, code/ID, or supplier name)
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        product.name.toLowerCase().includes(query) ||
        (product.code && product.code.toLowerCase().includes(query)) ||
        (product.supplier && product.supplier.toLowerCase().includes(query));

      // 2. Industry Checkbox Filter
      const matchesIndustry =
        selectedIndustries.length === 0 ||
        selectedIndustries.some((slug) => {
          const matchedIndustry = industries.find((ind) => ind.slug === slug);
          return (
            matchedIndustry &&
            matchedIndustry.name.toLowerCase() === product.industry.toLowerCase()
          );
        });

      // 3. Price Range Filter (fails open if price can't be parsed)
      const numericPrice = parsePriceValue(product.price);
      const matchesPrice =
        selectedPriceRanges.length === 0 ||
        numericPrice === null ||
        selectedPriceRanges.some((id) => {
          const range = PRICE_RANGES.find((r) => r.id === id);
          return range && numericPrice >= range.min && numericPrice < range.max;
        });

      // 4. Verified Only Filter
      const matchesVerified = !verifiedOnly || product.verified;

      return matchesSearch && matchesIndustry && matchesPrice && matchesVerified;
    });

    // Sorting
    const sorted = [...filtered];
    if (sortBy === "price-asc" || sortBy === "price-desc") {
      sorted.sort((a, b) => {
        const priceA = parsePriceValue(a.price) ?? 0;
        const priceB = parsePriceValue(b.price) ?? 0;
        return sortBy === "price-asc" ? priceA - priceB : priceB - priceA;
      });
    } else if (sortBy === "name-asc") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    }

    return sorted;
  }, [allProducts, searchQuery, selectedIndustries, selectedPriceRanges, verifiedOnly, sortBy]);

  // Pagination slice
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredProducts.slice(start, start + PAGE_SIZE);
  }, [filteredProducts, currentPage]);

  const goToPage = (page: number) => {
    const clamped = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(clamped);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const activeFilterCount =
    selectedIndustries.length + selectedPriceRanges.length + (verifiedOnly ? 1 : 0);

  return (
    <div className="overflow-x-hidden">
      <PageHero
        kicker="Product Catalog"
        title="Millions of products, sourced directly."
        description="Filter by industry, MOQ, and price to shortlist products from verified manufacturers and wholesalers."
      />

      <section className="bg-paper">
        <div className="container-x py-10 sm:py-12 md:py-16">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6 hidden sm:block">
            <ol className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest2 text-smoke">
              <li>
                <Link href="/" className="hover:text-ink transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-ink">Products</li>
            </ol>
          </nav>

          {/* Search Bar & Mobile Filter Toggle */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-10">
            <div className="flex-1 flex items-center gap-3 border border-ink px-4 py-3 bg-bone">
              <Search size={18} className="text-smoke shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search products, suppliers, or codes (e.g., 'Earbuds', 'Sinotruk')"
                className="w-full min-w-0 bg-transparent outline-none text-sm placeholder:text-smoke"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setCurrentPage(1);
                  }}
                  className="text-smoke hover:text-ink transition-colors"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden inline-flex items-center justify-center gap-2 border border-ink px-5 py-3 text-sm font-medium hover:bg-ink hover:text-paper transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40 shrink-0"
            >
              <SlidersHorizontal size={16} /> Filters
              {activeFilterCount > 0 && (
                <span className="ml-1 bg-ink text-paper rounded-full text-[10px] w-4 h-4 flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10">
            {/* Sidebar / Filter Section */}
            <aside
              className={`lg:col-span-3 ${showMobileFilters ? "block" : "hidden lg:block"
                }`}
            >
              <div className="lg:sticky lg:top-24 bg-bone p-4 lg:p-0 border lg:border-none border-line space-y-8">
                {/* Industries */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-mono text-xs uppercase tracking-widest2 text-smoke">
                      Industries
                    </h3>
                    {(selectedIndustries.length > 0 || searchQuery || selectedPriceRanges.length > 0 || verifiedOnly) && (
                      <button
                        onClick={handleClearFilters}
                        className="text-xs font-mono text-smoke hover:text-ink underline transition-colors"
                      >
                        Reset All
                      </button>
                    )}
                  </div>
                  <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-x-4 gap-y-1 lg:gap-y-0 lg:space-y-1 lg:divide-y lg:divide-line">
                    {industries.map((ind) => (
                      <li key={ind.slug}>
                        <label className="flex items-center gap-3 py-2 text-sm cursor-pointer hover:text-ink transition-colors">
                          <input
                            type="checkbox"
                            checked={selectedIndustries.includes(ind.slug)}
                            onChange={() => handleIndustryToggle(ind.slug)}
                            className="accent-black w-4 h-4 shrink-0 cursor-pointer"
                          />
                          <span className="break-words">{ind.name}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="font-mono text-xs uppercase tracking-widest2 text-smoke mb-4">
                    Price Range
                  </h3>
                  <ul className="space-y-1 lg:divide-y lg:divide-line">
                    {PRICE_RANGES.map((range) => (
                      <li key={range.id}>
                        <label className="flex items-center gap-3 py-2 text-sm cursor-pointer hover:text-ink transition-colors">
                          <input
                            type="checkbox"
                            checked={selectedPriceRanges.includes(range.id)}
                            onChange={() => handlePriceRangeToggle(range.id)}
                            className="accent-black w-4 h-4 shrink-0 cursor-pointer"
                          />
                          <span>{range.label}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Supplier Trust */}
                <div>
                  <h3 className="font-mono text-xs uppercase tracking-widest2 text-smoke mb-4">
                    Supplier
                  </h3>
                  <label className="flex items-center gap-3 py-2 text-sm cursor-pointer hover:text-ink transition-colors">
                    <input
                      type="checkbox"
                      checked={verifiedOnly}
                      onChange={() => {
                        setVerifiedOnly((v) => !v);
                        setCurrentPage(1);
                      }}
                      className="accent-black w-4 h-4 shrink-0 cursor-pointer"
                    />
                    <span className="flex items-center gap-1.5">
                      <BadgeCheck size={14} className="text-emerald-600" />
                      Verified Suppliers Only
                    </span>
                  </label>
                </div>
              </div>
            </aside>

            {/* Product Grid */}
            <div className="lg:col-span-9">
              {/* Toolbar: count, sort, view toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-line">
                <div className="flex items-center gap-3 text-xs text-smoke font-mono uppercase tracking-widest2">
                  <span>{filteredProducts.length} Products</span>
                  {activeFilterCount > 0 && <span>{activeFilterCount} Filter(s) Active</span>}
                </div>

                <div className="flex items-center gap-3">
                  {/* Sort dropdown */}
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => {
                        setSortBy(e.target.value as SortOption);
                        setCurrentPage(1);
                      }}
                      className="appearance-none border border-line bg-paper pl-3 pr-8 py-2 text-xs font-mono uppercase tracking-wide text-ink cursor-pointer hover:border-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40"
                      aria-label="Sort products"
                    >
                      <option value="best-match">Best Match</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="name-asc">Name: A-Z</option>
                    </select>
                    <ChevronDown
                      size={14}
                      className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-smoke"
                    />
                  </div>

                  {/* Grid / List toggle */}
                  <div className="hidden sm:flex items-center border border-line">
                    <button
                      onClick={() => setViewMode("grid")}
                      aria-label="Grid view"
                      aria-pressed={viewMode === "grid"}
                      className={`p-2 transition-colors ${viewMode === "grid" ? "bg-ink text-paper" : "text-smoke hover:text-ink"
                        }`}
                    >
                      <LayoutGrid size={15} />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      aria-label="List view"
                      aria-pressed={viewMode === "list"}
                      className={`p-2 border-l border-line transition-colors ${viewMode === "list" ? "bg-ink text-paper" : "text-smoke hover:text-ink"
                        }`}
                    >
                      <ListIcon size={15} />
                    </button>
                  </div>
                </div>
              </div>

              {paginatedProducts.length > 0 ? (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-px bg-line border border-line"
                      : "flex flex-col gap-px bg-line border border-line"
                  }
                >
                  {paginatedProducts.map((p, i) => {
                    const { rating, reviewCount, yearsActive, responseRate } = getTrustSignals(p.slug);
                    const isComparing = compareList.includes(p.slug);

                    return (
                      <Reveal key={p.slug} delay={(i % 6) * 0.04}>
                        <Link
                          href={`/products/${p.slug}`}
                          className={`group relative block bg-bone card-hover border border-transparent transition-all duration-300 hover:border-ink/10 hover:-translate-y-0.5 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40 ${viewMode === "grid"
                            ? "p-5 sm:p-6 h-full flex flex-col"
                            : "p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:gap-6"
                            }`}
                        >
                          {/* Compare checkbox */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleCompareToggle(p.slug);
                            }}
                            aria-pressed={isComparing}
                            aria-label={isComparing ? "Remove from compare" : "Add to compare"}
                            className={`absolute z-10 top-2 left-2 flex items-center gap-1 px-1.5 py-1 text-[10px] font-mono uppercase tracking-wide border backdrop-blur-sm transition-colors ${isComparing
                              ? "bg-ink text-paper border-ink"
                              : "bg-paper/90 text-smoke border-line hover:text-ink hover:border-ink"
                              }`}
                          >
                            <Scale size={11} />
                            {isComparing ? "Added" : "Compare"}
                          </button>

                          <div
                            className={`bg-bone border border-line flex items-center justify-center overflow-hidden relative group-hover:opacity-95 transition-opacity ${viewMode === "grid"
                              ? "aspect-[4/3] mb-5"
                              : "aspect-[4/3] sm:aspect-square sm:w-48 shrink-0"
                              }`}
                          >
                            <Image
                              src={p.image}
                              alt={p.name}
                              fill
                              unoptimized
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                              sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                            />
                            {p.code && (
                              <span className="absolute top-2 right-2 bg-paper/90 px-2 py-0.5 font-mono text-[10px] text-ink backdrop-blur-sm border border-line">
                                {p.code}
                              </span>
                            )}
                            {p.verified && (
                              <span className="absolute bottom-2 left-2 bg-paper/90 px-1.5 py-0.5 font-mono text-[10px] text-emerald-700 flex items-center gap-1 backdrop-blur-sm border border-line">
                                <BadgeCheck size={12} className="text-emerald-600" /> Verified
                              </span>
                            )}
                          </div>

                          <div className={viewMode === "list" ? "flex-1 flex flex-col" : "flex-1 flex flex-col"}>
                            <span className="text-[11px] font-mono uppercase tracking-wide text-smoke">
                              {p.industry}
                            </span>

                            <h3 className="mt-2 font-display font-semibold leading-snug text-sm sm:text-base break-words">
                              {p.name}
                            </h3>

                            {/* Rating + trust row */}
                            <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-smoke">
                              <span className="inline-flex items-center gap-1">
                                <Star size={12} className="fill-amber-400 text-amber-400" />
                                <span className="text-ink font-medium">{rating.toFixed(1)}</span>
                                <span>({reviewCount})</span>
                              </span>
                              <span className="hidden sm:inline">•</span>
                              <span>{responseRate}% Response Rate</span>
                              {p.supplier && (
                                <>
                                  <span className="hidden sm:inline">•</span>
                                  <span>{yearsActive} yrs on platform</span>
                                </>
                              )}
                            </div>

                            {p.supplier && (
                              <p className="mt-1.5 text-xs text-smoke font-sans">
                                {p.supplier} {p.country ? `• ${p.country}` : ""}
                              </p>
                            )}

                            <div className="mt-auto pt-4 flex items-center justify-between gap-2 text-sm">
                              <span className="font-medium">{p.price}</span>
                              <span className="text-smoke whitespace-nowrap text-xs">
                                MOQ: {p.moq}
                              </span>
                            </div>

                            <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest2 text-ink opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                              View product <ArrowUpRight size={13} />
                            </span>
                          </div>
                        </Link>
                      </Reveal>
                    );
                  })}
                </div>
              ) : (
                <div className="p-12 text-center border border-dashed border-line bg-bone/50">
                  <p className="text-sm text-smoke font-mono uppercase tracking-wide">
                    No products found matching your criteria.
                  </p>
                  <button
                    onClick={handleClearFilters}
                    className="mt-4 px-4 py-2 border border-ink text-xs font-mono uppercase tracking-wider hover:bg-ink hover:text-paper transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              )}

              {/* Pagination */}
              {filteredProducts.length > PAGE_SIZE && (
                <div className="mt-10 flex items-center justify-center gap-2">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                    className="p-2 border border-line hover:border-ink hover:text-ink text-smoke disabled:opacity-30 disabled:hover:border-line disabled:hover:text-smoke transition-colors"
                  >
                    <ChevronLeft size={15} />
                  </button>

                  {Array.from({ length: totalPages }, (_, idx) => idx + 1)
                    .filter(
                      (page) =>
                        page === 1 ||
                        page === totalPages ||
                        Math.abs(page - currentPage) <= 1
                    )
                    .reduce<number[]>((acc, page) => {
                      if (acc.length && page - acc[acc.length - 1] > 1) acc.push(-1); // gap marker
                      acc.push(page);
                      return acc;
                    }, [])
                    .map((page, idx) =>
                      page === -1 ? (
                        <span key={`gap-${idx}`} className="px-1 text-smoke text-xs font-mono">
                          …
                        </span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => goToPage(page)}
                          aria-current={page === currentPage ? "page" : undefined}
                          className={`w-9 h-9 text-xs font-mono border transition-colors ${page === currentPage
                            ? "bg-ink text-paper border-ink"
                            : "border-line text-smoke hover:border-ink hover:text-ink"
                            }`}
                        >
                          {page}
                        </button>
                      )
                    )}

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label="Next page"
                    className="p-2 border border-line hover:border-ink hover:text-ink text-smoke disabled:opacity-30 disabled:hover:border-line disabled:hover:text-smoke transition-colors"
                  >
                    <ChevronRight size={15} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Floating compare tray */}
      {compareList.length > 0 && (
        <div className="fixed bottom-0 inset-x-0 z-40 bg-ink text-paper border-t border-ink">
          <div className="container-x py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest2">
              <Scale size={14} />
              {compareList.length} Product{compareList.length > 1 ? "s" : ""} Selected
              <span className="hidden sm:inline text-paper/60">(max 4)</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCompareList([])}
                className="text-xs font-mono uppercase tracking-wide text-paper/70 hover:text-paper transition-colors"
              >
                Clear
              </button>
              <button
                disabled={compareList.length < 2}
                className="px-4 py-2 bg-paper text-ink text-xs font-mono uppercase tracking-wider disabled:opacity-40 hover:bg-paper/90 transition-colors"
              >
                Compare Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}