"use client";

import {
  getStoredUser,
  clearSession,
  AuthUser,
  getDashboardPath,
} from "@/lib/auth";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight } from "lucide-react";

// const links = [
//   { href: "/industries", label: "Industries" },
//   { href: "/suppliers", label: "Suppliers" },
//   { href: "/services", label: "Services" },
//   { href: "/logistics", label: "Logistics" },
//   { href: "/buyer-dashboard", label: "Buyer Dashboard" },
//   { href: "/pricing", label: "Pricing" },
//   { href: "/about", label: "About" },
//   { href: "/faq", label: "FAQ" },
// ];

const links = [
  { href: "/industries", label: "Industries" },
  { href: "/suppliers", label: "Suppliers" },
  { href: "/services", label: "Services" },
  { href: "/logistics", label: "Logistics" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const dashboardHref = user
    ? getDashboardPath(user.roleId)
    : "/buyer-dashboard";
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const storedUser = getStoredUser();
    setUser(storedUser);
  }, []);

  // Lock body scroll while mobile menu is open
  useEffect(() => {
    if (open) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [open]);

  // Close on Escape, return focus to trigger
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 bg-paper/95 backdrop-blur-md transition-shadow duration-300 ${scrolled ? "shadow-[0_1px_0_0_theme(colors.line)]" : "shadow-none"
        }`}
    >
      <div className="container-x flex items-center justify-between h-20">
        <Link
          href="/"
          className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40 rounded-sm"
        >
          <span className="w-9 h-9 bg-ink flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105">
            <span className="text-paper font-display font-bold text-sm">F</span>
          </span>
          <span className="font-display font-bold text-lg tracking-tightest leading-none">
            FAST
            <span className="block text-[10px] font-mono font-normal tracking-widest2 text-smoke">
              GLOBAL MARKETPLACE
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={`relative text-sm font-medium tracking-wide py-1 transition-colors duration-200 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40 rounded-sm ${active ? "text-ink" : "text-ash"
                  }`}
              >
                {l.label}
                <span
                  className={`absolute -bottom-0.5 left-0 h-[1.5px] bg-ink transition-all duration-300 ease-out ${active ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  style={{ width: active ? "100%" : undefined }}
                />
                <span
                  className={`absolute -bottom-0.5 left-0 h-[1.5px] bg-ink w-0 transition-all duration-300 ease-out ${active ? "" : "hover:w-full"
                    }`}
                  aria-hidden="true"
                />
              </Link>
            );
          })}
        </nav>

        {/* <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/contact"
            className="text-sm font-medium px-4 py-2 border border-ink transition-all duration-200 hover:bg-ink hover:text-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40"
          >
            Request Quotation
          </Link>
          <Link
            href="/sell"
            className="text-sm font-medium px-4 py-2 bg-ink text-paper flex items-center gap-1.5 transition-all duration-200 hover:bg-ash focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40 group"
          >
            Become a Seller
            <ArrowUpRight
              size={15}
              className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div> */}

        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <>
              <Link
                href={dashboardHref}
                className="text-sm font-medium px-4 py-2 border border-ink transition-all duration-200 hover:bg-ink hover:text-paper"
              >
                Dashboard
              </Link>

              <button
                onClick={() => {
                  clearSession();
                  setUser(null);
                  window.location.href = "/";
                }}
                className="text-sm font-medium px-4 py-2 bg-ink text-paper transition-all duration-200 hover:bg-ash"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium px-4 py-2 border border-ink transition-all duration-200 hover:bg-ink hover:text-paper"
              >
                Login
              </Link>

              <Link
                href="/sell"
                className="text-sm font-medium px-4 py-2 bg-ink text-paper flex items-center gap-1.5 transition-all duration-200 hover:bg-ash group"
              >
                Become a Seller
                <ArrowUpRight
                  size={15}
                  className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </>
          )}
        </div>

        <button
          ref={menuButtonRef}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="lg:hidden p-2 -mr-2 transition-colors duration-200 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40 rounded-sm"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="relative block w-6 h-6">
            <Menu
              size={24}
              className={`absolute inset-0 transition-all duration-200 ${open ? "opacity-0 rotate-45 scale-75" : "opacity-100 rotate-0 scale-100"
                }`}
            />
            <X
              size={24}
              className={`absolute inset-0 transition-all duration-200 ${open ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-45 scale-75"
                }`}
            />
          </span>
        </button>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`lg:hidden border-t border-line bg-paper overflow-hidden transition-[grid-template-rows] duration-300 ease-out grid ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr] border-t-0"
          }`}
      >
        <div className="min-h-0 overflow-hidden">
          <nav className="container-x py-6 flex flex-col gap-1">
            {links.map((l, i) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={pathname === l.href ? "page" : undefined}
                className={`py-3 text-base font-medium border-b border-line last:border-none transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40 rounded-sm ${pathname === l.href ? "text-ink" : "text-ash"
                  } ${open ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}`}
                style={{ transitionDelay: open ? `${i * 40}ms` : "0ms" }}
              >
                {l.label}
              </Link>
            ))}
            <div
              className={`flex flex-col gap-3 mt-5 transition-all duration-300 ease-out ${open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                }`}
              style={{
                transitionDelay: open
                  ? `${links.length * 40 + 40}ms`
                  : "0ms",
              }}
            >
              {user ? (
                <>
                  <Link
                    href={dashboardHref}
                    className="text-center text-sm font-medium px-4 py-3 border border-ink transition-colors duration-200 hover:bg-ink hover:text-paper"
                  >
                    Dashboard
                  </Link>

                  <button
                    onClick={() => {
                      clearSession();
                      setUser(null);
                      window.location.href = "/";
                    }}
                    className="text-center text-sm font-medium px-4 py-3 bg-ink text-paper transition-colors duration-200 hover:bg-ash"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-center text-sm font-medium px-4 py-3 border border-ink transition-colors duration-200 hover:bg-ink hover:text-paper"
                  >
                    Login
                  </Link>

                  <Link
                    href="/sell"
                    className="text-center text-sm font-medium px-4 py-3 bg-ink text-paper transition-colors duration-200 hover:bg-ash"
                  >
                    Become a Seller
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}