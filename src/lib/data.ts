export type Industry = {
  slug: string;
  name: string;
  code: string;
  blurb: string;
  items: string[];
};

export const industries: Industry[] = [
  {
    slug: "electronics",
    code: "01",
    name: "Electronics",
    blurb: "Consumer devices and components sourced from certified factories.",
    items: ["Mobile Phones", "Laptops", "Tablets", "Smart Watches", "Accessories", "Cameras", "Gaming"],
  },
  {
    slug: "fashion",
    code: "02",
    name: "Fashion",
    blurb: "Apparel, footwear, and accessories across every category and season.",
    items: ["Men's Clothing", "Women's Clothing", "Kids", "Shoes", "Bags", "Jewelry", "Watches"],
  },
  {
    slug: "home-furniture",
    code: "03",
    name: "Home & Furniture",
    blurb: "Furnishing and decor for residential and commercial interiors.",
    items: ["Bedroom", "Living Room", "Office Furniture", "Kitchen", "Decoration", "Outdoor Furniture"],
  },
  {
    slug: "machinery",
    code: "04",
    name: "Machinery",
    blurb: "Industrial and production equipment for manufacturers of scale.",
    items: ["Industrial Equipment", "Construction", "Agriculture", "Manufacturing", "Food Processing", "Textile Machinery"],
  },
  {
    slug: "automotive",
    code: "05",
    name: "Automotive",
    blurb: "Vehicles, parts, and components for fleets and workshops.",
    items: ["Cars", "Bikes", "Spare Parts", "Tires", "Batteries", "Accessories"],
  },
  {
    slug: "beauty",
    code: "06",
    name: "Beauty",
    blurb: "Cosmetics and personal care from bulk to private label.",
    items: ["Cosmetics", "Makeup", "Skincare", "Haircare", "Salon Equipment"],
  },
  {
    slug: "medical",
    code: "07",
    name: "Medical",
    blurb: "Clinical and laboratory supply for healthcare providers.",
    items: ["Hospital Equipment", "Laboratory Equipment", "Surgical Instruments", "PPE", "Medical Devices"],
  },
  {
    slug: "agriculture",
    code: "08",
    name: "Agriculture",
    blurb: "Inputs and equipment for growers and livestock operations.",
    items: ["Seeds", "Fertilizers", "Irrigation", "Livestock", "Animal Feed"],
  },
  {
    slug: "food-beverage",
    code: "09",
    name: "Food & Beverage",
    blurb: "Fresh, frozen, and packaged goods for distributors worldwide.",
    items: ["Frozen Foods", "Organic Foods", "Fruits", "Vegetables", "Snacks", "Beverages"],
  },
  {
    slug: "construction",
    code: "10",
    name: "Construction",
    blurb: "Raw materials and finishings for builders and contractors.",
    items: ["Cement", "Steel", "Wood", "Tiles", "Paint", "Building Materials"],
  },
];

export const buyerFeatures = [
  "Millions of Products",
  "Verified Suppliers",
  "Request for Quotation (RFQ)",
  "Price Comparison",
  "Bulk Purchasing",
  "MOQ Support",
  "Trade Assurance",
  "Secure Payments",
  "Global Shipping",
  "Live Chat",
  "Multiple Languages",
  "Multiple Currencies",
];

export const sellerFeatures = [
  "Company Profile",
  "Business Verification",
  "Product Management",
  "Bulk Upload",
  "Inventory Management",
  "Order Management",
  "Customer Management",
  "Analytics Dashboard",
  "Advertising Tools",
  "Featured Listings",
  "Premium Membership",
  "Global Exposure",
];

export const marketplaceFeatures = [

  "Product Search",

  "Smart Recommendations",

  "Voice Search",

  "Image Search",

  "Product Comparison",

  "Reviews & Ratings",

  "Wishlist",

  "Coupons",

  "Flash Sales",

  "Auctions",

  "Negotiation",

  "Live Streaming",

  "Chat System",

];

export const logisticsItems = [
  "International Shipping",
  "Local Delivery",
  "Freight Forwarding",
  "Air Cargo",
  "Sea Cargo",
  "Warehousing",
  "Customs Support",
  "Shipment Tracking",
];

export const paymentMethods = [
  "Credit Cards",
  "Debit Cards",
  "Bank Transfer",
  "Digital Wallets",
  "Escrow",
  "Buy Now Pay Later",
  "International Payments",
];

export const trustItems = [
  "Verified Businesses",
  "Identity Verification",
  "SSL Encryption",
  "Fraud Detection",
  "Buyer Protection",
  "Seller Protection",
  "Secure Checkout",
  "GDPR Compliance",
  "KYC Verification",
];

export type Plan = {
  name: string;
  code: string;
  price: string;
  cadence: string;
  description: string;
  features: string[];
  highlighted?: boolean;
};

