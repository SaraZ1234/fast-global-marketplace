"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

interface CategoryModalProps {
  open: boolean;
  title: string;
  initialValue?: string;
  placeholder?: string;
  onSave: (value: string) => void;
  onClose: () => void;
}

export default function CategoryModal({
  open,
  title,
  initialValue = "",
  placeholder = "Name",
  onSave,
  onClose,
}: CategoryModalProps) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (open) setValue(initialValue);
  }, [open, initialValue]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-ink/60 backdrop-blur-xs"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.18 }}
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-sm bg-paper border border-ink shadow-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-base">{title}</h3>
              <button onClick={onClose} className="text-ash hover:text-ink transition-colors" aria-label="Close">
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (value.trim()) onSave(value.trim());
              }}
            >
              <input
                autoFocus
                type="text"
                value={value}
                placeholder={placeholder}
                onChange={(e) => setValue(e.target.value)}
                className="w-full px-3 py-2.5 bg-bone border border-line text-sm focus:outline-none focus:border-ink transition-colors"
              />
              <div className="mt-5 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-mono uppercase tracking-wider border border-line hover:border-ink transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!value.trim()}
                  className="px-4 py-2 text-xs font-mono uppercase tracking-wider bg-ink text-paper hover:bg-ash transition-colors disabled:opacity-40"
                >
                  Save
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
