"use client";

import { forwardRef, InputHTMLAttributes, ReactNode } from "react";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  rightElement?: ReactNode;
}

/**
 * Shared text-input primitive for auth forms.
 * Sharp corners, hairline borders, mono uppercase label — consistent with
 * the marketplace's broadsheet visual language (see components/UI.tsx).
 */
const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, rightElement, id, name, className = "", ...props }, ref) => {
    const inputId = id ?? name;
    const errorId = error ? `${inputId}-error` : undefined;

    return (
      <div className="w-full">
        <label
          htmlFor={inputId}
          className="block text-xs font-mono uppercase tracking-widest2 text-smoke mb-2"
        >
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            name={name}
            aria-invalid={!!error}
            aria-describedby={errorId}
            className={`w-full bg-paper border text-sm sm:text-base text-ink placeholder:text-smoke/60
              px-4 py-3 outline-none transition-colors duration-200
              ${error ? "border-red-400 focus:border-red-500" : "border-line focus:border-ink"}
              ${rightElement ? "pr-11" : ""} ${className}`}
            {...props}
          />
          {rightElement && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {rightElement}
            </div>
          )}
        </div>
        {error && (
          <p id={errorId} role="alert" className="mt-1.5 text-xs text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = "FormField";
export default FormField;