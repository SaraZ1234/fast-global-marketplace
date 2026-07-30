"use client";

import { useState } from "react";
import { Heart, Share2, Mail, Check, Copy } from "lucide-react";

export default function SupplierActions({ supplierName }: { supplierName: string }) {
  const [following, setFollowing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ title: supplierName, url });
        return;
      }
    } catch {
      /* user cancelled or unsupported — fall back to copy */
    }
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setShowShare(true);
      setTimeout(() => {
        setCopied(false);
        setShowShare(false);
      }, 2000);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3 relative">
      <button
        type="button"
        onClick={() => setFollowing((v) => !v)}
        className={`inline-flex items-center gap-1.5 border px-3 py-2 text-xs font-mono uppercase tracking-wide transition-colors ${
          following ? "border-ink bg-ink text-paper" : "border-line text-ash hover:border-ash"
        }`}
      >
        <Heart size={13} className={following ? "fill-current" : ""} />
        {following ? "Following" : "Follow"}
      </button>

      <button
        type="button"
        onClick={handleShare}
        className="inline-flex items-center gap-1.5 border border-line px-3 py-2 text-xs font-mono uppercase tracking-wide text-ash hover:border-ash transition-colors"
      >
        {copied ? <Check size={13} /> : <Share2 size={13} />}
        {copied ? "Copied" : "Share"}
      </button>

      
        <a
        href={`mailto:?subject=${encodeURIComponent(`Supplier: ${supplierName}`)}&body=${encodeURIComponent(
          `Check out this supplier: ${typeof window !== "undefined" ? window.location.href : ""}`
        )}`}
        className="inline-flex items-center gap-1.5 border border-line px-3 py-2 text-xs font-mono uppercase tracking-wide text-ash hover:border-ash transition-colors"
      >
        <Mail size={13} />
        Email
      </a>

      {showShare && (
        <span className="absolute -bottom-7 left-0 text-[10px] font-mono text-emerald-700 flex items-center gap-1 animate-[fadeUp_0.2s_ease-out]">
          <Copy size={10} /> Link copied to clipboard
        </span>
      )}

      <style jsx>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}