import {
  createThread,
  postMessage,
  listThreadsRecent,
} from "@/lib/data/messages";
import type { Thread, ThreadParticipant } from "@/lib/types";

const DEMO_THREADS: Array<
  Omit<Thread, "id" | "createdAt"> & { seed: Array<{ authorId: string; text: string }> }
> = [
  {
    topic: "Question about the 65W GaN charger",
    participants: [
      { id: "customer", name: "Ada Obi", role: "customer" },
      { id: "retailer", name: "Voltra Retailer", role: "retailer" },
    ],
    status: "open",
    seed: [
      { authorId: "customer", text: "Hi, does the 65W charger come with a USB-C cable?" },
      { authorId: "retailer", text: "Yes — it ships with one USB-C and one USB-A cable." },
      { authorId: "customer", text: "Great, and is it okay for a MacBook?" },
    ],
  },
  {
    topic: "Restock timeline for power banks",
    participants: [
      { id: "customer", name: "Ada Obi", role: "customer" },
      { id: "retailer", name: "Voltra Retailer", role: "retailer" },
    ],
    status: "open",
    seed: [
      { authorId: "customer", text: "When do you expect the 20,000mAh power bank to restock?" },
      { authorId: "retailer", text: "Next week, most likely Tuesday or Wednesday." },
    ],
  },
];

export async function seedDemoThreads(): Promise<string | null> {
  const existing = listThreadsRecent();
  if (existing.length > 0) return null;

  const first = createThread({
    ...DEMO_THREADS[0],
    participants: DEMO_THREADS[0].participants as ThreadParticipant[],
    status: DEMO_THREADS[0].status,
  });

  for (const message of DEMO_THREADS[0].seed) {
    postMessage(first.id, message);
  }

  const second = createThread({
    ...DEMO_THREADS[1],
    participants: DEMO_THREADS[1].participants as ThreadParticipant[],
    status: DEMO_THREADS[1].status,
  });

  for (const message of DEMO_THREADS[1].seed) {
    postMessage(second.id, message);
  }

  return first.id;
}
