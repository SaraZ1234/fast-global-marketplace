"use client";

import { ArrowUpRight, ArrowRight, ShieldCheck } from "lucide-react";
import { PrimaryButton, GhostButton } from "@/components/UI";

interface CartSummaryProps {
  itemCount: number;
  subtotal: number;
  shipping: number;
  taxRate: number;
  onCheckout?: () => void;
}

const currency = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

export default function CartSummary({
  itemCount,
  subtotal,
  shipping,
  taxRate,
  onCheckout,
}: CartSummaryProps) {
  const tax = subtotal * taxRate;
  const total = subtotal + shipping + tax;

  return (
    <div className="lg:sticky lg:top-24 border border-ink bg-paper p-6 sm:p-7">
      <h2 className="font-display font-bold text-lg sm:text-xl tracking-tightest">
        Order Summary
      </h2>
      <p className="mt-1 text-xs text-smoke font-mono uppercase tracking-widest2">
        {itemCount} {itemCount === 1 ? "item" : "items"}
      </p>

      <dl className="mt-6 space-y-3.5 text-sm">
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

      <div className="mt-7 sm:mt-8 flex flex-col gap-3">
        <PrimaryButton href="/checkout">
          Proceed to Checkout
        </PrimaryButton>
        <GhostButton href="/products" icon={ArrowRight}>
          Continue Shopping
        </GhostButton>
      </div>

      <div className="mt-6 flex items-center gap-2 text-xs text-ash">
        <ShieldCheck size={15} className="shrink-0 text-smoke" />
        Protected by Trade Assurance
      </div>
    </div>
  );
}