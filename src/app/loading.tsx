import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div>
      {/* Hero */}
      <div className="border-b border-line px-5 pb-28 pt-20 md:pb-36 md:pt-28">
        <div className="mx-auto w-full max-w-[1180px]">
          <Skeleton className="h-3 w-52 rounded-full bg-bg3" />
          <Skeleton className="mt-7 h-14 w-[26rem] max-w-full rounded-xl bg-bg3 md:h-[4.5rem]" />
          <Skeleton className="mt-3 h-14 w-[16rem] max-w-full rounded-xl bg-bg3" />
          <Skeleton className="mt-6 h-4 w-[34rem] max-w-full rounded-full bg-bg3" />
          <Skeleton className="mt-2.5 h-4 w-[24rem] max-w-full rounded-full bg-bg3" />
          <div className="mt-10 flex gap-3">
            <Skeleton className="h-11 w-40 rounded-full bg-bg3" />
            <Skeleton className="h-11 w-36 rounded-full bg-bg3" />
          </div>
        </div>
      </div>

      {/* Featured grid */}
      <div className="mx-auto w-full max-w-[1180px] px-5 py-16">
        <div className="mb-8 flex items-end justify-between">
          <Skeleton className="h-7 w-48 rounded-lg bg-bg3" />
          <Skeleton className="h-3 w-36 rounded-full bg-bg3" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-xl border border-line bg-bg1">
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
      </div>
    </div>
  );
}
