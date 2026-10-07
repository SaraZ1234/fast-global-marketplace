// app/pakistan-products/page.tsx
import MarketplaceCategoryPage from "@/components/MarketplaceCategoryPage";
import { REGIONAL_MOCK_PRODUCTS } from "@/lib/regionalProductsData";

export const metadata = {
  title: "Pakistan Products | FAST Global Marketplace",
  description: "Explore export-quality leather goods, surgical tools, lawn fabric, and textiles directly from Pakistani exporters.",
};

export default function PakistanProductsPage() {
  return (
    <MarketplaceCategoryPage
      regionKey="pakistan"
      title="Pakistan Marketplace"
      subtitle="Local & Export Wholesale"
      description="Discover authentic leather products, lawn apparel, handcrafted items, and premium surgical instruments directly from certified Pakistani manufacturers."
      products={REGIONAL_MOCK_PRODUCTS}
    />
  );
}