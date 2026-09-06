"use client";

export function SpecsSkeleton() {
  return (
    <div className="mt-9">
      <div className="flex w-full items-center justify-between gap-3 border-0 bg-transparent p-0 text-left">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink-low">
          Tech specs
        </span>
        <div className="h-3 w-3 rounded-full bg-bg3 animate-pulse" />
      </div>

      <div className="mt-3 overflow-hidden rounded-lg border border-line bg-bg2 p-3.5">
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-3 rounded-md border border-line-strong bg-bg3 px-3 py-2.5 animate-pulse"
            >
              <span className="h-3 w-14 rounded-full bg-bg3" />
              <span className="h-3 w-20 rounded-full bg-bg3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
