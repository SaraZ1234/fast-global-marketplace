"use client";

import { AlertTriangle, ArrowRight, Package } from "lucide-react";
import {
  ORDER_STATUS_STYLES,
  PRODUCT_STATUS_STYLES,
  type VendorOrder,
  type VendorProduct,
} from "./data";
import { SimpleBarChart, StatusBadge, TabSectionHeading, EmptyState } from "./VendorUI";

interface OverviewTabProps {
  revenueHistory: { label: string; value: number }[];
  recentOrders: any[];
  lowStockProducts: VendorProduct[];
  onViewAllOrders: () => void;
  onViewAllProducts: () => void;
}

export default function OverviewTab({
  revenueHistory,
  recentOrders,
  lowStockProducts,
  onViewAllOrders,
  onViewAllProducts,
}: OverviewTabProps) {
  return (
    <div className="space-y-8 sm:space-y-10 animate-[fadeIn_0.25s_ease-out]">
      {/* Revenue chart */}
      <div className="border border-line bg-paper p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4 mb-6">
          <TabSectionHeading
            title="Revenue, last 6 months"
            description="Gross order value across all your listings."
          />
        </div>
        <SimpleBarChart data={revenueHistory} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8">
        {/* Recent orders */}
        <div className="lg:col-span-3 border border-line bg-paper p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4 mb-5">
            <h2 className="font-display font-bold text-lg tracking-tightest text-ink">
              Recent Orders
            </h2>
            <button
              type="button"
              onClick={onViewAllOrders}
              className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest2 text-ink hover:text-ash transition-colors shrink-0"
            >
              View all <ArrowRight size={12} />
            </button>
          </div>

          {recentOrders.length === 0 ? (
            <EmptyState
              icon={Package}
              title="No orders yet"
              description="Incoming orders will appear here as buyers purchase your products."
            />
          ) : (
            <div className="divide-y divide-line">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="py-3.5 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{order.items?.map((item: any) => item.product.name).join(", ")}</p>
                    <p className="mt-0.5 text-xs text-smoke font-mono">
                      {order.id} · {order.user?.fullName}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className="text-sm font-medium text-ink">
                      ${order.total.toLocaleString()}
                    </span>
                    <StatusBadge status={order.status} styles={ORDER_STATUS_STYLES} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Low stock alerts */}
        <div className="lg:col-span-2 border border-line bg-paper p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4 mb-5">
            <h2 className="font-display font-bold text-lg tracking-tightest text-ink">
              Stock Alerts
            </h2>
            <button
              type="button"
              onClick={onViewAllProducts}
              className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest2 text-ink hover:text-ash transition-colors shrink-0"
            >
              Manage <ArrowRight size={12} />
            </button>
          </div>

          {lowStockProducts.length === 0 ? (
            <EmptyState
              icon={Package}
              title="Stock levels are healthy"
              description="You'll be notified here when a product runs low."
            />
          ) : (
            <div className="space-y-3">
              {lowStockProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 border border-line p-3"
                >
                  <span className="w-8 h-8 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                    <AlertTriangle size={14} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink truncate">{product.name}</p>
                    <p className="text-xs text-smoke font-mono">{product.sku}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-ink">{product.stock}</p>
                    <StatusBadge status={product.status} styles={PRODUCT_STATUS_STYLES} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}