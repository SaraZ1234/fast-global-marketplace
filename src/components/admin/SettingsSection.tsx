"use client";

import { useState, type FormEvent } from "react";
import { Check, Loader2 } from "lucide-react";
import { TabSectionHeading } from "@/components/vendor/VendorUI";

interface SettingsState {
  siteName: string;
  supportEmail: string;
  commissionRate: number;
  autoApproveProducts: boolean;
  maintenanceMode: boolean;
}

const INITIAL_SETTINGS: SettingsState = {
  siteName: "FAST Global Marketplace",
  supportEmail: "support@fastglobalmarketplace.com",
  commissionRate: 5,
  autoApproveProducts: false,
  maintenanceMode: false,
};

/**
 * Wire onSubmit to your real endpoint, e.g.:
 *   apiRequest("/admin/settings", { method: "PATCH", body: JSON.stringify(settings) })
 */
export default function SettingsSection() {
  const [settings, setSettings] = useState<SettingsState>(INITIAL_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      // await apiRequest("/admin/settings", {
      //   method: "PATCH",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(settings),
      // });
      await new Promise((resolve) => setTimeout(resolve, 500));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="animate-[fadeIn_0.25s_ease-out] max-w-2xl">
      <TabSectionHeading
        title="Platform Settings"
        description="General configuration for FAST Global Marketplace."
      />

      <form onSubmit={handleSubmit} className="border border-line bg-paper p-5 sm:p-6 space-y-6">
        <div>
          <label
            htmlFor="siteName"
            className="block text-xs font-mono uppercase tracking-widest2 text-smoke mb-2"
          >
            Platform Name
          </label>
          <input
            id="siteName"
            type="text"
            value={settings.siteName}
            onChange={(e) => setSettings((s) => ({ ...s, siteName: e.target.value }))}
            className="w-full border border-line bg-paper px-4 py-3 text-sm text-ink focus:outline-none focus:border-ash transition-colors"
          />
        </div>

        <div>
          <label
            htmlFor="supportEmail"
            className="block text-xs font-mono uppercase tracking-widest2 text-smoke mb-2"
          >
            Support Email
          </label>
          <input
            id="supportEmail"
            type="email"
            value={settings.supportEmail}
            onChange={(e) => setSettings((s) => ({ ...s, supportEmail: e.target.value }))}
            className="w-full border border-line bg-paper px-4 py-3 text-sm text-ink focus:outline-none focus:border-ash transition-colors"
          />
        </div>

        <div>
          <label
            htmlFor="commissionRate"
            className="block text-xs font-mono uppercase tracking-widest2 text-smoke mb-2"
          >
            Platform Commission Rate (%)
          </label>
          <input
            id="commissionRate"
            type="number"
            min={0}
            max={100}
            step={0.1}
            value={settings.commissionRate}
            onChange={(e) =>
              setSettings((s) => ({ ...s, commissionRate: Number(e.target.value) }))
            }
            className="w-full sm:w-40 border border-line bg-paper px-4 py-3 text-sm text-ink focus:outline-none focus:border-ash transition-colors"
          />
        </div>

        <div className="space-y-4 pt-2 border-t border-line">
          <label className="flex items-start justify-between gap-4 pt-4 cursor-pointer select-none">
            <span>
              <span className="block text-sm font-medium text-ink">
                Auto-approve product submissions
              </span>
              <span className="block text-xs text-ash mt-0.5">
                Skip manual review for listings from verified vendors.
              </span>
            </span>
            <input
              type="checkbox"
              checked={settings.autoApproveProducts}
              onChange={(e) =>
                setSettings((s) => ({ ...s, autoApproveProducts: e.target.checked }))
              }
              className="mt-0.5 h-4 w-4 border border-line accent-ink cursor-pointer shrink-0"
            />
          </label>

          <label className="flex items-start justify-between gap-4 cursor-pointer select-none">
            <span>
              <span className="block text-sm font-medium text-ink">Maintenance mode</span>
              <span className="block text-xs text-ash mt-0.5">
                Temporarily disable storefront access for buyers.
              </span>
            </span>
            <input
              type="checkbox"
              checked={settings.maintenanceMode}
              onChange={(e) =>
                setSettings((s) => ({ ...s, maintenanceMode: e.target.checked }))
              }
              className="mt-0.5 h-4 w-4 border border-line accent-ink cursor-pointer shrink-0"
            />
          </label>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-ink text-paper px-5 py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            {saving ? "Saving…" : "Save Changes"}
          </button>
          {saved && (
            <span className="inline-flex items-center gap-1.5 text-sm text-emerald-700 animate-[fadeIn_0.2s_ease-out]">
              <Check size={15} /> Saved
            </span>
          )}
        </div>
      </form>
    </div>
  );
}