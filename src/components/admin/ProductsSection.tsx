"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import { CheckCircle2, XCircle, Package, AlertCircle, Loader2, Search, X } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { EmptyState, TabSectionHeading } from "@/components/vendor/VendorUI";

type Marketplace = "International" | "Pakistan" | "Gulf" | "Chinese" | "Unknown";
type ProductStatus = "pending" | "approved" | "rejected";

export interface AdminProduct {
  id: string;
  name: string;
  vendor: string;
  marketplace: Marketplace;
  /** null = backend did not return a recognisable status (treated as pending). */
  status: ProductStatus | null;
  category: string;
  price: number;
  submittedAt: string;
}

type ActionState = { id: string; type: "approve" | "reject" } | null;
type MarketplaceFilter = "all" | Exclude<Marketplace, "Unknown">;
type StatusFilter = "all" | ProductStatus;

const MARKETPLACE_OPTIONS: { value: MarketplaceFilter; label: string }[] = [
  { value: "all", label: "All Marketplaces" },
  { value: "International", label: "International" },
  { value: "Pakistan", label: "Pakistan" },
  { value: "Gulf", label: "Gulf" },
  { value: "Chinese", label: "Chinese" },
];

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

/** Maps backend values (INTERNATIONAL, PAKISTAN, GULF, CHINESE, ...) to readable labels. */
function normalizeMarketplace(raw: unknown): Marketplace {
  const value = typeof raw === "object" && raw !== null ? (raw as any).name ?? (raw as any).code : raw;
  if (typeof value !== "string") return "Unknown";
  const key = value.toUpperCase().replace(/[^A-Z]/g, "");
  if (key.startsWith("INTERNATIONAL") || key === "GLOBAL") return "International";
  if (key.startsWith("PAKISTAN") || key === "PK") return "Pakistan";
  if (key.startsWith("GULF") || key === "GCC") return "Gulf";
  if (key.startsWith("CHINESE") || key === "CHINA" || key === "CN") return "Chinese";
  return "Unknown";
}

function normalizeStatus(raw: unknown): ProductStatus | null {
  if (typeof raw !== "string") return null;
  const key = raw.toUpperCase().replace(/[^A-Z]/g, "");
  if (key.startsWith("PENDING")) return "pending";
  if (key === "APPROVED" || key === "ACTIVE" || key === "PUBLISHED") return "approved";
  if (key === "REJECTED") return "rejected";
  return null;
}

const STATUS_STYLES: Record<ProductStatus, string> = {
  pending: "text-amber-700 border-amber-300 bg-amber-50",
  approved: "text-emerald-700 border-emerald-300 bg-emerald-50",
  rejected: "text-rose-600 border-rose-300 bg-rose-50",
};

const MARKETPLACE_DOT: Record<Marketplace, string> = {
  International: "bg-sky-500",
  Pakistan: "bg-emerald-500",
  Gulf: "bg-amber-500",
  Chinese: "bg-rose-500",
  Unknown: "bg-smoke",
};

function MarketplaceBadge({ value }: { value: Marketplace }) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap border border-line bg-paper px-2 py-0.5 font-mono text-[11px] uppercase tracking-widest2 text-ash">
      <span className={`h-1.5 w-1.5 rounded-full ${MARKETPLACE_DOT[value]}`} aria-hidden="true" />
      {value}
    </span>
  );
}

