import { redirect } from "next/navigation";
import { createThread } from "@/lib/data/messages";
import type { ThreadParticipant } from "@/lib/types";

export const metadata = {
  title: "New message",
  description:
    "Start a prototype conversation from the inbox.",
};

const DEMO_THREAD = {
  topic: "Question about the 65W GaN charger",
  participants: [
    { id: "customer", name: "Ada Obi", role: "customer" as const },
    { id: "retailer", name: "Voltra Retailer", role: "retailer" as const },
  ],
  status: "open" as const,
};

export default async function NewMessagePage() {
  const thread = createThread({
    ...DEMO_THREAD,
    participants: DEMO_THREAD.participants as ThreadParticipant[],
    status: DEMO_THREAD.status,
  });

  redirect(`/messages?thread=${thread.id}`);
}
