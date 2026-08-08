"use client";

import { Loader2, Lock, ArrowUpRight } from "lucide-react";
import OrderSummaryItem, { OrderItem } from "./OrderSummaryItem";

interface CheckoutSummaryProps {
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  taxRate: number;
  isSubmitting: boolean;
  onPlaceOrder: () => void;
}

const currency = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

export default function CheckoutSummary({
  items,
  subtotal,
  shipping,
  taxRate,
  isSubmitting,
  onPlaceOrder,
}: CheckoutSummaryProps) {
  const tax = subtotal * taxRate;
  const total = subtotal + shipping + tax;

  return (
    <div className="lg:sticky lg:top-24 border border-ink bg-paper p-6 sm:p-7">
      <h2 className="font-display font-bold text-lg sm:text-xl tracking-tightest">
        Order Summary
      </h2>

      <div className="mt-5 divide-y divide-line max-h-72 overflow-y-auto pr-1">
        {items.map((item) => (
          <OrderSummaryItem key={item.id} item={item} />
        ))}
      </div>

      <div className="mt-2 h-px bg-line" />

      <dl className="mt-5 space-y-3.5 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-ash">Subtotal</dt>
          <dd className="font-mono">{currency(subtotal)}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-ash">Estimated shipping</dt>
          <dd className="font-mono">
            {shipping === 0 ? "Free" : currency(shipping)}
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-ash">Taxes ({Math.round(taxRate * 100)}%)</dt>
          <dd className="font-mono">{currency(tax)}</dd>
        </div>
      </dl>

      <div className="mt-6 h-px bg-line" />

      <div className="mt-6 flex items-center justify-between">
        <span className="font-display font-semibold text-base sm:text-lg">
          Grand Total
        </span>
        <span className="font-display font-bold text-lg sm:text-2xl tracking-tightest">
          {currency(total)}
        </span>
      </div>

      <button
        type="button"
        onClick={onPlaceOrder}
        disabled={isSubmitting}
        className="mt-7 sm:mt-8 w-full inline-flex items-center justify-center gap-2 bg-ink text-paper h-12 font-medium text-sm tracking-tight transition-opacity hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Placing Order&hellip;
          </>
        ) : (
          <>
            Place Order
            <ArrowUpRight size={16} />
          </>
        )}
      </button>

      <div className="mt-5 flex items-center gap-2 text-xs text-ash">
        <Lock size={13} className="shrink-0 text-smoke" />
        Encrypted checkout, protected by Trade Assurance
      </div>
    </div>
  );
}