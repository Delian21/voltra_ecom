const ITEMS = [
  { index: "01", text: "Sourced direct — no middleman markup" },
  { index: "02", text: "Priced fair — what it costs, plus honest margin" },
  { index: "03", text: "Stock you can see — live counts, honest pills" },
] as const;

export function TrustBar() {
  return (
    <section className="border-y border-line bg-bg1/50">
      <div className="mx-auto w-full max-w-[1180px] px-5 py-12">
        <p className="mb-10 text-center font-mono text-[10px] uppercase tracking-[0.22em] text-ink-low">
          <span className="mr-3 text-volt-text">02</span>Why Voltra
        </p>
        <div className="grid gap-10 md:grid-cols-3">
          {ITEMS.map((item) => (
            <div key={item.index} className="text-center md:text-left">
              <p className="font-mono text-[10px] text-volt-text">{item.index}</p>
              <p className="mx-auto mt-3 max-w-xs text-[14px] leading-6 text-ink-mid md:mx-0">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}