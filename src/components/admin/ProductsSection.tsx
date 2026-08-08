"use client";

import { Fragment, useEffect, useState } from "react";
import { CheckCircle2, XCircle, Package, AlertCircle, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { EmptyState, TabSectionHeading } from "@/components/vendor/VendorUI";

export interface AdminProduct {
  id: string;
  name: string;
  vendor: string;
  category: string;
  price: number;
  submittedAt: string;
}

type ActionState = { id: string; type: "approve" | "reject" } | null;

/**
 * Pending-product approvals — wired to live endpoints:
 *   GET   /admin/products/pending
 *   PATCH /admin/products/:id/approve
 *   PATCH /admin/products/:id/reject   (body: { reason })
 *
 * Adjust the paths/methods/payload shape below to match your actual API if
 * they differ — the rest of the component (loading states, optimistic
 * removal, error handling) will keep working unchanged.
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

  useEffect(() => {
    onCountChange?.(products.length);
  }, [products, onCountChange]);

  useEffect(() => {
    let cancelled = false;

    async function fetchPending() {
      try {
        const response = await apiRequest("/admin/products");
        if (cancelled) return;

        const formatted: AdminProduct[] = (response ?? []).map((p: any) => ({
          id: String(p.id),
          name: p.name ?? "Untitled product",
          vendor: p.vendor?.companyName ?? "Unknown vendor",
          category: p.category?.name ?? "Uncategorized",
          price: p.price ?? 0,
          submittedAt: p.createdAt ?? p.submittedAt ?? new Date().toISOString(),
        }));

        setProducts(formatted);
      } catch (error) {
        if (cancelled) return;
        console.error("Failed to load pending products:", error);
        setLoadError("Couldn't load pending products. Please try refreshing.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchPending();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleApprove(id: string) {
    setActionError(null);
    setActionState({ id, type: "approve" });
    try {
      await apiRequest(`/admin/product/${id}/approve`, { method: "PATCH" });
      setProducts((prev) => prev.filter((p) => p.id !== id));
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
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setRejectingId(null);
      setRejectReason("");
    } catch (error) {
      console.error("Reject failed:", error);
      setActionError("Couldn't reject this product. Please try again.");
    } finally {
      setActionState(null);
    }
  }

  return (
    <div className="animate-[fadeIn_0.25s_ease-out]">
      <TabSectionHeading
        title="Pending Products"
        description={`${products.length} submission${products.length === 1 ? "" : "s"} awaiting review`}
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

      {loading ? (
        <div className="border border-line divide-y divide-line">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-6 px-4 py-4">
              <div className="h-3 w-40 bg-bone rounded animate-pulse" />
              <div className="h-3 w-28 bg-bone rounded animate-pulse" />
              <div className="h-3 w-20 bg-bone rounded animate-pulse" />
              <div className="h-3 w-16 bg-bone rounded animate-pulse ml-auto" />
              <div className="h-8 w-40 bg-bone rounded animate-pulse" />
            </div>
          ))}
        </div>
      ) : loadError ? (
        <EmptyState
          icon={AlertCircle}
          title="Something went wrong"
          description={loadError}
        />
      ) : products.length === 0 ? (
        <EmptyState
          icon={Package}
          title="Nothing to review"
          description="New vendor product submissions will appear here for approval."
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block border border-line overflow-hidden">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-bone border-b border-line">
                  <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-widest2 text-smoke">Product</th>
                  <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-widest2 text-smoke">Vendor</th>
                  <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-widest2 text-smoke">Category</th>
                  <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-widest2 text-smoke">Price</th>
                  <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-widest2 text-smoke">Submitted</th>
                  <th className="px-4 py-3 text-right font-mono text-[11px] uppercase tracking-widest2 text-smoke">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, i) => {
                  const isApproving =
                    actionState?.id === product.id && actionState.type === "approve";
                  const isRejecting =
                    actionState?.id === product.id && actionState.type === "reject";
                  const showReasonBox = rejectingId === product.id;

                  return (
                    <Fragment key={product.id}>
                      <tr
                        className="border-b border-line last:border-0 hover:bg-bone transition-colors animate-[fadeUp_0.3s_ease-out_backwards]"
                        style={{ animationDelay: `${i * 30}ms` }}
                      >
                        <td className="px-4 py-3.5 font-medium text-ink max-w-[260px] truncate">
                          {product.name}
                        </td>
                        <td className="px-4 py-3.5 text-ash whitespace-nowrap">{product.vendor}</td>
                        <td className="px-4 py-3.5 text-ash whitespace-nowrap">{product.category}</td>
                        <td className="px-4 py-3.5 font-medium text-ink whitespace-nowrap">
                          ${product.price.toLocaleString()}
                        </td>
                        <td className="px-4 py-3.5 text-ash font-mono text-xs whitespace-nowrap">
                          {new Date(product.submittedAt).toLocaleDateString()}
                        </td> 
                        <td className="px-4 py-3.5">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleApprove(product.id)}
                              disabled={actionState !== null}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-line text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                              {isApproving ? (
                                <Loader2 size={13} className="animate-spin" />
                              ) : (
                                <CheckCircle2 size={13} />
                              )}
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setRejectingId((prev) => (prev === product.id ? null : product.id))
                              }
                              disabled={actionState !== null}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-line text-rose-600 hover:border-rose-300 hover:bg-rose-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                              {isRejecting ? (
                                <Loader2 size={13} className="animate-spin" />
                              ) : (
                                <XCircle size={13} />
                              )}
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                      {showReasonBox && (
                        <tr className="border-b border-line last:border-0 bg-bone/60">
                          <td colSpan={6} className="px-4 py-4">
                            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                              <input
                                type="text"
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="Reason for rejection (optional)..."
                                className="flex-1 w-full border border-line bg-paper px-3 py-2 text-sm text-ink placeholder:text-smoke focus:outline-none focus:border-ash transition-colors"
                              />
                              <div className="flex gap-2 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setRejectingId(null);
                                    setRejectReason("");
                                  }}
                                  className="px-3 py-2 text-sm text-ash hover:text-ink transition-colors"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleReject(product.id)}
                                  disabled={actionState !== null}
                                  className="inline-flex items-center gap-1.5 bg-rose-600 text-white px-4 py-2 text-sm font-medium hover:bg-rose-700 disabled:opacity-50 transition-colors"
                                >
                                  Confirm Reject
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {products.map((product, i) => {
              const isApproving =
                actionState?.id === product.id && actionState.type === "approve";
              const isRejecting = actionState?.id === product.id && actionState.type === "reject";
              const showReasonBox = rejectingId === product.id;

              return (
                <div
                  key={product.id}
                  className="border border-line p-4 bg-paper animate-[fadeUp_0.3s_ease-out_backwards]"
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  <p className="font-mono text-xs text-smoke mb-1">{product.vendor}</p>
                  <p className="font-display font-semibold text-sm tracking-tight text-ink mb-1">
                    {product.name}
                  </p>
                  <p className="text-xs text-ash mb-3">{product.category}</p>
                  <div className="flex items-center justify-between text-sm mb-3 pt-3 border-t border-line">
                    <span className="font-medium text-ink">${product.price.toLocaleString()}</span>
                    <span className="text-[11px] text-smoke font-mono">
                      {new Date(product.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleApprove(product.id)}
                      disabled={actionState !== null}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 text-xs font-medium border border-line text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50 disabled:opacity-40 transition-colors"
                    >
                      {isApproving ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setRejectingId((prev) => (prev === product.id ? null : product.id))
                      }
                      disabled={actionState !== null}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 text-xs font-medium border border-line text-rose-600 hover:border-rose-300 hover:bg-rose-50 disabled:opacity-40 transition-colors"
                    >
                      {isRejecting ? <Loader2 size={13} className="animate-spin" /> : <XCircle size={13} />}
                      Reject
                    </button>
                  </div>
                  {showReasonBox && (
                    <div className="mt-3 pt-3 border-t border-line space-y-2 animate-[fadeIn_0.2s_ease-out]">
                      <input
                        type="text"
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Reason for rejection (optional)..."
                        className="w-full border border-line bg-paper px-3 py-2 text-sm text-ink placeholder:text-smoke focus:outline-none focus:border-ash transition-colors"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setRejectingId(null);
                            setRejectReason("");
                          }}
                          className="px-3 py-2 text-sm text-ash hover:text-ink transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReject(product.id)}
                          disabled={actionState !== null}
                          className="inline-flex items-center gap-1.5 bg-rose-600 text-white px-4 py-2 text-sm font-medium hover:bg-rose-700 disabled:opacity-50 transition-colors"
                        >
                          Confirm Reject
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}