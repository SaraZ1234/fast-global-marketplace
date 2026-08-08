"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  children: ReactNode;
}

/**
 * Same visual weight as <PrimaryButton> from components/UI.tsx, but rendered
 * as an actual <button type="submit"> since PrimaryButton is Link/href-based.
 */
export default function AuthButton({
  loading = false,
  children,
  disabled,
  className = "",
  ...props
}: AuthButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      aria-busy={loading}
      className={`w-full inline-flex items-center justify-center gap-2 bg-ink text-paper
        px-6 py-3.5 text-sm font-medium tracking-wide
        transition-opacity duration-200 hover:opacity-90
        disabled:opacity-50 disabled:cursor-not-allowed
        focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-paper
        ${className}`}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
      <span>{loading ? "Signing in…" : children}</span>
    </button>
  );
}