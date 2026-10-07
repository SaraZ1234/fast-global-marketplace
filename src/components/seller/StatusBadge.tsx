"use client";

import { ProductStatus } from "@/lib/sellerTypes";
import { CheckCircle2, FileEdit, Ban } from "lucide-react";

const STATUS_CONFIG: Record<
  ProductStatus,
  {
    label: string;
    icon: React.ElementType;
    classes: string;
  }
> = {
  Approved: {
    label: "Approved",
    icon: CheckCircle2,
    classes: "bg-ink text-paper",
  },

  Pending: {
    label: "Pending",
    icon: FileEdit,
    classes: "bg-bone text-ash border border-line",
  },

  Rejected: {
    label: "Rejected",
    icon: Ban,
    classes:
      "bg-bone text-smoke border border-line line-through decoration-1",
  },
};

export default function StatusBadge({
  status,
}: {
  status: ProductStatus;
}) {
  const config = STATUS_CONFIG[status];

  if (!config) {
    return null;
  }

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider px-2 py-1 ${config.classes}`}
    >
      <Icon size={11} />
      {config.label}
    </span>
  );
}