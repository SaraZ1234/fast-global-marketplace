"use client";
import Sidebar from "@/components/dashboard/Sidebar";

export default function BuyerDashboardPage() {
  return (
    <div className="flex bg-bone min-h-screen">
      <Sidebar
        open={true}
        onClose={() => {}}
      />

      <main className="flex-1 p-6">
        <h1 className="font-display font-bold text-2xl tracking-tightest">Buyer Dashboard</h1>
      </main>
    </div>
  );
}