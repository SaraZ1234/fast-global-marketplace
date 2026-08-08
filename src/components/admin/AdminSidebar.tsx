"use client";

import {
  LayoutGrid,
  Users,
  Store,
  Package,
  ClipboardList,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type AdminSection =
  | "overview"
  | "users"
  | "vendors"
  | "products"
  | "orders"
  | "settings";

interface NavItem {
  key: AdminSection;
  label: string;
  icon: LucideIcon;
}

const NAV_ITEMS: NavItem[] = [
  { key: "overview", label: "Overview", icon: LayoutGrid },
  { key: "users", label: "Users", icon: Users },
  { key: "vendors", label: "Vendors", icon: Store },
  { key: "products", label: "Products", icon: Package },
  { key: "orders", label: "Orders", icon: ClipboardList },
  { key: "settings", label: "Settings", icon: Settings },
];

interface AdminSidebarProps {
  active: AdminSection;
  onChange: (section: AdminSection) => void;
  pendingProductsCount?: number;
}

/** Fixed vertical nav — shown on lg+ screens. */
export default function AdminSidebar({
  active,
  onChange,
  pendingProductsCount = 0,
}: AdminSidebarProps) {
  return (
    <nav className="hidden lg:flex lg:flex-col w-56 shrink-0 border-r border-line pr-5">
      <p className="font-mono text-[11px] uppercase tracking-widest2 text-smoke mb-4 px-3">
        Admin Panel
      </p>
      <ul className="space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.key;
          const showBadge = item.key === "products" && pendingProductsCount > 0;
          return (
            <li key={item.key}>
              <button
                type="button"
                onClick={() => onChange(item.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-ink text-paper"
                    : "text-ash hover:bg-bone hover:text-ink"
                }`}
              >
                <item.icon size={16} className="shrink-0" />
                <span className="flex-1 text-left">{item.label}</span>
                {showBadge && (
                  <span
                    className={`w-4.5 h-4.5 min-w-[18px] px-1 rounded-full text-[10px] font-mono flex items-center justify-center ${
                      isActive ? "bg-paper text-ink" : "bg-ink text-paper"
                    }`}
                  >
                    {pendingProductsCount}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Horizontal scrolling nav — shown below lg. */
export function AdminSidebarMobile({
  active,
  onChange,
  pendingProductsCount = 0,
}: AdminSidebarProps) {
  return (
    <nav className="lg:hidden -mx-4 sm:-mx-6 px-4 sm:px-6 mb-6 overflow-x-auto">
      <ul className="flex gap-2 w-max">
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.key;
          const showBadge = item.key === "products" && pendingProductsCount > 0;
          return (
            <li key={item.key}>
              <button
                type="button"
                onClick={() => onChange(item.key)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium border whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-ink text-paper border-ink"
                    : "text-ash border-line hover:border-ash"
                }`}
              >
                <item.icon size={15} className="shrink-0" />
                {item.label}
                {showBadge && (
                  <span
                    className={`w-4 h-4 rounded-full text-[9px] font-mono flex items-center justify-center ${
                      isActive ? "bg-paper text-ink" : "bg-ink text-paper"
                    }`}
                  >
                    {pendingProductsCount}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}