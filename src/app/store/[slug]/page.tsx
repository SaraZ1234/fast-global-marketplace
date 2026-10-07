import StoreView from "@/components/store/StoreView";

// `await` works whether params is a plain object (Next 14) or a Promise (Next 15+).
export default async function StorePage({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const { slug } = await params;
  return <StoreView slug={slug} />;
}