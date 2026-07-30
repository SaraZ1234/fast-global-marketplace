import type { Product } from "@/components/ProductCard";

/**
 * Placeholder catalogue for the homepage industry sections.
 * Replace `image` with real product photography and wire the rest
 * up to your product API / CMS when ready — the shape (Product) is
 * already what <ProductCard /> and <ProductSection /> expect.
 */

export const machineryProducts: Product[] = [
  { id: "mch-01", name: "Hydraulic Press Brake 100T", price: "$18,400", supplier: "Sinotruk Heavy Industries", country: "China", image: "https://picsum.photos/seed/mch1/600/600", verified: true },
  { id: "mch-02", name: "CNC Vertical Machining Center", price: "$32,900", supplier: "Delta Machine Works", country: "Taiwan", image: "https://picsum.photos/seed/mch2/600/600", verified: true },
  { id: "mch-03", name: "Industrial Air Compressor 20HP", price: "$4,250", supplier: "Kompress Global", country: "Germany", image: "https://picsum.photos/seed/mch3/600/600" },
  { id: "mch-04", name: "Automated Packaging Line", price: "$56,000", supplier: "PackTech Systems", country: "Italy", image: "https://picsum.photos/seed/mch4/600/600", verified: true },
  { id: "mch-05", name: "Diesel Generator Set 250kVA", price: "$21,750", supplier: "Voltrex Power", country: "India", image: "https://picsum.photos/seed/mch5/600/600" },
  { id: "mch-06", name: "Industrial Robotic Arm 6-Axis", price: "$41,300", supplier: "AutoMation Corp", country: "South Korea", image: "https://picsum.photos/seed/mch6/600/600", verified: true },
];

export const medicalProducts: Product[] = [
  { id: "med-01", name: "Digital Patient Monitor", price: "$1,180", supplier: "Meditrust Devices", country: "Germany", image: "https://picsum.photos/seed/med1/600/600", verified: true },
  { id: "med-02", name: "Portable Ultrasound Scanner", price: "$6,900", supplier: "Sonoscan Medical", country: "South Korea", image: "https://picsum.photos/seed/med2/600/600", verified: true },
  { id: "med-03", name: "Surgical Instrument Set", price: "$340", supplier: "Prime Surgical Co.", country: "Pakistan", image: "https://picsum.photos/seed/med3/600/600" },
  { id: "med-04", name: "Hospital Electric Bed", price: "$1,050", supplier: "CareLine Equipment", country: "China", image: "https://picsum.photos/seed/med4/600/600", verified: true },
  { id: "med-05", name: "N95 Respirator Masks (Box of 50)", price: "$65", supplier: "SafeGuard Health", country: "Vietnam", image: "https://picsum.photos/seed/med5/600/600" },
  { id: "med-06", name: "Infrared Forehead Thermometer", price: "$14", supplier: "MedTech Supplies", country: "Malaysia", image: "https://picsum.photos/seed/med6/600/600" },
];

export const electronicsProducts: Product[] = [
  { id: "ele-01", name: "Wireless Noise-Cancelling Earbuds", price: "$22", supplier: "SoundCore Electronics", country: "China", image: "https://picsum.photos/seed/ele1/600/600", verified: true },
  { id: "ele-02", name: "Smart Home Security Camera", price: "$18", supplier: "VisionGuard Tech", country: "China", image: "https://picsum.photos/seed/ele2/600/600", verified: true },
  { id: "ele-03", name: "Portable Power Bank 20,000mAh", price: "$9", supplier: "ChargeUp Ltd.", country: "Hong Kong", image: "https://picsum.photos/seed/ele3/600/600" },
  { id: "ele-04", name: "4K Action Camera", price: "$46", supplier: "PixelPro Imaging", country: "Japan", image: "https://picsum.photos/seed/ele4/600/600", verified: true },
  { id: "ele-05", name: "Smart LED Desk Lamp", price: "$12", supplier: "Brightline Goods", country: "China", image: "https://picsum.photos/seed/ele5/600/600" },
  { id: "ele-06", name: "Bluetooth Mechanical Keyboard", price: "$28", supplier: "KeyForge Peripherals", country: "Taiwan", image: "https://picsum.photos/seed/ele6/600/600", verified: true },
];

export const fashionProducts: Product[] = [
  { id: "fsh-01", name: "Men's Slim Fit Cotton Shirt", price: "$6.50", supplier: "Textile House Ltd.", country: "Bangladesh", image: "https://picsum.photos/seed/fsh1/600/600", verified: true },
  { id: "fsh-02", name: "Women's Linen Summer Dress", price: "$9.20", supplier: "Aurelia Garments", country: "Turkey", image: "https://picsum.photos/seed/fsh2/600/600", verified: true },
  { id: "fsh-03", name: "Unisex Canvas Sneakers", price: "$7.80", supplier: "Footwork Manufacturing", country: "Vietnam", image: "https://picsum.photos/seed/fsh3/600/600" },
  { id: "fsh-04", name: "Genuine Leather Handbag", price: "$21.00", supplier: "Milano Leather Co.", country: "Italy", image: "https://picsum.photos/seed/fsh4/600/600", verified: true },
  { id: "fsh-05", name: "Kids' Fleece Hoodie", price: "$4.90", supplier: "Sunrise Apparel", country: "Pakistan", image: "https://picsum.photos/seed/fsh5/600/600" },
  { id: "fsh-06", name: "Merino Wool Scarf", price: "$5.60", supplier: "Highland Textiles", country: "United Kingdom", image: "https://picsum.photos/seed/fsh6/600/600" },
];

export const homeFurnitureProducts: Product[] = [
  { id: "hom-01", name: "Modular Fabric Sofa Set", price: "$310", supplier: "Comfort Living Furniture", country: "Vietnam", image: "https://picsum.photos/seed/hom1/600/600", verified: true },
  { id: "hom-02", name: "Solid Oak Dining Table", price: "$245", supplier: "Nordic Wood Works", country: "Poland", image: "https://picsum.photos/seed/hom2/600/600", verified: true },
  { id: "hom-03", name: "Minimalist Ceramic Vase Set", price: "$18", supplier: "Claybound Studio", country: "Vietnam", image: "https://picsum.photos/seed/hom3/600/600" },
  { id: "hom-04", name: "Memory Foam Mattress Queen", price: "$135", supplier: "SleepWell Manufacturing", country: "China", image: "https://picsum.photos/seed/hom4/600/600", verified: true },
  { id: "hom-05", name: "Rattan Storage Basket Set", price: "$16", supplier: "Weaveline Home", country: "Indonesia", image: "https://picsum.photos/seed/hom5/600/600" },
  { id: "hom-06", name: "Adjustable Standing Desk", price: "$89", supplier: "ErgoSpace Furniture", country: "China", image: "https://picsum.photos/seed/hom6/600/600", verified: true },
];
