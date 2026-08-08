"use client";

import { useState, useMemo } from "react";
import { useEffect } from "react";
import { apiRequest } from "@/lib/api";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { Eyebrow } from "@/components/UI";
import {
  Search,
  Filter,
  X,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  Check,
  Package,
  CreditCard,
  Factory,
  Ship,
  Truck,
} from "lucide-react";

interface Order {
  id: string;
  product: string;
  qty: string;
  amount: string;
  amountValue: number;
  status: "Delivered" | "Shipped" | "In Production" | "Pending Payment";
  date: string;
  dateValue: string; // ISO for sorting
  supplier: string;
  port: string;
}

// const ORDERS: Order[] = [
//   { id: "FGM-20458", product: "Industrial CNC Lathe Machine", qty: "2 units", amount: "$18,400", amountValue: 18400, status: "Shipped", date: "Jul 21, 2026", dateValue: "2026-07-21", supplier: "Qingdao Machinery Corp.", port: "Shanghai Port" },
//   { id: "FGM-20431", product: "Organic Cotton T-Shirts", qty: "5,000 pcs", amount: "$6,250", amountValue: 6250, status: "In Production", date: "Jul 18, 2026", dateValue: "2026-07-18", supplier: "Guangzhou Textile Group", port: "Guangzhou Port" },
//   { id: "FGM-20402", product: "Bluetooth Wireless Earbuds", qty: "1,200 pcs", amount: "$9,840", amountValue: 9840, status: "Delivered", date: "Jul 09, 2026", dateValue: "2026-07-09", supplier: "Shenzhen ElectroTech Co.", port: "Shenzhen Port" },
//   { id: "FGM-20389", product: "Modular Office Desk System", qty: "40 units", amount: "$14,000", amountValue: 14000, status: "Pending Payment", date: "Jul 05, 2026", dateValue: "2026-07-05", supplier: "Yiwu Home Furnishings", port: "Ningbo Port" },
//   { id: "FGM-20355", product: "Automotive LED Headlight Kit", qty: "300 units", amount: "$7,650", amountValue: 7650, status: "Delivered", date: "Jun 28, 2026", dateValue: "2026-06-28", supplier: "Ningbo Auto Parts Ltd.", port: "Ningbo Port" },
//   { id: "FGM-20312", product: "Hyaluronic Acid Serum OEM", qty: "10,000 units", amount: "$28,500", amountValue: 28500, status: "Delivered", date: "Jun 14, 2026", dateValue: "2026-06-14", supplier: "Guangzhou Cosmetics Co.", port: "Guangzhou Port" },
//   { id: "FGM-20287", product: "Solar Panel 450W", qty: "200 units", amount: "$16,800", amountValue: 16800, status: "In Production", date: "Jun 02, 2026", dateValue: "2026-06-02", supplier: "Jiangsu Solar Tech", port: "Shanghai Port" },
// ];

const STATUS_STYLES: Record<Order["status"], string> = {
  Delivered: "text-emerald-700 bg-emerald-50",
  Shipped: "text-blue-700 bg-blue-50",
  "In Production": "text-amber-700 bg-amber-50",
  "Pending Payment": "text-rose-700 bg-rose-50",
};

const STATUS_OPTIONS: Order["status"][] = ["Delivered", "Shipped", "In Production", "Pending Payment"];

const TRACKING_STAGES = [
  { label: "Order Placed", icon: Check },
  { label: "Payment Confirmed", icon: CreditCard },
  { label: "In Production", icon: Factory },
  { label: "Shipped", icon: Ship },
  { label: "Delivered", icon: Package },
];

function getTrackingStage(status: Order["status"]): number {
  switch (status) {
    case "Pending Payment": return 0;
    case "In Production": return 2;
    case "Shipped": return 3;
    case "Delivered": return 4;
    default: return 0;
  }
}

type SortKey = "date" | "amount" | "id";
type SortDir = "asc" | "desc";

function StatusBadge({ status }: { status: Order["status"] }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap ${STATUS_STYLES[status]}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
      {status}
    </span>
  );
}

