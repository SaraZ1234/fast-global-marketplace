// lib/sellerTypes.ts
// Shared types for the seller dashboard flow. Structured so mock data
// can be swapped for real API responses without touching UI code.

export type Marketplace =
  | "INTERNATIONAL"
  | "PAKISTAN"
  | "GULF"
  | "CHINESE";

export type ProductStatus = "Pending" | "Approved" | "Rejected";

export type ProductCondition = "new" | "used-like-new" | "used-good" | "refurbished";

export interface SellerCategory {
  id: string;
  name: string;
  subcategories: SellerSubcategory[];
}

export interface SellerSubcategory {
  id: string;
  name: string;
  categoryId: string;
}

export interface SellerProfile {
  id: string;
  businessName: string;
  contactName: string;
  email: string;
  phone: string;
  location: string;
  sellerType: "individual" | "business";
  logoUrl?: string;
  description: string;
  joinedAt: string;
}

export interface SellerProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  condition: ProductCondition;
  location: string;
  categoryId: string;
  subcategoryId: string;
  marketplace: Marketplace;
  images: string[]; // data URLs or remote URLs
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
  views: number;
}

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  text: string;
}
