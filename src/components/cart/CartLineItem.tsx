"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import QuantityStepper from "./QuantityStepper";

export interface CartItem {
  id: string;
  name: string;
  image: string;
  supplier: string;
  supplierHref: string;
  unitPrice: number;
  moq: number;
  quantity: number;
}

interface CartLineItemProps {
  item: CartItem;
  onQuantityChange: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  isRemoving?: boolean;
}

const currency = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

export default function CartLineItem({
  item,
  onQuantityChange,
  onRemove,
  isRemoving = false,
}: CartLineItemProps) {
  const subtotal = item.unitPrice * item.quantity;

  return (
    <div
      className={`p-5 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 transition-all duration-300 ${
        isRemoving ? "opacity-0 -translate-x-2" : "opacity-100"
      }`}
    >
      {/* Image */}
      <div className="h-20 w-20 sm:h-24 sm:w-24 shrink-0 border border-line bg-bone overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          width={96}
          height={96}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <Link
              href={item.supplierHref}
              className="text-xs font-mono uppercase tracking-widest2 text-smoke hover:text-ink transition-colors"
            >
              {item.supplier}
            </Link>
            <h3 className="mt-1.5 font-display font-semibold text-sm sm:text-base leading-snug break-words pr-2">
              {item.name}
            </h3>
            <p className="mt-1.5 text-xs sm:text-sm text-ash">
              {currency(item.unitPrice)} / unit &middot; MOQ {item.moq}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onRemove(item.id)}
            aria-label={`Remove ${item.name} from cart`}
            className="shrink-0 h-8 w-8 grid place-items-center text-smoke hover:text-ink hover:border-ink border border-transparent transition-colors"
          >
            <Trash2 size={15} strokeWidth={1.75} />
          </button>
        </div>

        <div className="mt-4 sm:mt-5 flex items-center justify-between gap-4 flex-wrap">
          <QuantityStepper
            value={item.quantity}
            min={item.moq}
            onChange={(next) => onQuantityChange(item.id, next)}
          />
          <div className="text-right">
            <div className="text-[11px] font-mono uppercase tracking-widest2 text-smoke">
              Subtotal
            </div>
            <div className="font-display font-semibold text-sm sm:text-base tracking-tight">
              {currency(subtotal)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}