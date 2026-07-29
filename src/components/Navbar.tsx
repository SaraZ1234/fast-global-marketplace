"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight } from "lucide-react";

const links = [
  { href: "/industries", label: "Industries" },
  { href: "/suppliers", label: "Suppliers" },
  { href: "/services", label: "Services" },
  { href: "/logistics", label: "Logistics" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 bg-paper/95 backdrop-blur transition-shadow ${
        scrolled ? "shadow-[0_1px_0_0_#0A0A0A]" : ""
      }`}
    >
      <div className="container-x flex items-center justify-between h-20">
        <Link href="/" className="flex items-center gap-3 group">
          <span className="w-9 h-9 bg-ink flex items-center justify-center">
            <span className="text-paper font-display font-bold text-sm">F</span>
          </span>
          <span className="font-display font-bold text-lg tracking-tightest leading-none">
            FAST
            <span className="block text-[10px] font-mono font-normal tracking-widest2 text-smoke">
              GLOBAL MARKETPLACE
            </span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm font-medium tracking-wide transition-colors hover:text-ink ${
                pathname === l.href ? "text-ink" : "text-ash"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/contact"
            className="text-sm font-medium px-4 py-2 border border-ink hover:bg-ink hover:text-paper transition-colors"
          >
            Request Quotation
          </Link>
          <Link
            href="/sell"
            className="text-sm font-medium px-4 py-2 bg-ink text-paper flex items-center gap-1.5 hover:bg-ash transition-colors"
          >
            Become a Seller <ArrowUpRight size={15} />
          </Link>
        </div>

        <button
          aria-label={open ? "Close menu" : "Open menu"}
          className="lg:hidden p-2"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-line bg-paper">
          <nav className="container-x py-6 flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="py-3 text-base font-medium border-b border-line last:border-none"
              >
                {l.label}
              </Link>
            ))}
            <div className="flex flex-col gap-3 mt-5">
              <Link
                href="/contact"
                className="text-center text-sm font-medium px-4 py-3 border border-ink"
              >
                Request Quotation
              </Link>
              <Link
                href="/sell"
                className="text-center text-sm font-medium px-4 py-3 bg-ink text-paper"
              >
                Become a Seller
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
