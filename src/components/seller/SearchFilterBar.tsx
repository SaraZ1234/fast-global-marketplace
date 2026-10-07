"use client";

import { Search, X } from "lucide-react";
import { ProductStatus } from "@/lib/sellerTypes";

interface SearchFilterBarProps {
  query: string;
  onQueryChange: (value: string) => void;
  statusFilter: ProductStatus | "all";
  onStatusFilterChange: (value: ProductStatus | "all") => void;
}

const STATUS_TABS: { value: ProductStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "Pending", label: "Pending" },
  { value: "Approved", label: "Approved" },
  { value: "Rejected", label: "Rejected" },
];

export default function SearchFilterBar({
  query,
  onQueryChange,
  statusFilter,
  onStatusFilterChange,
}: SearchFilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 border border-line p-3 bg-paper">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-ash pointer-events-none" size={16} />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search your products..."
          className="w-full pl-9 pr-8 py-2 bg-bone border border-line text-sm focus:outline-none focus:border-ink transition-colors"
        />
        {query && (
          <button
            onClick={() => onQueryChange("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ash hover:text-ink transition-colors"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>
      <div className="flex border border-line bg-bone p-0.5 shrink-0">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onStatusFilterChange(tab.value)}
            className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-colors ${
              statusFilter === tab.value ? "bg-paper text-ink border border-line" : "text-ash hover:text-ink"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
