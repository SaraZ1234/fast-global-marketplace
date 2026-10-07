"use client";

// lib/sellerStore.tsx
//
// Single source of truth for the seller flow's client-side state.
// Everything is persisted to localStorage as a stand-in for a backend.
// To wire up a real API: replace the body of each action below with a
// fetch() call and keep the same function signatures — nothing in the
// pages or components needs to change.

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  SellerCategory,
  SellerProduct,
  SellerProfile,
  SellerSubcategory,
  ToastMessage,
} from "./sellerTypes";
import {
  DEFAULT_CATEGORIES,
  DEFAULT_PRODUCTS,
  DEFAULT_SELLER_PROFILE,
} from "./sellerData";

const STORAGE_KEY = "seller-flow-state-v1";

interface PersistedState {
  categories: SellerCategory[];
  products: SellerProduct[];
  profile: SellerProfile;
  isSellerOnboarded: boolean;
}

function loadState(): PersistedState {
  if (typeof window === "undefined") {
    return {
      categories: DEFAULT_CATEGORIES,
      products: DEFAULT_PRODUCTS,
      profile: DEFAULT_SELLER_PROFILE,
      isSellerOnboarded: false,
    };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) throw new Error("empty");
    return JSON.parse(raw) as PersistedState;
  } catch {
    return {
      categories: DEFAULT_CATEGORIES,
      products: DEFAULT_PRODUCTS,
      profile: DEFAULT_SELLER_PROFILE,
      isSellerOnboarded: false,
    };
  }
}

function saveState(state: PersistedState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage unavailable (private mode, quota) — fail silently, state
    // still lives in memory for the rest of the session
  }
}

function genId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

interface SellerStoreValue {
  categories: SellerCategory[];
  products: SellerProduct[];
  profile: SellerProfile;
  isSellerOnboarded: boolean;
  toasts: ToastMessage[];
  hydrated: boolean;

  // profile
  completeOnboarding: (profile: Omit<SellerProfile, "id" | "joinedAt">) => void;
  updateProfile: (patch: Partial<SellerProfile>) => void;

  // products
  addProduct: (product: Omit<SellerProduct, "id" | "createdAt" | "updatedAt" | "views">) => SellerProduct;
  updateProduct: (id: string, patch: Partial<SellerProduct>) => void;
  deleteProduct: (id: string) => void;
  setProductStatus: (id: string, status: SellerProduct["status"]) => void;
  getProduct: (id: string) => SellerProduct | undefined;

  // categories
  addCategory: (name: string) => void;
  renameCategory: (id: string, name: string) => void;
  deleteCategory: (id: string) => void;
  addSubcategory: (categoryId: string, name: string) => void;
  renameSubcategory: (id: string, name: string) => void;
  deleteSubcategory: (id: string) => void;
  mergeCategories: (sourceId: string, destinationId: string) => void;
  moveProductsToCategory: (fromCategoryId: string, toCategoryId: string, toSubcategoryId: string) => void;
  countProductsInCategory: (categoryId: string) => number;

  // toasts
  pushToast: (type: ToastMessage["type"], text: string) => void;
  dismissToast: (id: string) => void;
}

const SellerStoreContext = createContext<SellerStoreValue | null>(null);