function StatusBadge({ status }: { status: ProductStatus }) {
  return (
    <span
      className={`inline-block whitespace-nowrap border px-2.5 py-1 font-mono text-[11px] uppercase tracking-widest2 ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}

function FilterPills<T extends string>({
  options,
  value,
  onChange,
  label,
  counts,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
  counts?: Record<string, number>;
}) {
  return (
    <div>
      <p className="mb-1.5 font-mono text-[10px] uppercase tracking-widest2 text-smoke">{label}</p>
      <div
        role="group"
        aria-label={label}
        className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {options.map((o) => {
          const active = value === o.value;
          const count = counts?.[o.value];
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => onChange(o.value)}
              aria-pressed={active}
              className={`shrink-0 inline-flex items-center gap-1.5 whitespace-nowrap border px-3 py-1.5 text-xs font-medium transition-all duration-200 active:scale-[0.97] focus:outline-none focus-visible:ring-1 focus-visible:ring-ash ${
                active
                  ? "bg-ink text-paper border-ink"
                  : "border-line bg-paper text-ash hover:border-ash hover:text-ink hover:bg-bone"
              }`}
            >
              {o.label}
              {count !== undefined && (
                <span
                  className={`font-mono text-[10px] tabular-nums ${active ? "opacity-70" : "text-smoke"}`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function RejectBox({
  reason,
  onReasonChange,
  onCancel,
  onConfirm,
  disabled,
}: {
  reason: string;
  onReasonChange: (v: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
  disabled: boolean;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center animate-[fadeIn_0.2s_ease-out]">
      <input
        type="text"
        autoFocus
        value={reason}
        onChange={(e) => onReasonChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") onCancel();
          if (e.key === "Enter" && !disabled) onConfirm();
        }}
        placeholder="Reason for rejection (optional)..."
        className="min-w-0 flex-1 w-full border border-line bg-paper px-3 py-2 text-sm text-ink placeholder:text-smoke focus:outline-none focus:border-ash transition-colors"
      />
      <div className="flex shrink-0 justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-2 text-sm text-ash hover:text-ink transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={disabled}
          className="inline-flex items-center gap-1.5 bg-rose-600 text-white px-4 py-2 text-sm font-medium hover:bg-rose-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Confirm Reject
        </button>
      </div>
    </div>
  );
}

/**
 * Centralised admin product view (all four marketplaces).
 *   GET   /admin/products
 *   PATCH /admin/product/:id/approve
 *   PATCH /admin/product/:id/reject   (body: { reason? })
 *
 * Marketplace / status are read defensively from the response (see
 * normalizeMarketplace / normalizeStatus). Filtering and search are all
 * client-side on the loaded list.
 */
interface ProductsSectionProps {
  onCountChange?: (count: number) => void;
}

export default function ProductsSection({ onCountChange }: ProductsSectionProps) {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionState, setActionState] = useState<ActionState>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const [marketplaceFilter, setMarketplaceFilter] = useState<MarketplaceFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("pending");
  const [query, setQuery] = useState("");

  // Status filtering only makes sense if the backend actually returns a status.
  const hasStatus = useMemo(() => products.some((p) => p.status !== null), [products]);
  const isPending = (p: AdminProduct) => p.status === null || p.status === "pending";

  useEffect(() => {
    onCountChange?.(products.filter(isPending).length);
  }, [products, onCountChange]);

  useEffect(() => {
    let cancelled = false;

    async function fetchProducts() {
      try {
        const response = await apiRequest("/admin/products");
        if (cancelled) return;

        const formatted: AdminProduct[] = (response ?? []).map((p: any) => ({
          id: String(p.id),
          name: p.name ?? "Untitled product",
          vendor: p.vendor?.companyName ?? "Unknown vendor",
          marketplace: normalizeMarketplace(
            p.marketplace ?? p.marketplaceType ?? p.vendor?.marketplace
          ),
          status: normalizeStatus(p.status ?? p.approvalStatus),
          category: p.category?.name ?? "Uncategorized",
          price: Number(p.price) || 0,
          submittedAt: p.createdAt ?? p.submittedAt ?? new Date().toISOString(),
        }));

        setProducts(formatted);
      } catch (error) {
        if (cancelled) return;
        console.error("Failed to load products:", error);
        setLoadError("Couldn't load products. Please try refreshing.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchProducts();
    return () => {
      cancelled = true;
    };
  }, []);

  const visibleProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (marketplaceFilter !== "all" && p.marketplace !== marketplaceFilter) return false;
      if (hasStatus && statusFilter !== "all") {
        const effective: ProductStatus = p.status ?? "pending";
        if (effective !== statusFilter) return false;
      }
      if (q && !p.name.toLowerCase().includes(q) && !p.vendor.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  }, [products, marketplaceFilter, statusFilter, query, hasStatus]);

  // Display-only counts shown on the filter pills.
  const marketplaceCounts = useMemo(() => {
    const counts: Record<string, number> = { all: products.length };
    for (const p of products) counts[p.marketplace] = (counts[p.marketplace] ?? 0) + 1;
    return counts;
  }, [products]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: products.length, pending: 0, approved: 0, rejected: 0 };
    for (const p of products) counts[p.status ?? "pending"] += 1;
    return counts;
  }, [products]);

  const pendingCount = products.filter(isPending).length;
  const filtersActive =
    marketplaceFilter !== "all" || query.trim() !== "" || (hasStatus && statusFilter !== "pending");

  /** Approve/reject: update status if the list carries statuses, otherwise remove (pending-only list). */
  function applyResult(id: string, status: ProductStatus) {
    setProducts((prev) =>
      hasStatus
        ? prev.map((p) => (p.id === id ? { ...p, status } : p))
        : prev.filter((p) => p.id !== id)
    );
  }

  async function handleApprove(id: string) {
    setActionError(null);
    setActionState({ id, type: "approve" });
    try {
      await apiRequest(`/admin/product/${id}/approve`, { method: "PATCH" });
      applyResult(id, "approved");
    } catch (error) {
      console.error("Approve failed:", error);
      setActionError("Couldn't approve this product. Please try again.");
    } finally {
      setActionState(null);
    }
  }

  async function handleReject(id: string) {
    setActionError(null);
    setActionState({ id, type: "reject" });
    try {
      await apiRequest(`/admin/product/${id}/reject`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: rejectReason.trim() || undefined }),
      });
      applyResult(id, "rejected");
      setRejectingId(null);
      setRejectReason("");
    } catch (error) {
      console.error("Reject failed:", error);
      setActionError("Couldn't reject this product. Please try again.");
    } finally {
      setActionState(null);
    }
  }

  function cancelReject() {
    setRejectingId(null);
    setRejectReason("");
  }

  function clearFilters() {
    setMarketplaceFilter("all");
    setStatusFilter("pending");
    setQuery("");
  }

  function renderActions(product: AdminProduct, fullWidth: boolean) {
    // Already-reviewed products show their status instead of action buttons.
    if (!isPending(product) && product.status) {
      return fullWidth ? (
        <div className="flex w-full justify-start">
          <StatusBadge status={product.status} />
        </div>
      ) : (
        <StatusBadge status={product.status} />
      );
    }
    const isApproving = actionState?.id === product.id && actionState.type === "approve";
    const isRejecting = actionState?.id === product.id && actionState.type === "reject";
    const base = fullWidth
      ? "flex-1 inline-flex items-center justify-center gap-1.5 py-2.5"
      : "inline-flex items-center gap-1.5 px-3 py-1.5";

    return (
      <>
        <button
          type="button"
          onClick={() => handleApprove(product.id)}
          disabled={actionState !== null}
          className={`${base} text-xs font-medium border border-line text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed transition-all`}
        >
          {isApproving ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
          Approve
        </button>
        <button
          type="button"
          onClick={() => setRejectingId((prev) => (prev === product.id ? null : product.id))}
          disabled={actionState !== null}
          className={`${base} text-xs font-medium border border-line text-rose-600 hover:border-rose-300 hover:bg-rose-50 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed transition-all`}
        >
          {isRejecting ? <Loader2 size={13} className="animate-spin" /> : <XCircle size={13} />}
          Reject
        </button>
      </>
    );
  }

  const th =
    "px-4 py-3 text-left font-mono text-[11px] uppercase tracking-widest2 text-smoke whitespace-nowrap";

  return (
    <div className="animate-[fadeIn_0.25s_ease-out]">
      <TabSectionHeading
        title="Products"
        description={
          hasStatus
            ? `${pendingCount} pending review · ${products.length} total`
            : `${products.length} submission${products.length === 1 ? "" : "s"} awaiting review`
        }
      />

      {actionError && (
        <div
          role="alert"
          className="mb-5 flex items-start gap-3 border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 animate-[fadeIn_0.2s_ease-out]"
        >
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Filters + search */}
      {!loading && !loadError && products.length > 0 && (
        <div className="mb-5 border border-line bg-paper p-3 sm:p-4 space-y-4 animate-[fadeUp_0.3s_ease-out_backwards]">
          <div className="relative">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-smoke"
              aria-hidden="true"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by product or vendor..."
              aria-label="Search products"
              className="w-full border border-line bg-paper py-2.5 pl-9 pr-9 text-sm text-ink placeholder:text-smoke focus:outline-none focus:border-ash transition-colors"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-smoke hover:text-ink transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
            <FilterPills
              label="Marketplace"
              options={MARKETPLACE_OPTIONS}
              value={marketplaceFilter}
              onChange={setMarketplaceFilter}
              counts={marketplaceCounts}
            />
            {hasStatus && (
              <FilterPills
                label="Status"
                options={STATUS_OPTIONS}
                value={statusFilter}
                onChange={setStatusFilter}
                counts={statusCounts}
              />
            )}
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-line pt-3">
            <p className="font-mono text-[11px] text-smoke" aria-live="polite">
              Showing {visibleProducts.length} of {products.length} product
              {products.length === 1 ? "" : "s"}
            </p>
            {filtersActive && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs text-ash hover:text-ink underline underline-offset-2 transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <div className="border border-line divide-y divide-line">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-wrap items-center gap-x-6 gap-y-3 px-4 py-4">
              <div className="h-3 w-40 max-w-full bg-bone rounded animate-pulse" />
              <div className="h-3 w-28 bg-bone rounded animate-pulse" />
              <div className="h-3 w-20 bg-bone rounded animate-pulse" />
              <div className="h-3 w-16 bg-bone rounded animate-pulse sm:ml-auto" />
              <div className="h-8 w-40 max-w-full bg-bone rounded animate-pulse" />
            </div>
          ))}
        </div>
      ) : loadError ? (
        <EmptyState icon={AlertCircle} title="Something went wrong" description={loadError} />
      ) : products.length === 0 ? (
        <EmptyState
          icon={Package}
          title="Nothing to review"
          description="New vendor product submissions will appear here for approval."
        />
      ) : visibleProducts.length === 0 ? (
        <div className="animate-[fadeIn_0.25s_ease-out]">
          <EmptyState
            icon={Search}
            title="No matching products"
            description="Try a different marketplace, status, or search term."
          />
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden lg:block border border-line overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm border-collapse">
              <thead>
                <tr className="bg-bone border-b border-line">
                  <th className={th}>Product</th>
                  <th className={th}>Vendor</th>
                  <th className={th}>Marketplace</th>
                  <th className={th}>Category</th>
                  <th className={th}>Price</th>
                  <th className={th}>Submitted</th>
                  <th className={`${th} text-right`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visibleProducts.map((product, i) => (
                  <Fragment key={product.id}>
                    <tr
                      className="border-b border-line last:border-0 hover:bg-bone transition-colors animate-[fadeUp_0.3s_ease-out_backwards]"
                      style={{ animationDelay: `${Math.min(i, 12) * 30}ms` }}
                    >
                      <td
                        className="px-4 py-3.5 font-medium text-ink max-w-[240px] truncate"
                        title={product.name}
                      >
                        {product.name}
                      </td>
                      <td className="px-4 py-3.5 text-ash whitespace-nowrap max-w-[180px] truncate" title={product.vendor}>
                        {product.vendor}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <MarketplaceBadge value={product.marketplace} />
                      </td>
                      <td className="px-4 py-3.5 text-ash whitespace-nowrap">{product.category}</td>
                      <td className="px-4 py-3.5 font-medium text-ink whitespace-nowrap">
                        ${product.price.toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5 text-ash font-mono text-xs whitespace-nowrap">
                        {new Date(product.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-end gap-1.5">
                          {renderActions(product, false)}
                        </div>
                      </td>
                    </tr>
                    {rejectingId === product.id && (
                      <tr className="border-b border-line last:border-0 bg-bone/60">
                        <td colSpan={7} className="px-4 py-4">
                          <RejectBox
                            reason={rejectReason}
                            onReasonChange={setRejectReason}
                            onCancel={cancelReject}
                            onConfirm={() => handleReject(product.id)}
                            disabled={actionState !== null}
                          />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile / tablet cards */}
          <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 items-start gap-3">
            {visibleProducts.map((product, i) => (
              <div
                key={product.id}
                className="min-w-0 border border-line p-4 bg-paper hover:border-ash transition-colors animate-[fadeUp_0.3s_ease-out_backwards]"
                style={{ animationDelay: `${Math.min(i, 12) * 30}ms` }}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <p className="min-w-0 truncate font-mono text-xs text-smoke">{product.vendor}</p>
                  <MarketplaceBadge value={product.marketplace} />
                </div>
                <p className="font-display font-semibold text-sm tracking-tight text-ink mb-1 break-words">
                  {product.name}
                </p>
                <p className="text-xs text-ash mb-3">{product.category}</p>
                <div className="flex items-center justify-between text-sm mb-3 pt-3 border-t border-line">
                  <span className="font-medium text-ink">${product.price.toLocaleString()}</span>
                  <span className="text-[11px] text-smoke font-mono">
                    {new Date(product.submittedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">{renderActions(product, true)}</div>
                {rejectingId === product.id && (
                  <div className="mt-3 pt-3 border-t border-line">
                    <RejectBox
                      reason={rejectReason}
                      onReasonChange={setRejectReason}
                      onCancel={cancelReject}
                      onConfirm={() => handleReject(product.id)}
                      disabled={actionState !== null}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}