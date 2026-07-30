import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { Eyebrow } from "@/components/UI";
import { X } from "lucide-react";

export const metadata: Metadata = { title: "Wishlist | FAST Global Marketplace" };

const WISHLIST = [
  { slug: "industrial-cnc-lathe-machine", name: "Industrial CNC Lathe Machine", price: "$9,200", moq: "1 unit", image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80" },
  { slug: "bluetooth-wireless-earbuds", name: "Bluetooth Wireless Earbuds", price: "$8.20", moq: "500 pcs", image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=400&q=80" },
  { slug: "hyaluronic-acid-serum-oem", name: "Hyaluronic Acid Serum OEM", price: "$2.85", moq: "2,000 pcs", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80" },
  { slug: "automotive-led-headlight-kit", name: "Automotive LED Headlight Kit", price: "$25.50", moq: "100 units", image: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=400&q=80" },
  { slug: "modular-office-desk-system", name: "Modular Office Desk System", price: "$350", moq: "10 units", image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=400&q=80" },
  { slug: "organic-cotton-t-shirts", name: "Organic Cotton T-Shirts", price: "$1.25", moq: "1,000 pcs", image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80" },
];

export default function WishlistPage() {
  return (
    <DashboardShell>
      <div className="mb-6 sm:mb-8">
        <Eyebrow>Wishlist</Eyebrow>
        <h1 className="mt-2 font-display font-bold text-2xl sm:text-3xl tracking-tightest">
          {WISHLIST.length} Saved Products
        </h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {WISHLIST.map((w) => (
          <div key={w.slug} className="group relative bg-paper border border-line p-3 card-hover transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm">
            <button
              type="button"
              className="absolute top-2 right-2 z-10 w-7 h-7 bg-paper/90 border border-line flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Remove from wishlist"
            >
              <X size={12} />
            </button>
            <Link href={`/products/${w.slug}`}>
              <div className="relative aspect-square bg-bone overflow-hidden">
                <Image
                  src={w.image}
                  alt={w.name}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 45vw, 220px"
                />
              </div>
              <p className="mt-2.5 text-xs sm:text-sm font-medium leading-snug line-clamp-2 break-words">{w.name}</p>
              <p className="mt-1.5 text-xs sm:text-sm font-semibold text-ink">{w.price}</p>
              <p className="text-[10px] sm:text-[11px] text-smoke font-mono mt-0.5">MOQ: {w.moq}</p>
            </Link>
          </div>
        ))}
      </div>
    </DashboardShell>
  );
}