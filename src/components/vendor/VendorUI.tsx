"use client";

import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
/* ---------------------------------- Stat card ---------------------------------- */

interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: { value: string; positive: boolean };
  accent?: "default" | "warning" | "danger";
  delay?: number;
}

const ACCENT_STYLES: Record<NonNullable<StatCardProps["accent"]>, string> = {
  default: "bg-bone text-ink",
  warning: "bg-amber-50 text-amber-700",
  danger: "bg-rose-50 text-rose-700",
};

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  accent = "default",
  delay = 0,
}: StatCardProps) {
  return (
    <div
      className="border border-line bg-paper p-5 hover:border-ash transition-colors animate-[fadeUp_0.35s_ease-out_backwards]"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="font-mono text-[11px] uppercase tracking-widest2 text-smoke leading-snug">
          {label}
        </p>
        <span
          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${ACCENT_STYLES[accent]}`}
        >
          <Icon size={15} />
        </span>
      </div>
      <p className="mt-4 font-display font-bold text-2xl sm:text-3xl tracking-tightest text-ink">
        {value}
      </p>
      {trend && (
        <p
          className={`mt-1.5 text-xs font-medium ${
            trend.positive ? "text-emerald-600" : "text-rose-600"
          }`}
        >
          {trend.positive ? "▲" : "▼"} {trend.value}
        </p>
      )}
    </div>
  );
}

/* --------------------------------- Status badge --------------------------------- */

export function StatusBadge({
  status,
  styles,
}: {
  status: string;
  styles: Record<string, string>;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap ${
        styles[status] ?? "text-ash bg-bone"
      }`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
      {status}
    </span>
  );
}

/* --------------------------------- Bar chart --------------------------------- */

export function SimpleBarChart({
  data,
}: {
  data: { label: string; value: number }[];
}) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setAnimated(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="flex items-end gap-3 sm:gap-5 h-48 sm:h-56 px-1">
      {data.map((d) => (
        <div
          key={d.label}
          className="flex-1 flex flex-col items-center justify-end h-full group"
        >
          <p className="mb-2 text-[11px] font-mono text-ash opacity-0 group-hover:opacity-100 transition-opacity">
            ${d.value.toLocaleString()}
          </p>
          <div className="w-full bg-bone relative overflow-hidden h-full">
            <div
              className="absolute bottom-0 left-0 w-full bg-ink transition-all duration-700 ease-out group-hover:bg-ash"
              style={{ height: animated ? `${(d.value / max) * 100}%` : "0%" }}
            />
          </div>
          <p className="mt-2 text-[11px] font-mono uppercase tracking-widest2 text-smoke">
            {d.label}
          </p>
        </div>
      ))}
    </div>
  );
}

/* --------------------------------- Empty state --------------------------------- */

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 sm:py-20 border border-dashed border-line animate-[fadeIn_0.3s_ease-out]">
      <div className="w-14 h-14 rounded-full bg-bone flex items-center justify-center mb-4">
        <Icon size={22} className="text-smoke" />
      </div>
      <p className="font-display font-semibold text-lg tracking-tight text-ink">{title}</p>
      <p className="mt-1.5 text-sm text-ash max-w-xs leading-relaxed">{description}</p>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="mt-5 text-xs font-mono uppercase tracking-widest2 text-ink underline underline-offset-4 hover:text-ash transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

/* ------------------------------- Section heading ------------------------------- */

export function TabSectionHeading({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-5 sm:mb-6">
      <h2 className="font-display font-bold text-lg sm:text-xl tracking-tightest text-ink">
        {title}
      </h2>
      {description && (
        <p className="mt-1 text-sm text-ash leading-relaxed max-w-2xl">{description}</p>
      )}
    </div>
  );
}