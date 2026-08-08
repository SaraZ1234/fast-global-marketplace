export type ProductStatus = "Active" | "Low Stock" | "Out of Stock" | "Draft";
export type VendorOrderStatus = "New" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
export type InquiryStatus = "Unread" | "Replied" | "Closed";

export interface VendorProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
  status: ProductStatus;
  createdAt: string;
}

export interface VendorOrder {
  id: string;
  buyer: string;
  buyerCountry: string;
  product: string;
  qty: number;
  amount: number;
  status: VendorOrderStatus;
  date: string;
}

export interface VendorInquiry {
  id: string;
  buyer: string;
  company: string;
  subject: string;
  message: string;
  status: InquiryStatus;
  date: string;
}

export interface RevenuePoint {
  label: string;
  value: number;
}

/**
 * NOTE: This dashboard renders from local mock data so the UI is fully
 * functional out of the box. Swap the initial useState values in
 * app/dashboard/vendor/page.tsx for real apiRequest calls, e.g.:
 *   apiRequest("/vendor/products")
 *   apiRequest("/vendor/orders")
 *   apiRequest("/vendor/inquiries")
 *   apiRequest("/vendor/analytics/revenue")
 * following the same pattern used in the buyer Orders page.
 */

export const VENDOR_PRODUCTS: VendorProduct[] = [
  { id: "P-1042", name: "Industrial CNC Lathe Machine", sku: "CNC-LT-450", category: "Machinery", price: 9200, stock: 6, lowStockThreshold: 5, status: "Active", createdAt: "2026-05-02" },
  { id: "P-1039", name: "Hydraulic Press Brake 100T", sku: "HPB-100T", category: "Machinery", price: 14500, stock: 2, lowStockThreshold: 3, status: "Low Stock", createdAt: "2026-04-18" },
  { id: "P-1027", name: "Digital Blood Pressure Monitor", sku: "MED-BPM-22", category: "Medical", price: 34, stock: 850, lowStockThreshold: 100, status: "Active", createdAt: "2026-03-30" },
  { id: "P-1015", name: "N95 Respirator Masks (Box of 50)", sku: "MED-N95-50", category: "Medical", price: 22, stock: 0, lowStockThreshold: 200, status: "Out of Stock", createdAt: "2026-02-11" },
  { id: "P-1004", name: "Bluetooth Wireless Earbuds Pro", sku: "ELEC-BWE-07", category: "Electronics", price: 8.4, stock: 4200, lowStockThreshold: 500, status: "Active", createdAt: "2026-01-25" },
  { id: "P-0998", name: "Smart Home Security Camera 4K", sku: "ELEC-CAM-4K", category: "Electronics", price: 41, stock: 310, lowStockThreshold: 100, status: "Active", createdAt: "2025-12-19" },
  { id: "P-0981", name: "Organic Cotton Crewneck T-Shirt", sku: "FSH-CTN-BLK", category: "Fashion", price: 3.1, stock: 60, lowStockThreshold: 200, status: "Low Stock", createdAt: "2025-11-30" },
  { id: "P-0965", name: "Modular Office Desk System", sku: "HFN-DESK-M2", category: "Home & Furniture", price: 340, stock: 45, lowStockThreshold: 10, status: "Draft", createdAt: "2025-11-02" },
];

