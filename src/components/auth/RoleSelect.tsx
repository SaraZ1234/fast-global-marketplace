"use client";

import { ShoppingBag, Store } from "lucide-react";
import type { AccountRole } from "./validation";

interface RoleOption {
  value: AccountRole;
  label: string;
  description: string;
  icon: typeof ShoppingBag;
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    value: "buyer",
    label: "Buyer",
    description: "Source products from verified suppliers",
    icon: ShoppingBag,
  },
  {
    value: "vendor",
    label: "Vendor",
    description: "List products and sell to the world",
    icon: Store,
  },
];

interface RoleSelectProps {
  value: AccountRole | null;
  onChange: (role: AccountRole) => void;
  error?: string;
}

export default function RoleSelect({ value, onChange, error }: RoleSelectProps) {
  return (
    <div>
      <span className="block text-xs font-mono uppercase tracking-widest2 text-smoke mb-2">
        I want to
      </span>
      <div
        role="radiogroup"
        aria-invalid={!!error}
        className="grid grid-cols-2 gap-3"
      >
        {ROLE_OPTIONS.map((opt) => {
          const selected = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(opt.value)}
              className={`text-left border px-4 py-3.5 transition-colors duration-150 ${
                selected
                  ? "border-ink bg-ink text-paper"
                  : "border-line bg-paper text-ink hover:border-ash"
              }`}
            >
              <opt.icon
                size={18}
                className={selected ? "text-paper" : "text-ash"}
              />
              <p className="mt-2.5 text-sm font-semibold">{opt.label}</p>
              <p
                className={`mt-0.5 text-xs leading-snug ${
                  selected ? "text-paper/70" : "text-ash"
                }`}
              >
                {opt.description}
              </p>
            </button>
          );
        })}
      </div>
      {error && (
        <p role="alert" className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}