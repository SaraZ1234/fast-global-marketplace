"use client";
// import type { Metadata } from "next";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getStoredUser } from "@/lib/auth";
import {
  ArrowUpRight,
  ShieldCheck,
  MapPin,
  Star,
  BadgeCheck,
  Truck,
  CreditCard,
  Package,
  Clock,
  Award,
  Globe2,
  Factory,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import { Eyebrow, PrimaryButton, GhostButton } from "@/components/UI";
import ProductGallery from "@/components/product/ProductGallery";
import ProductActions from "@/components/product/ProductActions";
import ReviewsSection from "@/components/product/ReviewsSection";
import InquiryForm from "@/components/product/InquiryForm";
import FrequentlyBoughtTogether from "@/components/product/FrequentlyBoughtTogether";
import ShippingEstimator from "@/components/product/ShippingEstimator";
import { products as mainProducts, suppliers } from "@/lib/data";
import {
  machineryProducts,
  medicalProducts,
  electronicsProducts,
  fashionProducts,
  homeFurnitureProducts,
} from "@/lib/homeProducts";

// Fallback images for lib/data.ts items without explicit image paths
const PRODUCT_IMAGES: Record<string, string> = {
  "industrial-cnc-lathe-machine": "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
  "bluetooth-wireless-earbuds": "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80",
  "organic-cotton-t-shirts": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80",
  "modular-office-desk-system": "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=600&q=80",
  "automotive-led-headlight-kit": "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80",
  "hyaluronic-acid-serum-oem": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80",
};

interface SpecItem {
  label: string;
  value: string;
}

interface DetailedProduct {
  id?: number;
  code?: string;
  slug: string;
  name: string;
  description?: string;
  price: string | number;
  moq?: string | number;
  leadTime?: string | number;
  image?: string;
  brand?: string;
  modelNumber?: string;
  country?: string;
  supplierName?: string;
  industry?: string;
  supplierSlug?: string;
  verified?: boolean;
  specs?: SpecItem[];
  vendor?: any;
  category?: any;
  subCategory?: any;
}

// Unified catalog gatherer
function getAllProducts(): DetailedProduct[] {
  const formattedMain: DetailedProduct[] = mainProducts.map((p) => ({
    slug: p.slug,
    code: p.code,
    name: p.name,
    industry: p.industry,
    description: p.description || "High-quality wholesale product available for bulk order and custom branding.",
    price: p.price,
    moq: p.moq,
    leadTime: p.leadTime || "15 - 30 Days",
    image: PRODUCT_IMAGES[p.slug] || "https://picsum.photos/seed/default/600/600",
    supplierSlug: p.supplierSlug,
    specs: p.specs || [
      { label: "Minimum Order Quantity", value: p.moq },
      { label: "Pricing", value: p.price },
      { label: "Category", value: p.industry },
    ],
  }));

  const convertExtra = (list: any[], industryName: string): DetailedProduct[] =>
    list.map((p) => {
      const slug = p.id || p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      return {
        slug,
        code: p.id?.toUpperCase(),
        name: p.name,
        industry: industryName,
        description: `${p.name} sourced directly from ${p.supplier || "verified global manufacturers"}. Meets industrial standards with complete quality certification.`,
        price: p.price,
        moq: p.moq || "Negotiable",
        leadTime: "10 - 25 Days",
        image: p.image,
        supplierName: p.supplier,
        country: p.country,
        verified: p.verified,
        specs: [
          { label: "Supplier", value: p.supplier || "Verified Supplier" },
          { label: "Origin Country", value: p.country || "Global" },
          { label: "Minimum Order", value: p.moq || "Negotiable" },
          { label: "Verification Status", value: p.verified ? "Verified Gold Supplier" : "Standard Supplier" },
        ],
      };
    });

  return [
    ...formattedMain,
    ...convertExtra(machineryProducts, "Machinery"),
    ...convertExtra(medicalProducts, "Medical"),
    ...convertExtra(electronicsProducts, "Electronics"),
    ...convertExtra(fashionProducts, "Fashion"),
    ...convertExtra(homeFurnitureProducts, "Home & Furniture"),
  ];
}

// export function generateStaticParams() {
//   const all = getAllProducts();
//   return all.map((p) => ({ slug: p.slug }));
// }

// export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
//   const all = getAllProducts();
//   const product = all.find((p) => p.slug === params.slug);
//   return { title: product ? `${product.name} | Product Details` : "Product Details" };
// }

// --- Deterministic trust / commerce signals (no client state required) ---

function hashString(str: string | undefined): number {
  if (!str) {
    console.log("hashString received:", str);
    return 0;
  }

  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }

  return Math.abs(hash);
}

