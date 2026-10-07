"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Package,
  CheckCircle2,
  FileEdit,
  Ban,
  PlusCircle,
} from "lucide-react";

import { apiRequest } from "@/lib/api";
import StatusBadge from "@/components/seller/StatusBadge";
import EmptyState from "@/components/seller/EmptyState";

interface SellerProfile {
  id: number;
  companyName: string;
  contactName: string;
  companyEmail: string;
  phone?: string;
  address?: string;
  sellerType?: string;
  description?: string;
  status: string;
  verified: boolean;
  products?: any[];
}

export default function SellerDashboardPage() {
  

  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [seller, setSeller] = useState<SellerProfile | null>(null);
  const [loadingSeller, setLoadingSeller] = useState(true);
  const [sellerError, setSellerError] = useState("");

  useEffect(() => {
    async function loadSeller() {
      try {
        setSellerError("");

        const data = await apiRequest("/vendors/my-profile");

        console.log("REAL SELLER PROFILE:", data);

        setSeller(data);
      } catch (error) {
        console.error("FAILED TO LOAD SELLER:", error);

        setSellerError(
          error instanceof Error
            ? error.message
            : "Unable to load seller profile."
        );
      } finally {
        setLoadingSeller(false);
      }
    }

    loadSeller();
  }, []);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoadingProducts(true);

        const data = await apiRequest("/product/my-products");

        console.log("REAL SELLER PRODUCTS:", data);

        setProducts(data);
      } catch (error) {
        console.error("FAILED TO LOAD SELLER PRODUCTS:", error);
      } finally {
        setLoadingProducts(false);
      }
    }

    loadProducts();
  }, []);

  const stats = [
    {
      label: "Total Products",
      value: products.length,
      icon: Package,
    },
    {
      label: "Active Listings",
      value: products.filter((p) => p.status === "Approved").length,
      icon: CheckCircle2,
    },
    {
      label: "Pending Listings",
      value: products.filter((p) => p.status === "Pending").length,
      icon: FileEdit,
    },
    {
      label: "Rejected Listings",
      value: products.filter((p) => p.status === "Rejected").length,
      icon: Ban,
    },
  ];

  const recentProducts = [...products]
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() -
        new Date(a.updatedAt).getTime()
    )
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Seller information */}
      {/* <div className="border border-line bg-paper p-5">
        {loadingSeller ? (
          <p className="text-sm text-ash">
            Loading seller information...
          </p>
        ) : sellerError ? (
          <div>
            <p className="text-sm text-red-600">{sellerError}</p>
          </div>
        ) : seller ? (
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-ash">
              Welcome back
            </p>

            <h2 className="font-display font-bold text-xl mt-1">
              {seller.companyName}
            </h2>

            <p className="text-sm text-ash mt-1">
              {seller.contactName}
              {seller.companyEmail
                ? ` • ${seller.companyEmail}`
                : ""}
            </p>

            <div className="flex items-center gap-3 mt-3">
              <span className="text-xs font-mono uppercase tracking-wider">
                Status: {seller.status}
              </span>

              {seller.verified && (
                <span className="text-xs font-mono uppercase tracking-wider text-green-600">
                  Verified
                </span>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-ash">
            No seller profile found.
          </p>
        )}
      </div> */}

      {/* Dashboard heading */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-display font-bold text-2xl">
          Dashboard
        </h1>

        <Link
          href="/seller/products/new"
          className="inline-flex items-center gap-2 bg-ink text-paper px-4 py-2.5 text-xs font-mono uppercase tracking-wider hover:bg-ash transition-colors"
        >
          <PlusCircle size={14} />
          Add Product
        </Link>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-line border border-line">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div key={stat.label} className="bg-paper p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-ash">
                  {stat.label}
                </span>

                <Icon size={15} className="text-ash" />
              </div>

              <p className="font-display font-bold text-3xl mt-2">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Categories */}
      {/* <div className="border border-line bg-paper p-5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm">
          <Tags size={16} className="text-ash" />

          <span>
            <strong className="font-semibold">
              {categories.length}
            </strong>{" "}
            categories &bull;{" "}
            <strong className="font-semibold">
              {categories.reduce(
                (sum, c) => sum + c.subcategories.length,
                0
              )}
            </strong>{" "}
            subcategories
          </span>
        </div>

        <Link
          href="/seller/categories"
          className="text-xs font-mono uppercase tracking-wider text-ink hover:underline flex items-center gap-1"
        >
          Manage
          <ArrowRight size={12} />
        </Link>
      </div> */}

      {/* Recent products */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-semibold text-lg">
            Recent Activity
          </h2>

          <Link
            href="/seller/products"
            className="text-xs font-mono uppercase tracking-wider text-ink hover:underline"
          >
            View all
          </Link>
        </div>

        {recentProducts.length === 0 ? (
          <EmptyState
            title="No products yet"
            description="Add your first listing to start selling across our marketplaces."
            actionLabel="Add Product"
            onAction={() =>
              (window.location.href = "/seller/products/new")
            }
          />
        ) : (
          <div className="border border-line divide-y divide-line bg-paper">
            {recentProducts.map((p) => (
              <Link
                key={p.id}
                href={`/seller/products/${p.id}/edit`}
                className="flex items-center gap-4 p-4 hover:bg-bone transition-colors"
              >
                <div className="w-14 h-14 bg-bone border border-line overflow-hidden shrink-0">
                  <img
                    src={p.image || "/placeholder.jpg"}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {p.name}                  </p>

                  <p className="text-xs text-ash font-mono mt-0.5">
                    {p.currency}{" "}
                    {p.price.toLocaleString()}
                  </p>
                </div>

                <StatusBadge status={p.status} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}