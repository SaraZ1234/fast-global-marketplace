"use client";

import { useMemo, useState } from "react";
import { Search, Store, ShieldOff, ShieldCheck, BadgeCheck } from "lucide-react";
import { StatusBadge, EmptyState, TabSectionHeading } from "@/components/vendor/VendorUI";
import { VENDOR_STATUS_STYLES, type PlatformVendor, type VendorStatus } from "./data";

interface VendorsSectionProps {
  vendors: PlatformVendor[];
  onSetStatus: (id: string, status: VendorStatus) => void;
}

const STATUS_FILTERS: (VendorStatus | "All")[] = [
  "All",
  "Approved",
  "Pending",
  "Rejected",
];

export default function VendorsSection({ vendors, onSetStatus }: VendorsSectionProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<VendorStatus | "All">("All");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return vendors.filter((v) => {
      const matchesSearch =
        !q ||
        v.companyName.toLowerCase().includes(q) ||
        v.companyEmail.toLowerCase().includes(q)
      const matchesStatus = statusFilter === "All" || v.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [vendors, search, statusFilter]);

  return (
    <div className="animate-[fadeIn_0.25s_ease-out]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <TabSectionHeading title="Vendors" description={`${vendors.length} seller accounts`} />
        <div className="flex flex-col xs:flex-row sm:flex-row gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 border border-line px-3 py-2 bg-paper w-full xs:flex-1 sm:flex-none sm:w-56 focus-within:border-ash transition-colors">
            <Search size={15} className="text-smoke shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search business or email..."
              className="w-full bg-transparent text-sm placeholder:text-smoke focus:outline-none min-w-0"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as VendorStatus | "All")}
            className="border border-line bg-paper px-3 py-2 text-sm text-ink focus:outline-none focus:border-ash transition-colors w-full xs:w-auto sm:w-auto shrink-0"
          >
            {STATUS_FILTERS.map((s) => (
              <option key={s} value={s}>
                {s === "All" ? "All statuses" : s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Store}
          title="No vendors found"
          description="Try a different search term or status filter."
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block border border-line overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm border-collapse">
              <thead>
                <tr className="bg-bone border-b border-line">
                  <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-widest2 text-smoke">Business</th>
                  <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-widest2 text-smoke">Email</th>
                  <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-widest2 text-smoke">Products</th>
                  <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-widest2 text-smoke">Joined</th>
                  <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-widest2 text-smoke">Status</th>
                  <th className="px-4 py-3 text-right font-mono text-[11px] uppercase tracking-widest2 text-smoke">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((vendor, i) => (
                  <tr
                    key={vendor.id}
                    className="border-b border-line last:border-0 hover:bg-bone transition-colors animate-[fadeUp_0.3s_ease-out_backwards]"
                    style={{ animationDelay: `${i * 30}ms` }}
                  >
                    <td className="px-4 py-3.5 font-medium text-ink max-w-[220px] truncate">
                      {vendor.companyName}
                    </td>
                    <td className="px-4 py-3.5 text-ash whitespace-nowrap">{vendor.companyEmail}</td>
                    <td className="px-4 py-3.5 text-ash whitespace-nowrap">{vendor.products?.length ?? 0}</td>
                    <td className="px-4 py-3.5 text-ash font-mono text-xs whitespace-nowrap">
                      {new Date(vendor.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={vendor.status} styles={VENDOR_STATUS_STYLES} />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-end gap-1.5">
                        {vendor.status === "Pending" && (
                          <button
                            type="button"
                            onClick={() => onSetStatus(vendor.id, "Approved")}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-line text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
                          >
                            <BadgeCheck size={13} /> Verify
                          </button>
                        )}
                        {vendor.status !== "Rejected" ? (
                          <button
                            type="button"
                            onClick={() => onSetStatus(vendor.id, "Rejected")}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-line text-rose-600 hover:border-rose-300 hover:bg-rose-50 transition-colors"
                          >
                            <ShieldOff size={13} /> Suspend
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onSetStatus(vendor.id, "Approved")}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-line text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
                          >
                            <ShieldCheck size={13} /> Reactivate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {filtered.map((vendor, i) => (
              <div
                key={vendor.id}
                className="border border-line p-4 bg-paper animate-[fadeUp_0.3s_ease-out_backwards]"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <p className="font-mono text-xs text-smoke">{vendor.id}</p>
                  <StatusBadge status={vendor.status} styles={VENDOR_STATUS_STYLES} />
                </div>
                <p className="font-display font-semibold text-sm tracking-tight text-ink mb-1 break-words">
                  {vendor.companyName}
                </p>
                <p className="text-xs text-ash mb-3 break-words">{vendor.companyEmail}</p>
                <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-sm pt-3 border-t border-line mb-3">
                  <span className="text-ash">{vendor.products?.length ?? 0} products</span>
                  <span className="text-[11px] text-smoke font-mono">
                    Joined {new Date(vendor.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {vendor.status === "Pending" && (
                    <button
                      type="button"
                      onClick={() => onSetStatus(vendor.id, "Approved")}
                      className="flex-1 min-w-[100px] inline-flex items-center justify-center gap-1.5 py-2 text-xs font-medium border border-line text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
                    >
                      <BadgeCheck size={13} /> Verify
                    </button>
                  )}
                  {vendor.status !== "Rejected" ? (
                    <button
                      type="button"
                      onClick={() => onSetStatus(vendor.id, "Rejected")}
                      className="flex-1 min-w-[100px] inline-flex items-center justify-center gap-1.5 py-2 text-xs font-medium border border-line text-rose-600 hover:border-rose-300 hover:bg-rose-50 transition-colors"
                    >
                      <ShieldOff size={13} /> Suspend
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onSetStatus(vendor.id, "Approved")}
                      className="flex-1 min-w-[100px] inline-flex items-center justify-center gap-1.5 py-2 text-xs font-medium border border-line text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
                    >
                      <ShieldCheck size={13} /> Reactivate
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}