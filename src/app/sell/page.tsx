"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Globe2, ShieldCheck, TrendingUp, Wallet, ArrowRight } from "lucide-react";
import { useSellerStore } from "@/lib/sellerStore";

const BENEFITS = [
  {
    icon: Globe2,
    title: "Reach three marketplaces",
    description: "List once and choose International, Pakistan, or Gulf buyers — or all three.",
  },
  {
    icon: Wallet,
    title: "No listing fees to start",
    description: "Publish your first products without any upfront cost while you get set up.",
  },
  {
    icon: ShieldCheck,
    title: "Verified seller badge",
    description: "Complete your profile to earn a trust badge buyers look for before ordering.",
  },
  {
    icon: TrendingUp,
    title: "Simple dashboard",
    description: "Track views, manage drafts, and see what's sold — all from one place.",
  },
];

export default function BecomeASellerPage() {
  const { isSellerOnboarded, hydrated } = useSellerStore();
  const ctaHref = hydrated && isSellerOnboarded ? "/seller/dashboard" : "/sell/register";

  return (
    <div className="bg-paper text-ink min-h-screen">
      <section className="relative border-b border-line overflow-hidden py-16 sm:py-24">
        <div className="absolute inset-0 grid-paper opacity-[0.035] pointer-events-none" />
        <div className="container-x relative max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-xs font-mono uppercase tracking-widest text-ash"
          >
            Sell on our marketplaces
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="mt-3 font-display font-bold text-4xl sm:text-6xl tracking-tightest"
          >
            Turn your inventory into orders
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mt-4 text-ash text-base sm:text-lg max-w-xl leading-relaxed"
          >
            Set up a seller profile in minutes, list your first product, and choose which of our
            marketplaces should see it.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="mt-8"
          >
            <Link
              href={ctaHref}
              className="inline-flex items-center gap-2 bg-ink text-paper px-6 py-3.5 text-sm font-mono uppercase tracking-wider hover:bg-ash transition-colors"
            >
              Start Selling <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="container-x py-14 sm:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-line border border-line max-w-4xl">
          {BENEFITS.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <div key={benefit.title} className="bg-paper p-6 sm:p-7">
                <Icon size={22} className="text-ink mb-3" />
                <h3 className="font-display font-semibold text-base">{benefit.title}</h3>
                <p className="text-sm text-ash mt-1.5 leading-relaxed">{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="container-x pb-16 sm:pb-24">
        <div className="border border-line bg-bone p-8 sm:p-10 max-w-4xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div>
            <h2 className="font-display font-semibold text-xl">Ready to list your first product?</h2>
            <p className="text-ash text-sm mt-1">It takes about five minutes to set up your seller profile.</p>
          </div>
          <Link
            href={ctaHref}
            className="shrink-0 inline-flex items-center gap-2 bg-ink text-paper px-5 py-3 text-xs font-mono uppercase tracking-wider hover:bg-ash transition-colors"
          >
            Get Started <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
