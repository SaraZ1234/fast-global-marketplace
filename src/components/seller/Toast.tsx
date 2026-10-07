"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";
import { useSellerStore } from "@/lib/sellerStore";

const ICONS = { success: CheckCircle2, error: XCircle, info: Info };

export default function ToastViewport() {
  const { toasts, dismissToast } = useSellerStore();

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-[calc(100%-2rem)] max-w-sm">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = ICONS[toast.type];
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="flex items-start gap-2.5 bg-ink text-paper border border-ink px-4 py-3 shadow-lg"
            >
              <Icon size={16} className="mt-0.5 shrink-0" />
              <p className="text-sm flex-1 leading-snug">{toast.text}</p>
              <button
                onClick={() => dismissToast(toast.id)}
                className="text-paper/60 hover:text-paper transition-colors"
                aria-label="Dismiss notification"
              >
                <X size={14} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
