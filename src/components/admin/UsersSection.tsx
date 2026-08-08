"use client";

import { useMemo, useState } from "react";
import { Search, Users as UsersIcon, ShieldOff, ShieldCheck } from "lucide-react";
import { StatusBadge, EmptyState, TabSectionHeading } from "@/components/vendor/VendorUI";
import { USER_STATUS_STYLES, type PlatformUser, type UserStatus } from "./data";

interface UsersSectionProps {
  users: any[];
  onToggleStatus: (id: number) => void;
}

const STATUS_FILTERS: (UserStatus | "All")[] = ["All", "Active", "Suspended"];

export default function UsersSection({ users, onToggleStatus }: UsersSectionProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "All">("All");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      const matchesSearch =
        !q || u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Active" && u.status) ||
        (statusFilter === "Suspended" && !u.status);
      return matchesSearch && matchesStatus;
    });
  }, [users, search, statusFilter]);

  return (
    <div className="animate-[fadeIn_0.25s_ease-out]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <TabSectionHeading title="Users" description={`${users.length} registered buyers`} />
        <div className="flex gap-3">
          <div className="flex items-center gap-2 border border-line px-3 py-2 bg-paper flex-1 sm:flex-none sm:w-56 focus-within:border-ash transition-colors">
            <Search size={15} className="text-smoke shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or email..."
              className="w-full bg-transparent text-sm placeholder:text-smoke focus:outline-none min-w-0"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as UserStatus | "All")}
            className="border border-line bg-paper px-3 py-2 text-sm text-ink focus:outline-none focus:border-ash transition-colors"
          >
            {STATUS_FILTERS.map((s) => (
              <option key={s} value={s}>
                {s === "All" ? "All statuses" : s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={UsersIcon}
          title="No users found"
          description="Try a different search term or status filter."
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block border border-line overflow-hidden">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-bone border-b border-line">
                  <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-widest2 text-smoke">Name</th>
                  <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-widest2 text-smoke">Email</th>
                  <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-widest2 text-smoke">Orders</th>
                  <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-widest2 text-smoke">Joined</th>
                  <th className="px-4 py-3 text-left font-mono text-[11px] uppercase tracking-widest2 text-smoke">Status</th>
                  <th className="px-4 py-3 text-right font-mono text-[11px] uppercase tracking-widest2 text-smoke">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user, i) => (
                  <tr
                    key={user.id}
                    className="border-b border-line last:border-0 hover:bg-bone transition-colors animate-[fadeUp_0.3s_ease-out_backwards]"
                    style={{ animationDelay: `${i * 30}ms` }}
                  >
                    <td className="px-4 py-3.5 font-medium text-ink whitespace-nowrap">{user.fullName}</td>
                    <td className="px-4 py-3.5 text-ash whitespace-nowrap">{user.email}</td>
                    <td className="px-4 py-3.5 text-ash whitespace-nowrap">{user.orders?.length ?? 0}</td>
                    <td className="px-4 py-3.5 text-ash font-mono text-xs whitespace-nowrap">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge
                        status={user.status ? "Active" : "Suspended"} styles={USER_STATUS_STYLES} />
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => onToggleStatus(user.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border transition-colors ${user.status
                          ? "border-line text-rose-600 hover:border-rose-300 hover:bg-rose-50"
                          : "border-line text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50"
                          }`}
                      >
                        {user.status ? (
                          <>
                            <ShieldOff size={13} /> Suspend
                          </>
                        ) : (
                          <>
                            <ShieldCheck size={13} /> Reactivate
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {filtered.map((user, i) => (
              <div
                key={user.id}
                className="border border-line p-4 bg-paper animate-[fadeUp_0.3s_ease-out_backwards]"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <p className="font-mono text-xs text-smoke">{user.id}</p>
                  <StatusBadge
                    status={user.status ? "Active" : "Suspended"} styles={USER_STATUS_STYLES} />
                </div>
                <p className="font-display font-semibold text-sm tracking-tight text-ink mb-1">
                  {user.fullName}
                </p>
                <p className="text-xs text-ash mb-3">{user.email}</p>
                <div className="flex items-center justify-between text-sm pt-3 border-t border-line mb-3">
                  <span className="text-ash">{user.orders?.length ?? 0} orders</span>
                  <span className="text-[11px] text-smoke font-mono">
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onToggleStatus(user.id)}
                  // className={`w-full inline-flex items-center justify-center gap-1.5 py-2 text-xs font-medium border transition-colors ${user.status === "Active"
                  //   ? "border-line text-rose-600 hover:border-rose-300 hover:bg-rose-50"
                  //   : "border-line text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50"
                  //   }`}
                  className={`w-full inline-flex items-center justify-center gap-1.5 py-2 text-xs font-medium border transition-colors ${user.status
                    ? "border-line text-rose-600 hover:border-rose-300 hover:bg-rose-50"
                    : "border-line text-emerald-700 hover:border-emerald-300 hover:bg-emerald-50"
                    }`}
                >
                  {user.status ? (
                    <>
                      <ShieldOff size={13} /> Suspend
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={13} /> Reactivate
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}