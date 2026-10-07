"use client";

import { useMemo, useState, useEffect } from "react";
import { apiRequest } from "@/lib/api";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { Eyebrow } from "@/components/UI";
import {
  LayoutGrid,
  Package,
  ClipboardList,
  LineChart,
  MessageSquare,
  ShoppingBag,
  Clock3,
  CheckCircle2,
  Wallet,
  AlertTriangle,
  X,
} from "lucide-react";

import {
  VENDOR_PRODUCTS,
  VENDOR_ORDERS,
  VENDOR_INQUIRIES,
  REVENUE_HISTORY,
  type VendorProduct,
  type VendorOrder,
  type VendorOrderStatus,
  type VendorInquiry,
} from "@/components/vendor/data";
import { StatCard } from "@/components/vendor/VendorUI";
import OverviewTab from "@/components/vendor/OverviewTab";
import ProductsTab from "@/components/vendor/ProductsTab";
import OrdersTab from "@/components/vendor/OrdersTab";
import SalesTab from "@/components/vendor/SalesTab";
import InquiriesTab from "@/components/vendor/InquiriesTab";

/**
 * NOTE: This dashboard is wired to local mock data (see components/vendor/data.ts)
 * so it's fully interactive out of the box. To connect it to your backend, replace
 * the useState initial values below with data loaded via apiRequest, following the
 * same pattern used in the buyer Orders page, e.g.:
 *
 *   const [products, setProducts] = useState<VendorProduct[]>([]);
 *   useEffect(() => {
 *     apiRequest("/vendor/products").then(setProducts).catch(console.error);
 *   }, []);
 */

type TabKey = "overview" | "products" | "orders" | "sales" | "inquiries";

const TABS: { key: TabKey; label: string; icon: typeof LayoutGrid }[] = [
  { key: "overview", label: "Overview", icon: LayoutGrid },
  { key: "products", label: "Products", icon: Package },
  { key: "orders", label: "Orders", icon: ClipboardList },
  { key: "sales", label: "Sales", icon: LineChart },
  { key: "inquiries", label: "Inquiries", icon: MessageSquare },
];