export const plans: Plan[] = [
  {
    name: "Free",
    code: "FR-00",
    price: "$0",
    cadence: "/month",
    description: "For sellers testing the waters with a small catalog.",
    features: ["Limited Products", "Basic Store", "Standard Support"],
  },
  {
    name: "Professional",
    code: "PR-01",
    price: "$149",
    cadence: "/month",
    description: "For growing suppliers who need visibility and data.",
    features: ["Unlimited Products", "Featured Listings", "Analytics", "Priority Support"],
    highlighted: true,
  },
  {
    name: "Enterprise",
    code: "EN-02",
    price: "Custom",
    cadence: "",
    description: "For manufacturers operating at global scale.",
    features: ["Dedicated Manager", "API Access", "Advanced Marketing", "Multi-user Access", "Custom Branding"],
  },
];

export const businessServices = [
  "Product Sourcing",
  "OEM Manufacturing",
  "ODM Manufacturing",
  "Private Label",
  "White Label",
  "Inspection Services",
  "Quality Assurance",
  "Logistics Support",
  "Customs Clearance",
  "International Trade Consulting",
];

export const advertisingSolutions = [
  "Sponsored Products",
  "Homepage Banner",
  "Category Ads",
  "Search Ads",
  "Display Ads",
  "Video Ads",
  "Email Marketing",
  "Push Notifications",
];

export const supportChannels = [
  "24/7 Live Chat",
  "Email Support",
  "Phone Support",
  "Ticket System",
  "Knowledge Base",
  "FAQ Center",
  "Dispute Resolution",
];

export const whyChooseUs = [

  "Millions of Products",

  "Thousands of Verified Suppliers",

  "Global Shipping",

  "Competitive Prices",

  "Fast Delivery",

  "Safe Payments",

  "Secure Trading",

  "Professional Customer Support",

  "Business Growth Tools",

  "Powerful Marketplace",

];

export const faqs = [
  {
    q: "How do I become a seller?",
    a: "Register, complete verification, create your company profile, and start listing products.",
  },
  {
    q: "How can I request a quotation?",
    a: "Use the RFQ system to receive offers from multiple suppliers.",
  },
  {
    q: "Are suppliers verified?",
    a: "Yes, eligible suppliers can complete business verification and KYC to earn verification badges.",
  },
  {
    q: "Can I buy wholesale and retail?",
    a: "Yes, the marketplace supports both B2B wholesale and B2C retail transactions.",
  },
  {
    q: "Which regions do you ship to?",
    a: "Our logistics network covers air, sea, and land freight to more than 190 countries and territories.",
  },
  {
    q: "How does Trade Assurance protect me?",
    a: "Orders placed through Trade Assurance are covered for on-time shipment and product quality as agreed with the supplier.",
  },
];

export type Product = {
  slug: string;
  code: string;
  name: string;
  industry: string;
  price: string;
  moq: string;
  leadTime: string;
  supplierSlug: string;
  description: string;
  specs: { label: string; value: string }[];
};

export const products: Product[] = [
  {
    slug: "industrial-cnc-lathe-machine",
    code: "MC-2201",
    name: "Industrial CNC Lathe Machine",
    industry: "Machinery",
    price: "$8,200 – $14,500",
    moq: "1 unit",
    leadTime: "25–35 days",
    supplierSlug: "ironline-machinery",
    description:
      "A precision CNC lathe built for continuous production runs, suited to metal and alloy component manufacturing.",
    specs: [
      { label: "Max Turning Diameter", value: "500 mm" },
      { label: "Spindle Speed", value: "4,500 rpm" },
      { label: "Power", value: "15 kW" },
      { label: "Control System", value: "Fanuc / Siemens" },
      { label: "Warranty", value: "2 years" },
    ],
  },
  {
    slug: "bluetooth-wireless-earbuds",
    code: "EL-0947",
    name: "Bluetooth Wireless Earbuds",
    industry: "Electronics",
    price: "$3.20 – $6.80",
    moq: "500 pcs",
    leadTime: "12–18 days",
    supplierSlug: "meridian-electronics",
    description:
      "True wireless earbuds with active noise cancellation, private-label ready with custom packaging options.",
    specs: [
      { label: "Battery Life", value: "6h + 24h case" },
      { label: "Bluetooth Version", value: "5.3" },
      { label: "Water Resistance", value: "IPX5" },
      { label: "Customization", value: "Logo, packaging, color" },
      { label: "Certification", value: "CE, FCC, RoHS" },
    ],
  },
  {
    slug: "organic-cotton-t-shirts",
    code: "FS-1183",
    name: "Organic Cotton T-Shirts",
    industry: "Fashion",
    price: "$2.10 – $4.50",
    moq: "300 pcs",
    leadTime: "20–30 days",
    supplierSlug: "northgate-apparel",
    description:
      "GOTS-certified organic cotton tees available in a full size and color range, with private label printing.",
    specs: [
      { label: "Fabric", value: "180 gsm organic cotton" },
      { label: "Sizes", value: "XS – 3XL" },
      { label: "Printing", value: "Screen, DTG, embroidery" },
      { label: "Certification", value: "GOTS, OEKO-TEX" },
    ],
  },
  {
    slug: "modular-office-desk-system",
    code: "HF-0662",
    name: "Modular Office Desk System",
    industry: "Home & Furniture",
    price: "$95 – $210",
    moq: "20 sets",
    leadTime: "30–40 days",
    supplierSlug: "solara-home-interiors",
    description:
      "Configurable office desking with cable management and optional electric height adjustment.",
    specs: [
      { label: "Material", value: "Powder-coated steel, MDF top" },
      { label: "Adjustment", value: "Manual or electric" },
      { label: "Load Capacity", value: "80 kg" },
      { label: "Assembly", value: "Flat-pack" },
    ],
  },
  {
    slug: "automotive-led-headlight-kit",
    code: "AU-3305",
    name: "Automotive LED Headlight Kit",
    industry: "Automotive",
    price: "$14 – $28",
    moq: "100 pcs",
    leadTime: "15–20 days",
    supplierSlug: "vantage-auto-parts",
    description: "Plug-and-play LED headlight conversion kits compatible with major sedan and SUV models.",
    specs: [
      { label: "Lumens", value: "12,000 lm / pair" },
      { label: "Color Temp", value: "6000K" },
      { label: "Lifespan", value: "50,000 hours" },
      { label: "Fitment", value: "Universal H4 / H7 / H11" },
    ],
  },
  {
    slug: "hyaluronic-acid-serum-oem",
    code: "BT-7741",
    name: "Hyaluronic Acid Serum (OEM)",
    industry: "Beauty",
    price: "$1.10 – $2.40",
    moq: "1,000 units",
    leadTime: "35–45 days",
    supplierSlug: "meridian-electronics",
    description: "Dermatologically tested hydrating serum, formulated for private label skincare brands.",
    specs: [
      { label: "Volume", value: "30 ml" },
      { label: "Formulation", value: "2% Hyaluronic Acid" },
      { label: "Packaging", value: "Custom bottle + carton" },
      { label: "Shelf Life", value: "24 months" },
    ],
  },
];

