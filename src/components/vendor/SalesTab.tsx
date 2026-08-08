"use client";

import { useMemo } from "react";
import { Wallet, Clock3, TrendingUp, Download } from "lucide-react";
import { StatCard, SimpleBarChart, TabSectionHeading } from "./VendorUI";
import type { VendorOrder, RevenuePoint } from "./data";

interface SalesTabProps {
  orders: any[];
  revenueHistory: RevenuePoint[];
  onRequestPayout: () => void;
}

export default function SalesTab({ orders, revenueHistory, onRequestPayout }: SalesTabProps) {
  const { lifetimeEarnings, pendingClearance, availablePayout, byCategory } = useMemo(() => {
    const delivered = orders.filter((o) => o.status === "Delivered");
    const inTransit = orders.filter((o) => o.status === "Shipped" || o.status === "Processing");

    const lifetime = delivered.reduce(
      (sum, o) => sum + o.total,
      0
    );

    const pending = inTransit.reduce(
      (sum, o) => sum + o.total,
      0
    );
    // Simple illustrative split: 80% of delivered revenue is available now,
    // the remainder clears after the buyer confirmation window.
    const available = Math.round(lifetime * 0.8);

    const categoryMap = new Map<string, { units: number; revenue: number }>();
    for (const o of orders) {

      for (const item of o.items) {

        const productName = item.product.name;

        const key =
          productName.split(" ").slice(-1)[0] || "Other";


        const entry =
          categoryMap.get(key) ?? {
            units: 0,
            revenue: 0
          };


        entry.units += item.quantity;

        entry.revenue += item.price * item.quantity;


        categoryMap.set(key, entry);
      }
    }
    const totalRevenue =
      orders.reduce(
        (s, o) => s + o.total,
        0
      ) || 1;
    const breakdown = Array.from(categoryMap.entries())
      .map(([label, v]) => ({
        label,
        units: v.units,
        revenue: v.revenue,
        share: (v.revenue / totalRevenue) * 100,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 6);

    return {
      lifetimeEarnings: lifetime,
      pendingClearance: pending,
      availablePayout: available,
      byCategory: breakdown,
    };
  }, [orders]);

  return (
    <div className="space-y-8 sm:space-y-10 animate-[fadeIn_0.25s_ease-out]">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <TabSectionHeading
            title="Earnings"
            description="Revenue from delivered and in-transit orders."
          />
          <button
            type="button"
            onClick={onRequestPayout}
            className="inline-flex items-center gap-1.5 bg-ink text-paper px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity shrink-0 self-start sm:self-auto"
          >
            <Download size={15} />
            Request Payout
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          <StatCard
            label="Available for Payout"
            value={`$${availablePayout.toLocaleString()}`}
            icon={Wallet}
            delay={0}
          />
          <StatCard
            label="Pending Clearance"
            value={`$${pendingClearance.toLocaleString()}`}
            icon={Clock3}
            accent="warning"
            delay={40}
          />
          <StatCard
            label="Lifetime Earnings"
            value={`$${lifetimeEarnings.toLocaleString()}`}
            icon={TrendingUp}
            delay={80}
          />
        </div>
      </div>

      <div className="border border-line bg-paper p-5 sm:p-6">
        <TabSectionHeading title="Revenue trend" description="Gross order value by month." />
        <SimpleBarChart data={revenueHistory} />
      </div>

      <div>
        <TabSectionHeading
          title="Revenue by product"
          description="Where your sales are concentrated this period."
        />
        <div className="border border-line overflow-hidden">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-bone border-b border-line">
                <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-widest2 text-smoke">
                  Product
                </th>
                <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-widest2 text-smoke">
                  Units Sold
                </th>
                <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-widest2 text-smoke">
                  Revenue
                </th>
                <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-widest2 text-smoke">
                  Share
                </th>
              </tr>
            </thead>
            <tbody>
              {byCategory.map((row, i) => (
                <tr
                  key={row.label}
                  className="border-b border-line last:border-0 animate-[fadeUp_0.3s_ease-out_backwards]"
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  <td className="px-4 py-3.5 font-medium text-ink truncate max-w-[220px]">
                    {row.label}
                  </td>
                  <td className="px-4 py-3.5 text-ash whitespace-nowrap">
                    {row.units.toLocaleString()}
                  </td>
                  <td className="px-4 py-3.5 font-medium text-ink whitespace-nowrap">
                    ${row.revenue.toLocaleString()}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2 min-w-[120px]">
                      <div className="flex-1 h-1.5 bg-bone overflow-hidden">
                        <div
                          className="h-full bg-ink transition-all duration-700 ease-out"
                          style={{ width: `${row.share}%` }}
                        />
                      </div>
                      <span className="text-xs text-ash font-mono w-10 text-right">
                        {row.share.toFixed(0)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}