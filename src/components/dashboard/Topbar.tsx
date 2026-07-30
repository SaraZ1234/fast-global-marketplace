"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Menu, Bell, ChevronDown, Search, LogOut, Settings2, User, X } from "lucide-react";

const NOTIFICATIONS = [
  { id: 1, title: "Quotation received", detail: "Shenzhen ElectroTech sent a quote for RFQ-1042", time: "12m ago", unread: true },
  { id: 2, title: "Order shipped", detail: "Order #FGM-20458 has left the origin port", time: "1h ago", unread: true },
  { id: 3, title: "New message", detail: "Guangzhou Textile Group replied to your inquiry", time: "3h ago", unread: true },
  { id: 4, title: "Payment confirmed", detail: "Payment for Order #FGM-20402 was confirmed", time: "1d ago", unread: false },
];

export default function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const unreadCount = NOTIFICATIONS.filter((n) => n.unread).length;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close dropdowns on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setNotifOpen(false);
        setProfileOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-paper border-b border-line">
      <div className="flex items-center justify-between gap-2 sm:gap-4 px-3 sm:px-6 lg:px-8 h-16">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <button
            type="button"
            onClick={onMenuClick}
            className="lg:hidden w-9 h-9 flex items-center justify-center border border-line shrink-0"
            aria-label="Open menu"
          >
            <Menu size={17} />
          </button>

          <div className="hidden sm:flex items-center gap-2 max-w-sm w-full border border-line px-3 py-2 bg-bone focus-within:border-ash transition-colors">
            <Search size={15} className="text-smoke shrink-0" />
            <input
              type="text"
              placeholder="Search orders, RFQs, products..."
              className="w-full bg-transparent text-sm placeholder:text-smoke focus:outline-none min-w-0"
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Mobile search toggle */}
          <button
            type="button"
            onClick={() => setMobileSearchOpen((v) => !v)}
            className="sm:hidden w-9 h-9 flex items-center justify-center border border-line hover:border-ash transition-colors shrink-0"
            aria-label={mobileSearchOpen ? "Close search" : "Open search"}
          >
            {mobileSearchOpen ? <X size={16} /> : <Search size={16} />}
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setNotifOpen((v) => !v)}
              className="relative w-9 h-9 flex items-center justify-center border border-line hover:border-ash transition-colors"
              aria-label="Notifications"
            >
              <Bell size={16} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-ink text-paper text-[9px] font-mono flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <>
                {/* Mobile: fixed sheet anchored to viewport, independent of button position */}
                <div className="sm:hidden fixed left-3 right-3 top-[4.25rem] bg-paper border border-line shadow-lg animate-[fadeUp_0.15s_ease-out] z-40">
                  <div className="px-4 py-3 border-b border-line flex items-center justify-between">
                    <p className="font-mono text-xs uppercase tracking-widest2 text-smoke">Notifications</p>
                    <span className="text-[10px] font-mono text-ink">{unreadCount} new</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-line">
                    {NOTIFICATIONS.map((n) => (
                      <div key={n.id} className="px-4 py-3 hover:bg-bone transition-colors cursor-pointer">
                        <div className="flex items-start gap-2">
                          {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-ink mt-1.5 shrink-0" />}
                          <div className={`min-w-0 ${!n.unread ? "pl-3.5" : ""}`}>
                            <p className="text-sm font-medium">{n.title}</p>
                            <p className="text-xs text-smoke mt-0.5 leading-snug">{n.detail}</p>
                            <p className="text-[10px] text-smoke font-mono mt-1">{n.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2.5 border-t border-line text-center">
                    <button type="button" className="text-xs font-mono uppercase tracking-widest2 text-ink hover:text-ash">
                      View all
                    </button>
                  </div>
                </div>

                {/* Desktop/tablet: normal anchored dropdown */}
                <div className="hidden sm:block absolute right-0 mt-2 w-80 bg-paper border border-line shadow-lg animate-[fadeUp_0.15s_ease-out] z-40">
                  <div className="px-4 py-3 border-b border-line flex items-center justify-between">
                    <p className="font-mono text-xs uppercase tracking-widest2 text-smoke">Notifications</p>
                    <span className="text-[10px] font-mono text-ink">{unreadCount} new</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-line">
                    {NOTIFICATIONS.map((n) => (
                      <div key={n.id} className="px-4 py-3 hover:bg-bone transition-colors cursor-pointer">
                        <div className="flex items-start gap-2">
                          {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-ink mt-1.5 shrink-0" />}
                          <div className={`min-w-0 ${!n.unread ? "pl-3.5" : ""}`}>
                            <p className="text-sm font-medium">{n.title}</p>
                            <p className="text-xs text-smoke mt-0.5 leading-snug">{n.detail}</p>
                            <p className="text-[10px] text-smoke font-mono mt-1">{n.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2.5 border-t border-line text-center">
                    <button type="button" className="text-xs font-mono uppercase tracking-widest2 text-ink hover:text-ash">
                      View all
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Profile */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setProfileOpen((v) => !v)}
              className="flex items-center gap-1.5 sm:gap-2 pl-1 pr-1.5 sm:pr-3 py-1 border border-line hover:border-ash transition-colors"
            >
              <span className="w-7 h-7 rounded-full bg-ink text-paper flex items-center justify-center font-display font-semibold text-xs shrink-0">
                AK
              </span>
              <span className="hidden sm:block text-sm font-medium">Ahmed Khan</span>
              <ChevronDown size={14} className="text-smoke shrink-0" />
            </button>

            {profileOpen && (
              <>
                {/* Mobile: fixed sheet anchored to viewport */}
                <div className="sm:hidden fixed left-3 right-3 top-[4.25rem] bg-paper border border-line shadow-lg animate-[fadeUp_0.15s_ease-out] z-40">
                  <div className="px-4 py-3 border-b border-line">
                    <p className="text-sm font-medium">Ahmed Khan</p>
                    <p className="text-xs text-smoke truncate">ahmed.khan@buyerco.com</p>
                  </div>
                  <div className="py-1.5">
                    <Link href="/dashboard/profile" className="flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-bone transition-colors">
                      <User size={14} className="text-smoke" /> Profile
                    </Link>
                    <Link href="/dashboard/settings" className="flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-bone transition-colors">
                      <Settings2 size={14} className="text-smoke" /> Settings
                    </Link>
                  </div>
                  <div className="border-t border-line py-1.5">
                    <button type="button" className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-left hover:bg-bone transition-colors">
                      <LogOut size={14} className="text-smoke" /> Sign out
                    </button>
                  </div>
                </div>

                {/* Desktop/tablet: normal anchored dropdown */}
                <div className="hidden sm:block absolute right-0 mt-2 w-52 bg-paper border border-line shadow-lg animate-[fadeUp_0.15s_ease-out] z-40">
                  <div className="px-4 py-3 border-b border-line">
                    <p className="text-sm font-medium">Ahmed Khan</p>
                    <p className="text-xs text-smoke truncate">ahmed.khan@buyerco.com</p>
                  </div>
                  <div className="py-1.5">
                    <Link href="/dashboard/profile" className="flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-bone transition-colors">
                      <User size={14} className="text-smoke" /> Profile
                    </Link>
                    <Link href="/dashboard/settings" className="flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-bone transition-colors">
                      <Settings2 size={14} className="text-smoke" /> Settings
                    </Link>
                  </div>
                  <div className="border-t border-line py-1.5">
                    <button type="button" className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-left hover:bg-bone transition-colors">
                      <LogOut size={14} className="text-smoke" /> Sign out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile search bar (expands below header on small screens) */}
      <div
        className={`sm:hidden overflow-hidden transition-[grid-template-rows] duration-250 ease-out grid ${
          mobileSearchOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0 overflow-hidden border-t border-line px-3 py-3">
          <div className="flex items-center gap-2 border border-line px-3 py-2.5 bg-bone focus-within:border-ash transition-colors">
            <Search size={15} className="text-smoke shrink-0" />
            <input
              type="text"
              autoFocus={mobileSearchOpen}
              placeholder="Search orders, RFQs, products..."
              className="w-full bg-transparent text-sm placeholder:text-smoke focus:outline-none min-w-0"
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </header>
  );
}