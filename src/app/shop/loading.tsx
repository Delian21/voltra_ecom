import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <section className="mx-auto w-full max-w-[1180px] px-5 py-12">
      <Skeleton className="h-3 w-40 rounded-full bg-bg3" />
      <Skeleton className="mt-4 h-9 w-32 rounded-lg bg-bg3" />
      <Skeleton className="mt-3 h-4 w-64 rounded-full bg-bg3" />

      <Skeleton className="mt-8 h-10 w-full max-w-md rounded-full bg-bg2" />

      <div className="mt-6 mb-9 flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-8 w-20 rounded-full bg-bg2"
            style={i === 0 ? undefined : { opacity: 1 - i * 0.12 }}
          />
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-xl border border-line bg-bg1"
          >
            <Skeleton className="h-28 w-full rounded-none bg-bg2" />
            <div className="space-y-2.5 p-4">
              <Skeleton className="h-2.5 w-16 rounded-full bg-bg3" />
              <Skeleton className="h-3.5 w-4/5 rounded-full bg-bg3" />
              <Skeleton className="h-3 w-2/3 rounded-full bg-bg3" />
              <div className="flex justify-between pt-2">
                <Skeleton className="h-4 w-20 rounded-full bg-bg3" />
                <Skeleton className="h-4 w-24 rounded-full bg-bg3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
