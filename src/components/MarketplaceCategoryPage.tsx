"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Reveal from "@/components/Reveal";
import { Eyebrow } from "@/components/UI";
import {
  Search,
  Filter,
  SlidersHorizontal,
  Heart,
  Star,
  CheckCircle2,
  ChevronRight,
  RotateCcw,
  PackageOpen,
  LayoutGrid,
  List,
  ShieldCheck,
  X,
  Eye,
  MapPin,
  Clock,
  Sparkles,
  ArrowUpDown,
  MessageSquare,
} from "lucide-react";
import { RegionalProduct, Region } from "@/lib/regionalProductsData";
import { apiRequest } from "@/lib/api";

interface MarketplaceCategoryPageProps {
  regionKey: Region;
  title: string;
  subtitle: string;
  description: string;
  products?: RegionalProduct[];
}

interface BackendProduct {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price: number;
  currency: string;
  stock: number;
  image?: string;
  moq?: number | null;
  leadTime?: number | null;
  featured?: boolean;
  marketplace: "INTERNATIONAL" | "PAKISTAN" | "GULF" | "CHINESE";
  status: "Pending" | "Approved" | "Rejected";
  createdAt: string;
  category?: {
    name: string;
  };
  subCategory?: {
    name: string;
  };
  vendor?: {
    companyName?: string | null;
    address?: string | null;
    verified?: boolean;
    rating?: number;
  };
}

