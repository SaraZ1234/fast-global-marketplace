"use client";
import Sidebar from "@/components/dashboard/Sidebar";

export default function BuyerDashboardPage() {
  return (
    <div className="flex">
      <Sidebar
        open={true}
        onClose={() => {}}
      />

      <main className="flex-1 p-6">
        <h1>Buyer Dashboard</h1>
      </main>
    </div>
  );
}