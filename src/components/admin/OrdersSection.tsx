"use client";

import { useMemo, useState } from "react";
import { Search, ClipboardList } from "lucide-react";
import { StatusBadge, EmptyState, TabSectionHeading } from "@/components/vendor/VendorUI";
import { ORDER_STATUS_STYLES, type PlatformOrder, type AdminOrderStatus } from "./data";

interface OrdersSectionProps {
  orders: PlatformOrder[];
  onUpdateStatus: (id: number, status: string) => void;
}

const STATUS_FILTERS: (AdminOrderStatus | "All")[] = [
  "All",
  "Pending",
  "In Production",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export default function OrdersSection({
  orders,
  onUpdateStatus,
}: OrdersSectionProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<AdminOrderStatus | "All">("All");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    // async function handleUpdateOrderStatus(
    //   id: number,
    //   status: string
    // ) {

    //   try {

    //     await apiRequest(`/admin/order/${id}/status`, {
    //       method: "PATCH",
    //       headers: {
    //         "Content-Type": "application/json"
    //       },
    //       body: JSON.stringify({
    //         status
    //       })
    //     });


    //     setOrders(prev =>
    //       prev.map(order =>
    //         order.id === `FGM-${id}`
    //           ? {
    //             ...order,
    //             status
    //           }
    //           : order
    //       )
    //     );


    //   } catch (error) {
    //     console.error(
    //       "Order update failed",
    //       error
    //     );
    //   }

    // }
    return orders.filter((o) => {
      const matchesSearch =
        !q ||
        o.id.toLowerCase().includes(q) ||
        o.buyer.toLowerCase().includes(q) ||
        o.vendor.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "All" || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  return (
    <div className="animate-[fadeIn_0.25s_ease-out]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <TabSectionHeading
          title="Orders"
          description={`${orders.length} orders across the marketplace`}
        />
        <div className="flex gap-3">
          <div className="flex items-center gap-2 border border-line px-3 py-2 bg-paper flex-1 sm:flex-none sm:w-56 focus-within:border-ash transition-colors">
            <Search size={15} className="text-smoke shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search order, buyer, vendor..."
              className="w-full bg-transparent text-sm placeholder:text-smoke focus:outline-none min-w-0"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as AdminOrderStatus | "All")}
            className="border border-line bg-paper px-3 py-2 text-sm text-ink focus:outline-none focus:border-ash transition-colors"
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
          icon={ClipboardList}
          title="No orders found"
          description="Try a different search term or status filter."
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block border border-line overflow-hidden">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-bone border-b border-line">
                  <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-widest2 text-smoke">Order ID</th>
                  <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-widest2 text-smoke">Buyer</th>
                  <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-widest2 text-smoke">Vendor</th>
                  <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-widest2 text-smoke">Amount</th>
                  <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-widest2 text-smoke">Status</th>
                  <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-widest2 text-smoke">Date</th>
                  <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-widest2 text-smoke">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order, i) => (
                  <tr
                    key={order.id}
                    className="border-b border-line last:border-0 hover:bg-bone transition-colors animate-[fadeUp_0.3s_ease-out_backwards]"
                    style={{ animationDelay: `${i * 30}ms` }}
                  >
                    <td className="px-4 py-3.5 font-mono text-xs text-ink whitespace-nowrap">{order.id}</td>
                    <td className="px-4 py-3.5 text-ink max-w-[180px] truncate">{order.buyer}</td>
                    <td className="px-4 py-3.5 text-ash max-w-[180px] truncate">{order.vendor}</td>
                    <td className="px-4 py-3.5 font-medium text-ink whitespace-nowrap">
                      ${order.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={order.status} styles={ORDER_STATUS_STYLES} />
                    </td>
                    <td className="px-4 py-3.5 text-ash font-mono text-xs whitespace-nowrap">
                      {new Date(order.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3.5 text-right">

                      {order.status === "Pending" && (
                        <button
                          onClick={() =>
                            onUpdateStatus(
                              Number(order.id.replace("FGM-", "")),
                              "In Production"
                            )
                          }
                          className="px-3 py-1.5 text-xs border border-line text-emerald-700"
                        >
                          Start Production
                        </button>
                      )}


                      {order.status === "In Production" && (
                        <button
                          onClick={() =>
                            onUpdateStatus(
                              Number(order.id.replace("FGM-", "")),
                              "Shipped"
                            )
                          }
                          className="px-3 py-1.5 text-xs border border-line text-blue-700"
                        >
                          Ship
                        </button>
                      )}


                      {order.status === "Shipped" && (
                        <button
                          onClick={() =>
                            onUpdateStatus(
                              Number(order.id.replace("FGM-", "")),
                              "Delivered"
                            )
                          }
                          className="px-3 py-1.5 text-xs border border-line text-green-700"
                        >
                          Deliver
                        </button>
                      )}

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {filtered.map((order, i) => (
              <div
                key={order.id}
                className="border border-line p-4 bg-paper animate-[fadeUp_0.3s_ease-out_backwards]"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <p className="font-mono text-xs text-smoke">{order.id}</p>
                  <StatusBadge status={order.status} styles={ORDER_STATUS_STYLES} />
                </div>
                <p className="font-display font-semibold text-sm tracking-tight text-ink mb-1">
                  {order.buyer}
                </p>
                <p className="text-xs text-ash mb-3">→ {order.vendor}</p>
                <div className="flex items-center justify-between text-sm pt-3 border-t border-line">
                  <span className="font-medium text-ink">${order.amount.toLocaleString()}</span>
                  <span className="text-[11px] text-smoke font-mono">
                    {new Date(order.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}