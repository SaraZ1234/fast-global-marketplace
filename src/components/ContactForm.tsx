"use client";

import { useState } from "react";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";

const inputClasses =
  "w-full border-b border-line bg-transparent py-3 text-sm placeholder:text-smoke focus:border-ink outline-none transition-colors";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="border border-ink p-8 flex flex-col items-center text-center gap-4">
        <CheckCircle2 size={32} />
        <h3 className="font-display font-semibold text-xl">Request received.</h3>
        <p className="text-ash text-sm max-w-sm">
          A trade specialist will follow up within one business day with quotations from
          matching suppliers.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid sm:grid-cols-2 gap-8">
        <div>
          <label htmlFor="name" className="text-xs font-mono uppercase tracking-widest2 text-smoke">
            Full Name
          </label>
          <input id="name" required placeholder="Jordan Lee" className={`mt-2 ${inputClasses}`} />
        </div>
        <div>
          <label htmlFor="company" className="text-xs font-mono uppercase tracking-widest2 text-smoke">
            Company
          </label>
          <input id="company" placeholder="Acme Trading Co." className={`mt-2 ${inputClasses}`} />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-8">
        <div>
          <label htmlFor="email" className="text-xs font-mono uppercase tracking-widest2 text-smoke">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            placeholder="you@company.com"
            className={`mt-2 ${inputClasses}`}
          />
        </div>
        <div>
          <label htmlFor="product" className="text-xs font-mono uppercase tracking-widest2 text-smoke">
            Product / Category
          </label>
          <input id="product" placeholder="e.g. Industrial Sewing Machines" className={`mt-2 ${inputClasses}`} />
        </div>
      </div>
      <div>
        <label htmlFor="message" className="text-xs font-mono uppercase tracking-widest2 text-smoke">
          Details
        </label>
        <textarea
          id="message"
          required
          rows={5}
          placeholder="Quantity, target price, delivery timeline, and destination port."
          className={`mt-2 ${inputClasses} resize-none`}
        />
      </div>
      <button
        type="submit"
        className="inline-flex items-center gap-2 bg-ink text-paper px-6 py-3.5 text-sm font-medium hover:bg-ash transition-colors"
      >
        Submit Request <ArrowUpRight size={16} />
      </button>
    </form>
  );
}
