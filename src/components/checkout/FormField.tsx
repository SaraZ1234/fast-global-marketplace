"use client";

import { AlertCircle } from "lucide-react";

interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
  onBlur?: (name: string) => void;
  error?: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  as?: "input" | "select" | "textarea";
  options?: { value: string; label: string }[];
  className?: string;
  autoComplete?: string;
}

export default function FormField({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  required = false,
  type = "text",
  placeholder,
  as = "input",
  options = [],
  className = "",
  autoComplete,
}: FormFieldProps) {
  const hasError = Boolean(error);

  const baseClasses = `w-full bg-paper border text-sm px-3.5 py-2.5 transition-colors focus:outline-none placeholder:text-smoke ${
    hasError
      ? "border-red-600 focus:border-red-600"
      : "border-line focus:border-ink"
  }`;

  return (
    <div className={className}>
      <label
        htmlFor={name}
        className="block text-xs font-mono uppercase tracking-widest2 text-smoke mb-2"
      >
        {label}
        {required && <span className="text-ash"> *</span>}
      </label>

      {as === "select" ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          onBlur={() => onBlur?.(name)}
          className={`${baseClasses} appearance-none`}
        >
          <option value="" disabled>
            {placeholder || "Select"}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : as === "textarea" ? (
        <textarea
          id={name}
          name={name}
          value={value}
          rows={3}
          placeholder={placeholder}
          onChange={(e) => onChange(name, e.target.value)}
          onBlur={() => onBlur?.(name)}
          className={`${baseClasses} resize-none`}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onChange={(e) => onChange(name, e.target.value)}
          onBlur={() => onBlur?.(name)}
          className={baseClasses}
        />
      )}

      {hasError && (
        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-600">
          <AlertCircle size={12} strokeWidth={2} />
          {error}
        </p>
      )}
    </div>
  );
}