"use client";

import { Minus, Plus } from "lucide-react";

interface QuantityStepperProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (next: number) => void;
  disabled?: boolean;
}

export default function QuantityStepper({
  value,
  min = 1,
  max = 9999,
  onChange,
  disabled = false,
}: QuantityStepperProps) {
  const dec = () => {
    if (disabled) return;
    onChange(Math.max(min, value - 1));
  };
  const inc = () => {
    if (disabled) return;
    onChange(Math.min(max, value + 1));
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    if (raw === "") return onChange(min);
    const next = Math.min(max, Math.max(min, parseInt(raw, 10)));
    onChange(next);
  };

  return (
    <div
      className={`inline-flex items-center border border-line select-none ${
        disabled ? "opacity-40 pointer-events-none" : ""
      }`}
    >
      <button
        type="button"
        onClick={dec}
        aria-label="Decrease quantity"
        disabled={value <= min}
        className="h-9 w-9 grid place-items-center text-ash hover:text-ink hover:bg-bone transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
      >
        <Minus size={14} strokeWidth={2.25} />
      </button>
      <input
        value={value}
        onChange={handleInput}
        inputMode="numeric"
        aria-label="Quantity"
        className="h-9 w-12 text-center text-sm font-mono bg-transparent border-x border-line focus:outline-none focus:bg-bone transition-colors"
      />
      <button
        type="button"
        onClick={inc}
        aria-label="Increase quantity"
        disabled={value >= max}
        className="h-9 w-9 grid place-items-center text-ash hover:text-ink hover:bg-bone transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
      >
        <Plus size={14} strokeWidth={2.25} />
      </button>
    </div>
  );
}