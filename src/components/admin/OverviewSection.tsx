"use client";

import { ArrowRight, ClipboardList, Package } from "lucide-react";
import { SimpleBarChart, StatusBadge, TabSectionHeading, EmptyState } from "@/components/vendor/VendorUI";
import { ORDER_STATUS_STYLES, type PlatformOrder, type RevenuePoint } from "./data";

interface OverviewSectionProps {
  revenueHistory: RevenuePoint[];
  recentOrders: PlatformOrder[];
  pendingProductsCount: number;
  onViewOrders: () => void;
  onViewProducts: () => void;
}

export default function OverviewSection({
  revenueHistory,
  recentOrders,
  pendingProductsCount,
  onViewOrders,
  onViewProducts,
}: OverviewSectionProps) {
  return (
    <div className="space-y-8 sm:space-y-10 animate-[fadeIn_0.25s_ease-out]">
      <div className="border border-line bg-paper p-5 sm:p-6">
        <TabSectionHeading
          title="Platform revenue, last 6 months"
          description="Gross transaction value across all vendors."
        />
        <SimpleBarChart data={revenueHistory} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8">
        <div className="lg:col-span-3 border border-line bg-paper p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4 mb-5">
            <h2 className="font-display font-bold text-lg tracking-tightest text-ink">
              Recent Orders
            </h2>
            <button
              type="button"
              onClick={onViewOrders}
              className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest2 text-ink hover:text-ash transition-colors shrink-0"
            >
              View all <ArrowRight size={12} />
            </button>
          </div>

          {recentOrders.length === 0 ? (
            <EmptyState
              icon={ClipboardList}
              title="No orders yet"
              description="Orders placed across the marketplace will appear here."
            />
          ) : (
            <div className="divide-y divide-line">
              {recentOrders.map((order) => (
                <div key={order.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink truncate">
                      {order.buyer} → {order.vendor}
                    </p>
                    <p className="mt-0.5 text-xs text-smoke font-mono">{order.id}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className="text-sm font-medium text-ink">
                      ${order.amount.toLocaleString()}
                    </span>
                    <StatusBadge status={order.status} styles={ORDER_STATUS_STYLES} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-2 border border-line bg-paper p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4 mb-5">
            <h2 className="font-display font-bold text-lg tracking-tightest text-ink">
              Approvals Queue
            </h2>
            <button
              type="button"
              onClick={onViewProducts}
              className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest2 text-ink hover:text-ash transition-colors shrink-0"
            >
              Review <ArrowRight size={12} />
            </button>
          </div>

          {pendingProductsCount === 0 ? (
            <EmptyState
              icon={Package}
              title="All caught up"
              description="No product submissions are waiting for review."
            />
          ) : (
            <button
              type="button"
              onClick={onViewProducts}
              className="w-full flex items-center gap-3 border border-amber-200 bg-amber-50 p-4 text-left hover:bg-amber-100/70 transition-colors"
            >
              <span className="w-9 h-9 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Package size={16} />
              </span>
              <div>
                <p className="text-sm font-semibold text-amber-900">
                  {pendingProductsCount} product{pendingProductsCount > 1 ? "s" : ""} awaiting
                  review
                </p>
                <p className="text-xs text-amber-800/80 mt-0.5">
                  New vendor listings need approval before going live.
                </p>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}