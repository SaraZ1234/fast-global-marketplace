import { ShieldCheck } from "lucide-react";

export type Product = {
  id: string;
  name: string;
  price: string;
  supplier: string;
  country: string;
  image: string;
  verified?: boolean;
};

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group bg-paper border border-line p-4 sm:p-5 card-hover flex flex-col h-full">
      <div className="relative w-full aspect-square overflow-hidden bg-bone">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.verified && (
          <span className="absolute top-2 left-2 inline-flex items-center gap-1 bg-ink text-paper text-[10px] font-mono uppercase tracking-widest2 px-2 py-1">
            <ShieldCheck size={11} /> Verified
          </span>
        )}
      </div>

      <h4 className="mt-4 font-display font-semibold text-sm sm:text-base leading-snug line-clamp-2">
        {product.name}
      </h4>
      <p className="mt-2 font-mono text-sm sm:text-base text-ink">{product.price}</p>

      <div className="mt-3 pt-3 border-t border-line text-xs text-ash mt-auto">
        <p className="truncate">{product.supplier}</p>
        <p className="text-smoke">{product.country}</p>
      </div>
    </div>
  );
}
