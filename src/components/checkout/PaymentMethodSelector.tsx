"use client";

import { Landmark, Banknote, Smartphone, Upload } from "lucide-react";

export type PaymentMethodId =
  | "cod"
  | "easypaisa"
  | "bank-transfer";

interface PaymentOption {
  id: PaymentMethodId;
  label: string;
  description: string;
  icon: typeof Landmark;
}

const OPTIONS: PaymentOption[] = [
  {
    id: "cod",
    label: "Cash on Delivery",
    description: "Pay in cash when your order is delivered.",
    icon: Banknote,
  },
  {
    id: "easypaisa",
    label: "Easypaisa",
    description: "Pay securely through Easypaisa.",
    icon: Smartphone,
  },
  {
    id: "bank-transfer",
    label: "Bank Transfer",
    description: "Transfer the payment to the FAST marketplace bank account.",
    icon: Landmark,
  },
];

interface PaymentMethodSelectorProps {
  value: PaymentMethodId | null;
  onChange: (value: PaymentMethodId) => void;
  error?: string;
  transactionReference?: string;
  onTransactionReferenceChange?: (value: string) => void;
  proofFile?: File | null;
  onProofFileChange?: (file: File | null) => void;
}

export default function PaymentMethodSelector({
  value,
  onChange,
  error,
  transactionReference = "",
  onTransactionReferenceChange,
  proofFile = null,
  onProofFileChange,
}: PaymentMethodSelectorProps) {
  return (
    <div className="border border-line bg-paper p-6 sm:p-7 md:p-8">
      <h2 className="font-display font-bold text-lg sm:text-xl tracking-tightest">
        Payment Method
      </h2>

      <p className="mt-1.5 text-sm text-ash">
        Choose how you&apos;d like to pay for your order.
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

              <p className="mt-3 font-medium text-sm">
                {opt.label}
              </p>

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

      {/* Bank Transfer Details */}
      {value === "bank-transfer" && (
        <div className="mt-6 border border-line p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <Landmark size={20} />
            <div>
              <h3 className="font-semibold text-sm">
                Bank Transfer Instructions
              </h3>
              <p className="text-xs text-ash mt-1">
                Transfer the exact order amount using the details below.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 text-sm">
            <div className="flex justify-between gap-4 border-b border-line pb-3">
              <span className="text-ash">Bank Name</span>
              <span className="font-medium text-right">
                FAST Bank
              </span>
            </div>

            <div className="flex justify-between gap-4 border-b border-line pb-3">
              <span className="text-ash">Account Title</span>
              <span className="font-medium text-right">
                FAST Marketplace
              </span>
            </div>

            <div className="flex justify-between gap-4 border-b border-line pb-3">
              <span className="text-ash">IBAN / Account Number</span>
              <span className="font-medium text-right">
                Provided by FAST
              </span>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium mb-2">
              Transaction / Reference Number
            </label>

            <input
              type="text"
              value={transactionReference}
              onChange={(e) =>
                onTransactionReferenceChange?.(e.target.value)
              }
              placeholder="Enter your transaction reference"
              className="w-full border border-line bg-paper px-4 py-3 text-sm outline-none focus:border-ink"
            />
          </div>

          <div className="mt-5">
            <label className="block text-sm font-medium mb-2">
              Payment Proof
            </label>

            <label className="flex cursor-pointer items-center gap-3 border border-dashed border-line px-4 py-4 hover:border-ash transition-colors">
              <Upload size={18} className="text-ash" />

              <div className="min-w-0">
                <p className="text-sm font-medium">
                  {proofFile
                    ? proofFile.name
                    : "Upload payment receipt"}
                </p>

                <p className="text-xs text-ash mt-1">
                  JPG, PNG or PDF
                </p>
              </div>

              <input
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={(e) =>
                  onProofFileChange?.(
                    e.target.files?.[0] ?? null
                  )
                }
              />
            </label>
          </div>

          <div className="mt-4 bg-paper border border-line p-3">
            <p className="text-xs leading-relaxed text-ash">
              Your payment will remain pending until the transfer is
              verified by the marketplace administrator.
            </p>
          </div>
        </div>
      )}

      {/* Easypaisa Information */}
      {value === "easypaisa" && (
        <div className="mt-6 border border-line p-5">
          <p className="text-sm font-medium">
            Easypaisa
          </p>

          <p className="mt-1 text-xs text-ash leading-relaxed">
            Easypaisa online payment will be available once the
            marketplace merchant gateway is configured.
          </p>
        </div>
      )}

      {error && (
        <p className="mt-4 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}