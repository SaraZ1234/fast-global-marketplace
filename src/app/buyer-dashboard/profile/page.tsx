"use client";

import { useState, useRef, useEffect } from "react";
import { apiRequest } from "@/lib/api";
import Image from "next/image";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { Eyebrow } from "@/components/UI";
import {
  Mail,
  Phone,
  MapPin,
  Building2,
  Calendar,
  Camera,
  X,
  CheckCircle2,
  Pencil,
} from "lucide-react";

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  memberSince: string;
  profileImg: string | null;

  totalOrders: number;
  activeRfqs: number;
  yearsTrading: number;
}

const INITIAL_PROFILE: ProfileData = {
  name: "Ahmed Khan",
  email: "ahmed.khan@buyerco.com",
  phone: "+92 300 1234567",
  memberSince: "March 2024",
  profileImg: null,
  totalOrders: 0,
  activeRfqs: 0,
  yearsTrading: 0,
};


function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export default function ProfilePage() {

  console.log("PROFILE PAGE RENDER");
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [draft, setDraft] = useState<ProfileData | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadProfile() {
      const data = await apiRequest("/auth/profile");

      console.log("PROFILE DATA:", data);

      const userProfile: ProfileData = {
        name: data.fullName,
        email: data.email,
        phone: data.phone || "",
        memberSince: new Date(data.createdAt).toDateString(),
        profileImg: data.profileImg || null,

        totalOrders: data.totalOrders || 0,
        activeRfqs: data.activeRfqs || 0,
        yearsTrading: data.yearsTrading || 0,
      };

      setProfile(userProfile);
      setDraft(userProfile);

      setAvatar(
        userProfile.profileImg
          ? `http://localhost:3001/uploads/${userProfile.profileImg}`
          : null
      );
    }

    loadProfile();
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const startEditing = () => {
    console.log("START EDIT FUNCTION");

    if (!profile) {
      console.log("PROFILE NULL");
      return;
    }

    setDraft({ ...profile });
    setEditing(true);
  };

  const cancelEditing = () => {
    setDraft(profile);
    setEditing(false);
  };

  const handleChange =
    (field: keyof ProfileData) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setDraft((prev) => {
          if (!prev) return prev;

          return {
            ...prev,
            [field]: e.target.value,
          };
        });
      };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!draft) return;

    try {
      setSaving(true);

      const updated = await apiRequest("/auth/profile", {
        method: "PATCH",
        body: JSON.stringify({
          fullName: draft.name,
          phone: draft.phone,
        }),
      });

      const updatedProfile = {
        ...profile!,
        name: updated.fullName,
        email: updated.email,
        phone: updated.phone || "",
        memberSince: profile?.memberSince || "",
      };

      setProfile(updatedProfile);
      setDraft(updatedProfile);
      setEditing(false);

      showToast("Profile updated successfully");
    } catch (error) {
      console.error(error);
      showToast("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoClick = () => fileInputRef.current?.click();

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Please select a valid image file");
      return;
    }

    try {
      const token = localStorage.getItem("access_token");

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        "http://localhost:3001/auth/profile/photo",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();

      console.log("PHOTO UPLOAD RESPONSE:", data);


      if (!response.ok) {
        throw new Error(data.message || "Upload failed");
      }

      setAvatar(`http://localhost:3001/uploads/${data.profileImg}`);

      showToast("Profile photo updated");

    } catch (error: any) {
      console.error("PHOTO UPLOAD ERROR:", error.message);
      showToast(error.message);
    }

    e.target.value = "";
  };

  const fields: { key: keyof ProfileData; label: string; icon: typeof Mail; type?: string }[] = [
    { key: "email", label: "Email", icon: Mail, type: "email" },
    { key: "phone", label: "Phone", icon: Phone, type: "tel" },
  ];

  return (
    <DashboardShell>
      <div className="mb-6 sm:mb-8">
        <Eyebrow>My Profile</Eyebrow>
        <h1 className="mt-2 font-display font-bold text-2xl sm:text-3xl tracking-tightest">
          Account Overview
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="lg:col-span-1">
          <div className="bg-paper border border-line p-6 text-center">
            <div className="relative w-20 h-20 mx-auto">
              {avatar ? (
                <div className="relative w-20 h-20 rounded-full overflow-hidden">
                  <Image
                    src={avatar}
                    alt="Profile photo"
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-ink text-paper flex items-center justify-center font-display font-bold text-2xl">
                  {getInitials(profile?.name || "User")}
                </div>
              )}
              <button
                type="button"
                onClick={handlePhotoClick}
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-paper border border-line flex items-center justify-center hover:border-ash transition-colors"
                aria-label="Change photo"
              >
                <Camera size={12} />
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />

            {editing ? (
              <input
                type="text"
                value={draft?.name || ""} onChange={handleChange("name")}
                className="mt-4 w-full text-center bg-bone border border-line px-2 py-1.5 font-display font-semibold text-lg focus:outline-none focus:border-ash"
              />
            ) : (
              <h2 className="mt-4 font-display font-semibold text-lg break-words">{profile?.name || "User"}</h2>
            )}
            <p className="text-xs text-smoke font-mono uppercase tracking-wide mt-1">Buyer Account</p>
            <button
              type="button"
              onClick={handlePhotoClick}
              className="mt-5 w-full border border-line px-4 py-2.5 text-xs font-mono uppercase tracking-widest2 hover:border-ash transition-colors"
            >
              Change Photo
            </button>
          </div>
        </div>

        <div className="lg:col-span-2">
          <form onSubmit={handleSave} className="bg-paper border border-line p-5 sm:p-6">
            <div className="flex items-center justify-between mb-5">
              <p className="font-mono text-xs uppercase tracking-widest2 text-smoke">Contact Information</p>
              {editing && (
                <span className="text-[10px] font-mono uppercase tracking-widest2 text-ink border border-line px-2 py-1">
                  Editing
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {fields.map((f) => (
                <div key={f.key} className="flex items-start gap-3">
                  <f.icon size={16} className="text-smoke shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-mono uppercase tracking-widest2 text-smoke">{f.label}</p>
                    {editing ? (
                      <input
                        type={f.type || "text"}
                        value={draft?.[f.key] || ""}
                        onChange={handleChange(f.key)}
                        required
                        className="mt-1 w-full bg-bone border border-line px-2.5 py-1.5 text-sm font-medium focus:outline-none focus:border-ash"
                      />
                    ) : (
                      <p className="mt-1 text-sm font-medium break-words">{profile?.[f.key] || ""}</p>
                    )}
                  </div>
                </div>
              ))}
              <div className="flex items-start gap-3">
                <Calendar size={16} className="text-smoke shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-[10px] font-mono uppercase tracking-widest2 text-smoke">Member Since</p>
                  <p className="mt-1 text-sm font-medium">{profile?.memberSince || ""}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              {editing ? (
                <>
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-ink text-paper text-xs font-mono uppercase tracking-widest2 px-6 py-3 hover:bg-ash transition-colors disabled:opacity-60"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={cancelEditing}
                    disabled={saving}
                    className="inline-flex items-center gap-1.5 border border-line text-xs font-mono uppercase tracking-widest2 px-6 py-3 hover:border-ash transition-colors disabled:opacity-60"
                  >
                    <X size={13} /> Cancel
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    console.log("EDIT CLICK FINAL");
                    startEditing();
                  }}
                  className="inline-flex items-center gap-1.5 bg-ink text-paper text-xs font-mono uppercase tracking-widest2 px-6 py-3 hover:bg-ash transition-colors"
                >
                  <Pencil size={13} /> Edit Profile
                </button>
              )}
            </div>
          </form>

          <div className="mt-6 grid grid-cols-3 gap-px bg-line border border-line">

            <div className="bg-paper p-4 sm:p-5 text-center">
              <p className="font-display font-bold text-xl sm:text-2xl">
                {profile?.totalOrders || 0}
              </p>
              <p className="text-[10px] font-mono uppercase tracking-widest2 text-smoke mt-1">
                Total Orders
              </p>
            </div>


            <div className="bg-paper p-4 sm:p-5 text-center">
              <p className="font-display font-bold text-xl sm:text-2xl">
                {profile?.activeRfqs || 0}
              </p>
              <p className="text-[10px] font-mono uppercase tracking-widest2 text-smoke mt-1">
                Active RFQs
              </p>
            </div>


            <div className="bg-paper p-4 sm:p-5 text-center">
              <p className="font-display font-bold text-xl sm:text-2xl">
                {profile?.yearsTrading || 0}
              </p>
              <p className="text-[10px] font-mono uppercase tracking-widest2 text-smoke mt-1">
                Years Trading
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 sm:bottom-6 left-1/2 -translate-x-1/2 z-[60] bg-ink text-paper px-4 py-3 flex items-center gap-2 text-sm animate-[fadeUp_0.2s_ease-out] shadow-lg">
          <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
          {toast}
        </div>
      )}

      <style jsx>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </DashboardShell>
  );
}