function getTrustSignals(slug: string) {
  const h = hashString(slug);
  const rating = Math.min(5, Math.round((3.6 + (h % 15) / 10) * 10) / 10); // 3.6 - 5.0
  const reviewCount = 18 + (h % 480); // 18 - 497
  const ordersCount = 50 + (h % 2000); // 50 - 2049
  const responseRate = 88 + (h % 12); // 88% - 99%
  const responseTime = 1 + (h % 6); // 1 - 6 hours
  return { rating, reviewCount, ordersCount, responseRate, responseTime };
}

function parsePriceValue(price: string | number | null | undefined): number | null {
  console.log("Price value:", price, typeof price);

  if (price === null || price === undefined) return null;

  if (typeof price === "number") {
    return price;
  }

  if (typeof price === "string") {
    const match = price.replace(/,/g, "").match(/(\d+(\.\d+)?)/);
    return match ? parseFloat(match[1]) : null;
  }

  return null;
}

function getPriceTiers(price: string | number, moq?: string | number) {
  const base = parsePriceValue(price);
  if (base === null) return null;

  const minQty = parsePriceValue(moq) ?? 1;
  const tierQtys = [minQty, minQty * 5, minQty * 20];

  return tierQtys.map((qty, idx) => ({
    range: idx === tierQtys.length - 1 ? `${qty.toLocaleString()}+` : `${qty.toLocaleString()} - ${(tierQtys[idx + 1] - 1).toLocaleString()}`,
    price: `$${(base * (1 - idx * 0.08)).toFixed(2)}`,
  }));
}

function getShippingInfo(slug: string) {
  const ports = ["Karachi Port", "Port Qasim", "Shanghai Port", "Shenzhen Port", "Guangzhou Port"];
  const paymentTerms = ["T/T, L/C, Western Union", "T/T, PayPal, Escrow", "L/C, T/T, D/P"];
  const packaging = ["Standard export carton", "Wooden crate, pallet-ready", "Custom branded packaging available"];
  const h = hashString(slug);
  return {
    port: ports[h % ports.length],
    payment: paymentTerms[h % paymentTerms.length],
    packaging: packaging[h % packaging.length],
    supplyAbility: `${(500 + (h % 9500)).toLocaleString()} units / month`,
  };
}

// --- New mock data for gallery, reviews, certifications, factory/packaging imagery ---

function getGalleryItems(product: DetailedProduct) {
  const h = hashString(product.slug);
  const base =
    typeof product.image === "string" && product.image
      ? product.image
      : "https://picsum.photos/600/600";

  const sep = base.includes("?") ? "&" : "?";
  return [
    { type: "image" as const, src: base, label: "Front View" },
    { type: "image" as const, src: `${base}${sep}sig=${h % 89}`, label: "Side View" },
    { type: "image" as const, src: `${base}${sep}sig=${(h + 37) % 89}`, label: "Packaging" },
    {
      type: "video" as const,
      src: `${base}${sep}sig=${(h + 61) % 89}`,
      label: "Product Video",
      videoUrl: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    },
  ];
}

const REVIEW_NAMES = ["James Whitfield", "Amara Chen", "Diego Fernandez", "Fatima Al-Sayed", "Lucas Meyer", "Priya Nair", "Oliver Grant", "Sophia Rossi"];
const REVIEW_COUNTRIES = ["United States", "Germany", "UAE", "Brazil", "Australia", "India", "United Kingdom", "Italy"];
const REVIEW_COMMENTS = [
  "Solid build quality and matched the spec sheet exactly. Communication with the supplier was smooth throughout.",
  "Good value for the price tier. Packaging held up well during a long transit.",
  "Delivered on time and the sample matched the bulk order. Would source again.",
  "Minor delay in shipping but the supplier kept us updated and offered a partial credit.",
  "Exactly what we needed for our production line. Documentation was thorough.",
  "Quality control was consistent across the batch. No defects on inspection.",
];

