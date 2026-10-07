"use client";

import Link from "next/link";
import { Menu, PlusCircle } from "lucide-react";
import { useSellerStore } from "@/lib/sellerStore";

export default function SellerHeader({ onMenuClick }: { onMenuClick: () => void }) {
  const { profile } = useSellerStore();

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/95 backdrop-blur-xs">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3.5">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 border border-line hover:border-ink transition-colors"
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-ash">Welcome back</p>
            <p className="font-display font-semibold text-sm sm:text-base leading-tight">
              {profile.businessName || profile.contactName || "Seller"}
            </p>
          </div>
        </div>

        <Link
          href="/seller/products/new"
          className="inline-flex items-center gap-2 bg-ink text-paper px-3 sm:px-4 py-2 text-xs font-mono uppercase tracking-wider hover:bg-ash transition-colors"
        >
          <PlusCircle size={14} />
          <span className="hidden sm:inline">Add Product</span>
        </Link>
      </div>
    </header>
  );
}
