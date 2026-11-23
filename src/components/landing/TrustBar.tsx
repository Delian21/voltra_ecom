const ITEMS = [
  { index: "01", text: "Sourced direct — no middleman markup" },
  { index: "02", text: "Priced fair — what it costs, plus honest margin" },
  { index: "03", text: "Stock you can see — live counts, honest pills" },
] as const;

export function TrustBar() {
  return (
    <section className="border-y border-line bg-bg1/50">
      <div className="mx-auto w-full max-w-[1180px] px-5 py-12">
        <div className="mb-10 text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-low">
            <span className="mr-3 text-volt-text">02</span>Why Voltra
          </p>
          <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-ink-hi">
            Never out of stock, never marked up
          </h2>
          <p className="mx-auto mt-2 max-w-md text-[13.5px] leading-6 text-ink-mid">
            The three promises behind every order we ship.
          </p>
        </div>
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