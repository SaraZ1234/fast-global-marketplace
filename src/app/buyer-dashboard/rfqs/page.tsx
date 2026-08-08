"use client";

import { useState, useMemo, useEffect } from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { Eyebrow } from "@/components/UI";
import {
  MessageSquareText,
  Plus,
  Search,
  X,
  Send,
  CheckCircle2,
  Building2,
} from "lucide-react";

type RFQStatus =
  | "Open"
  | "Quoted"
  | "Negotiating"
  | "Closed";

interface Quote {
  supplier: string;
  price: string;
  leadTime: string;
  moq: string;
}

interface RFQ {
  id: number;
  title: string;
  description: string;
  quantity: number;
  budget: number;
  status: RFQStatus;
  createdAt: string;
  quotations: any[];
}

const STATUS_STYLES = {
  Open: "text-amber-700 bg-amber-50",
  Quoted: "text-blue-700 bg-blue-50",
  Negotiating: "text-purple-700 bg-purple-50",
  Closed: "text-smoke bg-bone",
};

const STATUS_FILTERS: ("All" | RFQStatus)[] = [
  "All",
  "Open",
  "Quoted",
  "Negotiating",
  "Closed",
];
// const INITIAL_RFQS: RFQ[] = [
//   {
//     id: "RFQ-1042",
//     product: "Hydraulic Excavator Parts",
//     qty: "20 units",
//     status: "Quoted",
//     date: "Jul 22, 2026",
//     notes: "Need OEM-grade hydraulic cylinders compatible with CAT 320 series.",
//     quotes: [
//       { supplier: "Qingdao Machinery Corp.", price: "$1,240 / unit", leadTime: "18-25 days", moq: "10 units" },
//       { supplier: "Shandong Heavy Industries", price: "$1,180 / unit", leadTime: "22-30 days", moq: "20 units" },
//       { supplier: "Xuzhou Construction Equip.", price: "$1,310 / unit", leadTime: "15-20 days", moq: "5 units" },
//     ],
//   },
//   {
//     id: "RFQ-1038",
//     product: "Custom Packaging Boxes",
//     qty: "50,000 pcs",
//     status: "Pending",
//     date: "Jul 19, 2026",
//     notes: "Corrugated boxes, custom print, food-safe coating required.",
//     quotes: [],
//   },
//   {
//     id: "RFQ-1029",
//     product: "Solar Panel 450W",
//     qty: "500 units",
//     status: "Negotiating",
//     date: "Jul 11, 2026",
//     notes: "Monocrystalline panels, need Tier 1 certification.",
//     quotes: [
//       { supplier: "Jiangsu Solar Tech", price: "$38.50 / unit", leadTime: "20-28 days", moq: "100 units" },
//       { supplier: "SunPower Guangzhou", price: "$41.00 / unit", leadTime: "15-20 days", moq: "200 units" },
//       { supplier: "Zhejiang Green Energy", price: "$36.80 / unit", leadTime: "25-35 days", moq: "500 units" },
//       { supplier: "Fujian Renewable Co.", price: "$39.90 / unit", leadTime: "18-24 days", moq: "150 units" },
//       { supplier: "Anhui Solar Systems", price: "$37.60 / unit", leadTime: "22-30 days", moq: "300 units" },
//     ],
//   },
//   {
//     id: "RFQ-1015",
//     product: "Stainless Steel Pipes",
//     qty: "1,000 m",
//     status: "Closed",
//     date: "Jun 30, 2026",
//     notes: "Grade 304, seamless, 2-inch diameter.",
//     quotes: [
//       { supplier: "Wuxi Steel Group", price: "$14.20 / m", leadTime: "12-18 days", moq: "500 m" },
//       { supplier: "Foshan Metal Works", price: "$13.90 / m", leadTime: "15-20 days", moq: "1,000 m" },
//     ],
//   },
//   {
//     id: "RFQ-1002",
//     product: "LED Panel Lights",
//     qty: "3,000 pcs",
//     status: "Closed",
//     date: "Jun 12, 2026",
//     notes: "600x600mm, 40W, 4000K, CE certified.",
//     quotes: [
//       { supplier: "Shenzhen Lighting Tech", price: "$6.80 / pc", leadTime: "10-15 days", moq: "1,000 pcs" },
//       { supplier: "Guangdong LED Co.", price: "$7.20 / pc", leadTime: "12-18 days", moq: "500 pcs" },
//       { supplier: "Ningbo Bright Solutions", price: "$6.50 / pc", leadTime: "14-20 days", moq: "2,000 pcs" },
//       { supplier: "Dongguan Illumination", price: "$7.00 / pc", leadTime: "10-14 days", moq: "1,500 pcs" },
//     ],
//   },
// ];

