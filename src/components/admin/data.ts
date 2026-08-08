export type UserStatus = "Active" | "Suspended";
export type VendorStatus =
  | "Approved"
  | "Pending"
  | "Rejected";
export type AdminOrderStatus =
  | "Pending"
  | "Pending Payment"
  | "In Production"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export interface PlatformUser {
  id: string;
  name: string;
  email: string;
  ordersCount: number;
  joinedAt: string;
  status: UserStatus;
}

export interface PlatformVendor {
  id: string;
  companyName: string;
  companyEmail: string;
  products: unknown[];
  createdAt: string;
  status: VendorStatus;
}

export interface PlatformOrder {
  id: string;
  buyer: string;
  vendor: string;
  amount: number;
  status: AdminOrderStatus;
  date: string;
}

export interface RevenuePoint {
  label: string;
  value: number;
}

/**
 * NOTE: These are display/demo numbers and mock lists so the dashboard is
 * fully functional out of the box. Replace with real apiRequest calls, e.g.
 *   apiRequest("/admin/stats")
 *   apiRequest("/admin/users")
 *   apiRequest("/admin/vendors")
 *   apiRequest("/admin/orders")
 * following the same pattern used in the Products section (which is already
 * wired to live endpoints) and the buyer Orders page.
 */

export const PLATFORM_STATS = {
  totalUsers: 8412,
  totalVendors: 1284,
  totalProducts: 9624,
  totalOrders: 3150,
  totalRevenue: 2438750,
  trends: {
    users: { value: "4.2% this month", positive: true },
    vendors: { value: "2.8% this month", positive: true },
    products: { value: "1.1% this month", positive: true },
    orders: { value: "6.5% this month", positive: true },
    revenue: { value: "9.3% this month", positive: true },
  },
};

export const REVENUE_HISTORY: RevenuePoint[] = [
  { label: "Mar", value: 312000 },
  { label: "Apr", value: 348500 },
  { label: "May", value: 361200 },
  { label: "Jun", value: 402800 },
  { label: "Jul", value: 447900 },
  { label: "Aug", value: 165350 },
];

export const PLATFORM_USERS: PlatformUser[] = [
  {
    id: "U-8821",
    name: "Elena Marchetti",
    email: "elena.m@meridianretail.com",
    ordersCount: 14,
    joinedAt: "2026-01-12",
    status: "Active",
  },
  {
    id: "U-8790",
    name: "Tomás Herrera",
    email: "tomas@kestrelindustrial.co.uk",
    ordersCount: 6,
    joinedAt: "2025-12-28",
    status: "Active",
  },
  {
    id: "U-8755",
    name: "Fatima Al-Sayed",
    email: "f.alsayed@alfahadmedical.ae",
    ordersCount: 22,
    joinedAt: "2025-11-15",
    status: "Active",
  },
  {
    id: "U-8710",
    name: "Johan Bergström",
    email: "johan.b@nordichome.se",
    ordersCount: 3,
    joinedAt: "2025-10-30",
    status: "Suspended",
  },
  {
    id: "U-8667",
    name: "Priya Nair",
    email: "priya.nair@solsticeapparel.ca",
    ordersCount: 9,
    joinedAt: "2025-09-19",
    status: "Active",
  },
  {
    id: "U-8602",
    name: "Marcus Bellweather",
    email: "mbellweather@vantagesecurity.au",
    ordersCount: 1,
    joinedAt: "2025-08-04",
    status: "Active",
  },
  {
    id: "U-8544",
    name: "Ingrid Solheim",
    email: "ingrid@blueharbormachinery.de",
    ordersCount: 17,
    joinedAt: "2025-06-22",
    status: "Active",
  },
  {
    id: "U-8501",
    name: "David Okafor",
    email: "d.okafor@riversidemedical.co.za",
    ordersCount: 5,
    joinedAt: "2025-05-10",
    status: "Suspended",
  },
];

