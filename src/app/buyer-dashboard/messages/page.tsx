"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { Eyebrow } from "@/components/UI";
import { Search, Send, Paperclip, ArrowLeft, CheckCheck } from "lucide-react";

interface Message {
  from: "me" | "them";
  text: string;
  time: string;
}

interface Thread {
  id: number;
  name: string;
  unread: boolean;
  verified: boolean;
  messages: Message[];
}

const INITIAL_THREADS: Thread[] = [
  {
    id: 1,
    name: "Shenzhen ElectroTech Co.",
    unread: true,
    verified: true,
    messages: [
      { from: "them", text: "Hi Ahmed, thanks for your inquiry on the CNC Lathe Machine. Happy to share more specs.", time: "10:02 AM" },
      { from: "me", text: "Great, could you send the technical datasheet and confirm MOQ for a trial order?", time: "10:05 AM" },
      { from: "them", text: "Sure — MOQ is 1 unit for trial, datasheet attached. Lead time is 20-25 days.", time: "10:11 AM" },
      { from: "them", text: "We can proceed with 1,200 units at $8.20/unit.", time: "10:12 AM" },
    ],
  },
  {
    id: 2,
    name: "Guangzhou Textile Group",
    unread: true,
    verified: true,
    messages: [
      { from: "them", text: "Good morning! Following up on the cotton t-shirt sample order.", time: "8:40 AM" },
      { from: "me", text: "Thanks for the update, has it shipped yet?", time: "8:52 AM" },
      { from: "them", text: "Sample dispatched today via DHL, tracking attached.", time: "9:15 AM" },
    ],
  },
  {
    id: 3,
    name: "Ningbo Auto Parts Ltd.",
    unread: false,
    verified: true,
    messages: [
      { from: "them", text: "We've revised the quotation based on your target price.", time: "Yesterday" },
      { from: "them", text: "Quotation revised as discussed — please review.", time: "Yesterday" },
    ],
  },
  {
    id: 4,
    name: "Yiwu Home Furnishings",
    unread: false,
    verified: false,
    messages: [
      { from: "me", text: "Please confirm the order has entered production.", time: "2 days ago" },
      { from: "them", text: "Thank you! Production has started on schedule.", time: "2 days ago" },
    ],
  },
  {
    id: 5,
    name: "Qingdao Machinery Corp.",
    unread: false,
    verified: true,
    messages: [
      { from: "them", text: "Factory audit report is ready for your review.", time: "3 days ago" },
    ],
  },
];

