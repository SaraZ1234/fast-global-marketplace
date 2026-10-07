"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { SellerProduct, ProductStatus } from "@/lib/sellerTypes";
import ProductCard from "@/components/seller/ProductCard";
import SearchFilterBar from "@/components/seller/SearchFilterBar";
import EmptyState from "@/components/seller/EmptyState";
import ConfirmModal from "@/components/seller/ConfirmModal";

type BackendProduct = {
  id: number;
  name: string;
  description?: string;
  price: number;
  currency: string;
  stock: number;
  marketplace: "INTERNATIONAL" | "PAKISTAN" | "GULF";
  image?: string;
  status: "Pending" | "Approved" | "Rejected";
  createdAt: string;
  updatedAt: string;
  categoryId: number;
  subCategoryId: number;
};

function mapProduct(product: BackendProduct): SellerProduct {
  const statusMap: Record<
  BackendProduct["status"],
  ProductStatus
> = {
  Pending: "Pending",
  Approved: "Approved",
  Rejected: "Rejected",
};

  return {
    id: String(product.id),
    title: product.name,
    description: product.description || "",
    price: product.price,
    currency: product.currency || "USD",
    condition: "new",
    location: "",
    categoryId: String(product.categoryId),
    subcategoryId: String(product.subCategoryId),
    marketplace: product.marketplace,
    images: product.image ? [product.image] : [],
    status: statusMap[product.status],
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    views: 0,
  };
}

export default function MyProductsPage() {
  const [products, setProducts] = useState<SellerProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<ProductStatus | "all">("all");
  const [pendingDeleteId, setPendingDeleteId] =
    useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await apiRequest("/product/my-products");

        const mappedProducts = data.map(
          (product: BackendProduct) => mapProduct(product)
        );

        setProducts(mappedProducts);
      } catch (error) {
        console.error("Failed to load seller products:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesQuery = p.title
        .toLowerCase()
        .includes(query.toLowerCase());

      const matchesStatus =
        statusFilter === "all"
          ? true
          : p.status === statusFilter;

      return matchesQuery && matchesStatus;
    });
  }, [products, query, statusFilter]);

  async function handleDelete(id: string) {
    try {
      await apiRequest(`/product/${id}`, {
        method: "DELETE",
      });

      setProducts((current) =>
        current.filter((product) => product.id !== id)
      );

      setPendingDeleteId(null);
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-display font-bold text-2xl">
          My Products
        </h1>

        <Link
          href="/seller/products/new"
          className="inline-flex items-center gap-2 bg-ink text-paper px-4 py-2.5 text-xs font-mono uppercase tracking-wider hover:bg-ash transition-colors"
        >
          <PlusCircle size={14} /> Add Product
        </Link>
      </div>

      <SearchFilterBar
        query={query}
        onQueryChange={setQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {loading ? (
        <div className="py-12 text-center text-sm font-mono text-ash">
          Loading products...
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title={
            products.length === 0
              ? "No products yet"
              : "No matching products"
          }
          description={
            products.length === 0
              ? "Add your first listing to start selling."
              : "Try a different search term or status filter."
          }
          actionLabel={
            products.length === 0 ? "Add Product" : undefined
          }
          onAction={
            products.length === 0
              ? () => (window.location.href = "/seller/products/new")
              : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onDelete={setPendingDeleteId}
            />
          ))}
        </div>
      )}

      <ConfirmModal
        open={pendingDeleteId !== null}
        title="Delete Product"
        description="This listing will be permanently removed from all marketplaces. This can't be undone."
        confirmLabel="Delete"
        onCancel={() => setPendingDeleteId(null)}
        onConfirm={() => {
          if (pendingDeleteId) {
            handleDelete(pendingDeleteId);
          }
        }}
      />
    </div>
  );
}