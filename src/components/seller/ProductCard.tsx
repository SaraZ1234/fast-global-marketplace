"use client";

import Link from "next/link";
import { Eye, Pencil, Trash2, MoreVertical, Globe2 } from "lucide-react";
import { useState } from "react";
import { SellerProduct } from "@/lib/sellerTypes";
import StatusBadge from "./StatusBadge";

const MARKETPLACE_LABEL: Record<SellerProduct["marketplace"], string> = {
  INTERNATIONAL: "International",
  PAKISTAN: "Pakistan",
  GULF: "Gulf",
  CHINESE: "Chinese",
};

interface ProductCardProps {
  product: SellerProduct;
  onDelete: (id: string) => void;
}

export default function ProductCard({ product, onDelete }: ProductCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="group bg-paper border border-line p-4 sm:p-5 flex flex-col transition-shadow hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
      <div className="relative aspect-square w-full bg-bone overflow-hidden mb-3 border border-line">
        <img
          src={product.images[0] || "/placeholder.jpg"}
          alt={product.title}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-2 left-2">
          <StatusBadge status={product.status} />
        </div>
        <div className="absolute top-2 right-2">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="p-1.5 bg-paper/90 border border-line text-ink hover:bg-paper transition-colors"
            aria-label="More actions"
          >
            <MoreVertical size={14} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-1 w-36 bg-paper border border-line shadow-lg text-xs font-mono uppercase tracking-wider z-10">
              <Link
                href={`/seller/products/${product.id}/preview`}
                className="flex items-center gap-2 px-3 py-2 hover:bg-bone transition-colors"
              >
                <Eye size={12} /> Preview
              </Link>
              <Link
                href={`/seller/products/${product.id}/edit`}
                className="flex items-center gap-2 px-3 py-2 hover:bg-bone transition-colors"
              >
                <Pencil size={12} /> Edit
              </Link>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onDelete(product.id);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-bone transition-colors text-left"
              >
                <Trash2 size={12} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="text-[10px] font-mono uppercase tracking-wider text-ash mb-1 flex items-center gap-1.5">
        <Globe2 size={11} /> {MARKETPLACE_LABEL[product.marketplace]}
      </div>
      <h3 className="font-display font-semibold text-sm leading-snug line-clamp-2 mb-2">{product.title}</h3>

      <div className="mt-auto pt-3 border-t border-line flex items-center justify-between">
        <span className="font-display font-bold text-base">
          {product.currency} {product.price.toLocaleString()}
        </span>
        <span className="text-[11px] font-mono text-ash flex items-center gap-1">
          <Eye size={12} /> {product.views}
        </span>
      </div>

      <div className="mt-3 flex gap-2">
        <Link
          href={`/seller/products/${product.id}/edit`}
          className="flex-1 text-center py-2 bg-bone border border-line text-xs font-mono uppercase tracking-wider hover:bg-ink hover:text-paper transition-colors"
        >
          Edit
        </Link>
        <Link
          href={`/seller/products/${product.id}/preview`}
          className="px-3 py-2 bg-ink text-paper text-xs font-mono uppercase tracking-wider hover:bg-ash transition-colors flex items-center justify-center"
        >
          <Eye size={13} />
        </Link>
      </div>
    </div>
  );
}
