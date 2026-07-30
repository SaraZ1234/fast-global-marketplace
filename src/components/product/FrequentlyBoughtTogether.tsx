"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";

type Item = { slug: string; name: string; image: string; price: string };

function parsePrice(price: string): number {
  const match = price.replace(/,/g, "").match(/(\d+(\.\d+)?)/);
  return match ? parseFloat(match[1]) : 0;
}

export default function FrequentlyBoughtTogether({ main, extras }: { main: Item; extras: Item[] }) {
  const items = [main, ...extras];
  const [checked, setChecked] = useState<Record<string, boolean>>(
    Object.fromEntries(items.map((i) => [i.slug, true]))
  );

  const total = items.reduce((sum, i) => (checked[i.slug] ? sum + parsePrice(i.price) : sum), 0);

  return (
    <div className="max-w-4xl">
      <div className="flex flex-wrap items-center gap-2 sm:gap-4">
        {items.map((item, i) => (
          <div key={item.slug} className="flex items-center gap-2 sm:gap-4">
            <div className="flex flex-col items-center gap-2 w-20 sm:w-28">
              <div className="relative w-16 h-16 sm:w-24 sm:h-24 border border-line bg-bone overflow-hidden">
                <Image src={item.image} alt={item.name} fill unoptimized className="object-cover" sizes="100px" />
              </div>
              <label className="flex items-center gap-1.5 text-[10px] sm:text-xs">
                <input
                  type="checkbox"
                  checked={!!checked[item.slug]}
                  onChange={() => setChecked((c) => ({ ...c, [item.slug]: !c[item.slug] }))}
                  className="accent-ink"
                />
                <span className="truncate max-w-[70px] sm:max-w-[100px]">{i === 0 ? "This item" : item.name}</span>
              </label>
            </div>
            {i < items.length - 1 && <Plus size={16} className="text-smoke shrink-0" />}
          </div>
        ))}
      </div>

      <div className="mt-5 sm:mt-6 flex flex-wrap items-center gap-4 sm:gap-6 border-t border-line pt-4 sm:pt-5">
        <p className="text-sm">
          Total for {Object.values(checked).filter(Boolean).length} items:{" "}
          <span className="font-display font-semibold text-base sm:text-lg">${total.toFixed(2)}</span>
        </p>
        <button
          type="button"
          className="bg-ink text-paper font-mono text-xs uppercase tracking-widest2 px-5 py-2.5 hover:bg-ash transition-colors"
        >
          Add Selected to Inquiry
        </button>
      </div>
    </div>
  );
}