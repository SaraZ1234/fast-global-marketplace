import MarketplaceCategoryPage from "@/components/MarketplaceCategoryPage";
import { REGIONAL_MOCK_PRODUCTS } from "@/lib/regionalProductsData";

export const metadata = {
  title: "Gulf Products | FAST Global Marketplace",
  description:
    "Explore premium products and wholesale listings from Gulf-region sellers and suppliers.",
};

export default function GulfProductsPage() {
  return (
    <MarketplaceCategoryPage
      regionKey="gulf"
      title="Gulf Marketplace"
      subtitle="Gulf Wholesale & Trade"
      description="Discover products from trusted Gulf-region sellers and suppliers across multiple categories."
      products={REGIONAL_MOCK_PRODUCTS}
    />
  );
}