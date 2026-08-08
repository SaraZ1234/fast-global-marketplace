"use client";

import { useState } from "react";
import { apiRequest } from "@/lib/api";
import { clearSession } from "@/lib/auth";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { Eyebrow } from "@/components/UI";
import {
  CheckCircle2,
  AlertCircle,
  X,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";

interface NotificationSetting {
  key: string;
  label: string;
  desc: string;
  checked: boolean;
}

const INITIAL_NOTIFICATIONS: NotificationSetting[] = [
  { key: "orders", label: "Order status updates", desc: "Get notified when an order changes status", checked: true },
  { key: "rfqs", label: "New RFQ quotes", desc: "Alerts when suppliers respond to your RFQs", checked: true },
  { key: "messages", label: "Supplier messages", desc: "Notify me of new chat messages", checked: false },
  { key: "marketing", label: "Marketing emails", desc: "Product recommendations and platform news", checked: false },
];

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${checked ? "bg-ink" : "bg-line"}`}
      aria-pressed={checked}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-paper transition-transform duration-200 ${checked ? "translate-x-5" : "translate-x-0"
          }`}
      />
    </button>
  );
}

function getPasswordStrength(pw: string): { label: string; color: string; score: number } {
  if (!pw) return { label: "", color: "", score: 0 };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { label: "Weak", color: "bg-rose-500", score };
  if (score === 2 || score === 3) return { label: "Medium", color: "bg-amber-500", score };
  return { label: "Strong", color: "bg-emerald-500", score };
}


