"use client";

import { useState } from "react";
import { Heart, GitCompareArrows, MessageCircle, Download, Check } from "lucide-react";

export default function ProductActions({
  productName,
  whatsappMessage,
  catalogHref,
}: {
  productName: string;
  whatsappMessage?: string;
  catalogHref?: string;
}) {
  const [wishlisted, setWishlisted] = useState(false);
  const [compared, setCompared] = useState(false);

  const waText = encodeURIComponent(
    whatsappMessage || `Hi, I'm interested in ${productName}. Could you share more details?`
  );

  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
      <button
        type="button"
        onClick={() => setWishlisted((v) => !v)}
        className={`inline-flex items-center gap-1.5 border px-3 py-2 text-xs font-mono uppercase tracking-wide transition-colors ${wishlisted ? "border-ink bg-ink text-paper" : "border-line text-ash hover:border-ash"
          }`}
      >
        <Heart size={13} className={wishlisted ? "fill-current" : ""} />
        {wishlisted ? "Saved" : "Wishlist"}
      </button>

      <button
        type="button"
        onClick={() => setCompared((v) => !v)}
        className={`inline-flex items-center gap-1.5 border px-3 py-2 text-xs font-mono uppercase tracking-wide transition-colors ${compared ? "border-ink bg-ink text-paper" : "border-line text-ash hover:border-ash"
          }`}
      >
        {compared ? <Check size={13} /> : <GitCompareArrows size={13} />}
        {compared ? "Added" : "Compare"}
      </button>


      <a
        href={`https://wa.me/?text=${waText}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 border border-line px-3 py-2 text-xs font-mono uppercase tracking-wide text-ash hover:border-ash transition-colors"
      >
        <MessageCircle size={13} /> Chat
      </a>


      <a
        href={catalogHref || "#"}
        download
        onClick={(e) => {
          if (!catalogHref) e.preventDefault();
        }}
        className="inline-flex items-center gap-1.5 border border-line px-3 py-2 text-xs font-mono uppercase tracking-wide text-ash hover:border-ash transition-colors"
      >
        <Download size={13} /> Catalog
      </a>
    </div>
  );
}