import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle, ArrowLeft } from "lucide-react";
import { listThreadsRecent } from "@/lib/data/messages";
import { seedDemoThreads } from "@/components/messages/SeedDemoThreads";
import { Inbox } from "@/components/messages/Inbox";

export const metadata: Metadata = {
  title: "Messages",
  description:
    "In-site messages — prototype inbox showing how retailer/customer messaging would work.",
};

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ thread?: string }>;
}) {
  const { thread: threadFromUrl } = await searchParams;
  const [threads, initialThreadId] = await Promise.all([
    listThreadsRecent(),
    seedDemoThreads(),
  ]);

  return (
    <div className="mx-auto w-full max-w-[1180px] px-5 py-12">
      <Link
        href="/retailer"
        className="inline-flex items-center gap-1.5 font-mono text-xs text-volt-text transition-colors hover:text-volt"
      >
        <ArrowLeft className="size-3.5" /> Back to console
      </Link>

      <header className="mt-4 flex items-center gap-3">
        <MessageCircle className="size-5 text-volt-text" />
        <h1 className="font-display text-2xl font-bold tracking-tight text-ink-hi">
          Messages
        </h1>
      </header>
      <p className="mt-2 text-sm text-ink-mid">
        Prototype inbox — this shows how retailer/customer messaging would look
        in the app. Conversations are stored locally for this browser only.
      </p>

      <Inbox initialThreadId={threadFromUrl ?? initialThreadId ?? null} />
    </div>
  );
}
