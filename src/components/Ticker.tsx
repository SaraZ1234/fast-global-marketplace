"use client";

import { tickerStats } from "@/lib/data";

export default function Ticker() {
  const loop = [...tickerStats, ...tickerStats];

  return (
    <div className="border-y border-line bg-bone overflow-hidden group">
      <div className="ticker-track flex w-max py-3 sm:py-4">
        {loop.map((s, i) => (
          <div
            key={i}
            className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 md:px-8 whitespace-nowrap border-r border-line shrink-0"
          >
            <span className="font-mono text-xs sm:text-sm font-medium text-ink">
              {s.value}
            </span>
            <span className="font-mono text-[9px] sm:text-[11px] tracking-widest2 text-smoke uppercase">
              {s.label}
            </span>
          </div>
        ))}
      </div>

      <style jsx>{`
        .ticker-track {
          animation: ticker-scroll 32s linear infinite;
        }

        .group:hover .ticker-track {
          animation-play-state: paused;
        }

        @keyframes ticker-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @media (max-width: 640px) {
          .ticker-track {
            animation-duration: 22s;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ticker-track {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}