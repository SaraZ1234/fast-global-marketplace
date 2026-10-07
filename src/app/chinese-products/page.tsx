import MarketplaceCategoryPage from "@/components/MarketplaceCategoryPage";
import { REGIONAL_MOCK_PRODUCTS } from "@/lib/regionalProductsData";

export const metadata = {
  title: "Chinese Products | FAST Global Marketplace",
  description:
    "Explore wholesale products and supplier listings from Chinese manufacturers and sellers.",
};

export default function ChineseProductsPage() {
  return (
    <MarketplaceCategoryPage
      regionKey="chinese"
      title="Chinese Marketplace"
      subtitle="China Wholesale & Trade"
      description="Discover products from Chinese manufacturers and suppliers across multiple categories."
      products={REGIONAL_MOCK_PRODUCTS}
    />
  );
}