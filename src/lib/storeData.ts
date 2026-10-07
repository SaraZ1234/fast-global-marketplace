import { apiRequest } from "@/lib/api";

export type Seller = {
  slug: string;
  storeName: string;
  logo: string | null;
  banner: string | null;
  description: string;
  location: string;
  country: string;
  phone: string;
  email: string;
  businessType: string;
  verified: boolean;
  yearsInBusiness: number | null;
};

export type StoreProduct = {
  slug: string;
  name: string;
  image: string | null;
  price: number;
  currency: string;
  stock: number;
  category: string;
  approved: boolean;
};

export type StoreData = {
  seller: Seller;
  products: StoreProduct[];
};

export async function getStoreBySlug(
  slug: string
): Promise<StoreData | null> {
  try {
    const data = await apiRequest(
      `/public/vendors/store/${slug}`
    );

    console.log("REAL STORE API RESPONSE:", data);

    if (!data) {
      return null;
    }

    return data;
  } catch (error) {
    console.error(
      "FAILED TO LOAD SELLER STORE:",
      error
    );

    return null;
  }
}