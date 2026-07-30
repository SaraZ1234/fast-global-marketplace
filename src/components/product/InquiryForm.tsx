"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";

export default function InquiryForm({ productName }: { productName: string }) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 700);
  };

  if (submitted) {
    return (
      <div className="max-w-xl border border-line p-6 sm:p-8 flex flex-col items-center text-center gap-3 animate-[fadeUp_0.3s_ease-out]">
        <CheckCircle2 size={28} className="text-emerald-600" />
        <p className="font-display font-semibold">Inquiry sent</p>
        <p className="text-sm text-smoke max-w-sm">
          Thanks for your interest in {productName}. The supplier typically responds within a few hours.
        </p>
        <style jsx>{`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(6px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl border border-line p-5 sm:p-8 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-[10px] sm:text-xs font-mono uppercase tracking-widest2 text-smoke">Name</label>
          <input
            required
            type="text"
            className="mt-1.5 w-full bg-bone border border-line px-3 py-2.5 text-sm focus:outline-none focus:border-ash"
          />
        </div>
        <div>
          <label className="text-[10px] sm:text-xs font-mono uppercase tracking-widest2 text-smoke">Email</label>
          <input
            required
            type="email"
            className="mt-1.5 w-full bg-bone border border-line px-3 py-2.5 text-sm focus:outline-none focus:border-ash"
          />
        </div>
      </div>
      <div>
        <label className="text-[10px] sm:text-xs font-mono uppercase tracking-widest2 text-smoke">
          Quantity Needed
        </label>
        <input
          type="text"
          placeholder="e.g. 500 pcs"
          className="mt-1.5 w-full bg-bone border border-line px-3 py-2.5 text-sm focus:outline-none focus:border-ash"
        />
      </div>
      <div>
        <label className="text-[10px] sm:text-xs font-mono uppercase tracking-widest2 text-smoke">Message</label>
        <textarea
          required
          rows={4}
          placeholder={`Hi, I'd like a quote for ${productName}...`}
          className="mt-1.5 w-full bg-bone border border-line px-3 py-2.5 text-sm resize-none focus:outline-none focus:border-ash"
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center gap-2 bg-ink text-paper font-mono text-xs uppercase tracking-widest2 px-6 py-3 hover:bg-ash transition-colors disabled:opacity-60"
      >
        {submitting ? "Sending..." : "Send Inquiry"}
        {!submitting && <Send size={13} />}
      </button>
    </form>
  );
}