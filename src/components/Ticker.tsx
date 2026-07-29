import { tickerStats } from "@/lib/data";

export default function Ticker() {
  const loop = [...tickerStats, ...tickerStats];
  return (
    <div className="border-y border-line bg-bone overflow-hidden">
      <div className="ticker-track py-4">
        {loop.map((s, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-8 whitespace-nowrap border-r border-line"
          >
            <span className="font-mono text-sm font-medium text-ink">{s.value}</span>
            <span className="font-mono text-[11px] tracking-widest2 text-smoke uppercase">
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
