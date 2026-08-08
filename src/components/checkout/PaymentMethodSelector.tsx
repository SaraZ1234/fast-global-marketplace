"use client";

import { CreditCard, Landmark, ShieldCheck, Wallet } from "lucide-react";

export type PaymentMethodId = "card" | "bank-transfer" | "trade-assurance" | "paypal";

interface PaymentOption {
  id: PaymentMethodId;
  label: string;
  description: string;
  icon: typeof CreditCard;
}

const OPTIONS: PaymentOption[] = [
  {
    id: "card",
    label: "Credit / Debit Card",
    description: "Visa, Mastercard, and American Express accepted.",
    icon: CreditCard,
  },
  {
    id: "trade-assurance",
    label: "Trade Assurance Escrow",
    description: "Funds are released to the supplier once you confirm receipt.",
    icon: ShieldCheck,
  },
  {
    id: "bank-transfer",
    label: "Bank Transfer (T/T)",
    description: "Wire transfer directly to the supplier's verified account.",
    icon: Landmark,
  },
  {
    id: "paypal",
    label: "PayPal",
    description: "Pay using your linked PayPal business account.",
    icon: Wallet,
  },
];

interface PaymentMethodSelectorProps {
  value: PaymentMethodId | null;
  onChange: (value: PaymentMethodId) => void;
  error?: string;
}

export default function PaymentMethodSelector({
  value,
  onChange,
  error,
}: PaymentMethodSelectorProps) {
  return (
    <div className="border border-line bg-paper p-6 sm:p-7 md:p-8">
      <h2 className="font-display font-bold text-lg sm:text-xl tracking-tightest">
        Payment Method
      </h2>
      <p className="mt-1.5 text-sm text-ash">
        Choose how you&apos;d like to pay this supplier.
      </p>

      <div
        role="radiogroup"
        aria-label="Payment method"
        className="mt-6 sm:mt-7 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4"
      >
        {OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const selected = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(opt.id)}
              className={`text-left p-4 sm:p-5 border transition-colors duration-200 ${
                selected
                  ? "border-ink bg-ink text-paper"
                  : "border-line hover:border-ash"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <Icon
                  size={19}
                  strokeWidth={1.6}
                  className={selected ? "text-paper" : "text-ash"}
                />
                <span
                  className={`h-4 w-4 shrink-0 rounded-full border grid place-items-center transition-colors ${
                    selected ? "border-paper" : "border-line"
                  }`}
                >
                  {selected && (
                    <span className="h-2 w-2 rounded-full bg-paper" />
                  )}
                </span>
              </div>
              <p className="mt-3 font-medium text-sm">{opt.label}</p>
              <p
                className={`mt-1 text-xs leading-relaxed ${
                  selected ? "text-paper/70" : "text-smoke"
                }`}
              >
                {opt.description}
              </p>
            </button>
          );
        })}
      </div>

      {error && (
        <p className="mt-4 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}