export default function VendorDashboardPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [products, setProducts] = useState<VendorProduct[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<VendorInquiry[]>(VENDOR_INQUIRIES);
  const [alertDismissed, setAlertDismissed] = useState(false);
  const [vendor, setVendor] = useState<any>(null);

  useEffect(() => {

    async function loadVendorProfile() {

      try {

        const data = await apiRequest("/vendors/my-profile");

        console.log("VENDOR PROFILE:", data);

        setVendor(data);


        const formattedProducts = data.products.map((product: any) => ({

          id: product.id.toString(),

          name: product.name,

          sku: product.slug,

          category: "Electronics",

          price: product.price,

          stock: product.stock,

          lowStockThreshold: 5,

          status:
            product.stock <= 5
              ? "Low Stock"
              : "Active",

          createdAt: product.createdAt,

        }));


        setProducts(formattedProducts);

        const vendorOrders = await apiRequest(
          `/order/vendor/${data.id}`
        );

        console.log("VENDOR ORDERS:", vendorOrders);

        setOrders(vendorOrders);


      } catch (error) {

        console.error(
          "Vendor profile loading failed:",
          error
        );

      }

    }


    loadVendorProfile();

  }, []);

  const stats = useMemo(() => {
    const pendingOrders = orders.filter(
      (o) => o.status === "Pending"
    ).length;
    const completedSales = orders.filter((o) => o.status === "Delivered").length;
    const totalEarnings = orders
      .reduce((sum, o) => sum + o.total, 0);
    const lowStockProducts = products.filter(
      (p) => p.status === "Low Stock" || p.status === "Out of Stock"
    );

    return {
      totalProducts: products.length,
      pendingOrders,
      completedSales,
      totalEarnings,
      lowStockProducts,
    };
  }, [products, orders]);

  const recentOrders = useMemo(
    () =>
      [...orders]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        )
        .slice(0, 5),
    [orders]
  );

  async function handleOrderStatusChange(
    id: string,
    status: VendorOrderStatus
  ) {
    try {
      await apiRequest(`/order/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({
          status,
        }),
      });

      setOrders((prev) =>
        prev.map((o) =>
          o.id === id
            ? { ...o, status }
            : o
        )
      );
    } catch (error) {
      console.error(error);
      alert("Failed to update order status");
    }
  }

  async function handleDeleteProduct(id: string) {
    if (
      typeof window !== "undefined" &&
      !window.confirm("Delete this product?")
    ) {
      return;
    }

    try {
      await apiRequest(`/product/${id}`, {
        method: "DELETE",
      });

      setProducts((prev) =>
        prev.filter((p) => p.id !== id)
      );
    } catch (err) {
      console.error(err);
      alert("Failed to delete product.");
    }
  }

  async function handleEditProduct(product: VendorProduct) {
    try {
      const updatedProduct = await apiRequest(
        `/product/${product.id}`,
        {
          method: "PATCH",
          body: JSON.stringify({
            name: product.name,
            price: product.price,
            stock: product.stock,
          }),
        }
      );

      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id
            ? {
              ...p,
              name: updatedProduct.name,
              price: updatedProduct.price,
              stock: updatedProduct.stock,
            }
            : p
        )
      );

    } catch (error) {
      console.error("Update product failed:", error);
      alert("Failed to update product");
    }
  }

  async function handleAddProduct(product: Omit<VendorProduct, "id">) {
    try {

      const payload = {
        name: product.name,
        description: "",
        price: product.price,
        stock: product.stock,
        vendorId: vendor.id,
        categoryId: 1,
        subCategoryId: 1,
      };


      const createdProduct = await apiRequest("/product", {
        method: "POST",
        body: JSON.stringify(payload),
      });


      setProducts((prev) => [
        ...prev,
        {
          id: createdProduct.id.toString(),
          name: createdProduct.name,
          sku: createdProduct.name,
          category: "Electronics",
          price: createdProduct.price,
          stock: createdProduct.stock,
          lowStockThreshold: 5,
          status:
            createdProduct.stock <= 5
              ? "Low Stock"
              : "Active",
          createdAt: createdProduct.createdAt,
        },
      ]);


    } catch (error) {

      console.error("Create product failed:", error);
      alert("Failed to create product");

    }
  }

  function handleInquiryReply(id: string, message: string) {
    console.log("Reply to inquiry", id, message);
    setInquiries((prev) =>
      prev.map((inq) => (inq.id === id ? { ...inq, status: "Replied" } : inq))
    );
  }

  function handleRequestPayout() {
    // apiRequest("/vendor/payouts/request", { method: "POST" })
    console.log("Payout requested");
  }

  return (
  <>
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <Eyebrow>Vendor Dashboard</Eyebrow>
          <h1 className="mt-2 font-display font-bold text-2xl sm:text-3xl tracking-tightest text-ink">
            Manage your business
          </h1>
        </div>
      </div>

      {/* Key stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5 mb-6 sm:mb-8">
        <StatCard
          label="Total Products"
          value={stats.totalProducts.toString()}
          icon={ShoppingBag}
          delay={0}
        />
        <StatCard
          label="Pending Orders"
          value={stats.pendingOrders.toString()}
          icon={Clock3}
          accent="warning"
          delay={40}
        />
        <StatCard
          label="Completed Sales"
          value={stats.completedSales.toString()}
          icon={CheckCircle2}
          delay={80}
        />
        <StatCard
          label="Total Earnings"
          value={`$${stats.totalEarnings.toLocaleString()}`}
          icon={Wallet}
          delay={120}
        />
        <StatCard
          label="Low Stock Alerts"
          value={stats.lowStockProducts.length.toString()}
          icon={AlertTriangle}
          accent={stats.lowStockProducts.length > 0 ? "danger" : "default"}
          delay={160}
        />
      </div>

      {/* Low stock banner */}
      {!alertDismissed && stats.lowStockProducts.length > 0 && (
        <div className="flex items-start gap-3 border border-amber-200 bg-amber-50 px-4 py-3 mb-6 sm:mb-8 animate-[fadeIn_0.25s_ease-out]">
          <AlertTriangle size={16} className="text-amber-700 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 flex-1">
            {stats.lowStockProducts.length} product
            {stats.lowStockProducts.length > 1 ? "s are" : " is"} low or out of stock.{" "}
            <button
              type="button"
              onClick={() => setActiveTab("products")}
              className="font-medium underline underline-offset-4 hover:text-amber-900"
            >
              Review products
            </button>
          </p>
          <button
            type="button"
            onClick={() => setAlertDismissed(true)}
            aria-label="Dismiss alert"
            className="text-amber-700 hover:text-amber-900 shrink-0"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Tab navigation */}
      <div className="flex items-center gap-1 border-b border-line mb-6 sm:mb-8 overflow-x-auto">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`relative inline-flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? "text-ink"
                  : "text-smoke hover:text-ash"
              }`}
            >
              <tab.icon size={15} />
              {tab.label}

              {tab.key === "inquiries" &&
                inquiries.filter((i) => i.status === "Unread").length > 0 && (
                  <span className="w-4 h-4 rounded-full bg-ink text-paper text-[9px] font-mono flex items-center justify-center">
                    {inquiries.filter((i) => i.status === "Unread").length}
                  </span>
                )}

              {isActive && (
                <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-ink" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {activeTab === "overview" && (
        <OverviewTab
          revenueHistory={REVENUE_HISTORY}
          recentOrders={recentOrders}
          lowStockProducts={stats.lowStockProducts}
          onViewAllOrders={() => setActiveTab("orders")}
          onViewAllProducts={() => setActiveTab("products")}
        />
      )}

      {activeTab === "products" && (
        <ProductsTab
          products={products}
          onDelete={handleDeleteProduct}
          onEdit={handleEditProduct}
          onAdd={handleAddProduct}
        />
      )}

      {activeTab === "orders" && (
        <OrdersTab
          orders={orders}
          onStatusChange={handleOrderStatusChange}
        />
      )}

      {activeTab === "sales" && (
        <SalesTab
          orders={orders}
          revenueHistory={REVENUE_HISTORY}
          onRequestPayout={handleRequestPayout}
        />
      )}

      {activeTab === "inquiries" && (
        <InquiriesTab
          inquiries={inquiries}
          onReply={handleInquiryReply}
        />
      )}

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

    </div>
  </>
);
}