"use client";

import CategoryManager from "@/components/seller/CategoryManager";

export default function CategoriesPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-display font-bold text-2xl">Categories</h1>
        <p className="text-ash text-sm mt-1">
          Organize how your products are grouped. Deleting or merging a category with products will ask you to
          move them first.
        </p>
      </div>
      <CategoryManager />
    </div>
  );
}
