"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  children?: React.ReactNode; // slot for extra controls, e.g. a "move to" select
}

export default function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = true,
  onConfirm,
  onCancel,
  children,
}: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-ink/60 backdrop-blur-xs"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.18 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-modal-title"
            className="relative w-full max-w-md bg-paper border border-ink shadow-2xl p-6"
          >
            <div className="flex items-start gap-3">
              {destructive && (
                <span className="p-2 bg-bone border border-line text-ink shrink-0">
                  <AlertTriangle size={18} />
                </span>
              )}
              <div className="flex-1">
                <h3 id="confirm-modal-title" className="font-display font-semibold text-lg">
                  {title}
                </h3>
                <p className="text-sm text-ash mt-1.5 leading-relaxed">{description}</p>
              </div>
            </div>

            {children && <div className="mt-4">{children}</div>}

            <div className="mt-6 flex gap-3 justify-end">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-xs font-mono uppercase tracking-wider border border-line hover:border-ink transition-colors"
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                className={`px-4 py-2 text-xs font-mono uppercase tracking-wider transition-colors ${
                  destructive ? "bg-ink text-paper hover:bg-ash" : "bg-ink text-paper hover:bg-ash"
                }`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
