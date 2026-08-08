"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { apiRequest } from "@/lib/api";
import {
  ROLE,
  saveSession,
  getDashboardPath,
  getErrorMessage,
  type LoginResponse,
} from "@/lib/auth";
import FormField from "./FormField";
import PasswordField from "./PasswordField";
import AuthButton from "./AuthButton";
import RoleSelect from "./RoleSelect";
import {
  validateRegister,
  type AccountRole,
  type RegisterFormErrors,
} from "./validation";

// Maps the UI's role choice to the numeric roleId your backend expects.
// Keep this in sync with the ROLE map in lib/auth.ts.
const ROLE_ID_MAP: Record<AccountRole, number> = {
  buyer: ROLE.BUYER,
  vendor: ROLE.VENDOR,
};

export default function RegisterForm() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<AccountRole | null>(null);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function clearFieldError(field: keyof RegisterFormErrors) {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);

    const values = { fullName, email, password, confirmPassword, role, agreeToTerms };
    const validationErrors = validateRegister(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    try {
      const data = await apiRequest("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          password,
          role,
        }),
      });


      if (!data?.user) {
        throw new Error("Unexpected response from the server. Please try again.");
      }

      router.push("/login");
    } catch (err) {
      setFormError(
        getErrorMessage(err, "Unable to create your account. Please try again.")
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full">
      {formError && (
        <div
          role="alert"
          className="mb-6 flex items-start gap-3 border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 animate-[fadeIn_0.2s_ease-out]"
        >
          <AlertCircle size={18} className="shrink-0 mt-0.5" aria-hidden="true" />
          <span>{formError}</span>
        </div>
      )}

      <div className="space-y-5">
        <RoleSelect
          value={role}
          onChange={(r) => {
            setRole(r);
            clearFieldError("role");
          }}
          error={errors.role}
        />

        <FormField
          label="Full name"
          type="text"
          name="fullName"
          autoComplete="name"
          placeholder="Jane Cooper"
          value={fullName}
          onChange={(e) => {
            setFullName(e.target.value);
            clearFieldError("fullName");
          }}
          error={errors.fullName}
          required
        />

        <FormField
          label="Email address"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            clearFieldError("email");
          }}
          error={errors.email}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <PasswordField
            label="Password"
            name="password"
            autoComplete="new-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              clearFieldError("password");
            }}
            error={errors.password}
            required
          />

          <PasswordField
            label="Confirm password"
            name="confirmPassword"
            autoComplete="new-password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              clearFieldError("confirmPassword");
            }}
            error={errors.confirmPassword}
            required
          />
        </div>
      </div>

      <div className="mt-5">
        <label className="flex items-start gap-2.5 text-sm text-ash cursor-pointer select-none">
          <input
            type="checkbox"
            checked={agreeToTerms}
            onChange={(e) => {
              setAgreeToTerms(e.target.checked);
              clearFieldError("agreeToTerms");
            }}
            className="mt-0.5 h-4 w-4 border border-line accent-ink cursor-pointer shrink-0"
          />
          <span>
            I agree to the{" "}
            <Link href="/terms" className="text-ink underline underline-offset-4 hover:text-ash">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-ink underline underline-offset-4 hover:text-ash">
              Privacy Policy
            </Link>
            .
          </span>
        </label>
        {errors.agreeToTerms && (
          <p role="alert" className="mt-1.5 text-xs text-red-600">
            {errors.agreeToTerms}
          </p>
        )}
      </div>

      <div className="mt-7">
        <AuthButton type="submit" loading={loading}>
          Create account
        </AuthButton>
      </div>

      <p className="mt-6 text-center text-sm text-ash">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-ink underline underline-offset-4 hover:text-ash transition-colors"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}