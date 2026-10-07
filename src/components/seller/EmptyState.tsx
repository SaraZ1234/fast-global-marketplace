"use client";

import { LucideIcon, PackageOpen } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon: Icon = PackageOpen,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="border border-dashed border-line p-10 sm:p-14 text-center bg-bone">
      <Icon size={40} className="mx-auto text-smoke mb-4" />
      <h3 className="font-display font-semibold text-lg">{title}</h3>
      <p className="text-ash text-sm mt-1.5 max-w-sm mx-auto leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-5 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider border border-ink px-4 py-2 hover:bg-ink hover:text-paper transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
