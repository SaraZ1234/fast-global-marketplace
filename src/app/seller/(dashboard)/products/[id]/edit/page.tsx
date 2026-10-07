"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { apiRequest } from "@/lib/api";
import { SellerProduct } from "@/lib/sellerTypes";
import ProductForm from "@/components/seller/ProductForm";
import EmptyState from "@/components/seller/EmptyState";

type BackendProduct = {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  currency: string;
  stock: number;
  image?: string | null;
  status: "Pending" | "Approved" | "Rejected";
  createdAt: string;
  updatedAt: string;
  categoryId: number;
  subCategoryId: number;
  marketplace: "INTERNATIONAL" | "PAKISTAN" | "GULF" | "CHINESE";
};

function mapProduct(product: BackendProduct): SellerProduct {
  const statusMap: Record<
    BackendProduct["status"],
    SellerProduct["status"]
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

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<SellerProduct | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      try {
        const data = await apiRequest(`/product/${id}`);

        console.log("REAL PRODUCT FOR EDIT:", data);

        if (!data) {
          setProduct(null);
          return;
        }

        setProduct(mapProduct(data));
      } catch (error) {
        console.error("FAILED TO LOAD PRODUCT:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <p className="text-ash text-sm font-mono uppercase tracking-wider">
          Loading product...
        </p>
      </div>
    );
  }

  if (!product) {
    return (
      <EmptyState
        title="Product not found"
        description="This listing may have been deleted or is no longer available."
        actionLabel="Back to My Products"
        onAction={() => (window.location.href = "/seller/products")}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/seller/products"
          className="text-xs font-mono uppercase tracking-wider text-ash hover:text-ink flex items-center gap-1 mb-3"
        >
          <ArrowLeft size={12} />
          Back to My Products
        </Link>

        <h1 className="font-display font-bold text-2xl">
          Edit Product
        </h1>

        <p className="text-ash text-sm mt-1">
          Update details, images, category, or publish status.
        </p>
      </div>

      <ProductForm existingProduct={product} />
    </div>
  );
}