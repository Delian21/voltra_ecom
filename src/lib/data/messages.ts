/**
 * Mock in-site messaging seam (prototype inbox).
 *
 * Today: localStorage-backed threads + messages for this browser session.
 * Backend phase: same shapes, fetch-based implementations; call sites never
 * change.
 *
 * This exists to demonstrate what in-site messaging would look like, not to
 * model a real messaging channel yet.
 */

import type { Message, Thread, ThreadParticipant } from "@/lib/types";


const THREADS_KEY = "voltra-threads";
const MESSAGES_KEY = "voltra-messages";

type StoredThreads = Thread[];
type StoredMessages = Record<string, Message[]>;

function readThreads(): Thread[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(THREADS_KEY);
    return raw ? (JSON.parse(raw) as StoredThreads) : [];
  } catch {
    return [];
  }
}

function writeThreads(threads: Thread[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(THREADS_KEY, JSON.stringify(threads));
  } catch {
    // Storage full or unavailable — fail silently for the prototype.
  }
}

function readMessages(threadId: string): Message[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(MESSAGES_KEY);
    const all = raw ? (JSON.parse(raw) as StoredMessages) : {};
    return all[threadId] ?? [];
  } catch {
    return [];
  }
}

function writeMessages(threadId: string, messages: Message[]): void {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(MESSAGES_KEY);
    const all = raw ? (JSON.parse(raw) as StoredMessages) : {};
    all[threadId] = messages;
    window.localStorage.setItem(MESSAGES_KEY, JSON.stringify(all));
  } catch {
    // Storage full or unavailable — fail silently for the prototype.
  }
}

/** Time + random base-36 suffix, unique across page loads that reset a counter. */
function uniqueSuffix(): string {
  const time = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 5);
  return `${time}${random}`.toUpperCase();
}

export function freshThreadId(): string {
  return `TH-${uniqueSuffix()}`;
}

export function freshMessageId(): string {
  return `MSG-${uniqueSuffix()}`;
}

function formattedNow(): string {
  return new Date().toLocaleString("en-NG", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Create a new prototype thread and return it. */
export function createThread(thread: Omit<Thread, "id" | "createdAt">): Thread {
  const created: Thread = {
    ...thread,
    id: freshThreadId(),
    createdAt: formattedNow(),
  };

  writeThreads([created, ...readThreads()]);
  writeMessages(created.id, []);

  return created;
}

/** Append a message to an existing thread. */
export function postMessage(threadId: string, message: Omit<Message, "id" | "sentAt">): Message {
  const existing = readMessages(threadId);
  const posted: Message = {
    ...message,
    id: freshMessageId(),
    sentAt: formattedNow(),
  };

  writeMessages(threadId, [...existing, posted]);
  return posted;
}

/** Read a thread with its messages. */
export function getThreadWithMessages(
  threadId: string,
): { thread: Thread | null; messages: Message[] } {
  const thread = readThreads().find((t) => t.id === threadId) ?? null;
  const messages = thread ? readMessages(threadId) : [];
  return { thread, messages };
}

/** Read all threads with the most recent message per thread. */
export function listThreadsRecent(): Array<Thread & { lastMessage: Message | null }> {
  const threads = readThreads();
  return threads.map((t) => {
    const messages = readMessages(t.id);
    const lastMessage = messages[messages.length - 1] ?? null;
    return { ...t, lastMessage };
  });
}

/** Clear all prototype messaging data (useful for dev resets). */
export function clearMockMessages(): void {
  writeThreads([]);
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(MESSAGES_KEY);
  } catch {
    // ignore
  }
}