function getReviews(slug: string) {
  const h = hashString(slug);
  const count = 5 + (h % 4); // 5-8 reviews
  return Array.from({ length: count }).map((_, i) => {
    const seed = h + i * 13;
    return {
      name: REVIEW_NAMES[seed % REVIEW_NAMES.length],
      country: REVIEW_COUNTRIES[seed % REVIEW_COUNTRIES.length],
      rating: 3 + (seed % 3), // 3-5
      date: `${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"][seed % 7]} 2026`,
      comment: REVIEW_COMMENTS[seed % REVIEW_COMMENTS.length],
      helpful: seed % 24,
    };
  });
}

const ALL_CERTIFICATIONS = ["ISO 9001", "CE", "RoHS", "SGS Tested", "BSCI Audited", "ISO 14001"];

function getCertifications(slug: string) {
  const h = hashString(slug);
  const shuffled = [...ALL_CERTIFICATIONS].sort((a, b) => ((h + a.length) % 7) - ((h + b.length) % 7));
  return shuffled.slice(0, 3 + (h % 2));
}

function getFactoryImages(product: DetailedProduct) {
  const gallery = getGalleryItems(product).filter((g) => g.type === "image");
  const labels = ["Factory Floor", "Production Line", "Warehouse"];
  return gallery.map((g, i) => ({ src: g.src, label: labels[i % labels.length] }));
}

function getPackagingImages(product: DetailedProduct) {
  const gallery = getGalleryItems(product).filter((g) => g.type === "image");
  const labels = ["Export Carton", "Pallet Packaging", "Custom Branding"];
  return gallery.map((g, i) => ({ src: g.src, label: labels[i % labels.length] }));
}


