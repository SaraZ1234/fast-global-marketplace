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
import { Menu, X, ArrowUpRight, ChevronDown } from "lucide-react";

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

const marketplaces = [
  {
    href: "/international-products",
    label: "International Products",
  },
  {
    href: "/pakistan-products",
    label: "Pakistan Products",
  },
  {
    href: "/gulf-products",
    label: "Gulf Products",
  },
  {
    href: "/chinese-products",
    label: "Chinese Products",
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [marketplaceOpen, setMarketplaceOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const marketplaceRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const dashboardHref = user
    ? getDashboardPath(user.roleId)
    : "/buyer-dashboard";

  const marketplaceActive = marketplaces.some(
    (m) => pathname === m.href || pathname.startsWith(`${m.href}/`)
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setMarketplaceOpen(false);
  }, [pathname]);

  useEffect(() => {
    const storedUser = getStoredUser();
    setUser(storedUser);
  }, []);

  // Close mobile menu automatically when the viewport grows to desktop
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
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

  // Marketplaces dropdown: close on outside click / Escape
  useEffect(() => {
    if (!marketplaceOpen) return;
    const onPointer = (e: MouseEvent | TouchEvent) => {
      if (
        marketplaceRef.current &&
        !marketplaceRef.current.contains(e.target as Node)
      ) {
        setMarketplaceOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMarketplaceOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("touchstart", onPointer, { passive: true });
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("touchstart", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [marketplaceOpen]);

  return (
    <header
      className={`sticky top-0 z-50 bg-paper/95 backdrop-blur-md transition-shadow duration-300 ${scrolled ? "shadow-[0_1px_0_0_theme(colors.line)]" : "shadow-none"
        }`}
    >
      <div className="container-x flex items-center justify-between gap-4 h-16 sm:h-20 transition-[height] duration-300">
        <Link
          href="/"
          className="flex items-center gap-2.5 sm:gap-3 group min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40 rounded-sm"
        >
          <span className="w-9 h-9 bg-ink flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100">
            <span className="text-paper font-display font-bold text-sm">F</span>
          </span>
          <span className="font-display font-bold text-lg tracking-tightest leading-none whitespace-nowrap">
            FAST
            <span className="block text-[9px] sm:text-[10px] font-mono font-normal tracking-widest2 text-smoke">
              GLOBAL MARKETPLACE
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-8">
          {links.map((l) => {
            const active =
              pathname === l.href || pathname.startsWith(`${l.href}/`);

            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={`group relative whitespace-nowrap text-sm font-medium tracking-wide py-1 transition-colors duration-200 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40 rounded-sm ${active ? "text-ink font-semibold" : "text-ash"
                  }`}
              >
                {l.label}

                <span
                  aria-hidden="true"
                  className={`absolute -bottom-1 left-0 h-[2px] bg-ink transition-all duration-300 ease-out motion-reduce:transition-none ${active ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                />
              </Link>
            );
          })}

          {/* Marketplaces dropdown */}
          <div
            ref={marketplaceRef}
            className="relative"
            onMouseEnter={() => setMarketplaceOpen(true)}
            onMouseLeave={() => setMarketplaceOpen(false)}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                setMarketplaceOpen(false);
              }
            }}
          >
            <button
              type="button"
              aria-haspopup="true"
              aria-expanded={marketplaceOpen}
              aria-controls="marketplaces-menu"
              className={`group relative flex items-center gap-1 whitespace-nowrap text-sm font-medium tracking-wide py-1 transition-colors duration-200 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40 rounded-sm ${marketplaceActive ? "text-ink font-semibold" : "text-ash"
                }`}
              onClick={() => setMarketplaceOpen((v) => !v)}
            >
              Marketplaces
              <ChevronDown
                size={14}
                aria-hidden="true"
                className={`transition-transform duration-300 ease-out motion-reduce:transition-none ${marketplaceOpen ? "rotate-180" : "rotate-0"
                  }`}
              />
              <span
                aria-hidden="true"
                className={`absolute -bottom-1 left-0 h-[2px] bg-ink transition-all duration-300 ease-out motion-reduce:transition-none ${marketplaceActive ? "w-full" : "w-0 group-hover:w-full"
                  }`}
              />
            </button>

            <div
              id="marketplaces-menu"
              className={`absolute right-0 top-full pt-3 origin-top-right transition-all duration-200 ease-out motion-reduce:transition-none ${marketplaceOpen
                  ? "opacity-100 visible translate-y-0 scale-100 pointer-events-auto"
                  : "opacity-0 invisible -translate-y-1 scale-95 pointer-events-none"
                }`}
            >
              <div className="w-56 border border-line bg-paper shadow-lg overflow-hidden">
                {marketplaces.map((marketplace) => {
                  const active =
                    pathname === marketplace.href ||
                    pathname.startsWith(`${marketplace.href}/`);

                  return (
                    <Link
                      key={marketplace.href}
                      href={marketplace.href}
                      aria-current={active ? "page" : undefined}
                      className={`block px-4 py-3 text-sm transition-colors duration-200 hover:bg-ink hover:text-paper focus-visible:outline-none focus-visible:bg-ink focus-visible:text-paper ${active
                          ? "bg-ink text-paper font-semibold"
                          : "text-ash"
                        }`}
                    >
                      {marketplace.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
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

        <div className="hidden lg:flex items-center gap-3 shrink-0">
          {user ? (
            <>
              <Link
                href={dashboardHref}
                className="whitespace-nowrap text-sm font-medium px-4 py-2 border border-ink transition-all duration-200 hover:bg-ink hover:text-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40"
              >
                Dashboard
              </Link>

              <button
                onClick={() => {
                  clearSession();
                  setUser(null);
                  window.location.href = "/";
                }}
                className="whitespace-nowrap text-sm font-medium px-4 py-2 bg-ink text-paper transition-all duration-200 hover:bg-ash focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="whitespace-nowrap text-sm font-medium px-4 py-2 border border-ink transition-all duration-200 hover:bg-ink hover:text-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40"
              >
                Login
              </Link>

              <Link
                href="/sell"
                className="whitespace-nowrap text-sm font-medium px-4 py-2 bg-ink text-paper flex items-center gap-1.5 transition-all duration-200 hover:bg-ash group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40"
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
          className="lg:hidden p-2 -mr-2 shrink-0 transition-colors duration-200 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40 rounded-sm"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="relative block w-6 h-6">
            <Menu
              size={24}
              className={`absolute inset-0 transition-all duration-200 motion-reduce:transition-none ${open ? "opacity-0 rotate-45 scale-75" : "opacity-100 rotate-0 scale-100"
                }`}
            />
            <X
              size={24}
              className={`absolute inset-0 transition-all duration-200 motion-reduce:transition-none ${open ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-45 scale-75"
                }`}
            />
          </span>
        </button>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        aria-hidden={!open}
        className={`lg:hidden border-t border-line bg-paper overflow-hidden transition-[grid-template-rows,visibility] duration-300 ease-out motion-reduce:transition-none grid ${open
            ? "grid-rows-[1fr] visible"
            : "grid-rows-[0fr] border-t-0 invisible"
          }`}
      >
        <div className="min-h-0 overflow-hidden">
          <nav
            aria-label="Mobile"
            className="container-x py-6 flex flex-col gap-1 max-h-[calc(100dvh-4rem)] sm:max-h-[calc(100dvh-5rem)] overflow-y-auto overscroll-contain"
          >
            {links.map((l, i) => {
              const active =
                pathname === l.href || pathname.startsWith(`${l.href}/`);

              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  tabIndex={open ? 0 : -1}
                  className={`py-3 text-base font-medium border-b border-line transition-all duration-300 ease-out motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40 rounded-sm ${active ? "text-ink font-semibold" : "text-ash"
                    } ${open
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-2"
                    }`}
                  style={{ transitionDelay: open ? `${i * 40}ms` : "0ms" }}
                >
                  {l.label}
                </Link>
              );
            })}

            {/* Marketplaces (mobile) */}
            <div
              className={`pt-4 pb-1 transition-all duration-300 ease-out motion-reduce:transition-none ${open ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
                }`}
              style={{
                transitionDelay: open ? `${links.length * 40}ms` : "0ms",
              }}
            >
              <span className="block pb-1 text-xs font-mono tracking-widest2 text-smoke">
                MARKETPLACES
              </span>
              {marketplaces.map((marketplace) => {
                const active =
                  pathname === marketplace.href ||
                  pathname.startsWith(`${marketplace.href}/`);

                return (
                  <Link
                    key={marketplace.href}
                    href={marketplace.href}
                    aria-current={active ? "page" : undefined}
                    tabIndex={open ? 0 : -1}
                    className={`block py-3 text-base font-medium border-b border-line last:border-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40 rounded-sm transition-colors duration-200 hover:text-ink ${active ? "text-ink font-semibold" : "text-ash"
                      }`}
                  >
                    {marketplace.label}
                  </Link>
                );
              })}
            </div>

            <div
              className={`flex flex-col gap-3 mt-5 transition-all duration-300 ease-out motion-reduce:transition-none ${open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                }`}
              style={{
                transitionDelay: open
                  ? `${(links.length + 1) * 40 + 40}ms`
                  : "0ms",
              }}
            >
              {user ? (
                <>
                  <Link
                    href={dashboardHref}
                    tabIndex={open ? 0 : -1}
                    className="text-center text-sm font-medium px-4 py-3 border border-ink transition-colors duration-200 hover:bg-ink hover:text-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40"
                  >
                    Dashboard
                  </Link>

                  <button
                    tabIndex={open ? 0 : -1}
                    onClick={() => {
                      clearSession();
                      setUser(null);
                      window.location.href = "/";
                    }}
                    className="text-center text-sm font-medium px-4 py-3 bg-ink text-paper transition-colors duration-200 hover:bg-ash focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    tabIndex={open ? 0 : -1}
                    className="text-center text-sm font-medium px-4 py-3 border border-ink transition-colors duration-200 hover:bg-ink hover:text-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40"
                  >
                    Login
                  </Link>

                  <Link
                    href="/sell"
                    tabIndex={open ? 0 : -1}
                    className="text-center text-sm font-medium px-4 py-3 bg-ink text-paper transition-colors duration-200 hover:bg-ash focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40"
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