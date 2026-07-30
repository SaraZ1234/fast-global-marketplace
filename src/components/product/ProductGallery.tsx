"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ZoomIn, Play, ChevronLeft, ChevronRight } from "lucide-react";

type GalleryItem = { type: "image" | "video"; src: string; label: string; videoUrl?: string };

export default function ProductGallery({
  items,
  productName,
}: {
  items: GalleryItem[];
  productName: string;
}) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [zooming, setZooming] = useState(false);
  const current = items[active];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setZoomPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const goTo = (i: number) => setActive((i + items.length) % items.length);

  return (
    <div>
      <div
        className="relative aspect-square bg-bone border border-line overflow-hidden group cursor-zoom-in"
        onMouseEnter={() => current.type === "image" && setZooming(true)}
        onMouseLeave={() => setZooming(false)}
        onMouseMove={current.type === "image" ? handleMouseMove : undefined}
        onClick={() => setLightbox(true)}
      >
        {current.type === "image" ? (
          <Image
            src={current.src}
            alt={`${productName} — ${current.label}`}
            fill
            unoptimized
            className="object-cover transition-transform duration-300"
            style={
              zooming
                ? { transform: "scale(1.9)", transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` }
                : undefined
            }
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 420px, 40vw"
            priority
          />
        ) : (
          <div className="relative w-full h-full">
            <Image
              src={current.src}
              alt={`${productName} video thumbnail`}
              fill
              unoptimized
              className="object-cover"
              sizes="(max-width: 640px) 90vw, 40vw"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-ink/30">
              <span className="w-14 h-14 rounded-full bg-paper/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play size={22} className="text-ink ml-0.5" fill="currentColor" />
              </span>
            </div>
          </div>
        )}

        <span className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 bg-paper/90 px-2 py-1 font-mono text-[10px] sm:text-xs text-ink flex items-center gap-1 border border-line opacity-0 group-hover:opacity-100 transition-opacity">
          <ZoomIn size={12} /> Zoom
        </span>

        {items.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goTo(active - 1);
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-paper/90 border border-line flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Previous image"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goTo(active + 1);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-paper/90 border border-line flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Next image"
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}
      </div>

      <div className="mt-3 grid grid-cols-4 gap-2 sm:gap-3">
        {items.map((item, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            className={`relative aspect-square border overflow-hidden transition-colors ${
              i === active ? "border-ink" : "border-line hover:border-ash"
            }`}
          >
            <Image src={item.src} alt={item.label} fill unoptimized className="object-cover" sizes="80px" />
            {item.type === "video" && (
              <span className="absolute inset-0 flex items-center justify-center bg-ink/30">
                <Play size={12} className="text-paper" fill="currentColor" />
              </span>
            )}
          </button>
        ))}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-ink/90 flex items-center justify-center p-4 sm:p-8 animate-[fadeIn_0.2s_ease-out]"
          onClick={() => setLightbox(false)}
        >
          <button
            type="button"
            onClick={() => setLightbox(false)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 bg-paper/90 flex items-center justify-center"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          <div className="relative w-full max-w-3xl aspect-square" onClick={(e) => e.stopPropagation()}>
            {current.type === "video" && current.videoUrl ? (
              <video src={current.videoUrl} controls autoPlay className="w-full h-full object-contain bg-ink" />
            ) : (
              <Image
                src={current.src}
                alt={`${productName} — ${current.label}`}
                fill
                unoptimized
                className="object-contain"
                sizes="90vw"
              />
            )}
          </div>

          {items.length > 1 && (
            <>
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
            </>
          )}
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