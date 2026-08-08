"use client";

import { CheckCircle2, ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import { GhostButton, PrimaryButton } from "@/components/UI";

export default function OrderConfirmation({ orderId }: { orderId: string }) {
  return (
    <Reveal>
      <div className="border border-line bg-paper py-16 sm:py-24 px-6 text-center max-w-2xl mx-auto">
        <div className="mx-auto h-14 w-14 border border-ink grid place-items-center">
          <CheckCircle2 size={24} strokeWidth={1.5} className="text-ink" />
        </div>
        <h2 className="mt-6 font-display font-bold text-2xl sm:text-3xl tracking-tightest">
          Order placed.
        </h2>
        <p className="mt-3 text-sm sm:text-base text-ash leading-relaxed">
          Your order <span className="font-mono text-ink">#{orderId}</span> has
          been sent to the supplier. A confirmation with tracking details will
          be emailed to you shortly.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 sm:gap-4 justify-center">
          <PrimaryButton href="/orders" icon={ArrowRight}>
            View Order Status
          </PrimaryButton>
          <GhostButton href="/products" icon={ArrowRight}>
            Continue Shopping
          </GhostButton>
        </div>
      </div>
    </Reveal>
  );
}