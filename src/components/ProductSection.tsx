import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import { SectionHeading, GhostButton } from "@/components/UI";
import ProductCard, { type Product } from "@/components/ProductCard";

export default function ProductSection({
  eyebrow,
  title,
  description,
  products,
  viewAllHref,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  products: Product[];
  viewAllHref: string;
}) {
  return (
    <section className="border-b border-line">
      <div className="container-x py-14 sm:py-20 md:py-24">
        <div className="flex items-end justify-between flex-wrap gap-4 sm:gap-6 mb-8 sm:mb-10">
          <SectionHeading eyebrow={eyebrow} title={title} description={description} />
          <Link
            href={viewAllHref}
            className="hidden md:inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4"
          >
            View all <ArrowRight size={15} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {products.map((p, i) => (
            <Reveal key={p.id} delay={(i % 4) * 0.05}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>

        <div className="mt-6 sm:mt-8 md:hidden">
          <GhostButton href={viewAllHref} icon={ArrowRight}>
            View all
          </GhostButton>
        </div>
      </div>
    </section>
  );
}
