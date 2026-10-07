"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { Plus, Pencil, Trash2, GitMerge, ChevronDown, ChevronRight } from "lucide-react";
import { useSellerStore } from "@/lib/sellerStore";
import CategoryModal from "./CategoryModal";
import ConfirmModal from "./ConfirmModal";

type ModalState =
  | { kind: "none" }
  | { kind: "add-category" }
  | { kind: "rename-category"; id: string; name: string }
  | { kind: "add-subcategory"; categoryId: string }
  | { kind: "rename-subcategory"; id: string; name: string }
  | { kind: "delete-category"; id: string; name: string }
  | { kind: "delete-subcategory"; id: string }
  | { kind: "merge-category"; id: string; name: string };

export default function CategoryManager() {
  const {
    categories,
    addCategory,
    renameCategory,
    deleteCategory,
    addSubcategory,
    renameSubcategory,
    deleteSubcategory,
    mergeCategories,
    moveProductsToCategory,
    countProductsInCategory,
    pushToast,
  } = useSellerStore();

  const [backendCategories, setBackendCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [modal, setModal] = useState<ModalState>({ kind: "none" });
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [moveTarget, setMoveTarget] = useState<string>("");
  const [mergeTarget, setMergeTarget] = useState<string>("");

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await apiRequest("/category");

        console.log("REAL CATEGORIES FROM BACKEND:", data);

        setBackendCategories(data);
      } catch (error) {
        console.error("Failed to load categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    }

    loadCategories();
  }, []);

  const closeModal = () => setModal({ kind: "none" });

  const toggleExpand = (id: string) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display font-semibold text-lg">Categories & Subcategories</h2>
        <button
          onClick={() => setModal({ kind: "add-category" })}
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider bg-ink text-paper px-3 py-2 hover:bg-ash transition-colors"
        >
          <Plus size={14} /> Add Category
        </button>
      </div>

      <div className="border border-line divide-y divide-line bg-paper">
        {backendCategories.map((cat) => {
          const productCount = countProductsInCategory(cat.id);
          const isOpen = expanded[cat.id] ?? true;
          return (
            <div key={cat.id}>
              <div className="flex items-center justify-between px-4 py-3">
                <button
                  onClick={() => toggleExpand(cat.id)}
                  className="flex items-center gap-2 text-left flex-1 min-w-0"
                >
                  {isOpen ? <ChevronDown size={15} className="text-ash shrink-0" /> : <ChevronRight size={15} className="text-ash shrink-0" />}
                  <span className="font-display font-semibold text-sm truncate">{cat.name}</span>
                  <span className="text-[11px] font-mono text-ash shrink-0">
                    {cat.subCategories.length} subcats &bull; {productCount} products
                  </span>
                </button>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => setModal({ kind: "add-subcategory", categoryId: cat.id })}
                    title="Add subcategory"
                    className="p-1.5 text-ash hover:text-ink transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                  <button
                    onClick={() => setModal({ kind: "rename-category", id: cat.id, name: cat.name })}
                    title="Rename category"
                    className="p-1.5 text-ash hover:text-ink transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => {
                      setMergeTarget("");
                      setModal({ kind: "merge-category", id: cat.id, name: cat.name });
                    }}
                    title="Merge into another category"
                    className="p-1.5 text-ash hover:text-ink transition-colors"
                  >
                    <GitMerge size={14} />
                  </button>
                  <button
                    onClick={() => {
                      setMoveTarget("");
                      setModal({ kind: "delete-category", id: cat.id, name: cat.name });
                    }}
                    title="Delete category"
                    className="p-1.5 text-ash hover:text-ink transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {isOpen && cat.subCategories.length > 0 && (
                <div className="bg-bone divide-y divide-line">
                  {cat.subCategories.map((sub: { id: string; name: string }) => (
                    <div key={sub.id} className="flex items-center justify-between pl-10 pr-4 py-2">
                      <span className="text-sm text-ink">{sub.name}</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setModal({ kind: "rename-subcategory", id: sub.id, name: sub.name })}
                          className="p-1.5 text-ash hover:text-ink transition-colors"
                          title="Rename subcategory"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => setModal({ kind: "delete-subcategory", id: sub.id })}
                          className="p-1.5 text-ash hover:text-ink transition-colors"
                          title="Delete subcategory"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add category */}
      <CategoryModal
        open={modal.kind === "add-category"}
        title="Add Category"
        placeholder="e.g. Sporting Goods"
        onClose={closeModal}
        onSave={(name) => {
          addCategory(name);
          pushToast("success", `Category "${name}" created.`);
          closeModal();
        }}
      />

      {/* Rename category */}
      <CategoryModal
        open={modal.kind === "rename-category"}
        title="Rename Category"
        initialValue={modal.kind === "rename-category" ? modal.name : ""}
        onClose={closeModal}
        onSave={(name) => {
          if (modal.kind === "rename-category") renameCategory(modal.id, name);
          pushToast("success", "Category renamed.");
          closeModal();
        }}
      />

      {/* Add subcategory */}
      <CategoryModal
        open={modal.kind === "add-subcategory"}
        title="Add Subcategory"
        placeholder="e.g. Cycling Gear"
        onClose={closeModal}
        onSave={(name) => {
          if (modal.kind === "add-subcategory") addSubcategory(modal.categoryId, name);
          pushToast("success", `Subcategory "${name}" added.`);
          closeModal();
        }}
      />

      {/* Rename subcategory */}
      <CategoryModal
        open={modal.kind === "rename-subcategory"}
        title="Rename Subcategory"
        initialValue={modal.kind === "rename-subcategory" ? modal.name : ""}
        onClose={closeModal}
        onSave={(name) => {
          if (modal.kind === "rename-subcategory") renameSubcategory(modal.id, name);
          pushToast("success", "Subcategory renamed.");
          closeModal();
        }}
      />

      {/* Delete subcategory */}
      <ConfirmModal
        open={modal.kind === "delete-subcategory"}
        title="Delete Subcategory"
        description="Products in this subcategory will keep their category but lose this subcategory tag. This can't be undone."
        confirmLabel="Delete"
        onCancel={closeModal}
        onConfirm={() => {
          if (modal.kind === "delete-subcategory") deleteSubcategory(modal.id);
          pushToast("success", "Subcategory deleted.");
          closeModal();
        }}
      />

      {/* Delete category — require moving products first if any exist */}
      <ConfirmModal
        open={modal.kind === "delete-category"}
        title="Delete Category"
        description={
          modal.kind === "delete-category" && countProductsInCategory(modal.id) > 0
            ? `This category has ${countProductsInCategory(modal.id)} product(s). Choose where to move them before deleting.`
            : "This category has no products. It can be safely deleted."
        }
        confirmLabel="Delete Category"
        onCancel={closeModal}
        onConfirm={() => {
          if (modal.kind !== "delete-category") return;
          const count = countProductsInCategory(modal.id);
          if (count > 0) {
            if (!moveTarget) {
              pushToast("error", "Select a destination category for the existing products first.");
              return;
            }
            const destination = categories.find((c) => c.id === moveTarget);
            moveProductsToCategory(modal.id, moveTarget, destination?.subcategories[0]?.id || "");
          }
          deleteCategory(modal.id);
          pushToast("success", `"${modal.name}" deleted.`);
          closeModal();
        }}
      >
        {modal.kind === "delete-category" && countProductsInCategory(modal.id) > 0 && (
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-ash">Move products to</label>
            <select
              value={moveTarget}
              onChange={(e) => setMoveTarget(e.target.value)}
              className="w-full mt-1.5 px-3 py-2 bg-bone border border-line text-sm focus:outline-none focus:border-ink"
            >
              <option value="">Select category&hellip;</option>
              {categories
                .filter((c) => c.id !== modal.id)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </select>
          </div>
        )}
      </ConfirmModal>

      {/* Merge category */}
      <ConfirmModal
        open={modal.kind === "merge-category"}
        title="Merge Category"
        description={
          modal.kind === "merge-category"
            ? `Merge "${modal.name}" into another category. Its products and subcategories will move over, and "${modal.name}" will be removed.`
            : ""
        }
        confirmLabel="Merge"
        destructive={false}
        onCancel={closeModal}
        onConfirm={() => {
          if (modal.kind !== "merge-category") return;
          if (!mergeTarget) {
            pushToast("error", "Select a destination category to merge into.");
            return;
          }
          mergeCategories(modal.id, mergeTarget);
          pushToast("success", "Categories merged.");
          closeModal();
        }}
      >
        {modal.kind === "merge-category" && (
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-ash">Merge into</label>
            <select
              value={mergeTarget}
              onChange={(e) => setMergeTarget(e.target.value)}
              className="w-full mt-1.5 px-3 py-2 bg-bone border border-line text-sm focus:outline-none focus:border-ink"
            >
              <option value="">Select category&hellip;</option>
              {categories
                .filter((c) => c.id !== modal.id)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </select>
          </div>
        )}
      </ConfirmModal>
    </div>
  );
}
