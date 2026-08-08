"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { apiRequest } from "@/lib/api";
import {
  saveSession,
  getDashboardPath,
  getErrorMessage,
  type LoginResponse,
} from "@/lib/auth";
import FormField from "./FormField";
import PasswordField from "./PasswordField";
import AuthButton from "./AuthButton";
import { validateLogin, type LoginFormErrors } from "./validation";

const REMEMBERED_EMAIL_KEY = "fast_remembered_email";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Prefill email if the user previously checked "Remember me".
  useEffect(() => {
    const remembered = window.localStorage.getItem(REMEMBERED_EMAIL_KEY);
    if (remembered) {
      setEmail(remembered);
      setRememberMe(true);
    }
  }, []);

  function handleFieldChange(field: keyof LoginFormErrors) {
    // Clear a field's error the moment the user starts correcting it.
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);

    const validationErrors = validateLogin({ email, password });
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    try {
      const data = (await apiRequest("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      })) as LoginResponse;

      if (!data?.access_token || !data?.user) {
        throw new Error("Unexpected response from the server. Please try again.");
      }

      saveSession(data.access_token, data.user);

      console.log("SAVED USER:", data.user);
      console.log(
        "LOCAL STORAGE AFTER SAVE:",
        localStorage.getItem("user")
      );

      if (rememberMe) {
        window.localStorage.setItem(REMEMBERED_EMAIL_KEY, email.trim());
      } else {
        window.localStorage.removeItem(REMEMBERED_EMAIL_KEY);
      }

      const redirect =
        new URLSearchParams(window.location.search).get("redirect");

      if (redirect) {
        router.push(redirect);
      } else {
        router.push(getDashboardPath(data.user.roleId));
      }
    } catch (err) {
      setFormError(
        getErrorMessage(err, "Unable to sign in. Please check your credentials and try again.")
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
        <FormField
          label="Email address"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            handleFieldChange("email");
          }}
          error={errors.email}
          required
        />

        <PasswordField
          label="Password"
          name="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            handleFieldChange("password");
          }}
          error={errors.password}
          required
        />
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-2.5 text-sm text-ash cursor-pointer select-none">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="h-4 w-4 border border-line accent-ink cursor-pointer"
          />
          Remember me
        </label>
        <Link
          href="/forgot-password"
          className="text-sm font-medium text-ink underline underline-offset-4 hover:text-ash transition-colors"
        >
          Forgot password?
        </Link>
      </div>

      <div className="mt-7">
        <AuthButton type="submit" loading={loading}>
          Sign in
        </AuthButton>
      </div>

      <p className="mt-6 text-center text-sm text-ash">
        New to FAST Global Marketplace?{" "}
        <Link
          href="/register"
          className="font-medium text-ink underline underline-offset-4 hover:text-ash transition-colors"
        >
          Create an account
        </Link>
      </p>
    </form>
  );
}