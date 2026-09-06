"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatNaira } from "@/components/product/PriceTag";
import {
  listThreadsRecent,
  getThreadWithMessages,
  postMessage,
} from "@/lib/data/messages";
import type { Thread, Message } from "@/lib/types";

const ROLE_LABEL: Record<Thread["participants"][number]["role"], string> = {
  customer: "Customer",
  retailer: "Retailer",
  support: "Voltra support",
};

interface InboxProps {
  initialThreadId?: string | null;
}

export function Inbox({ initialThreadId }: InboxProps = {}) {
  const [selected, setSelected] = useState<string | null>(initialThreadId ?? null);
  const [draft, setDraft] = useState("");
  const threads = listThreadsRecent();

  const selectedThread = selected
    ? getThreadWithMessages(selected)
    : null;

  const sendReply = () => {
    if (!selected || !draft.trim()) return;
    postMessage(selected, {
      authorId: "me",
      text: draft.trim(),
    });
    setDraft("");
    setSelected((prev) => (prev === selected ? prev : prev));
  };

  return (
    <div className="mt-6 flex gap-6">
      <section className="w-full max-w-sm flex-none border border-line bg-bg1 p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-low">
            Conversations
          </p>
          {threads.length === 0 && (
            <span className="font-mono text-[10px] text-ink-low">
              No messages yet
            </span>
          )}
        </div>

        {threads.length === 0 ? (
          <p className="border-t border-line px-4 py-6 text-center text-sm text-ink-mid">
            Nothing here yet. The demo inbox starts empty in a fresh browser.
          </p>
        ) : (
          <ul className="space-y-1">
            {threads.map((thread) => {
              const isActive = selected === thread.id;
              return (
                <li key={thread.id}>
                  <button
                    type="button"
                    onClick={() => setSelected(thread.id)}
                    className={`w-full flex flex-col gap-1 rounded-lg px-3 py-3 text-left transition-colors ${
                      isActive
                        ? "bg-volt/10 border border-volt/40"
                        : "border border-transparent hover:bg-bg2"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate font-mono text-[11px] text-ink-low">
                        {thread.topic}
                      </span>
                      <span className="flex-none font-mono text-[10px] text-ink-low">
                        {thread.createdAt}
                      </span>
                    </div>
                    <p className="truncate text-xs text-ink-mid">
                      {thread.lastMessage ? (
                        <>
                          <span className="text-ink-low">
                            {ROLE_LABEL[thread.lastMessage.authorId as keyof typeof ROLE_LABEL] ??
                              thread.lastMessage.authorId}
                            :
                          </span>{" "}
                          {thread.lastMessage.text}
                        </>
                      ) : (
                        <span className="text-ink-low">No replies yet</span>
                      )}
                    </p>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section
        className="flex-1 border border-line bg-bg1 p-5"
        aria-live="polite"
      >
        {selectedThread && selectedThread.thread ? (
          <>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-low">
                  {selectedThread.thread.topic}
                </p>
                <p className="mt-0.5 text-xs text-ink-mid">
                  {selectedThread.thread.participants
                    .map((p) =>
                      ROLE_LABEL[p.role] ?? p.role,
                    )
                    .join(" · ")}
                </p>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-low">
                {selectedThread.thread.id}
              </span>
            </div>

            <div className="mb-4 h-[280px] overflow-y-auto rounded-lg border border-line bg-bg2 p-4">
              {selectedThread.messages.length === 0 ? (
                <p className="text-center text-sm text-ink-mid">
                  No messages in this conversation yet.
                </p>
              ) : (
                <ul className="flex flex-col gap-3">
                  {selectedThread.messages.map((message) => {
                    const isMine =
                      message.authorId === "me";
                    return (
                      <li
                        key={message.id}
                        className={`flex max-w-[80%] gap-2 ${isMine ? "flex-row-reverse" : ""}`}
                      >
                        <span
                          className={`flex-none rounded-full px-2 py-0.5 text-[10px] font-mono ${
                            isMine
                              ? "bg-volt/10 text-volt-text"
                              : "bg-bg1 text-ink-mid"
                          }`}
                        >
                          {ROLE_LABEL[message.authorId as keyof typeof ROLE_LABEL] ??
                            message.authorId}
                        </span>
                        <div
                          className={`rounded-lg px-3 py-2 ${
                            isMine
                              ? "bg-volt/10 text-ink-hi"
                              : "bg-bg1 text-ink-hi"
                          }`}
                        >
                          <p className="text-sm leading-relaxed">
                            {message.text}
                          </p>
                          <p className="mt-1 font-mono text-[10px] opacity-60">
                            {message.sentAt}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendReply();
              }}
              className="flex gap-2"
            >
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Reply in this thread..."
                className="flex-1 rounded-lg border border-line-strong bg-bg2 px-3 py-2 text-sm text-ink-hi outline-none placeholder:text-ink-low focus:border-volt focus:ring-2 focus:ring-volt/40"
              />
              <Button
                size="icon"
                onClick={sendReply}
                disabled={!draft.trim()}
                className="shrink-0 border-volt text-volt-ink hover:bg-volt/20"
              >
                <Send className="size-4" />
              </Button>
            </form>
          </>
        ) : (
          <div className="h-[280px] flex items-center justify-center text-sm text-ink-mid">
            {threads.length === 0 ? (
              <>
                No conversations yet.
                <p className="mt-1 text-[11px] text-ink-low">
                  Reply to a demo thread below to start one.
                </p>
              </>
            ) : (
              <>
                Select a conversation to read it.
                <p className="mt-1 text-[11px] text-ink-low">
                  Or start a new one from the retailer console.
                </p>
              </>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
