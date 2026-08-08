"use client";

import { useState } from "react";
import { MessageSquare, Send } from "lucide-react";
import { INQUIRY_STATUS_STYLES, type VendorInquiry } from "./data";
import { EmptyState, StatusBadge, TabSectionHeading } from "./VendorUI";

interface InquiriesTabProps {
  inquiries: VendorInquiry[];
  onReply: (id: string, message: string) => void;
}

export default function InquiriesTab({ inquiries, onReply }: InquiriesTabProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const unreadCount = inquiries.filter((i) => i.status === "Unread").length;

  function handleOpen(id: string) {
    setOpenId((prev) => (prev === id ? null : id));
    setDraft("");
  }

  function handleSend(id: string) {
    if (!draft.trim()) return;
    onReply(id, draft.trim());
    setDraft("");
    setOpenId(null);
  }

  return (
    <div className="animate-[fadeIn_0.25s_ease-out]">
      <TabSectionHeading
        title="Customer Inquiries"
        description={`${inquiries.length} conversations${unreadCount > 0 ? ` · ${unreadCount} unread` : ""}`}
      />

      {inquiries.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="No inquiries yet"
          description="Questions from buyers about your products will show up here."
        />
      ) : (
        <div className="space-y-3">
          {inquiries.map((inquiry, i) => {
            const isOpen = openId === inquiry.id;
            return (
              <div
                key={inquiry.id}
                className={`border bg-paper transition-colors animate-[fadeUp_0.3s_ease-out_backwards] ${
                  inquiry.status === "Unread" ? "border-line" : "border-line"
                }`}
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <button
                  type="button"
                  onClick={() => handleOpen(inquiry.id)}
                  className="w-full text-left p-4 sm:p-5 hover:bg-bone transition-colors"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-ink truncate">
                        {inquiry.subject}
                      </p>
                      <p className="mt-0.5 text-xs text-smoke">
                        {inquiry.buyer} · {inquiry.company}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <StatusBadge status={inquiry.status} styles={INQUIRY_STATUS_STYLES} />
                      <span className="text-[11px] text-smoke font-mono whitespace-nowrap">
                        {new Date(inquiry.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-ash leading-relaxed line-clamp-2">
                    {inquiry.message}
                  </p>
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-1 border-t border-line animate-[fadeIn_0.2s_ease-out]">
                    <textarea
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      rows={3}
                      placeholder={`Reply to ${inquiry.buyer}...`}
                      className="w-full mt-4 border border-line bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-smoke focus:outline-none focus:border-ash transition-colors resize-none"
                    />
                    <div className="mt-3 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setOpenId(null)}
                        className="px-4 py-2 text-sm text-ash hover:text-ink transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSend(inquiry.id)}
                        disabled={!draft.trim()}
                        className="inline-flex items-center gap-1.5 bg-ink text-paper px-4 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                      >
                        <Send size={14} />
                        Send Reply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}