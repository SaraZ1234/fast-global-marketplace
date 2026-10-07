// lib/sellerData.ts
// Seed / fallback data used the first time the store initializes.
// Replace the functions in sellerStore.tsx with real API calls when
// the backend is ready — the shapes below are the contract to keep.

import { SellerCategory, SellerProduct, SellerProfile } from "./sellerTypes";

export const DEFAULT_CATEGORIES: SellerCategory[] = [
  {
    id: "cat-electronics",
    name: "Electronics",
    subcategories: [
      {
        id: "sub-mobiles",
        name: "Mobiles & Tablets",
        categoryId: "cat-electronics",
      },
      {
        id: "sub-computers",
        name: "Computers & Laptops",
        categoryId: "cat-electronics",
      },
      {
        id: "sub-accessories",
        name: "Accessories",
        categoryId: "cat-electronics",
      },
    ],
  },
  {
    id: "cat-fashion",
    name: "Fashion & Apparel",
    subcategories: [
      { id: "sub-mens", name: "Men's Clothing", categoryId: "cat-fashion" },
      { id: "sub-womens", name: "Women's Clothing", categoryId: "cat-fashion" },
      { id: "sub-footwear", name: "Footwear", categoryId: "cat-fashion" },
    ],
  },
  {
    id: "cat-home",
    name: "Home & Living",
    subcategories: [
      { id: "sub-furniture", name: "Furniture", categoryId: "cat-home" },
      { id: "sub-decor", name: "Decor", categoryId: "cat-home" },
      { id: "sub-appliances", name: "Appliances", categoryId: "cat-home" },
    ],
  },
  {
    id: "cat-industrial",
    name: "Industrial & Business",
    subcategories: [
      { id: "sub-machinery", name: "Machinery", categoryId: "cat-industrial" },
      {
        id: "sub-tools",
        name: "Tools & Equipment",
        categoryId: "cat-industrial",
      },
    ],
  },
];

export const DEFAULT_SELLER_PROFILE: SellerProfile = {
  id: "seller-001",
  businessName: "",
  contactName: "",
  email: "",
  phone: "",
  location: "",
  sellerType: "individual",
  description: "",
  joinedAt: new Date().toISOString(),
};

export const DEFAULT_PRODUCTS: SellerProduct[] = [
  {
    id: "prod-1001",
    title: "Used iPhone 13 Pro — Excellent Condition",
    description:
      "128GB, Sierra Blue, minor wear on the frame, battery health 89%. Includes original box and charger.",
    price: 420,
    currency: "USD",
    condition: "used-like-new",
    location: "Karachi, Pakistan",
    categoryId: "cat-electronics",
    subcategoryId: "sub-mobiles",
    marketplace: "PAKISTAN",
    images: ["https://picsum.photos/seed/iphone-13-pro-listing/800/600"],
    status: "Approved",
    createdAt: "2026-09-10T09:00:00Z",
    updatedAt: "2026-09-10T09:00:00Z",
    views: 214,
  },
  {
    id: "prod-1002",
    title: "Solid Wood Coffee Table",
    description:
      "Handmade sheesham wood coffee table, barely used, moving sale.",
    price: 65,
    currency: "USD",
    condition: "used-good",
    location: "Lahore, Pakistan",
    categoryId: "cat-home",
    subcategoryId: "sub-furniture",
    marketplace: "PAKISTAN",
    images: ["https://picsum.photos/seed/wood-coffee-table-listing/800/600"],
    status: "Pending",
    createdAt: "2026-09-14T12:30:00Z",
    updatedAt: "2026-09-14T12:30:00Z",
    views: 0,
  },
  {
    id: "prod-1003",
    title: "Industrial Bench Grinder 8-Inch",
    description:
      "Heavy-duty bench grinder, lightly used, still under manufacturer warranty.",
    price: 140,
    currency: "USD",
    condition: "used-good",
    location: "Dubai, UAE",
    categoryId: "cat-industrial",
    subcategoryId: "sub-tools",
    marketplace: "GULF",
    images: ["https://picsum.photos/seed/bench-grinder-listing/800/600"],
    status: "Approved",
    createdAt: "2026-08-28T08:00:00Z",
    updatedAt: "2026-09-02T08:00:00Z",
    views: 88,
  },
];
