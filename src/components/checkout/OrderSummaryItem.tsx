import Image from "next/image";

export interface OrderItem {
  id: string;
  name: string;
  image: string;
  supplier: string;
  unitPrice: number;
  quantity: number;
}

const currency = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

export default function OrderSummaryItem({ item }: { item: OrderItem }) {
  return (
    <div className="flex gap-3 sm:gap-4 py-4 first:pt-0">
      <div className="h-14 w-14 shrink-0 border border-line bg-bone overflow-hidden relative">
        <Image src={item.image} alt={item.name} fill className="object-cover" />
        <span className="absolute -top-1.5 -right-1.5 h-5 min-w-5 px-1 rounded-full bg-ink text-paper text-[10px] font-mono grid place-items-center">
          {item.quantity}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-mono uppercase tracking-widest2 text-smoke truncate">
          {item.supplier}
        </p>
        <p className="mt-1 text-sm font-medium leading-snug line-clamp-2">
          {item.name}
        </p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-sm font-display font-semibold tracking-tight">
          {currency(item.unitPrice * item.quantity)}
        </p>
      </div>
    </div>
  );
}