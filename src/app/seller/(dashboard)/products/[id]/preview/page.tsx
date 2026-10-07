"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Pencil, MapPin, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useSellerStore } from "@/lib/sellerStore";
import EmptyState from "@/components/seller/EmptyState";
import StatusBadge from "@/components/seller/StatusBadge";
import { apiRequest } from "@/lib/api";

export default function ProductPreviewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { categories, profile } = useSellerStore();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    async function loadProduct() {
      try {
        const data = await apiRequest(`/product/${id}`);

        console.log("REAL PRODUCT FOR PREVIEW:", data);

        setProduct({
          id: String(data.id),
          title: data.name,
          description: data.description || "",
          price: data.price,
          currency: data.currency || "USD",
          condition: "new",
          location: "",
          categoryId: String(data.categoryId),
          subcategoryId: String(data.subCategoryId),
          marketplace: "international",
          images: data.image ? [data.image] : [],
          status:
            data.status === "Approved"
              ? "active"
              : "draft",
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          views: 0,
        });
      } catch (error) {
        console.error("Failed to load product for preview:", error);
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
      <div className="py-12 text-center text-sm font-mono text-ash">
        Loading product...
      </div>
    );
  }

  if (!product) {
    return (
      <EmptyState
        title="Product not found"
        description="This listing may have been deleted."
        actionLabel="Back to My Products"
        onAction={() => (window.location.href = "/seller/products")}
      />
    );
  }

  const category = categories.find((c) => c.id === product.categoryId);
  const subcategory = category?.subcategories.find((s) => s.id === product.subcategoryId);

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Link href="/seller/products" className="text-xs font-mono uppercase tracking-wider text-ash hover:text-ink flex items-center gap-1">
          <ArrowLeft size={12} /> Back to My Products
        </Link>
        <div className="flex items-center gap-2">
          <StatusBadge status={product.status} />
          <button
            onClick={() => router.push(`/seller/products/${product.id}/edit`)}
            className="inline-flex items-center gap-2 border border-line px-3 py-2 text-xs font-mono uppercase tracking-wider hover:border-ink transition-colors"
          >
            <Pencil size={13} /> Edit
          </button>
        </div>
      </div>

      <p className="text-xs font-mono uppercase tracking-widest text-ash">Buyer preview</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border border-line bg-paper p-5 sm:p-7">
        <div>
          <div className="aspect-square w-full bg-bone border border-line overflow-hidden">
            <img
              src={product.images[activeImage] || "/placeholder.jpg"}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 mt-3">
              {product.images.map((img: string, i: number) => (<button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`w-16 h-16 border bg-bone overflow-hidden transition-all ${activeImage === i ? "border-ink ring-1 ring-ink" : "border-line opacity-70"
                  }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-xs font-mono uppercase tracking-wider text-ash">
            {category?.name || "Uncategorized"} {subcategory && `\u2022 ${subcategory.name}`}
          </p>
          <h1 className="font-display font-bold text-2xl leading-tight mt-2">{product.title}</h1>
          <p className="font-display font-bold text-3xl mt-3">
            {product.currency} {product.price.toLocaleString()}
          </p>

          <p className="text-sm text-ink leading-relaxed mt-4 whitespace-pre-line">{product.description}</p>

          <div className="mt-5 flex items-center gap-1.5 text-sm text-ash">
            <MapPin size={14} /> {product.location || "Location not specified"}
          </div>

          <div className="mt-6 p-4 bg-bone border border-line">
            <p className="font-display font-semibold text-sm flex items-center gap-1.5">
              {profile.businessName || profile.contactName || "Seller"}
              <CheckCircle2 size={14} className="text-ink" />
            </p>
            <p className="text-xs text-ash mt-1">{profile.location}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