export default function SettingsPage() {
  const [notifications, setNotifications] = useState<NotificationSetting[]>(INITIAL_NOTIFICATIONS);
  const [toast, setToast] = useState<string | null>(null);

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSaving, setPwSaving] = useState(false);

  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [deactivateConfirmText, setDeactivateConfirmText] = useState("");
  const [deactivating, setDeactivating] = useState(false);
  const [deactivated, setDeactivated] = useState(false);

  const strength = getPasswordStrength(newPw);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const toggleNotification = (key: string) => {
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.key === key ? { ...n, checked: !n.checked } : n));
      const changed = updated.find((n) => n.key === key);
      showToast(`${changed?.label} ${changed?.checked ? "enabled" : "disabled"}`);
      return updated;
    });
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError(null);

    if (!currentPw || !newPw || !confirmPw) {
      setPwError("Please fill in all password fields.");
      return;
    }

    if (newPw.length < 8) {
      setPwError("New password must be at least 8 characters.");
      return;
    }

    if (newPw !== confirmPw) {
      setPwError("New password and confirmation do not match.");
      return;
    }

    if (newPw === currentPw) {
      setPwError("New password must be different from current password.");
      return;
    }


    try {

      setPwSaving(true);

      await apiRequest("/auth/change-password", {
        method: "PATCH",
        body: JSON.stringify({
          currentPassword: currentPw,
          newPassword: newPw,
        }),
      });


      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");

      showToast("Password updated successfully");


    } catch (error: any) {

      setPwError(error.message);

    } finally {

      setPwSaving(false);

    }

  };

  const handleDeactivate = async () => {

    if (deactivateConfirmText !== "DEACTIVATE") return;


    try {

      setDeactivating(true);


      await apiRequest("/auth/deactivate", {
        method: "PATCH",
      });


      setDeactivated(true);

      showToast("Account deactivated");


      setTimeout(() => {

        clearSession();

        window.location.href = "/login";

      }, 1500);



    } catch (error: any) {

      showToast(error.message);


    } finally {

      setDeactivating(false);

    }

  };

  return (
    <DashboardShell>
      <div className="mb-6 sm:mb-8">
        <Eyebrow>Settings</Eyebrow>
        <h1 className="mt-2 font-display font-bold text-2xl sm:text-3xl tracking-tightest">
          Account Settings
        </h1>
      </div>

      {deactivated && (
        <div className="max-w-2xl mb-6 border border-rose-200 bg-rose-50 p-4 flex items-start gap-3">
          <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
          <p className="text-sm text-rose-800">
            Your account has been deactivated. Contact support to reactivate it at any time.
          </p>
        </div>
      )}

      <div className="space-y-6 sm:space-y-8 max-w-2xl">
        {/* Notifications */}
        <div className="bg-paper border border-line p-5 sm:p-6">
          <p className="font-mono text-xs uppercase tracking-widest2 text-smoke mb-5">Notifications</p>
          <div className="space-y-4">
            {notifications.map((item) => (
              <div key={item.key} className="flex items-center justify-between gap-4 py-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-smoke mt-0.5">{item.desc}</p>
                </div>
                <Toggle checked={item.checked} onChange={() => toggleNotification(item.key)} />
              </div>
            ))}
          </div>
        </div>

        {/* Security */}
        <form onSubmit={handlePasswordSubmit} className="bg-paper border border-line p-5 sm:p-6">
          <p className="font-mono text-xs uppercase tracking-widest2 text-smoke mb-5">Security</p>

          {pwError && (
            <div className="mb-4 flex items-start gap-2 border border-rose-200 bg-rose-50 px-3 py-2.5">
              <AlertCircle size={14} className="text-rose-600 shrink-0 mt-0.5" />
              <p className="text-xs text-rose-800">{pwError}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-mono uppercase tracking-widest2 text-smoke">Current Password</label>
              <div className="relative mt-1.5">
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPw}
                  onChange={(e) => setCurrentPw(e.target.value)}
                  className="w-full bg-bone border border-line px-3 py-2.5 pr-10 text-sm focus:outline-none focus:border-ash"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-smoke hover:text-ink transition-colors"
                  aria-label={showCurrent ? "Hide password" : "Show password"}
                >
                  {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase tracking-widest2 text-smoke">New Password</label>
              <div className="relative mt-1.5">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  className="w-full bg-bone border border-line px-3 py-2.5 pr-10 text-sm focus:outline-none focus:border-ash"
                />
                <button
                  type="button"
                  onClick={() => setShowNew((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-smoke hover:text-ink transition-colors"
                  aria-label={showNew ? "Hide password" : "Show password"}
                >
                  {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {newPw && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1 bg-line overflow-hidden rounded-full">
                    <div
                      className={`h-full transition-all duration-300 ${strength.color}`}
                      style={{ width: `${(strength.score / 4) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-smoke shrink-0">{strength.label}</span>
                </div>
              )}
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase tracking-widest2 text-smoke">Confirm New Password</label>
              <input
                type={showNew ? "text" : "password"}
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                className="mt-1.5 w-full bg-bone border border-line px-3 py-2.5 text-sm focus:outline-none focus:border-ash"
              />
            </div>

            <button
              type="submit"
              disabled={pwSaving}
              className="inline-flex items-center gap-2 bg-ink text-paper text-xs font-mono uppercase tracking-widest2 px-6 py-3 hover:bg-ash transition-colors disabled:opacity-60"
            >
              {pwSaving && <Loader2 size={13} className="animate-spin" />}
              {pwSaving ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>

        {/* Danger Zone */}
        <div className="bg-paper border border-rose-200 p-5 sm:p-6">
          <p className="font-mono text-xs uppercase tracking-widest2 text-rose-700 mb-2">Danger Zone</p>
          <p className="text-sm text-ash mb-4">
            Deactivating your account will hide your profile and pause all active orders.
          </p>
          <button
            type="button"
            onClick={() => setDeactivateOpen(true)}
            disabled={deactivated}
            className="border border-rose-300 text-rose-700 text-xs font-mono uppercase tracking-widest2 px-6 py-3 hover:bg-rose-50 transition-colors disabled:opacity-50 disabled:pointer-events-none"
          >
            {deactivated ? "Account Deactivated" : "Deactivate Account"}
          </button>
        </div>
      </div>

      {/* Deactivate confirmation modal */}
      {deactivateOpen && (
        <div
          className="fixed inset-0 z-50 bg-ink/50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-[fadeIn_0.2s_ease-out]"
          onClick={() => !deactivating && setDeactivateOpen(false)}
        >
          <div
            className="bg-paper w-full sm:max-w-sm border-t sm:border border-rose-200 p-5 sm:p-6 animate-[slideUp_0.25s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertCircle size={18} className="text-rose-600 shrink-0" />
                <h2 className="font-display font-bold text-lg tracking-tightest">Deactivate Account</h2>
              </div>
              <button
                type="button"
                onClick={() => !deactivating && setDeactivateOpen(false)}
                className="w-7 h-7 flex items-center justify-center hover:bg-bone transition-colors shrink-0"
                aria-label="Close"
              >
                <X size={15} />
              </button>
            </div>

            <p className="text-sm text-ash leading-relaxed">
              This will hide your profile and pause all active orders and RFQs. This action can be
              reversed by contacting support.
            </p>

            <p className="mt-4 text-xs font-mono uppercase tracking-widest2 text-smoke">
              Type <span className="text-ink font-semibold">DEACTIVATE</span> to confirm
            </p>
            <input
              type="text"
              value={deactivateConfirmText}
              onChange={(e) => setDeactivateConfirmText(e.target.value)}
              placeholder="DEACTIVATE"
              className="mt-2 w-full bg-bone border border-line px-3 py-2.5 text-sm focus:outline-none focus:border-rose-400"
            />

            <div className="mt-5 flex items-center gap-3">
              <button
                type="button"
                onClick={handleDeactivate}
                disabled={deactivateConfirmText !== "DEACTIVATE" || deactivating}
                className="inline-flex items-center gap-2 bg-rose-600 text-paper text-xs font-mono uppercase tracking-widest2 px-5 py-2.5 hover:bg-rose-700 transition-colors disabled:opacity-40 disabled:pointer-events-none"
              >
                {deactivating && <Loader2 size={13} className="animate-spin" />}
                {deactivating ? "Deactivating..." : "Confirm Deactivation"}
              </button>
              <button
                type="button"
                onClick={() => setDeactivateOpen(false)}
                disabled={deactivating}
                className="text-xs font-mono uppercase tracking-widest2 text-smoke hover:text-ink transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 sm:bottom-6 left-1/2 -translate-x-1/2 z-[60] bg-ink text-paper px-4 py-3 flex items-center gap-2 text-sm animate-[fadeUp_0.2s_ease-out] shadow-lg">
          <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
          {toast}
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </DashboardShell>
  );
}