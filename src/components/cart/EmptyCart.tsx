"use client";

import { ShoppingCart } from "lucide-react";
import Reveal from "@/components/Reveal";
import { PrimaryButton, GhostButton } from "@/components/UI";
import { ArrowUpRight, ArrowRight } from "lucide-react";

export default function EmptyCart() {
  return (
    <Reveal>
      <div className="border border-line bg-paper py-20 sm:py-28 px-6 text-center">
        <div className="mx-auto h-14 w-14 border border-line grid place-items-center">
          <ShoppingCart size={22} strokeWidth={1.5} className="text-smoke" />
        </div>
        <h2 className="mt-6 font-display font-bold text-xl sm:text-2xl tracking-tightest">
          Your cart is empty.
        </h2>
        <p className="mt-3 text-sm sm:text-base text-ash max-w-sm mx-auto leading-relaxed">
          Items you add from suppliers across our ten industries will show up
          here, ready for checkout.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 sm:gap-4 justify-center">
          <PrimaryButton href="/products" icon={ArrowUpRight}>
            Start Buying
          </PrimaryButton>
          <GhostButton href="/industries" icon={ArrowRight}>
            Browse Categories
          </GhostButton>
        </div>
      </div>
    </Reveal>
  );
}