export default function MarketplaceCategoryPage({
  regionKey,
  title,
  subtitle,
  description,
  products = [],
}: MarketplaceCategoryPageProps) {
  // Ensure products is always an array
  const safeProducts = useMemo(() => (Array.isArray(products) ? products : []), [products]);

  // --- STATES ---
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSubcategory, setSelectedSubcategory] = useState("All");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [onlyTradeAssurance, setOnlyTradeAssurance] = useState(false);
  const [sortBy, setSortBy] = useState<"newest" | "price-low" | "price-high" | "popular">("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Quick View Drawer / Modal State
  const [quickViewProduct, setQuickViewProduct] = useState<RegionalProduct | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [backendProducts, setBackendProducts] = useState<BackendProduct[]>([]);

  interface BackendCategory {
    id: number;
    name: string;
    marketplace: "INTERNATIONAL" | "PAKISTAN" | "GULF" | "CHINESE";
    isActive: boolean;
    isCustom: boolean;
    subCategories: {
      id: number;
      name: string;
    }[];
  }

  const [backendCategories, setBackendCategories] = useState<BackendCategory[]>([]);

  const adaptedBackendProducts = useMemo<RegionalProduct[]>(() => {
    return backendProducts.map((product) => ({
      id: `backend-${product.id}`,
      title: product.name,
      slug: product.slug,
      category: product.category?.name || "Uncategorized",
      subcategory: product.subCategory?.name || "General",
      region: regionKey,
      price: product.price,
      currency: product.currency,
      unit: "Unit",
      moq: product.moq ?? 1,
      image:
        product.image ||
        `https://picsum.photos/seed/backend-${product.id}/800/600`,
      seller: {
        id: `vendor-${product.id}`,
        name: product.vendor?.companyName || "Verified Supplier",
        verified: Boolean(product.vendor?.verified),
        rating: product.vendor?.rating ?? 0,
        reviewCount: 0,
        location: product.vendor?.address || "Global",
        countryCode: "",
        responseRate: "—",
      },
      rating: product.vendor?.rating ?? 0,
      reviewCount: 0,
      inStock: product.stock > 0,
      stockQuantity: product.stock,
      deliveryTime: product.leadTime
        ? `${product.leadTime} days`
        : "Contact Seller",
      tradeAssurance: false,
      createdAt: product.createdAt,
      isPopular: false,
      isFeatured: Boolean(product.featured),
      attributes: {},
    }));
  }, [backendProducts, regionKey]);

  const allProducts = useMemo(() => {
    return adaptedBackendProducts;
  }, [adaptedBackendProducts]);
  const itemsPerPage = 6;
  const marketplaceKey =
    regionKey === "international"
      ? "INTERNATIONAL"
      : regionKey === "pakistan"
        ? "PAKISTAN"
        : regionKey === "gulf"
          ? "GULF"
          : "CHINESE";

  useEffect(() => {
    const fetchMarketplaceData = async () => {
      try {
        // Fetch marketplace products
        const productsData = await apiRequest(
          `/product?marketplace=${marketplaceKey}`
        );

        console.log("BACKEND MARKETPLACE PRODUCTS:", productsData);

        if (Array.isArray(productsData)) {
          setBackendProducts(productsData);
        }

        // Fetch marketplace categories
        const categoriesData = await apiRequest(
          `/category?marketplace=${marketplaceKey}`
        );

        console.log("BACKEND MARKETPLACE CATEGORIES:", categoriesData);

        if (Array.isArray(categoriesData)) {
          setBackendCategories(categoriesData);
        }
      } catch (error) {
        console.error("Failed to fetch marketplace data:", error);
      }
    };

    fetchMarketplaceData();
  }, [marketplaceKey]);

  // Safe product Link generator helper to prevent missing dynamic routes
  const getProductHref = (prod: RegionalProduct) => {
    return `/products/${prod.slug}`;
  };

  // Extract Categories & Subcategories safely
  // Database-driven Categories & Subcategories
  const categories = useMemo(() => {
    const activeCategories = backendCategories
      .filter((category) => category.isActive)
      .map((category) => category.name);

    return ["All", ...activeCategories];
  }, [backendCategories]);

  const subcategories = useMemo(() => {
    if (selectedCategory === "All") return [];

    const selectedCategoryData = backendCategories.find(
      (category) => category.name === selectedCategory
    );

    if (!selectedCategoryData) return [];

    const activeSubcategories = selectedCategoryData.subCategories.map(
      (subCategory) => subCategory.name
    );

    return ["All", ...activeSubcategories];
  }, [backendCategories, selectedCategory]);

  // const subcategories = useMemo(() => {
  //   if (selectedCategory === "All" || !allProducts.length) return [];

  //   const filtered = allProducts.filter(
  //     (p) => p?.category === selectedCategory
  //   );

  //   const set = new Set(
  //     filtered.map((p) => p?.subcategory).filter(Boolean)
  //   );

  //   return ["All", ...Array.from(set)];
  // }, [allProducts, selectedCategory]);
  // Wishlist Handler
  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Quick View Trigger
  const handleOpenQuickView = (prod: RegionalProduct, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewProduct(prod);
    setActiveImageIndex(0);
  };

  // Filter & Sort Pipeline safely
  const filteredProducts = useMemo(() => {
    console.log(
      "FILTER INPUT:",
      allProducts.map((p) => ({
        title: p.title,
        region: p.region,
        regionKey,
      }))
    );
    return allProducts
      .filter((p) => p && p.region === regionKey)
      .filter((p) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          p.title?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.subcategory?.toLowerCase().includes(q) ||
          p.seller?.name?.toLowerCase().includes(q) ||
          p.seller?.location?.toLowerCase().includes(q)
        );
      })
      .filter((p) => (selectedCategory === "All" ? true : p.category === selectedCategory))
      .filter((p) => (selectedSubcategory === "All" ? true : p.subcategory === selectedSubcategory))
      .filter((p) => {
        const min = minPrice !== "" ? Number(minPrice) : 0;
        const max = maxPrice !== "" ? Number(maxPrice) : Infinity;
        const price = p.price ?? 0;
        return price >= min && price <= max;
      })
      .filter((p) => (onlyInStock ? Boolean(p.inStock) : true))
      .filter((p) => (onlyVerified ? Boolean(p.seller?.verified) : true))
      .filter((p) => (onlyTradeAssurance ? Boolean(p.tradeAssurance) : true))
      .sort((a, b) => {
        if (sortBy === "price-low") return (a.price ?? 0) - (b.price ?? 0);
        if (sortBy === "price-high") return (b.price ?? 0) - (a.price ?? 0);
        if (sortBy === "popular") return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      });
  }, [
    allProducts,
    regionKey,
    searchQuery,
    selectedCategory,
    selectedSubcategory,
    minPrice,
    maxPrice,
    onlyInStock,
    onlyVerified,
    onlyTradeAssurance,
    sortBy,
  ]);

  // Pagination Logic
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedSubcategory("All");
    setMinPrice("");
    setMaxPrice("");
    setOnlyInStock(false);
    setOnlyVerified(false);
    setOnlyTradeAssurance(false);
    setSortBy("newest");
    setCurrentPage(1);
  };

  return (
    <div className="bg-paper text-ink min-h-screen">
      {/* HERO / HEADER SECTION */}
      <section className="relative border-b border-line bg-paper overflow-hidden py-10 sm:py-14 lg:py-16">
        <div className="absolute inset-0 grid-paper opacity-[0.035] pointer-events-none" />
        <div className="container-x relative">
          <Reveal>
            <Eyebrow>{subtitle}</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-3 font-display font-bold text-3xl sm:text-5xl lg:text-6xl tracking-tightest">
              {title}
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-3 text-ash text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed">
              {description}
            </p>
          </Reveal>

          {/* SEARCH & CONTROLS TOOLBAR */}
          <Reveal delay={0.15}>
            <div className="mt-8 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between border border-line p-3 sm:p-4 bg-paper shadow-xs">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ash pointer-events-none" size={18} />
                <input
                  type="text"
                  placeholder="Search products, machinery, suppliers or countries..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-9 py-2.5 bg-bone border border-line text-sm text-ink placeholder:text-smoke focus:outline-none focus:border-ink transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ash hover:text-ink transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* View Mode & Controls */}
              <div className="flex flex-wrap items-center justify-between lg:justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                  className="lg:hidden flex items-center gap-2 px-3 py-2.5 border border-line text-xs font-mono uppercase tracking-wider hover:border-ink transition-colors"
                >
                  <SlidersHorizontal size={14} /> Filters
                </button>

                {/* Grid / List Switcher */}
                <div className="hidden sm:flex border border-line bg-bone p-0.5">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 transition-colors ${viewMode === "grid" ? "bg-paper text-ink border border-line shadow-xs" : "text-ash hover:text-ink"
                      }`}
                    title="Grid View"
                  >
                    <LayoutGrid size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 transition-colors ${viewMode === "list" ? "bg-paper text-ink border border-line shadow-xs" : "text-ash hover:text-ink"
                      }`}
                    title="List View"
                  >
                    <List size={16} />
                  </button>
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono uppercase text-ash hidden sm:inline flex items-center gap-1">
                    <ArrowUpDown size={12} /> Sort:
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-bone border border-line py-2.5 px-3 text-xs font-mono uppercase tracking-wider text-ink focus:outline-none focus:border-ink transition-colors cursor-pointer"
                  >
                    <option value="newest">Newest Arrivals</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="popular">Popularity</option>
                  </select>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* MAIN CONTENT AREA */}
      <section className="container-x py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* SIDEBAR FILTERS */}
          <aside className={`lg:col-span-3 ${mobileFilterOpen ? "block" : "hidden lg:block"}`}>
            <div className="sticky top-24 border border-line p-5 bg-paper space-y-6 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-line">
                <h3 className="font-display font-semibold text-base flex items-center gap-2">
                  <Filter size={16} /> Filters
                </h3>
                <button
                  onClick={resetFilters}
                  className="text-xs text-ash hover:text-ink flex items-center gap-1 transition-colors font-mono"
                >
                  <RotateCcw size={12} /> Reset All
                </button>
              </div>

              {/* Active Filter Badges */}
              {(selectedCategory !== "All" || selectedSubcategory !== "All" || minPrice || maxPrice || onlyVerified || onlyInStock || onlyTradeAssurance) && (
                <div className="flex flex-wrap gap-1.5 pb-4 border-b border-line">
                  {selectedCategory !== "All" && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono bg-bone border border-line px-2 py-1">
                      {selectedCategory}
                      <X size={12} className="cursor-pointer hover:text-ink" onClick={() => setSelectedCategory("All")} />
                    </span>
                  )}
                  {selectedSubcategory !== "All" && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono bg-bone border border-line px-2 py-1">
                      {selectedSubcategory}
                      <X size={12} className="cursor-pointer hover:text-ink" onClick={() => setSelectedSubcategory("All")} />
                    </span>
                  )}
                  {onlyVerified && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono bg-bone border border-line px-2 py-1">
                      Verified
                      <X size={12} className="cursor-pointer hover:text-ink" onClick={() => setOnlyVerified(false)} />
                    </span>
                  )}
                  {onlyTradeAssurance && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono bg-bone border border-line px-2 py-1">
                      Trade Assurance
                      <X size={12} className="cursor-pointer hover:text-ink" onClick={() => setOnlyTradeAssurance(false)} />
                    </span>
                  )}
                </div>
              )}

              {/* Categories */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-widest text-ash mb-3">Industry Category</h4>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setSelectedSubcategory("All");
                        setCurrentPage(1);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm transition-colors flex items-center justify-between ${selectedCategory === cat
                        ? "bg-ink text-paper font-medium"
                        : "text-ash hover:bg-bone hover:text-ink"
                        }`}
                    >
                      <span>{cat}</span>
                      {selectedCategory === cat && <ChevronRight size={14} />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subcategories (if Category selected) */}
              {subcategories.length > 0 && (
                <div className="pt-4 border-t border-line">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-ash mb-3">Subcategory</h4>
                  <div className="space-y-1">
                    {subcategories.map((sub) => (
                      <button
                        key={sub}
                        onClick={() => {
                          setSelectedSubcategory(sub);
                          setCurrentPage(1);
                        }}
                        className={`w-full text-left px-3 py-1.5 text-xs transition-colors flex items-center justify-between ${selectedSubcategory === sub
                          ? "bg-bone text-ink font-semibold border-l-2 border-ink pl-2.5"
                          : "text-ash hover:text-ink"
                          }`}
                      >
                        <span>{sub}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Range Filter */}
              <div className="pt-4 border-t border-line">
                <h4 className="text-xs font-mono uppercase tracking-widest text-ash mb-3">Price Range (USD)</h4>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="p-2 bg-bone border border-line text-xs focus:outline-none focus:border-ink font-mono"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="p-2 bg-bone border border-line text-xs focus:outline-none focus:border-ink font-mono"
                  />
                </div>
              </div>

              {/* Trust & Supplier Toggles */}
              <div className="pt-4 border-t border-line space-y-3">
                <h4 className="text-xs font-mono uppercase tracking-widest text-ash mb-1">Trust & Availability</h4>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyVerified}
                    onChange={(e) => setOnlyVerified(e.target.checked)}
                    className="accent-ink h-4 w-4 rounded-none border-line"
                  />
                  <span className="text-sm text-ash hover:text-ink transition-colors flex items-center gap-1.5">
                    Verified Sellers <CheckCircle2 size={14} className="text-ink" />
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyTradeAssurance}
                    onChange={(e) => setOnlyTradeAssurance(e.target.checked)}
                    className="accent-ink h-4 w-4 rounded-none border-line"
                  />
                  <span className="text-sm text-ash hover:text-ink transition-colors flex items-center gap-1.5">
                    Trade Assurance <ShieldCheck size={14} className="text-ink" />
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyInStock}
                    onChange={(e) => setOnlyInStock(e.target.checked)}
                    className="accent-ink h-4 w-4 rounded-none border-line"
                  />
                  <span className="text-sm text-ash hover:text-ink transition-colors">
                    In Stock Only
                  </span>
                </label>
              </div>
            </div>
          </aside>

          {/* LISTINGS / GRID AREA */}
          <main className="lg:col-span-9">
            {/* Results Counter Header */}
            <div className="mb-4 flex items-center justify-between text-xs font-mono text-ash pb-3 border-b border-line">
              <span>Showing {filteredProducts.length} Verified Listings</span>
              <span>Page {currentPage} of {totalPages}</span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="border border-dashed border-line p-12 text-center bg-bone">
                <PackageOpen size={48} className="mx-auto text-smoke mb-4" />
                <h3 className="font-display font-semibold text-lg">No Products Match Your Criteria</h3>
                <p className="text-ash text-sm mt-1 max-w-sm mx-auto">
                  Try adjusting your search query, expanding the price range, or clearing active filters.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-5 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider border border-ink px-4 py-2 hover:bg-ink hover:text-paper transition-colors"
                >
                  Reset Search Filters
                </button>
              </div>
            ) : viewMode === "grid" ? (
              /* GRID VIEW */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-line border border-line">
                {paginatedProducts.map((prod) => {
                  const isWishlisted = wishlist.includes(prod.id);
                  return (
                    <Reveal key={prod.id}>
                      <div className="group bg-paper h-full flex flex-col justify-between p-4 sm:p-5 transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] relative">
                        <div>
                          {/* Image Box */}
                          <div className="relative aspect-square w-full bg-bone overflow-hidden mb-4 border border-line">
                            {prod.isFeatured && (
                              <span className="absolute top-2 left-2 z-10 bg-ink text-paper text-[10px] font-mono px-2 py-0.5 uppercase tracking-wider flex items-center gap-1">
                                <Sparkles size={10} /> Featured
                              </span>
                            )}
                            <button
                              onClick={(e) => toggleWishlist(prod.id, e)}
                              className="absolute top-2 right-2 z-10 p-1.5 bg-paper/90 border border-line text-ink hover:bg-paper transition-colors"
                              aria-label="Wishlist"
                            >
                              <Heart size={15} className={isWishlisted ? "fill-ink text-ink" : "text-ash"} />
                            </button>

                            <img
                              src={prod.image || "/placeholder.jpg"}
                              alt={prod.title || "Product Image"}
                              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                            />

                            {/* Quick View Button Overlay */}
                            <button
                              type="button"
                              onClick={(e) => handleOpenQuickView(prod, e)}
                              className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 bg-paper/95 text-ink text-xs font-mono uppercase px-3 py-1.5 border border-line opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1 shadow-xs hover:bg-ink hover:text-paper"
                            >
                              <Eye size={12} /> Quick View
                            </button>
                          </div>

                          {/* Subcategory & Title */}
                          <div className="text-[10px] font-mono uppercase tracking-wider text-ash mb-1">
                            {prod.category} &bull; {prod.subcategory}
                          </div>
                          <Link href={getProductHref(prod)}>
                            <h3 className="font-display font-semibold text-base leading-snug line-clamp-2 hover:underline decoration-line">
                              {prod.title}
                            </h3>
                          </Link>

                          {/* Seller & Rating Strip */}
                          <div className="mt-3 pt-3 border-t border-line space-y-1.5 text-xs text-ash">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-ink truncate max-w-[140px] flex items-center gap-1">
                                {prod.seller?.name || "Verified Supplier"}
                                {prod.seller?.verified && <CheckCircle2 size={12} className="text-ink shrink-0" />}
                              </span>
                              <span className="flex items-center gap-1 font-mono text-ink text-[11px]">
                                <Star size={12} className="fill-ink text-ink" />
                                {prod.rating ?? "5.0"} ({prod.reviewCount ?? 0})
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-[11px] text-smoke font-mono">
                              <span className="flex items-center gap-1">
                                <MapPin size={11} /> {prod.seller?.location || "Global"}
                              </span>
                              <span>MOQ: {prod.moq ?? 1} {prod.unit ?? "unit"}</span>
                            </div>
                          </div>
                        </div>

                        {/* Price & Primary Action */}
                        <div className="mt-4 pt-3 border-t border-line">
                          <div className="flex items-baseline justify-between">
                            <div>
                              <span className="font-display font-bold text-lg">
                                ${prod.price?.toLocaleString() ?? "0"}
                              </span>
                              <span className="text-xs text-ash font-mono"> / {prod.unit ?? "unit"}</span>
                            </div>
                            {prod.discountPercentage && (
                              <span className="text-[10px] font-mono text-ink bg-bone border border-line px-1.5 py-0.5">
                                -{prod.discountPercentage}%
                              </span>
                            )}
                          </div>

                          <div className="mt-3 flex gap-2">
                            <button
                              type="button"
                              onClick={(e) => handleOpenQuickView(prod, e)}
                              className="flex-1 text-center py-2 bg-bone border border-line text-xs font-mono uppercase tracking-wider hover:bg-ink hover:text-paper transition-colors"
                            >
                              Quick View
                            </button>
                            <Link
                              href={getProductHref(prod)}
                              className="px-3 py-2 bg-ink text-paper text-xs font-mono uppercase tracking-wider hover:bg-ash transition-colors flex items-center justify-center"
                            >
                              Inquire
                            </Link>
                          </div>
                        </div>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            ) : (
              /* LIST VIEW (OLX HORIZONTAL ROWS) */
              <div className="space-y-3">
                {paginatedProducts.map((prod) => {
                  const isWishlisted = wishlist.includes(prod.id);
                  return (
                    <Reveal key={prod.id}>
                      <div className="group bg-paper border border-line p-4 sm:p-5 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between transition-all duration-200 hover:shadow-[0_8px_25px_rgba(0,0,0,0.05)]">
                        {/* Image */}
                        <div className="relative w-full sm:w-44 aspect-square bg-bone border border-line shrink-0 overflow-hidden">
                          <img
                            src={prod.image || "/placeholder.jpg"}
                            alt={prod.title || "Product"}
                            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                          />
                          <button
                            onClick={(e) => toggleWishlist(prod.id, e)}
                            className="absolute top-2 right-2 p-1.5 bg-paper/90 border border-line text-ink"
                          >
                            <Heart size={14} className={isWishlisted ? "fill-ink text-ink" : "text-ash"} />
                          </button>
                        </div>

                        {/* Body Details */}
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-ash">
                            <span>{prod.category}</span>
                            <span>&bull;</span>
                            <span>{prod.subcategory}</span>
                          </div>

                          <Link href={getProductHref(prod)}>
                            <h3 className="font-display font-semibold text-lg hover:underline decoration-line">
                              {prod.title}
                            </h3>
                          </Link>

                          <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-ash">
                            <span className="flex items-center gap-1 font-medium text-ink">
                              {prod.seller?.name || "Supplier"}
                              {prod.seller?.verified && <CheckCircle2 size={13} className="text-ink" />}
                            </span>
                            <span className="flex items-center gap-1 font-mono">
                              <MapPin size={12} /> {prod.seller?.location || "Global"}
                            </span>
                            <span className="flex items-center gap-1 font-mono">
                              <Clock size={12} /> {prod.deliveryTime || "Contact Seller"}
                            </span>
                          </div>

                          {/* Attribute Snippets */}
                          <div className="flex flex-wrap gap-2 pt-1">
                            {prod.attributes &&
                              Object.entries(prod.attributes).slice(0, 3).map(([k, v]) => (
                                <span key={k} className="text-[10px] font-mono bg-bone border border-line px-2 py-0.5 text-ash">
                                  {k}: <strong className="text-ink">{v}</strong>
                                </span>
                              ))}
                          </div>
                        </div>

                        {/* Price & Action Block */}
                        <div className="w-full sm:w-auto sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-line shrink-0 space-y-2">
                          <div>
                            <div className="font-display font-bold text-xl">
                              ${prod.price?.toLocaleString() ?? "0"}
                            </div>
                            <div className="text-xs text-ash font-mono">MOQ: {prod.moq ?? 1} {prod.unit ?? "unit"}</div>
                          </div>

                          <div className="flex sm:flex-col gap-2">
                            <button
                              type="button"
                              onClick={(e) => handleOpenQuickView(prod, e)}
                              className="px-3 py-2 bg-bone border border-line text-xs font-mono uppercase tracking-wider hover:border-ink"
                            >
                              Quick View
                            </button>
                            <Link
                              href={getProductHref(prod)}
                              className="px-4 py-2 bg-ink text-paper text-xs font-mono uppercase tracking-wider hover:bg-ash transition-colors text-center"
                            >
                              Inquire
                            </Link>
                          </div>
                        </div>
                      </div>
                    </Reveal>
                  );
                })}
              </div>
            )}

            {/* PAGINATION NUMBERS */}
            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2 border-t border-line pt-6">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  className="px-3 py-2 border border-line text-xs font-mono uppercase disabled:opacity-40 hover:border-ink transition-colors"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-9 h-9 text-xs font-mono transition-colors ${currentPage === i + 1
                      ? "bg-ink text-paper font-bold"
                      : "border border-line bg-paper text-ash hover:text-ink"
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  className="px-3 py-2 border border-line text-xs font-mono uppercase disabled:opacity-40 hover:border-ink transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </main>
        </div>
      </section>

      {/* OLX QUICK VIEW DRAWER & MODAL */}
      <AnimatePresence>
        {quickViewProduct && (
          <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setQuickViewProduct(null)}
              className="absolute inset-0 bg-ink/60 backdrop-blur-xs"
            />

            {/* Slide-over Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-2xl bg-paper border-l border-ink h-full shadow-2xl z-10 flex flex-col justify-between overflow-y-auto"
            >
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-line flex items-center justify-between sticky top-0 bg-paper z-20">
                <div className="flex items-center gap-2 text-xs font-mono uppercase text-ash">
                  <Eye size={14} className="text-ink" />
                  <span>Quick View Inspection</span>
                </div>
                <button
                  onClick={() => setQuickViewProduct(null)}
                  className="p-1 text-ash hover:text-ink border border-line transition-colors"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body Content */}
              <div className="p-5 sm:p-6 space-y-6 flex-1">
                {/* Image Gallery Showcase */}
                <div className="space-y-3">
                  <div className="relative aspect-video w-full bg-bone border border-line overflow-hidden">
                    <img
                      src={
                        (quickViewProduct.gallery && quickViewProduct.gallery[activeImageIndex]) ||
                        quickViewProduct.image ||
                        "/placeholder.jpg"
                      }
                      alt={quickViewProduct.title || "Product"}
                      className="w-full h-full object-cover"
                    />
                    {quickViewProduct.discountPercentage && (
                      <span className="absolute top-3 left-3 bg-ink text-paper text-xs font-mono px-2 py-0.5">
                        -{quickViewProduct.discountPercentage}% OFF
                      </span>
                    )}
                  </div>

                  {/* Thumbnail Row */}
                  {quickViewProduct.gallery && quickViewProduct.gallery.length > 1 && (
                    <div className="flex gap-2">
                      {quickViewProduct.gallery.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveImageIndex(idx)}
                          className={`w-16 h-16 border bg-bone overflow-hidden transition-all ${activeImageIndex === idx ? "border-ink ring-1 ring-ink" : "border-line opacity-70"
                            }`}
                        >
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Listing Details */}
                <div className="space-y-3">
                  <div className="text-xs font-mono uppercase tracking-wider text-ash">
                    {quickViewProduct.category} &bull; {quickViewProduct.subcategory}
                  </div>
                  <h2 className="font-display font-bold text-2xl leading-tight">
                    {quickViewProduct.title}
                  </h2>

                  <div className="flex items-baseline gap-3 pb-3 border-b border-line">
                    <span className="font-display font-bold text-3xl">
                      ${quickViewProduct.price?.toLocaleString() ?? "0"}
                    </span>
                    <span className="text-sm font-mono text-ash">
                      Per {quickViewProduct.unit ?? "unit"} (MOQ: {quickViewProduct.moq ?? 1})
                    </span>
                  </div>
                </div>

                {/* Seller & Verification Details */}
                <div className="p-4 bg-bone border border-line space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-display font-semibold text-base flex items-center gap-1.5">
                      {quickViewProduct.seller?.name || "Verified Supplier"}
                      {quickViewProduct.seller?.verified && <CheckCircle2 size={16} className="text-ink" />}
                    </span>
                    <span className="text-xs font-mono text-ink flex items-center gap-1">
                      <Star size={13} className="fill-ink text-ink" /> {quickViewProduct.seller?.rating ?? "5.0"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono text-ash pt-2 border-t border-line">
                    <div>Location: <strong className="text-ink">{quickViewProduct.seller?.location || "Global"}</strong></div>
                    <div>Response Rate: <strong className="text-ink">{quickViewProduct.seller?.responseRate || "100%"}</strong></div>
                  </div>
                </div>

                {/* Attributes & Specifications Grid */}
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-widest text-ash mb-3">Product Specifications</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-line border border-line">
                    {quickViewProduct.attributes &&
                      Object.entries(quickViewProduct.attributes).map(([key, val]) => (
                        <div key={key} className="bg-paper p-2.5 flex justify-between text-xs">
                          <span className="text-ash">{key}</span>
                          <span className="font-mono font-medium text-ink">{val}</span>
                        </div>
                      ))}
                    <div className="bg-paper p-2.5 flex justify-between text-xs">
                      <span className="text-ash">Estimated Delivery</span>
                      <span className="font-mono font-medium text-ink">{quickViewProduct.deliveryTime || "Contact Supplier"}</span>
                    </div>
                    <div className="bg-paper p-2.5 flex justify-between text-xs">
                      <span className="text-ash">Trade Guarantee</span>
                      <span className="font-mono font-medium text-ink">
                        {quickViewProduct.tradeAssurance ? "Assured" : "Standard"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Sticky Footer */}
              <div className="p-4 border-t border-line bg-paper sticky bottom-0 flex gap-3">
                <Link
                  href={getProductHref(quickViewProduct)}
                  className="flex-1 py-3 bg-ink text-paper text-xs font-mono uppercase tracking-wider text-center font-semibold hover:bg-ash transition-colors flex items-center justify-center gap-2"
                >
                  <MessageSquare size={14} /> Request Quote & Contact
                </Link>
                <button
                  onClick={(e) => toggleWishlist(quickViewProduct.id, e)}
                  className="p-3 border border-line hover:border-ink transition-colors"
                  aria-label="Save to wishlist"
                >
                  <Heart
                    size={18}
                    className={wishlist.includes(quickViewProduct.id) ? "fill-ink text-ink" : "text-ash"}
                  />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}