export function SellerStoreProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<SellerCategory[]>(DEFAULT_CATEGORIES);
  const [products, setProducts] = useState<SellerProduct[]>(DEFAULT_PRODUCTS);
  const [profile, setProfile] = useState<SellerProfile>(DEFAULT_SELLER_PROFILE);
  const [isSellerOnboarded, setIsSellerOnboarded] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // hydrate from localStorage once on mount (client only)
  useEffect(() => {
    const loaded = loadState();
    setCategories(loaded.categories);
    setProducts(loaded.products);
    setProfile(loaded.profile);
    setIsSellerOnboarded(loaded.isSellerOnboarded);
    setHydrated(true);
  }, []);

  // persist on every change, after hydration
  useEffect(() => {
    if (!hydrated) return;
    saveState({ categories, products, profile, isSellerOnboarded });
  }, [categories, products, profile, isSellerOnboarded, hydrated]);

  const pushToast = useCallback((type: ToastMessage["type"], text: string) => {
    const toast: ToastMessage = { id: genId("toast"), type, text };
    setToasts((prev) => [...prev, toast]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toast.id));
    }, 3500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const completeOnboarding = useCallback(
    (data: Omit<SellerProfile, "id" | "joinedAt">) => {
      setProfile((prev) => ({ ...prev, ...data, id: prev.id || genId("seller") , joinedAt: prev.joinedAt || new Date().toISOString() }));
      setIsSellerOnboarded(true);
    },
    []
  );

  const updateProfile = useCallback((patch: Partial<SellerProfile>) => {
    setProfile((prev) => ({ ...prev, ...patch }));
  }, []);

  const addProduct = useCallback(
    (product: Omit<SellerProduct, "id" | "createdAt" | "updatedAt" | "views">) => {
      const now = new Date().toISOString();
      const created: SellerProduct = {
        ...product,
        id: genId("prod"),
        createdAt: now,
        updatedAt: now,
        views: 0,
      };
      setProducts((prev) => [created, ...prev]);
      return created;
    },
    []
  );

  const updateProduct = useCallback((id: string, patch: Partial<SellerProduct>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...patch, updatedAt: new Date().toISOString() } : p))
    );
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const setProductStatus = useCallback((id: string, status: SellerProduct["status"]) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status, updatedAt: new Date().toISOString() } : p))
    );
  }, []);

  const getProduct = useCallback((id: string) => products.find((p) => p.id === id), [products]);

  const addCategory = useCallback((name: string) => {
    setCategories((prev) => [...prev, { id: genId("cat"), name, subcategories: [] }]);
  }, []);

  const renameCategory = useCallback((id: string, name: string) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, name } : c)));
  }, []);

  const countProductsInCategory = useCallback(
    (categoryId: string) => products.filter((p) => p.categoryId === categoryId).length,
    [products]
  );

  const moveProductsToCategory = useCallback(
    (fromCategoryId: string, toCategoryId: string, toSubcategoryId: string) => {
      setProducts((prev) =>
        prev.map((p) =>
          p.categoryId === fromCategoryId
            ? { ...p, categoryId: toCategoryId, subcategoryId: toSubcategoryId, updatedAt: new Date().toISOString() }
            : p
        )
      );
    },
    []
  );

  const deleteCategory = useCallback((id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const addSubcategory = useCallback((categoryId: string, name: string) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === categoryId
          ? { ...c, subcategories: [...c.subcategories, { id: genId("sub"), name, categoryId }] }
          : c
      )
    );
  }, []);

  const renameSubcategory = useCallback((id: string, name: string) => {
    setCategories((prev) =>
      prev.map((c) => ({
        ...c,
        subcategories: c.subcategories.map((s) => (s.id === id ? { ...s, name } : s)),
      }))
    );
  }, []);

  const deleteSubcategory = useCallback((id: string) => {
    setCategories((prev) =>
      prev.map((c) => ({ ...c, subcategories: c.subcategories.filter((s) => s.id !== id) }))
    );
  }, []);

  const mergeCategories = useCallback(
    (sourceId: string, destinationId: string) => {
      setCategories((prev) => {
        const source = prev.find((c) => c.id === sourceId);
        const destination = prev.find((c) => c.id === destinationId);
        if (!source || !destination) return prev;

        // merge subcategories (dedupe by name), remap products, drop source
        const mergedSubcategories: SellerSubcategory[] = [...destination.subcategories];
        const nameToSubId = new Map(destination.subcategories.map((s) => [s.name.toLowerCase(), s.id]));

        source.subcategories.forEach((s) => {
          const existingId = nameToSubId.get(s.name.toLowerCase());
          if (!existingId) {
            const newSub: SellerSubcategory = { ...s, categoryId: destinationId };
            mergedSubcategories.push(newSub);
            nameToSubId.set(s.name.toLowerCase(), s.id);
          }
        });

        setProducts((prevProducts) =>
          prevProducts.map((p) =>
            p.categoryId === sourceId
              ? { ...p, categoryId: destinationId, updatedAt: new Date().toISOString() }
              : p
          )
        );

        return prev
          .filter((c) => c.id !== sourceId)
          .map((c) => (c.id === destinationId ? { ...c, subcategories: mergedSubcategories } : c));
      });
    },
    []
  );

  const value: SellerStoreValue = useMemo(
    () => ({
      categories,
      products,
      profile,
      isSellerOnboarded,
      toasts,
      hydrated,
      completeOnboarding,
      updateProfile,
      addProduct,
      updateProduct,
      deleteProduct,
      setProductStatus,
      getProduct,
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
      dismissToast,
    }),
    [
      categories,
      products,
      profile,
      isSellerOnboarded,
      toasts,
      hydrated,
      completeOnboarding,
      updateProfile,
      addProduct,
      updateProduct,
      deleteProduct,
      setProductStatus,
      getProduct,
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
      dismissToast,
    ]
  );

  return <SellerStoreContext.Provider value={value}>{children}</SellerStoreContext.Provider>;
}

export function useSellerStore() {
  const ctx = useContext(SellerStoreContext);
  if (!ctx) throw new Error("useSellerStore must be used within a SellerStoreProvider");
  return ctx;
}