export type Supplier = {
  slug: string;
  name: string;
  country: string;
  industry: string;
  years: number;
  rating: string;
  verified: boolean;
  responseRate: string;
  mainProducts: string[];
  description: string;
};

export const suppliers: Supplier[] = [
  {
    slug: "meridian-electronics",
    name: "Meridian Electronics Co.",
    country: "Vietnam",
    industry: "Electronics",
    years: 12,
    rating: "4.8",
    verified: true,
    responseRate: "97%",
    mainProducts: ["Wireless Audio", "Wearables", "OEM Accessories"],
    description:
      "A contract manufacturer specializing in consumer audio and wearable electronics, supplying private-label brands across North America and Europe.",
  },
  {
    slug: "northgate-apparel",
    name: "Northgate Apparel Group",
    country: "Bangladesh",
    industry: "Fashion",
    years: 9,
    rating: "4.7",
    verified: true,
    responseRate: "94%",
    mainProducts: ["Knitwear", "Organic Cotton Basics", "Activewear"],
    description:
      "A GOTS-certified garment manufacturer producing knitwear and basics for international retail brands.",
  },
  {
    slug: "ironline-machinery",
    name: "Ironline Machinery Ltd.",
    country: "Germany",
    industry: "Machinery",
    years: 21,
    rating: "4.9",
    verified: true,
    responseRate: "99%",
    mainProducts: ["CNC Machines", "Industrial Presses", "Automation Lines"],
    description:
      "A precision engineering firm building CNC and automation equipment for metalworking industries worldwide.",
  },
  {
    slug: "solara-home-interiors",
    name: "Solara Home Interiors",
    country: "Türkiye",
    industry: "Home & Furniture",
    years: 7,
    rating: "4.6",
    verified: true,
    responseRate: "91%",
    mainProducts: ["Office Furniture", "Modular Storage", "Outdoor Furniture"],
    description:
      "A furniture manufacturer supplying commercial and residential furnishings to distributors across Europe and the Gulf.",
  },
  {
    slug: "vantage-auto-parts",
    name: "Vantage Auto Parts",
    country: "South Korea",
    industry: "Automotive",
    years: 15,
    rating: "4.8",
    verified: true,
    responseRate: "96%",
    mainProducts: ["Lighting Systems", "Braking Components", "Aftermarket Accessories"],
    description:
      "A tier-2 automotive parts supplier producing lighting and braking components for OEM and aftermarket channels.",
  },
  {
    slug: "pure-harvest-foods",
    name: "Pure Harvest Foods",
    country: "Thailand",
    industry: "Food & Beverage",
    years: 6,
    rating: "4.5",
    verified: true,
    responseRate: "89%",
    mainProducts: ["Frozen Seafood", "Canned Fruit", "Snack Foods"],
    description:
      "A food processing and export company supplying frozen and shelf-stable goods to distributors across Asia-Pacific.",
  },
];

export const tickerStats = [
  { label: "Active Suppliers", value: "182,400+" },
  { label: "Product Listings", value: "9.6M" },
  { label: "Countries Served", value: "190" },
  { label: "RFQs This Month", value: "64,200" },
  { label: "Industries Covered", value: "10" },
  { label: "Trade Assurance Orders", value: "1.2M" },
];