function todayLabel() {
  return new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

export default function RFQsPage() {
  const [rfqs, setRfqs] = useState<RFQ[]>([]);
  const [statusFilter, setStatusFilter] = useState<"All" | RFQStatus>("All");
  const [search, setSearch] = useState("");
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [detailRFQ, setDetailRFQ] = useState<RFQ | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetchRFQs();
  }, []);

  const fetchRFQs = async () => {
    try {
      const res = await fetch(
        "http://localhost:3001/rfq/my",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      const data = await res.json();
      console.log("RFQ API RESPONSE:", data);

      setRfqs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
    }
  };

  const filtered = useMemo(() => {
    return rfqs.filter((r) => {
      const matchesStatus =
        statusFilter === "All" || r.status === statusFilter;

      const q = search.trim().toLowerCase();

      const matchesSearch =
        !q ||
        r.title.toLowerCase().includes(q) ||
        String(r.id).includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [rfqs, statusFilter, search]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleCreateRFQ = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;

    const formData = new FormData(form);

    const title = String(formData.get("product") || "").trim();
    const quantity = Number(formData.get("qty") || 0);
    const description = String(formData.get("notes") || "").trim();

    if (!title || !quantity) return;

    try {
      setSubmitting(true);

      const res = await fetch(
        "http://localhost:3001/rfq",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify({
            title,
            description,
            quantity,
            budget: 0,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to create RFQ");
      }

      const newRFQ = await res.json();

      console.log("CREATED RFQ:", newRFQ);

      await fetchRFQs();

      setNewModalOpen(false);

      form.reset();

      showToast(`RFQ-${String(newRFQ.id).padStart(4, "0")} submitted successfully`);

    } catch (error) {
      console.log(error);
      showToast("Failed to submit RFQ");
    } finally {
      setSubmitting(false);
    }
  };

  const updateRFQStatus = async (
    id: number,
    status: string
  ) => {
    try {
      const res = await fetch(
        `http://localhost:3001/rfq/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update status");
      }

      await fetchRFQs();

      setDetailRFQ(null);

      showToast(
        status === "Closed"
          ? "RFQ marked as closed"
          : "RFQ reopened"
      );

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <DashboardShell>
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <Eyebrow>Request for Quotation</Eyebrow>
          <h1 className="mt-2 font-display font-bold text-2xl sm:text-3xl tracking-tightest">
            {filtered.length} of {rfqs.length} RFQs
          </h1>
        </div>
        <button
          type="button"
          onClick={() => setNewModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 bg-ink text-paper text-sm font-mono uppercase tracking-widest2 px-5 py-2.5 hover:bg-ash transition-colors"
        >
          <Plus size={15} /> New RFQ
        </button>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5 sm:mb-6">
        <div className="flex items-center gap-2 border border-line px-3 py-2 bg-paper w-full sm:max-w-xs">
          <Search size={15} className="text-smoke shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product or RFQ ID..."
            className="w-full bg-transparent text-sm placeholder:text-smoke focus:outline-none min-w-0"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatusFilter(s)}
              className={`text-xs font-mono uppercase tracking-widest2 px-3 py-2 border transition-colors ${statusFilter === s
                ? "border-ink bg-ink text-paper"
                : "border-line text-ash hover:border-ash"
                }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* RFQ list */}
      {filtered.length === 0 ? (
        <div className="bg-paper border border-line p-10 text-center text-sm text-smoke">
          No RFQs match your search or filter.
        </div>
      ) : (
        <div className="bg-paper border border-line divide-y divide-line">
          {filtered.map((r, i) => (
            <div
              key={r.id}
              className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-bone transition-colors animate-[fadeUp_0.3s_ease-out]"
              style={{ animationDelay: `${i * 30}ms`, animationFillMode: "backwards" }}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium text-sm sm:text-base">{r.title}</p>
                  <span
                    className={`inline-block px-2.5 py-1 text-[10px] font-medium rounded-full whitespace-nowrap ${STATUS_STYLES[r.status]}`}
                  >
                    {r.status}
                  </span>
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] sm:text-xs text-smoke font-mono">
                  <span>RFQ-{String(r.id).padStart(4, "0")}</span>
                  <span>•</span>
                  <span>Qty: {r.quantity}</span>
                  <span>•</span>
                  <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {r.quotations.length > 0 && (
                  <span className="inline-flex items-center gap-1 text-xs text-ash font-mono">
                    <MessageSquareText size={13} /> {r.quotations.length} quotes received
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setDetailRFQ(r)}
                  className="text-xs font-mono uppercase tracking-widest2 border border-line px-4 py-2 hover:border-ash transition-colors whitespace-nowrap"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New RFQ modal */}
      {newModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-ink/50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-[fadeIn_0.2s_ease-out]"
          onClick={() => setNewModalOpen(false)}
        >
          <div
            className="bg-paper w-full sm:max-w-md border-t sm:border border-line p-5 sm:p-6 animate-[slideUp_0.25s_ease-out] max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-bold text-lg tracking-tightest">New RFQ</h2>
              <button
                type="button"
                onClick={() => setNewModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center hover:bg-bone transition-colors"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateRFQ} className="space-y-4">
              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest2 text-smoke">
                  Product Name
                </label>
                <input
                  name="product"
                  required
                  type="text"
                  placeholder="e.g. Injection Molding Machine"
                  className="mt-1.5 w-full bg-bone border border-line px-3 py-2.5 text-sm focus:outline-none focus:border-ash"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest2 text-smoke">
                  Quantity Needed
                </label>
                <input
                  name="qty"
                  required
                  type="text"
                  placeholder="e.g. 100 units"
                  className="mt-1.5 w-full bg-bone border border-line px-3 py-2.5 text-sm focus:outline-none focus:border-ash"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest2 text-smoke">
                  Requirements / Notes
                </label>
                <textarea
                  name="notes"
                  rows={4}
                  placeholder="Specs, certifications, target price, delivery timeline..."
                  className="mt-1.5 w-full bg-bone border border-line px-3 py-2.5 text-sm resize-none focus:outline-none focus:border-ash"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 bg-ink text-paper font-mono text-xs uppercase tracking-widest2 px-6 py-3 hover:bg-ash transition-colors disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Submit RFQ"}
                {!submitting && <Send size={13} />}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* View Details modal */}
      {detailRFQ && (
        <div
          className="fixed inset-0 z-50 bg-ink/50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-[fadeIn_0.2s_ease-out]"
          onClick={() => setDetailRFQ(null)}
        >
          <div
            className="bg-paper w-full sm:max-w-lg border-t sm:border border-line p-5 sm:p-6 animate-[slideUp_0.25s_ease-out] max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4 gap-3">
              <div>
                <p className="font-mono text-xs text-smoke">{detailRFQ.id}</p>
                <h2 className="mt-1 font-display font-bold text-lg tracking-tightest break-words">
                  {detailRFQ.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setDetailRFQ(null)}
                className="w-8 h-8 flex items-center justify-center hover:bg-bone transition-colors shrink-0"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className={`inline-block px-2.5 py-1 text-[10px] font-medium rounded-full ${STATUS_STYLES[detailRFQ.status]}`}>
                {detailRFQ.status}
              </span>
              <span className="text-xs text-smoke font-mono">Qty: {detailRFQ.quantity}</span>
              <span className="text-xs text-smoke font-mono">• {new Date(detailRFQ.createdAt).toLocaleDateString()}</span>
            </div>

            <p className="text-sm text-ash leading-relaxed border-t border-line pt-4">
              {detailRFQ.description}
            </p>

            <div className="mt-5">
              <p className="font-mono text-xs uppercase tracking-widest2 text-smoke mb-3">
                Quotes ({detailRFQ.quotations.length})
              </p>
              {detailRFQ.quotations.length === 0 ? (
                <p className="text-sm text-smoke border border-dashed border-line p-4 text-center">
                  No quotes received yet. Suppliers typically respond within 24 hours.
                </p>
              ) : (
                <div className="border border-line divide-y divide-line">
                  {detailRFQ.quotations.map((q, i) => (
                    <div key={i} className="p-3.5 flex items-start gap-3">
                      <span className="w-8 h-8 rounded-full bg-ink text-paper flex items-center justify-center shrink-0">
                        <Building2 size={13} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium break-words">{q.supplier}</p>
                        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-smoke font-mono">
                          <span>{q.price}</span>
                          <span>• Lead: {q.leadTime}</span>
                          <span>• MOQ: {q.moq}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() =>
                updateRFQStatus(
                  detailRFQ.id,
                  detailRFQ.status === "Closed" ? "Open" : "Closed"
                )
              }
              className="mt-6 w-full border border-line text-xs font-mono uppercase tracking-widest2 px-5 py-2.5 hover:border-ash transition-colors"
            >
              {detailRFQ.status === "Closed"
                ? "Mark as Open"
                : "Mark as Closed"}
            </button>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 sm:bottom-6 left-1/2 -translate-x-1/2 z-[60] bg-ink text-paper px-4 py-3 flex items-center gap-2 text-sm animate-[fadeUp_0.2s_ease-out] shadow-lg">
          <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
          {toast}
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
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