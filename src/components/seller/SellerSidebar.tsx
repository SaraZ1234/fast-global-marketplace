"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Tags,
  UserCircle,
  X,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/seller/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/seller/products", label: "My Products", icon: Package },
  { href: "/seller/products/new", label: "Add Product", icon: PlusCircle },
  // { href: "/seller/categories", label: "Categories", icon: Tags },
  { href: "/seller/profile", label: "Profile", icon: UserCircle },
];

interface SellerSidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export default function SellerSidebar({ mobileOpen, onClose }: SellerSidebarProps) {
  const pathname = usePathname();

  const NavList = (
    <nav className="space-y-1">
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={`flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
              active ? "bg-ink text-paper font-medium" : "text-ash hover:bg-bone hover:text-ink"
            }`}
          >
            <Icon size={16} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-60 shrink-0 border-r border-line bg-paper min-h-screen sticky top-0 p-4">
        <div className="px-3 py-4 mb-2">
          <span className="font-display font-bold text-lg">Seller Hub</span>
        </div>
        {NavList}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/60" onClick={onClose} />
          <div className="absolute left-0 top-0 h-full w-72 max-w-[80%] bg-paper border-r border-ink p-4 shadow-2xl">
            <div className="flex items-center justify-between px-3 py-4 mb-2">
              <span className="font-display font-bold text-lg">Seller Hub</span>
              <button onClick={onClose} aria-label="Close menu" className="text-ash hover:text-ink">
                <X size={20} />
              </button>
            </div>
            {NavList}
          </div>
        </div>
      )}
    </>
  );
}
