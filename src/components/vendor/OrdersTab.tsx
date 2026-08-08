"use client";

import { useMemo, useState } from "react";
import { Search, ClipboardList } from "lucide-react";
import { ORDER_STATUS_OPTIONS, ORDER_STATUS_STYLES, type VendorOrder, type VendorOrderStatus } from "./data";
import { EmptyState, TabSectionHeading } from "./VendorUI";

interface OrdersTabProps {
  orders: any[];
  onStatusChange: (id: string, status: VendorOrderStatus) => void;
}

function OrderStatusSelect({
  status,
  onChange,
}: {
  status: VendorOrderStatus;
  onChange: (status: VendorOrderStatus) => void;
}) {
  return (
    <select
      value={status}
      onChange={(e) => onChange(e.target.value as VendorOrderStatus)}
      onClick={(e) => e.stopPropagation()}
      className={`border-0 rounded-full pl-2.5 pr-7 py-1 text-[11px] font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-ink appearance-none bg-no-repeat bg-[right_6px_center] bg-[length:10px] ${ORDER_STATUS_STYLES[status]}`}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='currentColor'%3E%3Cpath fill-rule='evenodd' d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z' clip-rule='evenodd'/%3E%3C/svg%3E\")",
      }}
    >
      {ORDER_STATUS_OPTIONS.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}

export default function OrdersTab({ orders, onStatusChange }: OrdersTabProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((o) => {
      const matchesSearch =
        !q ||
        o.id.toString().includes(q) ||
        o.user?.fullName?.toLowerCase().includes(q) ||
        o.items?.some((item: any) =>
          item.product.name.toLowerCase().includes(q)
        );
      const matchesStatus = statusFilter === "All" || o.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  return (
    <div className="animate-[fadeIn_0.25s_ease-out]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <TabSectionHeading
          title="Orders Received"
          description={`${orders.length} orders across your storefront`}
        />
        <div className="flex gap-3">
          <div className="flex items-center gap-2 border border-line px-3 py-2 bg-paper flex-1 sm:flex-none sm:w-56 focus-within:border-ash transition-colors">
            <Search size={15} className="text-smoke shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search order, buyer, product..."
              className="w-full bg-transparent text-sm placeholder:text-smoke focus:outline-none min-w-0"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-line bg-paper px-3 py-2 text-sm text-ink focus:outline-none focus:border-ash transition-colors"
          >
            <option value="All">All statuses</option>
            {ORDER_STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
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
                  <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-widest2 text-smoke">
                    Order ID
                  </th>
                  <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-widest2 text-smoke">
                    Buyer
                  </th>
                  <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-widest2 text-smoke">
                    Product
                  </th>
                  <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-widest2 text-smoke">
                    Qty
                  </th>
                  <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-widest2 text-smoke">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-widest2 text-smoke">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-widest2 text-smoke">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order, i) => (
                  <tr
                    key={order.id}
                    className="border-b border-line last:border-0 hover:bg-bone transition-colors animate-[fadeUp_0.3s_ease-out_backwards]"
                    style={{ animationDelay: `${i * 30}ms` }}
                  >
                    <td className="px-4 py-3.5 font-mono text-xs text-ink whitespace-nowrap">
                      {order.id}
                    </td>
                    <td className="px-4 py-3.5 max-w-[200px]">
                      <p className="font-medium text-ink truncate">
                        {order.user?.fullName}
                      </p>

                      <p className="text-xs text-smoke">
                        {order.user?.email}
                      </p>                    </td>
                    <td className="px-4 py-3.5 text-ash max-w-[220px] truncate">{order.items
                      ?.map((item: any) => item.product.name)
                      .join(", ")}</td>
                    <td className="px-4 py-3.5 text-ash whitespace-nowrap">
                      {order.items?.reduce(
                        (sum: number, item: any) => sum + item.quantity,
                        0
                      ).toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5 font-medium text-ink whitespace-nowrap">
                      ${order.total.toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5">
                      <OrderStatusSelect
                        status={order.status}
                        onChange={(status) => onStatusChange(order.id, status)}
                      />
                    </td>
                    <td className="px-4 py-3.5 text-ash font-mono text-xs whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString()}
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
                  <OrderStatusSelect
                    status={order.status}
                    onChange={(status) => onStatusChange(order.id, status)}
                  />
                </div>
                <p className="font-display font-semibold text-sm tracking-tight text-ink mb-1">
                  {order.product}
                </p>
                <p className="text-xs text-ash mb-3">
                  {order.buyer} · {order.buyerCountry}
                </p>
                <div className="flex items-center justify-between text-sm pt-3 border-t border-line">
                  <span className="text-ash">{order.items?.reduce(
                    (sum: number, item: any) => sum + item.quantity,
                    0
                  ).toLocaleString()} units</span>
                  <span className="font-medium text-ink">${order.total.toLocaleString()}</span>
                </div>
                <p className="mt-2 text-[11px] text-smoke font-mono">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}