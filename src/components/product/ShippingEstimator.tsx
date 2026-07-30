"use client";

import { useState } from "react";
import { Truck, Loader2 } from "lucide-react";

const DESTINATIONS = ["North America", "Europe", "Middle East", "Asia Pacific", "Africa"];

export default function ShippingEstimator({ seedHash, originPort }: { seedHash: number; originPort: string }) {
  const [destination, setDestination] = useState(DESTINATIONS[0]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ days: string; cost: string } | null>(null);

  const estimate = () => {
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      const idx = DESTINATIONS.indexOf(destination);
      const baseDays = 12 + idx * 5 + (seedHash % 6);
      const baseCost = 350 + idx * 180 + (seedHash % 220);
      setResult({
        days: `${baseDays}-${baseDays + 6} days`,
        cost: `$${baseCost} - $${baseCost + 140}`,
      });
      setLoading(false);
    }, 600);
  };

  return (
    <div className="max-w-md border border-line p-4 sm:p-5">
      <p className="text-[10px] sm:text-xs font-mono uppercase tracking-widest2 text-smoke mb-3 flex items-center gap-1.5">
        <Truck size={13} /> Shipping Estimate from {originPort}
      </p>
      <div className="flex flex-col xs:flex-row gap-2 sm:gap-3">
        <select
          value={destination}
          onChange={(e) => {
            setDestination(e.target.value);
            setResult(null);
          }}
          className="flex-1 bg-bone border border-line px-3 py-2 text-sm focus:outline-none focus:border-ash"
        >
          {DESTINATIONS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={estimate}
          disabled={loading}
          className="bg-ink text-paper font-mono text-xs uppercase tracking-widest2 px-4 py-2 hover:bg-ash transition-colors disabled:opacity-60 whitespace-nowrap"
        >
          {loading ? <Loader2 size={14} className="animate-spin mx-auto" /> : "Estimate"}
        </button>
      </div>

      {result && (
        <div className="mt-4 grid grid-cols-2 gap-3 animate-[fadeUp_0.3s_ease-out]">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wide text-smoke">Est. Transit</p>
            <p className="text-sm font-medium mt-0.5">{result.days}</p>
          </div>
          <div>
            <p className="text-[10px] font-mono uppercase tracking-wide text-smoke">Est. Freight Cost</p>
            <p className="text-sm font-medium mt-0.5">{result.cost}</p>
          </div>
        </div>
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