export default function ProductDetail({
  params,
}: {
  params: { slug: string };
}) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await apiRequest("/product");

        const products = response.data || response;

        const found = products.find(
          (p: any) =>
            p.slug === params.slug ||
            String(p.id) === params.slug
        );

        console.log("FOUND PRODUCT:", JSON.stringify(found, null, 2));

        if (!found) {
          setProduct(null);
          return;
        }

        setProduct({
          ...found,

          slug: found.slug || String(found.id),

          industry: found.category?.name || "General",

          supplierName:
            found.vendor?.companyName || "Unknown Supplier",

          country:
            found.vendor?.country || "Pakistan",

          image:
            found.image ||
            "https://picsum.photos/600/600",

          leadTime:
            found.leadTime ||
            "15 - 30 Days",

          moq:
            found.moq ||
            "Negotiable",

          specs: [
            {
              label: "Brand",
              value: found.brand || "Not Specified",
            },
            {
              label: "Model Number",
              value: found.modelNumber || "Not Specified",
            },
            {
              label: "Stock Available",
              value: `${found.stock ?? 0} units`,
            },
            {
              label: "Category",
              value: found.category?.name || "General",
            },
            {
              label: "Sub Category",
              value: found.subCategory?.name || "General",
            },
          ],
        });


        // setProduct(found);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [params.slug]);

  if (loading) {
    return <div className="container-x py-20">Loading...</div>;
  }

  console.log("Product:", product);

  if (!product) {
    return (
      <div style={{ padding: "40px" }}>
        Product not found
      </div>
    );
  }

  // Matched supplier logic
  const supplier = product.supplierSlug
    ? suppliers.find((s) => s.slug === product.supplierSlug)
    : null;

  // Related products from same category
  const related: any[] = [];

  const slug = product.slug || product.id?.toString() || "";

  const { rating, reviewCount, ordersCount, responseRate, responseTime } =
    getTrustSignals(slug); const priceTiers = getPriceTiers(product.price, product.moq);
  const shipping = getShippingInfo(slug);
  const galleryItems = getGalleryItems(product);
  const reviews = getReviews(slug);
  const certifications = getCertifications(slug);
  const factoryImages = getFactoryImages(product);
  const packagingImages = getPackagingImages(product);
  const seedHash = hashString(slug);

  const handleAddToCart = async () => {

    try {

      const user = getStoredUser();

      console.log("ADD CART USER:", user);
      console.log(
        "LOCAL STORAGE USER:",
        localStorage.getItem("user")
      );

      if (!user) {
        window.location.href = "/login";
        return;
      }


      await apiRequest(`/cart/${user.id}/add`, {
        method: "POST",
        body: JSON.stringify({
          productId: product.id,
          quantity: 1,
        }),
      });


      window.location.href = "/cart";


    } catch (error) {

      console.error(
        "ADD TO CART FAILED:",
        error
      );

    }

  };

  const handleAddToWishlist = async () => {

    try {

      const user = getStoredUser();

      console.log("WISHLIST USER:", user);


      if (!user) {
        window.location.href = "/login";
        return;
      }


      const response = await apiRequest("/wishlist", {
        method: "POST",
        body: JSON.stringify({
          userId: user.id,
          productId: product.id,
        }),
      });


      console.log(
        "WISHLIST RESPONSE:",
        response
      );


      alert("Product added to wishlist");


    } catch (error) {

      console.error(
        "ADD WISHLIST FAILED:",
        error
      );

    }

  };

  return (
    <>
      <section className="border-b border-line bg-paper overflow-hidden">
        <div className="container-x py-8 sm:py-14 md:py-20">
          <nav className="text-[11px] sm:text-xs font-mono uppercase tracking-widest2 text-smoke mb-5 sm:mb-8 flex flex-wrap items-center gap-1">
            <Link href="/" className="hover:text-ink">Home</Link>
            <span className="mx-1">/</span>
            <Link href="/products" className="hover:text-ink">Products</Link>
            <span className="mx-1">/</span>
            <span className="text-ink break-words">{product.industry}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 lg:gap-12">
            {/* Image column: gallery with zoom/lightbox + video */}
            <div className="lg:col-span-5">
              <div className="w-full max-w-sm sm:max-w-md mx-auto lg:max-w-none lg:mx-0">
                <ProductGallery items={galleryItems} productName={product.name} />

                {/* Trade assurance strip */}
                <div className="mt-4 grid grid-cols-3 gap-px bg-line border border-line text-center">
                  <div className="bg-bone py-2.5 sm:py-3 px-1.5 sm:px-2 flex flex-col items-center gap-1 sm:gap-1.5">
                    <ShieldCheck size={15} className="text-emerald-600 shrink-0" />
                    <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wide text-smoke leading-tight">
                      Trade<br />Assurance
                    </span>
                  </div>
                  <div className="bg-paper py-2.5 sm:py-3 px-1.5 sm:px-2 flex flex-col items-center gap-1 sm:gap-1.5">
                    <Award size={15} className="text-ink shrink-0" />
                    <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wide text-smoke leading-tight">
                      Quality<br />Certified
                    </span>
                  </div>
                  <div className="bg-paper py-2.5 sm:py-3 px-1.5 sm:px-2 flex flex-col items-center gap-1 sm:gap-1.5">
                    <Truck size={15} className="text-ink shrink-0" />
                    <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wide text-smoke leading-tight">
                      On-Time<br />Delivery
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 min-w-0">
              <Eyebrow>{product.industry}</Eyebrow>
              <h1 className="mt-3 sm:mt-4 font-display font-bold text-xl xs:text-2xl sm:text-3xl md:text-4xl tracking-tightest break-words">
                {product.name}
              </h1>

              {/* Rating + orders row */}
              <div className="mt-3 flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-1.5 text-xs sm:text-sm">
                <span className="inline-flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={`shrink-0 ${i < Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-line"}`}
                      />
                    ))}
                  </span>
                  <span className="font-medium text-ink">{rating.toFixed(1)}</span>
                  <span className="text-smoke">({reviewCount})</span>
                </span>
                <span className="text-smoke hidden sm:inline">•</span>
                <span className="text-smoke">{ordersCount.toLocaleString()}+ orders</span>
                <span className="text-smoke hidden sm:inline">•</span>
                <span className="text-smoke">{responseRate}% response rate</span>
              </div>

              {(product.supplierName || product.country) && (
                <p className="mt-3 text-[11px] sm:text-xs font-mono text-smoke uppercase tracking-wider break-words">
                  Supplier: {product.supplierName} {product.country ? `(${product.country})` : ""}
                </p>
              )}

              <p className="mt-4 sm:mt-5 text-ash leading-relaxed max-w-xl text-sm sm:text-base">
                {product.description}
              </p>

              <div className="mt-6 sm:mt-8 grid grid-cols-3 gap-2 xs:gap-3 sm:gap-6 border-y border-line py-4 sm:py-6 max-w-md">
                <div className="min-w-0">
                  <p className="text-[9px] sm:text-xs font-mono uppercase tracking-widest2 text-smoke">Price</p>
                  <p className="mt-1 font-medium text-xs sm:text-base break-words">{product.price}</p>
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] sm:text-xs font-mono uppercase tracking-widest2 text-smoke">MOQ</p>
                  <p className="mt-1 font-medium text-xs sm:text-base break-words">{product.moq}</p>
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] sm:text-xs font-mono uppercase tracking-widest2 text-smoke">Lead Time</p>
                  <p className="mt-1 font-medium text-xs sm:text-base break-words">{product.leadTime}</p>
                </div>
              </div>

              {/* Bulk pricing tiers */}
              {priceTiers && (
                <div className="mt-6 sm:mt-8 w-full max-w-md">
                  <p className="text-[10px] sm:text-xs font-mono uppercase tracking-widest2 text-smoke mb-3">
                    Bulk Pricing
                  </p>
                  <div className="border border-line divide-y divide-line overflow-hidden">
                    <div className="grid grid-cols-2 bg-bone px-3 sm:px-4 py-2">
                      <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wide text-smoke">Quantity (pcs)</span>
                      <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wide text-smoke text-right">Price / Unit</span>
                    </div>
                    {priceTiers.map((tier, idx) => (
                      <div key={idx} className="grid grid-cols-2 px-3 sm:px-4 py-2.5">
                        <span className="text-xs sm:text-sm break-words pr-2">{tier.range}</span>
                        <span className="text-xs sm:text-sm font-medium text-right shrink-0">{tier.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* <div className="mt-6 sm:mt-8 flex flex-wrap gap-3 sm:gap-4">
                <PrimaryButton href="/contact" icon={ArrowUpRight}>
                  Request Quotation
                </PrimaryButton>
                {supplier && (
                  <GhostButton href={`/suppliers/${supplier.slug}`}>
                    View Supplier
                  </GhostButton>
                )}
              </div> */}

              <div className="mt-6 sm:mt-8 flex flex-wrap gap-3 sm:gap-4">


                <button
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>


                <button
                  onClick={handleAddToWishlist}
                >
                  Add to Wishlist
                </button>


                <PrimaryButton href="/contact" icon={ArrowUpRight}>
                  Request Quotation
                </PrimaryButton>


              </div>

              <div className="mt-4">
                <ProductActions productName={product.name} />
              </div>

              <p className="mt-3 flex items-center gap-1.5 text-[11px] sm:text-xs text-smoke">
                <Clock size={12} className="shrink-0" />
                Typical response time: {responseTime} hour{responseTime > 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Specifications */}
      {product.specs && product.specs.length > 0 && (
        <section className="border-b border-line bg-bone overflow-hidden">
          <div className="container-x py-8 sm:py-14 md:py-20">
            <Eyebrow>Specifications</Eyebrow>
            <div className="mt-5 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-px bg-line border border-line max-w-3xl">
              {product.specs.map((s: { label: string; value: string }, idx: number) => (
                <div
                  key={`${s.label}-${idx}`}
                  className="bg-paper p-4 sm:p-5 flex items-center justify-between gap-3 sm:gap-4"
                >
                  <span className="text-xs sm:text-sm text-smoke shrink-0">{s.label}</span>
                  <span className="text-xs sm:text-sm font-medium text-right break-words">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Shipping & Payment */}
      <section className="border-b border-line bg-paper overflow-hidden">
        <div className="container-x py-8 sm:py-14 md:py-20">
          <Eyebrow>Shipping & Payment</Eyebrow>
          <div className="mt-5 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-px bg-line border border-line max-w-3xl">
            <div className="bg-bone p-4 sm:p-5 flex items-start gap-3">
              <Globe2 size={16} className="text-smoke shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-[9px] sm:text-xs font-mono uppercase tracking-widest2 text-smoke">Port of Loading</p>
                <p className="mt-1 text-xs sm:text-sm font-medium break-words">{shipping.port}</p>
              </div>
            </div>
            <div className="bg-paper p-4 sm:p-5 flex items-start gap-3">
              <CreditCard size={16} className="text-smoke shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-[9px] sm:text-xs font-mono uppercase tracking-widest2 text-smoke">Payment Terms</p>
                <p className="mt-1 text-xs sm:text-sm font-medium break-words">{shipping.payment}</p>
              </div>
            </div>
            <div className="bg-paper p-4 sm:p-5 flex items-start gap-3">
              <Package size={16} className="text-smoke shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-[9px] sm:text-xs font-mono uppercase tracking-widest2 text-smoke">Packaging</p>
                <p className="mt-1 text-xs sm:text-sm font-medium break-words">{shipping.packaging}</p>
              </div>
            </div>
            <div className="bg-paper p-4 sm:p-5 flex items-start gap-3">
              <Truck size={16} className="text-smoke shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-[9px] sm:text-xs font-mono uppercase tracking-widest2 text-smoke">Supply Ability</p>
                <p className="mt-1 text-xs sm:text-sm font-medium break-words">{shipping.supplyAbility}</p>
              </div>
            </div>
          </div>

          {/* Packaging images */}
          <div className="mt-6 sm:mt-8 max-w-3xl">
            <p className="text-[10px] sm:text-xs font-mono uppercase tracking-widest2 text-smoke mb-3">
              Packaging Gallery
            </p>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {packagingImages.map((img, i) => (
                <div key={i} className="relative aspect-square border border-line overflow-hidden group">
                  <Image
                    src={img.src}
                    alt={img.label}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="150px"
                  />
                  <span className="absolute bottom-0 inset-x-0 bg-ink/70 text-paper text-[9px] sm:text-[10px] font-mono uppercase tracking-wide text-center py-1">
                    {img.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping estimator */}
          <div className="mt-6 sm:mt-8">
            <ShippingEstimator seedHash={seedHash} originPort={shipping.port} />
          </div>
        </div>
      </section>

      {/* Supplied By Section (Data-backed Supplier) */}
      {supplier && (
        <section className="border-b border-line bg-bone overflow-hidden">
          <div className="container-x py-8 sm:py-14 md:py-20">
            <Eyebrow>Supplied By</Eyebrow>

            <Link
              href={`/suppliers/${supplier.slug}`}
              className="mt-5 sm:mt-6 group flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 border border-line bg-paper p-4 sm:p-6 card-hover max-w-3xl"
            >
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <div className="w-9 h-9 sm:w-12 sm:h-12 bg-ink text-paper flex items-center justify-center font-display font-bold shrink-0 text-sm sm:text-base">
                  {supplier.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-display font-semibold text-sm sm:text-base break-words">{supplier.name}</h3>
                    {supplier.verified && <ShieldCheck size={14} className="shrink-0" />}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-1 text-[11px] sm:text-xs text-ash font-mono">
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={11} className="shrink-0" /> {supplier.country}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Star size={11} className="shrink-0" /> {supplier.rating}
                    </span>
                    <span>{supplier.years} yrs on FAST</span>
                  </div>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-mono uppercase tracking-widest2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0">
                View profile <ArrowUpRight size={13} />
              </span>
            </Link>

            {/* Extended supplier metrics */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-px bg-line border border-line max-w-3xl">
              <div className="bg-paper p-3 sm:p-4 text-center">
                <p className="font-display font-bold text-lg sm:text-xl">{supplier.years}</p>
                <p className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wide text-smoke mt-0.5">Years Active</p>
              </div>
              <div className="bg-paper p-3 sm:p-4 text-center">
                <p className="font-display font-bold text-lg sm:text-xl">{responseRate}%</p>
                <p className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wide text-smoke mt-0.5">Response Rate</p>
              </div>
              <div className="bg-paper p-3 sm:p-4 text-center">
                <p className="font-display font-bold text-lg sm:text-xl">{ordersCount.toLocaleString()}+</p>
                <p className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wide text-smoke mt-0.5">Orders Completed</p>
              </div>
              <div className="bg-paper p-3 sm:p-4 text-center">
                <p className="font-display font-bold text-lg sm:text-xl">{supplier.rating}</p>
                <p className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wide text-smoke mt-0.5">Avg. Rating</p>
              </div>
            </div>

            {/* Certifications */}
            <div className="mt-6 max-w-3xl">
              <p className="text-[10px] sm:text-xs font-mono uppercase tracking-widest2 text-smoke mb-3">
                Certifications
              </p>
              <div className="flex flex-wrap gap-2">
                {certifications.map((cert) => (
                  <span
                    key={cert}
                    className="inline-flex items-center gap-1.5 border border-line bg-paper px-3 py-1.5 text-xs font-mono"
                  >
                    <BadgeCheck size={13} className="text-emerald-600" /> {cert}
                  </span>
                ))}
              </div>
            </div>

            {/* Factory images */}
            <div className="mt-6 max-w-3xl">
              <p className="text-[10px] sm:text-xs font-mono uppercase tracking-widest2 text-smoke mb-3 flex items-center gap-1.5">
                <Factory size={13} /> Factory & Facilities
              </p>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {factoryImages.map((img, i) => (
                  <div key={i} className="relative aspect-[4/3] border border-line overflow-hidden group">
                    <Image
                      src={img.src}
                      alt={img.label}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="150px"
                    />
                    <span className="absolute bottom-0 inset-x-0 bg-ink/70 text-paper text-[9px] sm:text-[10px] font-mono uppercase tracking-wide text-center py-1">
                      {img.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Frequently Bought Together */}
      {related.length > 0 && (
        <section className="border-b border-line bg-paper overflow-hidden">
          <div className="container-x py-8 sm:py-14 md:py-20">
            <Eyebrow>Frequently Bought Together</Eyebrow>
            <div className="mt-5 sm:mt-8">
              <FrequentlyBoughtTogether
                main={{ slug: product.slug, name: product.name, image: product.image, price: product.price }}
                extras={related.slice(0, 2).map((r) => ({ slug: r.slug, name: r.name, image: r.image, price: r.price }))}
              />
            </div>
          </div>
        </section>
      )}

      {/* Reviews & Inquiry */}
      <section className="border-b border-line bg-bone overflow-hidden">
        <div className="container-x py-8 sm:py-14 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            <div>
              <Eyebrow>Customer Reviews</Eyebrow>
              <div className="mt-5 sm:mt-8">
                <ReviewsSection reviews={reviews} averageRating={rating} reviewCount={reviewCount} />
              </div>
            </div>
            <div>
              <Eyebrow>Product Inquiry</Eyebrow>
              <div className="mt-5 sm:mt-8">
                <InquiryForm productName={product.name} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products Section */}
      {related.length > 0 && (
        <section className="bg-paper overflow-hidden">
          <div className="container-x py-8 sm:py-14 md:py-20">
            <Eyebrow>More in {product.industry}</Eyebrow>
            <div className="mt-5 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-line border border-line">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/products/${r.slug}`}
                  className="group block bg-bone p-4 sm:p-6 card-hover border border-transparent min-w-0 flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-[4/3] bg-bone border border-line mb-4 relative overflow-hidden">
                      <Image
                        src={r.image}
                        alt={r.name}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                    {r.code && <span className="font-mono text-xs text-smoke">{r.code}</span>}
                    <h3 className="mt-2 font-display font-semibold leading-snug text-sm sm:text-base break-words">{r.name}</h3>
                  </div>
                  <div className="mt-4 pt-3 border-t border-line flex items-center justify-between gap-2">
                    <p className="text-xs sm:text-sm font-medium">{r.price}</p>
                    <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-mono uppercase tracking-widest2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      View <ArrowUpRight size={13} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Spacer so fixed mobile CTA bar never overlaps the last section's content */}
      <div className="lg:hidden h-24" aria-hidden="true" />

      {/* Sticky mobile CTA bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-paper border-t border-line px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[9px] font-mono uppercase tracking-widest2 text-smoke">Price</p>
          <p className="text-xs sm:text-sm font-medium truncate">{product.price}</p>
        </div>
        <div className="shrink-0">
          <PrimaryButton href="/contact" icon={ArrowUpRight}>
            <span className="hidden xs:inline">Request Quotation</span>
            <span className="xs:hidden">Get Quote</span>
          </PrimaryButton>
        </div>
      </div>
    </>
  );
}