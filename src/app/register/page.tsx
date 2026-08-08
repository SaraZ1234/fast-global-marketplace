"use client";

import Link from "next/link";
import { ShieldCheck, Globe2, Users } from "lucide-react";
import Reveal from "@/components/Reveal";
import { Eyebrow } from "@/components/UI";
import RegisterForm from "@/components/auth//RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-paper">
      {/* BRAND PANEL — hidden on mobile, mirrors the login page's ink panel */}
      <div className="hidden lg:flex lg:col-span-5 relative bg-ink text-paper overflow-hidden">
        <div className="absolute inset-0 grid-paper opacity-[0.06] pointer-events-none" />
        <div className="relative flex flex-col justify-between p-12 xl:p-16 w-full">
          <Reveal>
            <Link
              href="/"
              className="font-display font-bold text-2xl tracking-tightest"
            >
              FAST
            </Link>
          </Reveal>

          <div>
            <Reveal delay={0.05}>
              <Eyebrow>Global B2B &amp; B2C Trade Network</Eyebrow>
            </Reveal>
            <Reveal delay={0.15}>
              <h1 className="mt-5 font-display font-bold leading-[0.98] tracking-tightest text-4xl xl:text-5xl max-w-md">
                Join 182K+ suppliers and buyers already trading.
              </h1>
            </Reveal>
            <Reveal delay={0.25}>
              <p className="mt-5 text-paper/70 leading-relaxed max-w-sm">
                Create your account to start sourcing from verified
                manufacturers, or open a storefront and sell to buyers
                across 190 countries.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.3}>
            <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-paper/70 border-t border-paper/15 pt-6">
              <div className="flex items-center gap-2">
                <ShieldCheck size={17} className="shrink-0" aria-hidden="true" />
                Trade Assurance
              </div>
              <div className="flex items-center gap-2">
                <Globe2 size={17} className="shrink-0" aria-hidden="true" />
                190 Countries
              </div>
              <div className="flex items-center gap-2">
                <Users size={17} className="shrink-0" aria-hidden="true" />
                182K+ Suppliers
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* FORM PANEL */}
      <div className="col-span-1 lg:col-span-7 flex flex-col">
        {/* Mobile top bar */}
        <div className="flex items-center justify-between px-6 sm:px-10 py-6 lg:hidden border-b border-line">
          <Link
            href="/"
            className="font-display font-bold text-xl tracking-tightest text-ink"
          >
            FAST
          </Link>
          <Link
            href="/"
            className="text-xs font-mono uppercase tracking-widest2 text-smoke hover:text-ink transition-colors"
          >
            Back home
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 sm:px-10 py-10 sm:py-14">
          <div className="w-full max-w-md">
            <Reveal>
              <Eyebrow>Create your account</Eyebrow>
              <h2 className="mt-4 font-display font-bold text-2xl sm:text-3xl tracking-tightest text-ink">
                Get started with FAST
              </h2>
              <p className="mt-3 text-sm sm:text-base text-ash leading-relaxed">
                Free to join. Set up your account in under a minute.
              </p>
            </Reveal>

            <Reveal delay={0.1} className="mt-8 sm:mt-10 block">
              <RegisterForm />
            </Reveal>
          </div>
        </div>

        <div className="hidden lg:block px-10 py-6 border-t border-line text-xs text-smoke">
          © {new Date().getFullYear()} FAST Global Marketplace. All rights reserved.
        </div>
      </div>
    </div>
  );
}