"use client";

import { useMemo, useState } from "react";
import { Search, Plus, Pencil, Trash2, Package, X } from "lucide-react";
import {
  PRODUCT_STATUS_OPTIONS,
  PRODUCT_STATUS_STYLES,
  type VendorProduct,
  type ProductStatus,
} from "./data";
import { StatusBadge, EmptyState, TabSectionHeading } from "./VendorUI";

interface ProductsTabProps {
  products: VendorProduct[];
  onDelete: (id: string) => void;
  onEdit: (product: VendorProduct) => void;
  onAdd: (product: Omit<VendorProduct, "id">) => void;
}

export default function ProductsTab({ products, onDelete, onEdit, onAdd }: ProductsTabProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // Dynamic Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<VendorProduct | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    price: 0,
    stock: 0,
    status: PRODUCT_STATUS_OPTIONS[0] || "Active",
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      const matchesSearch =
        !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "All" || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [products, search, statusFilter]);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      sku: "",
      category: "",
      price: 0,
      stock: 0,
      status: PRODUCT_STATUS_OPTIONS[0] || "Active",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: VendorProduct) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku,
      category: product.category,
      price: product.price,
      stock: product.stock,
      status: product.status,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingProduct) {
      onEdit({ ...editingProduct, ...formData });
    } else {
      onAdd({
        ...formData,
        createdAt: new Date().toISOString(),
        lowStockThreshold: 10,
      });
    }

    handleCloseModal();
  };

  return (
    <div className="animate-[fadeIn_0.25s_ease-out]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <TabSectionHeading
          title="Products"
          description={`${products.length} listings across your catalog`}
        />
        <div className="flex gap-3">
          <div className="flex items-center gap-2 border border-line px-3 py-2 bg-paper flex-1 sm:flex-none sm:w-56 focus-within:border-ash transition-colors">
            <Search size={15} className="text-smoke shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or SKU..."
              className="w-full bg-transparent text-sm placeholder:text-smoke focus:outline-none min-w-0"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-line bg-paper px-3 py-2 text-sm text-ink focus:outline-none focus:border-ash transition-colors"
          >
            <option value="All">All statuses</option>
            {PRODUCT_STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 bg-ink text-paper px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity shrink-0"
          >
            <Plus size={15} />
            <span className="hidden sm:inline">Add Product</span>
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No products found"
          description="Try a different search term or status filter, or add a new listing."
          action={{ label: "Add a product", onClick: handleOpenAdd }}
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block border border-line overflow-hidden">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-bone border-b border-line">
                  <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-widest2 text-smoke">
                    Product
                  </th>
                  <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-widest2 text-smoke">
                    SKU
                  </th>
                  <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-widest2 text-smoke">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-widest2 text-smoke">
                    Price
                  </th>
                  <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-widest2 text-smoke">
                    Stock
                  </th>
                  <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-widest2 text-smoke">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right font-mono text-[11px] uppercase tracking-widest2 text-smoke">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product, i) => (
                  <tr
                    key={product.id}
                    className="border-b border-line last:border-0 hover:bg-bone transition-colors animate-[fadeUp_0.3s_ease-out_backwards]"
                    style={{ animationDelay: `${i * 30}ms` }}
                  >
                    <td className="px-4 py-3.5 font-medium text-ink max-w-[280px] truncate">
                      {product.name}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-xs text-ash whitespace-nowrap">
                      {product.sku}
                    </td>
                    <td className="px-4 py-3.5 text-ash whitespace-nowrap">{product.category}</td>
                    <td className="px-4 py-3.5 font-medium text-ink whitespace-nowrap">
                      ${product.price.toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5 text-ash whitespace-nowrap">
                      {product.stock.toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={product.status} styles={PRODUCT_STATUS_STYLES} />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(product)}
                          aria-label={`Edit ${product.name}`}
                          className="w-8 h-8 flex items-center justify-center hover:bg-paper border border-transparent hover:border-line transition-colors"
                        >
                          <Pencil size={14} className="text-ash" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(product.id)}
                          aria-label={`Delete ${product.name}`}
                          className="w-8 h-8 flex items-center justify-center hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors"
                        >
                          <Trash2 size={14} className="text-rose-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {filtered.map((product, i) => (
              <div
                key={product.id}
                className="border border-line p-4 bg-paper animate-[fadeUp_0.3s_ease-out_backwards]"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <p className="font-mono text-xs text-smoke">{product.sku}</p>
                  <StatusBadge status={product.status} styles={PRODUCT_STATUS_STYLES} />
                </div>
                <p className="font-display font-semibold text-sm tracking-tight text-ink mb-1">
                  {product.name}
                </p>
                <p className="text-xs text-ash mb-3">{product.category}</p>
                <div className="flex items-center justify-between text-sm mb-3">
                  <span className="text-ash">Stock: {product.stock.toLocaleString()}</span>
                  <span className="font-medium text-ink">${product.price.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 pt-3 border-t border-line">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(product)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 border border-line py-2 text-xs font-medium hover:border-ash transition-colors"
                  >
                    <Pencil size={13} /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(product.id)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 border border-line py-2 text-xs font-medium text-rose-600 hover:border-rose-300 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Dynamic Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 animate-[fadeIn_0.15s_ease-out]">
          <div className="bg-paper border border-line w-full max-w-md p-6 shadow-xl relative animate-[fadeUp_0.2s_ease-out]">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-semibold text-lg text-ink">
                {editingProduct ? "Edit Product" : "Add Product"}
              </h3>
              <button
                type="button"
                onClick={handleCloseModal}
                className="text-ash hover:text-ink transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-smoke mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Minimalist Watch"
                  className="w-full border border-line bg-paper px-3 py-2 text-sm text-ink focus:outline-none focus:border-ash transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-smoke mb-1">
                    SKU
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="SKU-1001"
                    className="w-full border border-line bg-paper px-3 py-2 text-sm text-ink focus:outline-none focus:border-ash transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-smoke mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Accessories"
                    className="w-full border border-line bg-paper px-3 py-2 text-sm text-ink focus:outline-none focus:border-ash transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-smoke mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full border border-line bg-paper px-3 py-2 text-sm text-ink focus:outline-none focus:border-ash transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-smoke mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: parseInt(e.target.value, 10) || 0 })
                    }
                    className="w-full border border-line bg-paper px-3 py-2 text-sm text-ink focus:outline-none focus:border-ash transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-smoke mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as ProductStatus,
                    })
                  }
                  className="w-full border border-line bg-paper px-3 py-2 text-sm text-ink focus:outline-none focus:border-ash transition-colors"
                >
                  {PRODUCT_STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-line mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="border border-line px-4 py-2 text-sm font-medium hover:border-ash transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-ink text-paper px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  {editingProduct ? "Save Changes" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}