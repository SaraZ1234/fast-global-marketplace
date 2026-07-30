"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Play, ChevronLeft, ChevronRight, FileCheck2 } from "lucide-react";

type GalleryItem = {
  type: "factory" | "certificate" | "video";
  src: string;
  label: string;
  videoUrl?: string;
};

export default function FactoryGallery({ items }: { items: GalleryItem[] }) {
  const [active, setActive] = useState<number | null>(null);

  const goTo = (i: number) => setActive((i + items.length) % items.length);

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3">
        {items.map((item, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            className="group relative aspect-[4/3] border border-line overflow-hidden bg-bone"
          >
            <Image
              src={item.src}
              alt={item.label}
              fill
              unoptimized
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 22vw"
            />
            {item.type === "video" && (
              <span className="absolute inset-0 flex items-center justify-center bg-ink/30">
                <span className="w-9 h-9 rounded-full bg-paper/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play size={14} className="text-ink ml-0.5" fill="currentColor" />
                </span>
              </span>
            )}
            {item.type === "certificate" && (
              <span className="absolute top-1.5 left-1.5 bg-paper/90 p-1 border border-line">
                <FileCheck2 size={11} className="text-emerald-600" />
              </span>
            )}
            <span className="absolute bottom-0 inset-x-0 bg-ink/70 text-paper text-[9px] sm:text-[10px] font-mono uppercase tracking-wide text-center py-1 truncate px-1">
              {item.label}
            </span>
          </button>
        ))}
      </div>

      {active !== null && (
        <div
          className="fixed inset-0 z-50 bg-ink/90 flex items-center justify-center p-4 sm:p-8 animate-[fadeIn_0.2s_ease-out]"
          onClick={() => setActive(null)}
        >
          <button
            type="button"
            onClick={() => setActive(null)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 bg-paper/90 flex items-center justify-center"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          <div className="relative w-full max-w-3xl aspect-[4/3]" onClick={(e) => e.stopPropagation()}>
            {items[active].type === "video" && items[active].videoUrl ? (
              <video src={items[active].videoUrl} controls autoPlay className="w-full h-full object-contain bg-ink" />
            ) : (
              <Image
                src={items[active].src}
                alt={items[active].label}
                fill
                unoptimized
                className="object-contain"
                sizes="90vw"
              />
            )}
          </div>

          <p className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 text-paper text-xs sm:text-sm font-mono uppercase tracking-wide">
            {items[active].label}
          </p>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goTo(active - 1);
            }}
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-paper/90 flex items-center justify-center"
            aria-label="Previous"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              goTo(active + 1);
            }}
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-paper/90 flex items-center justify-center"
            aria-label="Next"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}