function OrdersTableSkeleton() {
  return (
    <>
      {/* Desktop skeleton */}
      <div className="hidden md:block border border-line">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-6 px-4 py-4 border-b border-line last:border-0"
          >
            <div className="h-3 w-16 bg-bone rounded animate-pulse" />
            <div className="h-3 w-48 bg-bone rounded animate-pulse" />
            <div className="h-3 w-20 bg-bone rounded animate-pulse" />
            <div className="h-3 w-16 bg-bone rounded animate-pulse ml-auto" />
            <div className="h-5 w-24 bg-bone rounded-full animate-pulse" />
            <div className="h-3 w-20 bg-bone rounded animate-pulse" />
          </div>
        ))}
      </div>
      {/* Mobile skeleton */}
      <div className="md:hidden space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border border-line p-4 space-y-3">
            <div className="flex justify-between">
              <div className="h-3 w-16 bg-bone rounded animate-pulse" />
              <div className="h-5 w-20 bg-bone rounded-full animate-pulse" />
            </div>
            <div className="h-3.5 w-3/4 bg-bone rounded animate-pulse" />
            <div className="flex justify-between">
              <div className="h-3 w-16 bg-bone rounded animate-pulse" />
              <div className="h-3 w-14 bg-bone rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function OrdersEmptyState({
  hasActiveFilters,
  onClear,
}: {
  hasActiveFilters: boolean;
  onClear: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 sm:py-20 border border-dashed border-line animate-[fadeIn_0.3s_ease-out]">
      <div className="w-14 h-14 rounded-full bg-bone flex items-center justify-center mb-4">
        <Package size={22} className="text-smoke" />
      </div>
      <p className="font-display font-semibold text-lg tracking-tight text-ink">
        No orders found
      </p>
      <p className="mt-1.5 text-sm text-ash max-w-xs leading-relaxed">
        {hasActiveFilters
          ? "Try adjusting your search or filters."
          : "Orders you place will show up here."}
      </p>
      {hasActiveFilters && (
        <button
          type="button"
          onClick={onClear}
          className="mt-5 text-xs font-mono uppercase tracking-widest2 text-ink underline underline-offset-4 hover:text-ash transition-colors"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilters, setStatusFilters] = useState<Set<Order["status"]>>(new Set());
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   async function fetchOrders() {
  //     try {
  //       const response = await apiRequest("/order/my-orders")

  //       console.log("MY ORDERS:", response);


  //       const formattedOrders: Order[] = response.map((order: any) => ({
  //         id: `FGM-${order.id}`,

  //         product:
  //           order.items
  //             .map((item: any) => item.product.name)
  //             .join(", "),

  //         qty:
  //           order.items
  //             .map((item: any) => `${item.quantity}`)
  //             .join(", ") + " units",

  //         amount:
  //           `$${order.total.toLocaleString()}`,

  //         amountValue:
  //           order.total,

  //         status:
  //           order.status === "Pending"
  //             ? "Pending Payment"
  //             : order.status,

  //         date:
  //           new Date(order.createdAt).toLocaleDateString(),

  //         dateValue:
  //           order.createdAt,

  //         supplier:
  //           "Unknown Supplier",

  //         port:
  //           "N/A",
  //       }));


  //       setOrders(formattedOrders);


  //     } catch (error) {
  //       console.error("Orders failed:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }



  //   fetchOrders();

  // }, []);

  useEffect(() => {

    async function fetchOrders() {

      try {

        const response = await apiRequest("/order/my-orders");

        console.log("MY ORDERS:", response);


        const formattedOrders: Order[] = response.map((order: any) => ({

          id: `FGM-${order.id}`,

          product:
            order.items
              ?.map((item: any) => item.product?.name)
              .join(", ") || "Unknown Product",

          qty:
            order.items
              ?.map((item: any) => item.quantity)
              .join(", ") + " units",

          amount:
            `$${order.total?.toLocaleString() || 0}`,

          amountValue:
            order.total || 0,

          status:
            order.status === "Pending"
              ? "Pending Payment"
              : order.status,

          date:
            new Date(order.createdAt)
              .toLocaleDateString(),

          dateValue:
            order.createdAt,

          supplier:
            "Unknown Supplier",

          port:
            "N/A",

        }));


        setOrders(formattedOrders);


      } catch (error) {

        console.error(
          "Orders failed:",
          error
        );

      } finally {

        setLoading(false);

      }

    }


    fetchOrders();


  }, []);
  const toggleStatusFilter = (status: Order["status"]) => {
    setStatusFilters((prev) => {
      const next = new Set(prev);
      if (next.has(status)) next.delete(status);
      else next.add(status);
      return next;
    });
  };

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const filteredOrders = useMemo(() => {
    let result = orders.filter((o) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q || o.id.toLowerCase().includes(q) || o.product.toLowerCase().includes(q);
      const matchesStatus = statusFilters.size === 0 || statusFilters.has(o.status);
      return matchesSearch && matchesStatus;
    });

    result = [...result].sort((a, b) => {
      let comp = 0;
      if (sortKey === "date") comp = a.dateValue.localeCompare(b.dateValue);
      else if (sortKey === "amount") comp = a.amountValue - b.amountValue;
      else if (sortKey === "id") comp = a.id.localeCompare(b.id);
      return sortDir === "asc" ? comp : -comp;
    });

    return result;
  }, [orders, search, statusFilters, sortKey, sortDir]);

  const SortIcon = ({ active }: { active: boolean }) => {
    if (!active) return <ArrowUpDown size={11} className="text-smoke/50" />;
    return sortDir === "asc" ? <ArrowUp size={11} /> : <ArrowDown size={11} />;
  };

  return (
    <DashboardShell>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <Eyebrow>My Orders</Eyebrow>
          <h1 className="mt-2 font-display font-bold text-2xl sm:text-3xl tracking-tightest">
            {filteredOrders.length} Orders
          </h1>
        </div>
        <div className="flex gap-3 relative">
          <div className="flex items-center gap-2 border border-line px-3 py-2 bg-paper flex-1 sm:flex-none sm:w-64 focus-within:border-ash transition-colors">
            <Search size={15} className="text-smoke shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search order ID or product..."
              className="w-full bg-transparent text-sm placeholder:text-smoke focus:outline-none min-w-0"
            />
          </div>
          <button
            type="button"
            onClick={() => setFilterOpen((v) => !v)}
            className={`flex items-center gap-2 border px-3 py-2 text-sm transition-colors shrink-0 ${statusFilters.size > 0 ? "border-ink bg-ink text-paper" : "border-line hover:border-ash"
              }`}
          >
            <Filter size={15} />
            <span className="hidden sm:inline">Filter</span>
            {statusFilters.size > 0 && (
              <span className="w-4 h-4 rounded-full bg-paper text-ink text-[9px] font-mono flex items-center justify-center">
                {statusFilters.size}
              </span>
            )}
          </button>

          {filterOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-paper border border-line shadow-lg z-20 animate-[fadeUp_0.15s_ease-out]">
              <div className="px-4 py-3 border-b border-line flex items-center justify-between">
                <p className="font-mono text-xs uppercase tracking-widest2 text-smoke">Status</p>
                {statusFilters.size > 0 && (
                  <button
                    type="button"
                    onClick={() => setStatusFilters(new Set())}
                    className="text-[10px] font-mono text-ink hover:text-ash"
                  >
                    Clear
                  </button>
                )}
              </div>
              <div className="p-2">
                {STATUS_OPTIONS.map((s) => (
                  <label
                    key={s}
                    className="flex items-center gap-2.5 px-2 py-2 text-sm hover:bg-bone cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={statusFilters.has(s)}
                      onChange={() => toggleStatusFilter(s)}
                      className="accent-ink"
                    />
                    {s}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <OrdersTableSkeleton />
      ) : filteredOrders.length === 0 ? (
        <OrdersEmptyState
          hasActiveFilters={search.trim().length > 0 || statusFilters.size > 0}
          onClear={() => {
            setSearch("");
            setStatusFilters(new Set());
          }}
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block border border-line overflow-hidden">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-bone border-b border-line">
                  <th
                    onClick={() => toggleSort("id")}
                    className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-widest2 text-smoke cursor-pointer select-none hover:text-ink transition-colors"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      Order ID <SortIcon active={sortKey === "id"} />
                    </span>
                  </th>
                  <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-widest2 text-smoke">
                    Product
                  </th>
                  <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-widest2 text-smoke">
                    Quantity
                  </th>
                  <th
                    onClick={() => toggleSort("amount")}
                    className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-widest2 text-smoke cursor-pointer select-none hover:text-ink transition-colors"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      Amount <SortIcon active={sortKey === "amount"} />
                    </span>
                  </th>
                  <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-widest2 text-smoke">
                    Status
                  </th>
                  <th
                    onClick={() => toggleSort("date")}
                    className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-widest2 text-smoke cursor-pointer select-none hover:text-ink transition-colors"
                  >
                    <span className="inline-flex items-center gap-1.5">
                      Date <SortIcon active={sortKey === "date"} />
                    </span>
                  </th>
                  <th className="px-4 py-3 w-8" aria-hidden="true" />
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, i) => (
                  <tr
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className="group border-b border-line last:border-0 hover:bg-bone cursor-pointer transition-colors animate-[fadeUp_0.3s_ease-out_backwards]"
                    style={{ animationDelay: `${i * 30}ms` }}
                  >
                    <td className="px-4 py-3.5 font-mono text-xs text-ink whitespace-nowrap">
                      {order.id}
                    </td>
                    <td className="px-4 py-3.5 font-medium text-ink max-w-[260px] truncate">
                      {order.product}
                    </td>
                    <td className="px-4 py-3.5 text-ash whitespace-nowrap">{order.qty}</td>
                    <td className="px-4 py-3.5 font-medium text-ink whitespace-nowrap">
                      {order.amount}
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-3.5 text-ash font-mono text-xs whitespace-nowrap">
                      {order.date}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <ChevronRight
                        size={16}
                        className="text-smoke opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {filteredOrders.map((order, i) => (
              <button
                type="button"
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className="w-full text-left border border-line p-4 bg-paper hover:border-ash active:scale-[0.99] transition-all animate-[fadeUp_0.3s_ease-out_backwards]"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <p className="font-mono text-xs text-smoke">{order.id}</p>
                  <StatusBadge status={order.status} />
                </div>
                <p className="font-display font-semibold text-sm tracking-tight text-ink mb-2 line-clamp-2">
                  {order.product}
                </p>
                <div className="flex items-center justify-between text-xs text-ash">
                  <span>{order.qty}</span>
                  <span className="font-medium text-ink">{order.amount}</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-[11px] text-smoke font-mono">{order.date}</p>
                  <ChevronRight size={14} className="text-smoke" />
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Order details modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 bg-ink/50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-[fadeIn_0.2s_ease-out]"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-paper w-full sm:max-w-lg border-t sm:border border-line p-5 sm:p-6 animate-[slideUp_0.25s_ease-out] max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4 gap-3">
              <div>
                <p className="font-mono text-xs text-smoke">{selectedOrder.id}</p>
                <h2 className="mt-1 font-display font-bold text-lg tracking-tightest break-words">
                  {selectedOrder.product}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 flex items-center justify-center hover:bg-bone transition-colors shrink-0"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-5">
              <span className={`inline-block px-2.5 py-1 text-[10px] font-medium rounded-full ${STATUS_STYLES[selectedOrder.status]}`}>
                {selectedOrder.status}
              </span>
              <span className="text-xs text-smoke font-mono">{selectedOrder.date}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 border-y border-line py-4 mb-5">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest2 text-smoke">Quantity</p>
                <p className="mt-1 text-sm font-medium">{selectedOrder.qty}</p>
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest2 text-smoke">Amount</p>
                <p className="mt-1 text-sm font-medium">{selectedOrder.amount}</p>
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest2 text-smoke">Supplier</p>
                <p className="mt-1 text-sm font-medium break-words">{selectedOrder.supplier}</p>
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest2 text-smoke">Port of Loading</p>
                <p className="mt-1 text-sm font-medium">{selectedOrder.port}</p>
              </div>
            </div>

            {/* Tracking timeline */}
            <p className="font-mono text-xs uppercase tracking-widest2 text-smoke mb-4">Shipment Tracking</p>
            <div className="space-y-0">
              {TRACKING_STAGES.map((stage, i) => {
                const currentStage = getTrackingStage(selectedOrder.status);
                const done = i < currentStage || (selectedOrder.status === "Delivered" && i === currentStage);
                const active = i === currentStage && selectedOrder.status !== "Delivered";
                return (
                  <div key={stage.label} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center border-2 shrink-0 ${done
                          ? "bg-ink border-ink text-paper"
                          : active
                            ? "border-ink text-ink animate-pulse"
                            : "border-line text-smoke"
                          }`}
                      >
                        <stage.icon size={12} />
                      </span>
                      {i < TRACKING_STAGES.length - 1 && (
                        <div className={`w-0.5 flex-1 min-h-[20px] ${done ? "bg-ink" : "bg-line"}`} />
                      )}
                    </div>
                    <div className="pb-5">
                      <p className={`text-sm font-medium ${done || active ? "text-ink" : "text-smoke"}`}>
                        {stage.label}
                      </p>
                      {active && <p className="text-xs text-smoke mt-0.5">Currently in progress</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </DashboardShell>
  );
}