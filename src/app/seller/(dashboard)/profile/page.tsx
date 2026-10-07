"use client";

import { useState } from "react";
import { Pencil, Save, X, ImagePlus } from "lucide-react";
import { useSellerStore } from "@/lib/sellerStore";
import { apiRequest } from "@/lib/api";
export default function SellerProfilePage() {
  const { profile, updateProfile, pushToast } = useSellerStore();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(profile);

  const startEditing = () => {
    setDraft(profile);
    setIsEditing(true);
  };

  const save = async () => {
    try {
      const updated = await apiRequest("/vendors/my-profile", {
        method: "PATCH",
        body: JSON.stringify({
          companyName: draft.businessName,
          contactName: draft.contactName,
          companyEmail: draft.email,
          phone: draft.phone,
          address: draft.location,
          description: draft.description,
        }),
      });

      console.log("UPDATED SELLER PROFILE:", updated);

      updateProfile(draft);
      pushToast("success", "Profile updated.");
      setIsEditing(false);
    } catch (error) {
      console.error("FAILED TO UPDATE SELLER PROFILE:", error);
      pushToast("error", "Failed to update profile.");
    }
  };

  const handleLogoChange = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setDraft((prev) => ({ ...prev, logoUrl: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const joinedLabel = new Date(profile.joinedAt).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
  });

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-2xl">Seller Profile</h1>
        {!isEditing && (
          <button
            onClick={startEditing}
            className="inline-flex items-center gap-2 border border-line px-3 py-2 text-xs font-mono uppercase tracking-wider hover:border-ink transition-colors"
          >
            <Pencil size={13} /> Edit Profile
          </button>
        )}
      </div>

      <div className="border border-line bg-paper p-6 sm:p-7">
        <div className="flex items-center gap-4">
          <label className="relative w-20 h-20 bg-bone border border-line overflow-hidden shrink-0 cursor-pointer group">
            {draft.logoUrl ? (
              <img src={draft.logoUrl} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-ash">
                <ImagePlus size={20} />
              </div>
            )}
            {isEditing && (
              <>
                <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/40 transition-colors" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleLogoChange(e.target.files?.[0])}
                />
              </>
            )}
          </label>
          <div>
            <p className="font-display font-semibold text-lg">{profile.businessName || "Unnamed Seller"}</p>
            <p className="text-xs text-ash font-mono mt-0.5">Joined {joinedLabel}</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {(
            [
              ["businessName", "Business / Seller Name"],
              ["contactName", "Contact Name"],
              ["email", "Email"],
              ["phone", "Phone"],
              ["location", "Location"],
            ] as const
          ).map(([key, label]) => (
            <div key={key}>
              <label className="text-xs font-mono uppercase tracking-wider text-ash">{label}</label>
              {isEditing ? (
                <input
                  value={draft[key]}
                  onChange={(e) => setDraft((prev) => ({ ...prev, [key]: e.target.value }))}
                  className="w-full mt-1.5 px-3 py-2.5 bg-bone border border-line text-sm focus:outline-none focus:border-ink"
                />
              ) : (
                <p className="mt-1.5 text-sm">{profile[key] || "—"}</p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4">
          <label className="text-xs font-mono uppercase tracking-wider text-ash">Description</label>
          {isEditing ? (
            <textarea
              value={draft.description}
              onChange={(e) => setDraft((prev) => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full mt-1.5 px-3 py-2.5 bg-bone border border-line text-sm focus:outline-none focus:border-ink resize-none"
            />
          ) : (
            <p className="mt-1.5 text-sm text-ash leading-relaxed">{profile.description || "No description yet."}</p>
          )}
        </div>

        {isEditing && (
          <div className="mt-6 flex gap-3 justify-end">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-xs font-mono uppercase tracking-wider border border-line hover:border-ink transition-colors flex items-center gap-2"
            >
              <X size={13} /> Cancel
            </button>
            <button
              onClick={save}
              className="px-4 py-2 text-xs font-mono uppercase tracking-wider bg-ink text-paper hover:bg-ash transition-colors flex items-center gap-2"
            >
              <Save size={13} /> Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
