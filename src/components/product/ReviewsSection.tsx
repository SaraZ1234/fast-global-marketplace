"use client";

import { useState } from "react";
import { Star, ThumbsUp } from "lucide-react";

type Review = { name: string; country: string; rating: number; date: string; comment: string; helpful: number };

export default function ReviewsSection({
  reviews,
  averageRating,
  reviewCount,
}: {
  reviews: Review[];
  averageRating: number;
  reviewCount: number;
}) {
  const [visible, setVisible] = useState(3);
  const [helpfulClicked, setHelpfulClicked] = useState<Record<number, boolean>>({});

  const distribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => Math.round(r.rating) === star).length;
    return { star, count, pct: reviews.length ? Math.round((count / reviews.length) * 100) : 0 };
  });

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-6 sm:gap-10 max-w-3xl">
        <div className="flex sm:flex-col items-center sm:items-start gap-3 sm:gap-1">
          <p className="font-display font-bold text-3xl sm:text-4xl">{averageRating.toFixed(1)}</p>
          <div>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < Math.round(averageRating) ? "fill-amber-400 text-amber-400" : "text-line"}
                />
              ))}
            </div>
            <p className="text-xs text-smoke mt-1 font-mono">{reviewCount} reviews</p>
          </div>
        </div>

        <div className="space-y-1.5 w-full max-w-xs">
          {distribution.map((d) => (
            <div key={d.star} className="flex items-center gap-2 text-xs">
              <span className="w-3 text-smoke font-mono">{d.star}</span>
              <Star size={10} className="text-amber-400 fill-amber-400 shrink-0" />
              <div className="flex-1 h-1.5 bg-line overflow-hidden">
                <div className="h-full bg-ink transition-all duration-700 ease-out" style={{ width: `${d.pct}%` }} />
              </div>
              <span className="w-8 text-right text-smoke font-mono">{d.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 sm:mt-10 divide-y divide-line border-t border-line max-w-3xl">
        {reviews.slice(0, visible).map((r, i) => (
          <div key={i} className="py-5 sm:py-6 animate-[fadeUp_0.3s_ease-out]">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-medium text-sm">{r.name}</p>
                <p className="text-[11px] text-smoke font-mono uppercase tracking-wide">
                  {r.country} • {r.date}
                </p>
              </div>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} size={12} className={s < r.rating ? "fill-amber-400 text-amber-400" : "text-line"} />
                ))}
              </div>
            </div>
            <p className="mt-3 text-sm text-ash leading-relaxed">{r.comment}</p>
            <button
              type="button"
              onClick={() => setHelpfulClicked((prev) => ({ ...prev, [i]: !prev[i] }))}
              className={`mt-3 inline-flex items-center gap-1.5 text-xs font-mono ${
                helpfulClicked[i] ? "text-ink" : "text-smoke hover:text-ink"
              } transition-colors`}
            >
              <ThumbsUp size={12} className={helpfulClicked[i] ? "fill-current" : ""} />
              Helpful ({r.helpful + (helpfulClicked[i] ? 1 : 0)})
            </button>
          </div>
        ))}
      </div>

      {visible < reviews.length && (
        <button
          type="button"
          onClick={() => setVisible((v) => v + 3)}
          className="mt-4 font-mono text-xs uppercase tracking-widest2 border border-line px-5 py-2.5 hover:border-ash transition-colors"
        >
          Load more reviews
        </button>
      )}

      <style jsx>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}