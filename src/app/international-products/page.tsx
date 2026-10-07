// app/international-products/page.tsx
import MarketplaceCategoryPage from "@/components/MarketplaceCategoryPage";
import { INTERNATIONAL_MOCK_PRODUCTS } from "@/lib/regionalProductsData";

export const metadata = {
  title: "International Wholesale Products | FAST Global Marketplace",
  description: "Directly source industrial machinery, medical equipment, and high-tech electronics from verified manufacturers worldwide.",
};

export default function InternationalProductsPage() {
  return (
    <MarketplaceCategoryPage
      regionKey="international"
      title="International Marketplace"
      subtitle="Global B2B & Wholesale Directory"
      description="Connect directly with verified exporters, machinery fabricators, and certified original equipment manufacturers (OEMs) across Europe, Asia, and the Americas."
      products={INTERNATIONAL_MOCK_PRODUCTS}
    />
  );
}