"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FileText,
  Heart,
  MessageSquare,
  User,
  Settings2,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/buyer-dashboard", icon: LayoutDashboard },
  { label: "Orders", href: "/buyer-dashboard/orders", icon: Package },
  { label: "RFQs", href: "/buyer-dashboard/rfqs", icon: FileText },
  { label: "Wishlist", href: "/buyer-dashboard/wishlist", icon: Heart },
  // { label: "Messages", href: "/buyer-dashboard/messages", icon: MessageSquare },
  { label: "Profile", href: "/buyer-dashboard/profile", icon: User },
  { label: "Settings", href: "/buyer-dashboard/settings", icon: Settings2 },
];

export default function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-ink/50 lg:hidden animate-[fadeIn_0.2s_ease-out]"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 lg:z-auto h-screen lg:h-[100dvh] w-64 shrink-0 bg-ink text-paper flex flex-col transition-transform duration-300 ease-out
        ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="flex items-center justify-between px-5 sm:px-6 py-5 border-b border-paper/15 shrink-0">
          <Link href="/" className="flex items-center gap-3">
            <span className="w-9 h-9 bg-paper flex items-center justify-center shrink-0">
              <span className="text-ink font-display font-bold text-sm">F</span>
            </span>
            <span className="font-display font-bold text-lg tracking-tightest">FAST</span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden w-8 h-8 flex items-center justify-center border border-paper/20"
            aria-label="Close menu"
          >
            <X size={16} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 sm:px-4 py-5 sm:py-6 space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={onClose}
                className={`group flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-paper text-ink"
                    : "text-bone/80 hover:bg-paper/10 hover:text-paper"
                }`}
              >
                <item.icon
                  size={17}
                  className={`shrink-0 transition-transform group-hover:scale-110 ${
                    active ? "text-ink" : "text-bone/70 group-hover:text-paper"
                  }`}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-4 sm:px-5 py-5 border-t border-paper/15 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-paper/10 flex items-center justify-center font-display font-semibold text-sm shrink-0">
              AK
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">Ahmed Khan</p>
              <p className="text-[11px] text-smoke font-mono uppercase tracking-wide truncate">
                Buyer Account
              </p>
            </div>
          </div>
        </div>
      </aside>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  );
}