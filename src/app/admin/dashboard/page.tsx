"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { Eyebrow } from "@/components/UI";
import { Users, Store, Package, ClipboardList, Wallet } from "lucide-react";

import {
  PLATFORM_STATS,
  REVENUE_HISTORY,
  PLATFORM_USERS,
  PLATFORM_VENDORS,
  PLATFORM_ORDERS,
  type PlatformUser,
  type PlatformVendor,
  type VendorStatus,
} from "@/components/admin/data";
import { StatCard } from "@/components/vendor/VendorUI";
import AdminSidebar, {
  AdminSidebarMobile,
  type AdminSection,
} from "@/components/admin/AdminSidebar";
import OverviewSection from "@/components/admin/OverviewSection";
import UsersSection from "@/components/admin/UsersSection";
import VendorsSection from "@/components/admin/VendorsSection";
import ProductsSection from "@/components/admin/ProductsSection";
import OrdersSection from "@/components/admin/OrdersSection";
import SettingsSection from "@/components/admin/SettingsSection";

/**
 * NOTE: Users, Vendors, and Orders currently run on local mock data
 * (see components/admin/data.ts) so the dashboard is fully interactive
 * out of the box. The Products section is already wired to live endpoints
 * (GET/PATCH /admin/products/...) — see components/admin/ProductsSection.tsx.
 * Follow that same pattern to connect Users/Vendors/Orders, e.g.:
 *   apiRequest("/admin/users")
 *   apiRequest("/admin/vendors")
 *   apiRequest("/admin/orders")
 *   apiRequest("/admin/stats")
 */

export default function AdminDashboardPage() {
  const [activeSection, setActiveSection] = useState<AdminSection>("overview");
  const [users, setUsers] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [pendingProductsCount, setPendingProductsCount] = useState(0);
  const [stats, setStats] = useState({
    users: 0,
    vendors: 0,
    products: 0,
    orders: 0,
    revenue: 0,
    pendingProducts: 0,
    pendingVendors: 0,
  });

  useEffect(() => {
    async function loadDashboard() {
      try {
        const data = await apiRequest("/admin/dashboard");

        console.log("ADMIN DASHBOARD:", data);

        setStats(data);
        setPendingProductsCount(data.pendingProducts);
        const usersData = await apiRequest("/admin/users");
        setUsers(usersData);
        const vendorsData = await apiRequest("/admin/vendors");
        setVendors(vendorsData);
        const ordersData = await apiRequest("/admin/orders");

        const formattedOrders = ordersData.map((order: any) => ({
          id: `FGM-${order.id}`,
          buyer: order.user?.fullName ?? "Unknown Buyer",
          vendor:
            order.items?.[0]?.product?.vendorId === 1
              ? "Global Electronics"
              : "Unknown Vendor",
          amount: order.total,
          status: order.status,
          date: order.createdAt,
        }));

        setOrders(formattedOrders);
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      }
    }

    loadDashboard();
  }, []);

  async function handleToggleUserStatus(id: number) {
    try {
      const user = users.find((u) => u.id === id);

      if (!user) return;

      await apiRequest(`/admin/user/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: !user.status,
        }),
      });


      setUsers((prev) =>
        prev.map((u) =>
          u.id === id
            ? {
              ...u,
              status: !u.status,
            }
            : u
        )
      );

    } catch (error) {
      console.error("Failed to update user status:", error);
    }
  }

  async function handleSetVendorStatus(id: string, status: VendorStatus) {
    try {
      if (status === "Approved") {
        await apiRequest(`/admin/vendor/${id}/approve`, {
          method: "PATCH",
        });
      }

      if (status === "Rejected") {
        await apiRequest(`/admin/vendor/${id}/reject`, {
          method: "PATCH",
        });
      }

      const vendorsData = await apiRequest("/admin/vendors");
      setVendors(vendorsData);
    } catch (error) {
      console.error("Vendor status update failed:", error);
    }
  }

  async function handleUpdateStatus(
    id: number,
    status: string
  ) {
    try {

      await apiRequest(`/admin/order/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          status
        })
      });


      setOrders(prev =>
        prev.map(order =>
          order.id === `FGM-${id}`
            ? {
              ...order,
              status
            }
            : order
        )
      );


    } catch (error) {
      console.error(error);
    }
  }

  return (
    <DashboardShell>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <Eyebrow>Admin Dashboard</Eyebrow>
          <h1 className="mt-2 font-display font-bold text-2xl sm:text-3xl tracking-tightest text-ink">
            Platform overview
          </h1>
        </div>
      </div>

      {/* Key stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5 mb-6 sm:mb-8">
        <StatCard
          label="Total Users"
          value={stats.users.toLocaleString()}
          icon={Users}
          trend={PLATFORM_STATS.trends.users}
          delay={0}
        />
        <StatCard
          label="Vendors"
          value={stats.vendors.toLocaleString()}
          icon={Store}
          trend={PLATFORM_STATS.trends.vendors}
          delay={40}
        />
        <StatCard
          label="Products"
          value={stats.products.toLocaleString()}
          icon={Package}
          trend={PLATFORM_STATS.trends.products}
          delay={80}
        />
        <StatCard
          label="Orders"
          value={stats.orders.toLocaleString()}
          icon={ClipboardList}
          trend={PLATFORM_STATS.trends.orders}
          delay={120}
        />
        <StatCard
          label="Revenue"
          value={`$${(Number(stats.revenue) / 1000).toFixed(1)}K`}
          icon={Wallet}
          trend={PLATFORM_STATS.trends.revenue}
          delay={160}
        />
      </div>

      {/* Mobile section nav */}
      <AdminSidebarMobile
        active={activeSection}
        onChange={setActiveSection}
        pendingProductsCount={pendingProductsCount}
      />

      {/* Sidebar + content */}
      <div className="flex gap-8">
        <AdminSidebar
          active={activeSection}
          onChange={setActiveSection}
          pendingProductsCount={pendingProductsCount}
        />

        <div className="flex-1 min-w-0">
          {activeSection === "overview" && (
            <OverviewSection
              revenueHistory={REVENUE_HISTORY}
              recentOrders={[...orders]
                .sort(
                  (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                )
                .slice(0, 5)}
              pendingProductsCount={pendingProductsCount}
              onViewOrders={() => setActiveSection("orders")}
              onViewProducts={() => setActiveSection("products")}
            />
          )}

          {activeSection === "users" && (
            <UsersSection users={users} onToggleStatus={handleToggleUserStatus} />
          )}

          {activeSection === "vendors" && (
            <VendorsSection vendors={vendors} onSetStatus={handleSetVendorStatus} />
          )}

          {activeSection === "products" && (
            <ProductsSection onCountChange={setPendingProductsCount} />
          )}

          {activeSection === "orders" && <OrdersSection
            orders={orders}
            onUpdateStatus={handleUpdateStatus}
          />}

          {activeSection === "settings" && <SettingsSection />}
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </DashboardShell>
  );
}