export const VENDOR_ORDERS: VendorOrder[] = [
  { id: "FGM-30582", buyer: "Meridian Retail Group", buyerCountry: "United States", product: "Bluetooth Wireless Earbuds Pro", qty: 1200, amount: 10080, status: "New", date: "2026-08-03" },
  { id: "FGM-30571", buyer: "Nordic Home Supply AB", buyerCountry: "Sweden", product: "Modular Office Desk System", qty: 40, amount: 13600, status: "Processing", date: "2026-08-01" },
  { id: "FGM-30549", buyer: "Al Fahad Medical Trading", buyerCountry: "UAE", product: "Digital Blood Pressure Monitor", qty: 2000, amount: 68000, status: "Processing", date: "2026-07-29" },
  { id: "FGM-30512", buyer: "Kestrel Industrial Ltd.", buyerCountry: "United Kingdom", product: "Hydraulic Press Brake 100T", qty: 1, amount: 14500, status: "Shipped", date: "2026-07-24" },
  { id: "FGM-30488", buyer: "Solstice Apparel Co.", buyerCountry: "Canada", product: "Organic Cotton Crewneck T-Shirt", qty: 5000, amount: 15500, status: "Shipped", date: "2026-07-20" },
  { id: "FGM-30450", buyer: "Vantage Security Systems", buyerCountry: "Australia", product: "Smart Home Security Camera 4K", qty: 500, amount: 20500, status: "Delivered", date: "2026-07-12" },
  { id: "FGM-30417", buyer: "Blue Harbor Machinery", buyerCountry: "Germany", product: "Industrial CNC Lathe Machine", qty: 2, amount: 18400, status: "Delivered", date: "2026-07-05" },
  { id: "FGM-30390", buyer: "Riverside Medical Supplies", buyerCountry: "South Africa", product: "N95 Respirator Masks (Box of 50)", qty: 300, amount: 6600, status: "Cancelled", date: "2026-06-28" },
];

export const VENDOR_INQUIRIES: VendorInquiry[] = [
  { id: "INQ-2201", buyer: "Elena Marchetti", company: "Meridian Retail Group", subject: "Bulk pricing for 5,000+ units", message: "We're looking to place a recurring monthly order of Bluetooth Wireless Earbuds Pro. Could you share tiered pricing above 5,000 units and your standard lead time?", status: "Unread", date: "2026-08-04" },
  { id: "INQ-2198", buyer: "Tomás Herrera", company: "Kestrel Industrial Ltd.", subject: "Press brake spare parts availability", message: "Do you stock replacement hydraulic seals for the HPB-100T, and can they ship separately from a full unit order?", status: "Unread", date: "2026-08-03" },
  { id: "INQ-2190", buyer: "Fatima Al-Sayed", company: "Al Fahad Medical Trading", subject: "CE certification documents", message: "Could you send over the CE and ISO 13485 certificates for the Digital Blood Pressure Monitor for our import filing?", status: "Replied", date: "2026-08-01" },
  { id: "INQ-2176", buyer: "Johan Bergström", company: "Nordic Home Supply AB", subject: "Custom desk finish options", message: "Is it possible to get the Modular Office Desk System in a walnut finish instead of the standard oak for orders over 30 units?", status: "Replied", date: "2026-07-27" },
  { id: "INQ-2154", buyer: "Priya Nair", company: "Solstice Apparel Co.", subject: "Sample request before reorder", message: "Before we reorder, could you send two samples of the Organic Cotton Crewneck in size L for quality check?", status: "Closed", date: "2026-07-19" },
];

export const REVENUE_HISTORY: RevenuePoint[] = [
  { label: "Mar", value: 42800 },
  { label: "Apr", value: 51200 },
  { label: "May", value: 47650 },
  { label: "Jun", value: 63400 },
  { label: "Jul", value: 71900 },
  { label: "Aug", value: 26080 },
];

export const ORDER_STATUS_OPTIONS: VendorOrderStatus[] = [
  "New",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export const PRODUCT_STATUS_OPTIONS: ProductStatus[] = [
  "Active",
  "Low Stock",
  "Out of Stock",
  "Draft",
];

export const PRODUCT_STATUS_STYLES: Record<ProductStatus, string> = {
  Active: "text-emerald-700 bg-emerald-50",
  "Low Stock": "text-amber-700 bg-amber-50",
  "Out of Stock": "text-rose-700 bg-rose-50",
  Draft: "text-smoke bg-bone",
};

export const ORDER_STATUS_STYLES: Record<VendorOrderStatus, string> = {
  New: "text-blue-700 bg-blue-50",
  Processing: "text-amber-700 bg-amber-50",
  Shipped: "text-indigo-700 bg-indigo-50",
  Delivered: "text-emerald-700 bg-emerald-50",
  Cancelled: "text-rose-700 bg-rose-50",
};

export const INQUIRY_STATUS_STYLES: Record<InquiryStatus, string> = {
  Unread: "text-blue-700 bg-blue-50",
  Replied: "text-emerald-700 bg-emerald-50",
  Closed: "text-smoke bg-bone",
};