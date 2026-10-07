"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSellerStore } from "@/lib/sellerStore";
import { getStoredToken } from "@/lib/auth";
import SellerSidebar from "@/components/seller/SellerSidebar";
import SellerHeader from "@/components/seller/SellerHeader";

export default function SellerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { hydrated } = useSellerStore();
  const router = useRouter();

  useEffect(() => {
    if (!hydrated) return;

    const token = getStoredToken();

    if (!token) {
      router.replace("/seller/login");
    }
  }, [hydrated, router]);

  if (!hydrated) {
    return <div className="min-h-screen bg-paper" />;
  }

  if (!getStoredToken()) {
    return <div className="min-h-screen bg-paper" />;
  }

  return (
    <div className="flex bg-paper text-ink min-h-screen">
      <SellerSidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      <div className="flex-1 min-w-0">
        <SellerHeader onMenuClick={() => setMobileOpen(true)} />

        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}