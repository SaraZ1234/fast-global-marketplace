"use client";

import ProductForm from "@/components/seller/ProductForm";

export default function AddProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl">Add Product</h1>
        <p className="text-ash text-sm mt-1">Fill in the details below, then publish or save as a draft.</p>
      </div>
      <ProductForm />
    </div>
  );
}