export const PLATFORM_VENDORS: PlatformVendor[] = [
  {
    id: "V-2201",
    companyName: "Qingdao Machinery Corp.",
    companyEmail: "sales@qingdaomachinery.cn",
    products: [],
    createdAt: "2025-02-14",
    status: "Approved",
  },
  {
    id: "V-2198",
    companyName: "Guangzhou Textile Group",
    companyEmail: "trade@gztextile.cn",
    products: [],
    createdAt: "2025-03-02",
    status: "Approved",
  },
  {
    id: "V-2185",
    companyName: "Shenzhen ElectroTech Co.",
    companyEmail: "export@szelectrotech.cn",
    products: [],
    createdAt: "2025-04-19",
    status: "Approved",
  },
  {
    id: "V-2172",
    companyName: "Yiwu Home Furnishings",
    companyEmail: "b2b@yiwuhome.cn",
    products: [],
    createdAt: "2025-05-27",
    status: "Pending",
  },
  {
    id: "V-2160",
    companyName: "Ningbo Auto Parts Ltd.",
    companyEmail: "sales@ningboauto.cn",
    products: [],
    createdAt: "2025-06-11",
    status: "Approved",
  },
  {
    id: "V-2144",
    companyName: "Jiangsu Solar Tech",
    companyEmail: "info@jiangsusolar.cn",
    products: [],
    createdAt: "2025-07-08",
    status: "Pending",
  },
  {
    id: "V-2130",
    companyName: "Guangzhou Cosmetics Co.",
    companyEmail: "oem@gzcosmetics.cn",
    products: [],
    createdAt: "2025-07-30",
    status: "Rejected",
  },
];


export const PLATFORM_ORDERS: PlatformOrder[] = [
  {
    id: "FGM-30582",
    buyer: "Meridian Retail Group",
    vendor: "Shenzhen ElectroTech Co.",
    amount: 10080,
    status: "Pending Payment",
    date: "2026-08-03",
  },
  {
    id: "FGM-30571",
    buyer: "Nordic Home Supply AB",
    vendor: "Yiwu Home Furnishings",
    amount: 13600,
    status: "In Production",
    date: "2026-08-01",
  },
  {
    id: "FGM-30549",
    buyer: "Al Fahad Medical Trading",
    vendor: "Riverside Medical Supplies",
    amount: 68000,
    status: "In Production",
    date: "2026-07-29",
  },
  {
    id: "FGM-30512",
    buyer: "Kestrel Industrial Ltd.",
    vendor: "Qingdao Machinery Corp.",
    amount: 14500,
    status: "Shipped",
    date: "2026-07-24",
  },
  {
    id: "FGM-30488",
    buyer: "Solstice Apparel Co.",
    vendor: "Guangzhou Textile Group",
    amount: 15500,
    status: "Shipped",
    date: "2026-07-20",
  },
  {
    id: "FGM-30450",
    buyer: "Vantage Security Systems",
    vendor: "Shenzhen ElectroTech Co.",
    amount: 20500,
    status: "Delivered",
    date: "2026-07-12",
  },
  {
    id: "FGM-30417",
    buyer: "Blue Harbor Machinery",
    vendor: "Qingdao Machinery Corp.",
    amount: 18400,
    status: "Delivered",
    date: "2026-07-05",
  },
  {
    id: "FGM-30390",
    buyer: "Riverside Medical Supplies",
    vendor: "Guangzhou Cosmetics Co.",
    amount: 6600,
    status: "Cancelled",
    date: "2026-06-28",
  },
];

export const USER_STATUS_STYLES: Record<UserStatus, string> = {
  Active: "text-emerald-700 bg-emerald-50",
  Suspended: "text-rose-700 bg-rose-50",
};

export const VENDOR_STATUS_STYLES: Record<VendorStatus, string> = {
  Approved: "text-emerald-700 bg-emerald-50",
  Pending: "text-amber-700 bg-amber-50",
  Rejected: "text-rose-700 bg-rose-50",
};

export const ORDER_STATUS_STYLES: Record<AdminOrderStatus, string> = {
  Pending: "text-yellow-700 bg-yellow-50",
  "Pending Payment": "text-rose-700 bg-rose-50",
  "In Production": "text-amber-700 bg-amber-50",
  Shipped: "text-blue-700 bg-blue-50",
  Delivered: "text-emerald-700 bg-emerald-50",
  Cancelled: "text-smoke bg-bone",
};