function currentTime() {
  return new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export default function MessagesPage() {
  const [threads, setThreads] = useState<Thread[]>(INITIAL_THREADS);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeThread = threads.find((t) => t.id === activeId) || null;

  const filteredThreads = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return threads;
    return threads.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.messages.some((m) => m.text.toLowerCase().includes(q))
    );
  }, [threads, search]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [activeThread?.messages.length, typing]);

  const openThread = (id: number) => {
    setActiveId(id);
    setThreads((prev) => prev.map((t) => (t.id === id ? { ...t, unread: false } : t)));
  };

  const sendMessage = () => {
    const text = draft.trim();
    if (!text || !activeId) return;

    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeId
          ? { ...t, messages: [...t.messages, { from: "me", text, time: currentTime() }] }
          : t
      )
    );
    setDraft("");

    // Simulated supplier reply for a realistic, responsive feel
    setTyping(true);
    setTimeout(() => {
      const replies = [
        "Thanks for the message, let me check with our production team and get back to you shortly.",
        "Understood — I'll confirm the details and revert within the hour.",
        "Noted, we can accommodate that. I'll send updated terms shortly.",
        "Good question, let me pull the specs and send them over.",
      ];
      const reply = replies[Math.floor(Math.random() * replies.length)];
      setThreads((prev) =>
        prev.map((t) =>
          t.id === activeId
            ? { ...t, messages: [...t.messages, { from: "them", text: reply, time: currentTime() }] }
            : t
        )
      );
      setTyping(false);
    }, 1400);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <DashboardShell>
      <div className="mb-6 sm:mb-8">
        <Eyebrow>Messages</Eyebrow>
        <h1 className="mt-2 font-display font-bold text-2xl sm:text-3xl tracking-tightest">
          Supplier Conversations
        </h1>
      </div>

      <div className="bg-paper border border-line grid grid-cols-1 lg:grid-cols-[320px_1fr] h-[600px] max-h-[75vh]">
        {/* Thread list */}
        <div className={`border-r border-line flex-col ${activeId !== null ? "hidden lg:flex" : "flex"}`}>
          <div className="p-4 border-b border-line">
            <div className="flex items-center gap-2 border border-line px-3 py-2 bg-bone focus-within:border-ash transition-colors">
              <Search size={14} className="text-smoke shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search messages..."
                className="w-full bg-transparent text-sm placeholder:text-smoke focus:outline-none min-w-0"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-line">
            {filteredThreads.length === 0 ? (
              <p className="text-sm text-smoke text-center py-10 px-4">No conversations match your search.</p>
            ) : (
              filteredThreads.map((t) => {
                const lastMsg = t.messages[t.messages.length - 1];
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => openThread(t.id)}
                    className={`w-full text-left flex items-start gap-3 p-4 transition-colors ${
                      activeId === t.id ? "bg-bone" : "hover:bg-bone"
                    }`}
                  >
                    <span className="w-9 h-9 rounded-full bg-ink text-paper flex items-center justify-center font-display font-semibold text-xs shrink-0">
                      {t.name.charAt(0)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className={`text-sm truncate ${t.unread ? "font-semibold text-ink" : "font-medium text-ash"}`}>
                          {t.name}
                        </p>
                        <span className="text-[10px] text-smoke font-mono shrink-0">{lastMsg?.time}</span>
                      </div>
                      <p className="mt-0.5 text-xs text-smoke leading-snug line-clamp-1">
                        {lastMsg?.from === "me" ? "You: " : ""}
                        {lastMsg?.text}
                      </p>
                    </div>
                    {t.unread && <span className="w-2 h-2 rounded-full bg-ink shrink-0 mt-1.5" />}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Conversation */}
        <div className={`flex-col min-h-0 ${activeId !== null ? "flex" : "hidden lg:flex"}`}>
          {!activeThread ? (
            <div className="flex-1 flex items-center justify-center text-sm text-smoke px-6 text-center">
              Select a conversation to start messaging.
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 p-4 border-b border-line shrink-0">
                <button
                  onClick={() => setActiveId(null)}
                  className="lg:hidden w-8 h-8 flex items-center justify-center -ml-1 hover:bg-bone transition-colors shrink-0"
                  aria-label="Back to conversations"
                >
                  <ArrowLeft size={17} />
                </button>
                <span className="w-9 h-9 rounded-full bg-ink text-paper flex items-center justify-center font-display font-semibold text-xs shrink-0">
                  {activeThread.name.charAt(0)}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{activeThread.name}</p>
                  <p className="text-[11px] text-smoke font-mono">
                    {activeThread.verified ? "Verified Supplier" : "Standard Supplier"}
                  </p>
                </div>
              </div>

              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
                {activeThread.messages.map((m, i) => (
                  <div
                    key={i}
                    className={`flex ${m.from === "me" ? "justify-end" : "justify-start"} animate-[fadeUp_0.25s_ease-out]`}
                  >
                    <div
                      className={`max-w-[80%] sm:max-w-[70%] px-4 py-2.5 text-sm leading-relaxed ${
                        m.from === "me" ? "bg-ink text-paper" : "bg-bone text-ink"
                      }`}
                    >
                      <p className="break-words">{m.text}</p>
                      <div
                        className={`mt-1 flex items-center gap-1 text-[10px] font-mono ${
                          m.from === "me" ? "text-paper/60 justify-end" : "text-smoke"
                        }`}
                      >
                        {m.time}
                        {m.from === "me" && <CheckCheck size={11} />}
                      </div>
                    </div>
                  </div>
                ))}

                {typing && (
                  <div className="flex justify-start animate-[fadeUp_0.2s_ease-out]">
                    <div className="bg-bone px-4 py-3 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-smoke animate-bounce [animation-delay:-0.2s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-smoke animate-bounce [animation-delay:-0.1s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-smoke animate-bounce" />
                    </div>
                  </div>
                )}
              </div>

              <div className="p-3 sm:p-4 border-t border-line flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  className="w-9 h-9 flex items-center justify-center border border-line hover:border-ash transition-colors shrink-0"
                  aria-label="Attach file"
                >
                  <Paperclip size={15} />
                </button>
                <input
                  type="text"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  className="flex-1 bg-bone border border-line px-3 py-2.5 text-sm placeholder:text-smoke focus:outline-none focus:border-ash min-w-0"
                />
                <button
                  type="button"
                  onClick={sendMessage}
                  disabled={!draft.trim()}
                  className="w-9 h-9 flex items-center justify-center bg-ink text-paper hover:bg-ash transition-colors shrink-0 disabled:opacity-40 disabled:pointer-events-none"
                  aria-label="Send message"
                >
                  <Send size={14} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </DashboardShell>
  );
}