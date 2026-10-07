"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { getErrorMessage } from "@/lib/auth";

const SELLER_ROLE_ID = 4; // 1 = ADMIN, 2 = VENDOR, 3 = BUYER, 4 = SELLER

interface SellerVendor {
  id: number;
  companyName: string;
  contactName: string;
  sellerType: string;
  status: string;
  verified: boolean;
}

interface LoginResponse {
  message: string;
  access_token: string;
  user: {
    id: number;
    fullName: string;
    email: string;
    roleId: number;
    isSeller?: boolean;
    vendor?: SellerVendor | null;
  };
}

export default function SellerLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    try {
      // ADJUST 1: match the call signature of your existing apiRequest
      // (e.g. it may take (path, method, body) or (path, { method, body })).
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const user = data?.user;
      const isSeller = user && (user.roleId === SELLER_ROLE_ID || user.isSeller === true);

      // Check the role BEFORE saving anything, so a non-seller account
      // never ends up authenticated through this page.
      if (!data?.access_token || !user || !isSeller) {
        setError("This account is not registered as a seller.");
        return;
      }

      // ADJUST 2: replace with the exact keys/helper your buyer login uses
      // (e.g. a login() helper, auth context, or store) so JwtGuard APIs work.
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user", JSON.stringify(user));

      router.push("/seller/dashboard");
    } catch (err) {
      setError(getErrorMessage(err, "Seller login failed. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-paper text-ink min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md"
      >
        <div className="text-center">
          <p className="text-xs font-mono uppercase tracking-widest text-ash">
            FAST Global Marketplace
          </p>
          <h1 className="mt-2 font-display font-bold text-3xl">Seller Login</h1>
          <p className="mt-2 text-sm text-ash">
            Log in to manage your store, products, categories, and listings.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate={false}
          className="mt-8 border border-line bg-paper p-6 sm:p-7 space-y-4"
        >
          {error && (
            <div
              role="alert"
              className="flex items-start gap-2.5 border border-line bg-bone px-3 py-2.5 text-sm text-ink"
            >
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <p className="leading-snug">{error}</p>
            </div>
          )}

          <div>
            <label
              htmlFor="seller-email"
              className="text-xs font-mono uppercase tracking-wider text-ash"
            >
              Email
            </label>
            <input
              id="seller-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              placeholder="you@example.com"
              className="w-full mt-1.5 px-3 py-2.5 bg-bone border border-line text-sm placeholder:text-smoke focus:outline-none focus:border-ink transition-colors disabled:opacity-60"
            />
          </div>

          <div>
            <label
              htmlFor="seller-password"
              className="text-xs font-mono uppercase tracking-wider text-ash"
            >
              Password
            </label>
            <div className="relative mt-1.5">
              <input
                id="seller-password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                placeholder="Enter your password"
                className="w-full pl-3 pr-10 py-2.5 bg-bone border border-line text-sm placeholder:text-smoke focus:outline-none focus:border-ink transition-colors disabled:opacity-60"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                disabled={loading}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ash hover:text-ink transition-colors disabled:opacity-60"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 bg-ink text-paper text-xs font-mono uppercase tracking-wider font-semibold hover:bg-ash transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-ash space-y-2">
          <p>
            Don&apos;t have a seller account?{" "}
            <Link href="/sell/register" className="text-ink font-medium hover:underline">
              Become a Seller
            </Link>
          </p>
          <p>
            <Link href="/" className="text-ash hover:text-ink transition-colors">
              Back to Marketplace
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// Details:
// Email: testseller2@example.com
// Password: Test123456