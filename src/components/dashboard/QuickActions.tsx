import { Search, FileText, MessageCircle, Truck } from "lucide-react";
import { PrimaryButton } from "@/components/UI";
import Reveal from "@/components/Reveal";

export default function QuickActions() {
  return (
    <Reveal>
      <div className="bg-ink text-paper p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6">
        <div>
          <h2 className="font-display font-bold text-lg sm:text-xl tracking-tightest">
            Ready for your next order?
          </h2>
          <p className="mt-1 text-sm text-smoke max-w-md">
            Browse verified suppliers, request a quotation, or reach out directly to your trade partners.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:flex sm:flex-row gap-3 shrink-0">
          <PrimaryButton href="/products" icon={Search}>
            Browse Products
          </PrimaryButton>

          <a
            href="/contact"
            className="inline-flex items-center justify-center gap-2 border border-paper/30 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-mono uppercase tracking-widest2 hover:bg-paper/10 transition-colors text-center"
          >
            <FileText size={14} className="shrink-0" />
            Request Quotation
          </a>

          <a
            href="/suppliers"
            className="inline-flex items-center justify-center gap-2 border border-paper/30 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-mono uppercase tracking-widest2 hover:bg-paper/10 transition-colors text-center"
          >
            <MessageCircle size={14} className="shrink-0" />
            Contact Supplier
          </a>

          <a
            href="/dashboard/orders"
            className="inline-flex items-center justify-center gap-2 border border-paper/30 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-mono uppercase tracking-widest2 hover:bg-paper/10 transition-colors text-center"
          >
            <Truck size={14} className="shrink-0" />
            Track Orders
          </a>
        </div>
      </div>
    </Reveal>
  );
}
