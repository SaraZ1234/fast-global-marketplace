"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { apiRequest } from "@/lib/api";
import { getErrorMessage } from "@/lib/auth";
import { useSellerStore } from "@/lib/sellerStore";
import { SellerProfile } from "@/lib/sellerTypes";

export default function SellerRegisterPage() {
  const router = useRouter();
  const { completeOnboarding, pushToast } = useSellerStore();

  // Account information
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Seller information
  const [businessName, setBusinessName] = useState("");
  const [contactName, setContactName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [sellerType, setSellerType] =
    useState<SellerProfile["sellerType"]>("individual");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const isValid =
    fullName.trim() &&
    email.trim() &&
    password &&
    confirmPassword &&
    businessName.trim() &&
    contactName.trim() &&
    phone.trim() &&
    location.trim();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!isValid) {
      pushToast("error", "Please fill in all required fields.");
      return;
    }

    if (password.length < 6) {
      setFormError("Password must be at least 6 characters long.");
      pushToast("error", "Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      pushToast("error", "Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const data = await apiRequest("/auth/register-seller", {
        method: "POST",
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          password,

          companyName: businessName.trim(),
          contactName: contactName.trim(),
          phone: phone.trim(),
          address: location.trim(),
          sellerType,
          description: description.trim() || undefined,
        }),
      });

      // Keep the current frontend seller store synchronized temporarily.
      // This will later be replaced completely by backend data.
      completeOnboarding({
        businessName: businessName.trim(),
        contactName: contactName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        location: location.trim(),
        sellerType,
        description: description.trim(),
      });

      pushToast(
        "success",
        data?.message ||
          "Seller account created successfully. You can now log in."
      );

      router.push("/seller/login");
    } catch (err) {
      const message = getErrorMessage(
        err,
        "Unable to create your seller account. Please try again."
      );

      setFormError(message);
      pushToast("error", message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-paper text-ink min-h-screen flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-lg"
      >
        <p className="text-xs font-mono uppercase tracking-widest text-ash text-center">
          Step 1 of 1
        </p>

        <h1 className="mt-2 font-display font-bold text-2xl sm:text-3xl text-center">
          Create your seller account
        </h1>

        <p className="text-ash text-sm text-center mt-2">
          Create your account and seller profile to start selling on FAST
          Global Marketplace.
        </p>

        {formError && (
          <div className="mt-6 border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
            {formError}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-8 border border-line bg-paper p-6 sm:p-7 space-y-5"
        >
          {/* Account Information */}
          <div>
            <h2 className="font-semibold text-sm">Account Information</h2>
            <p className="text-xs text-ash mt-1">
              These details will be used to log in to your seller account.
            </p>
          </div>

          {/* Full Name */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-ash">
              Full Name *
            </label>

            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              disabled={loading}
              autoComplete="name"
              className="w-full mt-1.5 px-3 py-2.5 bg-bone border border-line text-sm focus:outline-none focus:border-ink disabled:opacity-60"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-ash">
              Email *
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={loading}
              autoComplete="email"
              className="w-full mt-1.5 px-3 py-2.5 bg-bone border border-line text-sm focus:outline-none focus:border-ink disabled:opacity-60"
            />
          </div>

          {/* Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-ash">
                Password *
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                disabled={loading}
                autoComplete="new-password"
                className="w-full mt-1.5 px-3 py-2.5 bg-bone border border-line text-sm focus:outline-none focus:border-ink disabled:opacity-60"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-ash">
                Confirm Password *
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                disabled={loading}
                autoComplete="new-password"
                className="w-full mt-1.5 px-3 py-2.5 bg-bone border border-line text-sm focus:outline-none focus:border-ink disabled:opacity-60"
              />
            </div>
          </div>

          {/* Seller Information */}
          <div className="pt-2">
            <h2 className="font-semibold text-sm">Seller Information</h2>
            <p className="text-xs text-ash mt-1">
              This information appears on your listings so buyers know who
              they're dealing with.
            </p>
          </div>

          {/* Business / Seller Name */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-ash">
              Business / Seller Name *
            </label>

            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="e.g. Sarah Tech Store"
              disabled={loading}
              className="w-full mt-1.5 px-3 py-2.5 bg-bone border border-line text-sm focus:outline-none focus:border-ink disabled:opacity-60"
            />
          </div>

          {/* Contact Name */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-ash">
              Contact Name *
            </label>

            <input
              type="text"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="Your full name"
              disabled={loading}
              className="w-full mt-1.5 px-3 py-2.5 bg-bone border border-line text-sm focus:outline-none focus:border-ink disabled:opacity-60"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-ash">
              Phone *
            </label>

            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+92 300 1234567"
              disabled={loading}
              autoComplete="tel"
              className="w-full mt-1.5 px-3 py-2.5 bg-bone border border-line text-sm focus:outline-none focus:border-ink disabled:opacity-60"
            />
          </div>

          {/* Location + Seller Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-ash">
                Location *
              </label>

              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, Country"
                disabled={loading}
                className="w-full mt-1.5 px-3 py-2.5 bg-bone border border-line text-sm focus:outline-none focus:border-ink disabled:opacity-60"
              />
            </div>

            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-ash">
                Seller Type
              </label>

              <select
                value={sellerType}
                onChange={(e) =>
                  setSellerType(
                    e.target.value as SellerProfile["sellerType"]
                  )
                }
                disabled={loading}
                className="w-full mt-1.5 px-3 py-2.5 bg-bone border border-line text-sm focus:outline-none focus:border-ink disabled:opacity-60"
              >
                <option value="individual">Individual</option>
                <option value="business">Registered Business</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-mono uppercase tracking-wider text-ash">
              Short Description
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Tell buyers what you sell."
              disabled={loading}
              className="w-full mt-1.5 px-3 py-2.5 bg-bone border border-line text-sm focus:outline-none focus:border-ink resize-none disabled:opacity-60"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 bg-ink text-paper text-xs font-mono uppercase tracking-wider font-semibold hover:bg-ash transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              "Creating Account..."
            ) : (
              <>
                Create Seller Account
                <ArrowRight size={14} />
              </>
            )}
          </button>

          <p className="text-center text-xs text-ash pt-1">
            Already have a seller account?{" "}
            <button
              type="button"
              onClick={() => router.push("/seller/login")}
              disabled={loading}
              className="text-ink font-semibold hover:underline"
            >
              Seller Login
            </button>
          </p>
        </form>
      </motion.div>
    </div>
  );
}

