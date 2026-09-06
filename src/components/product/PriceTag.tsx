export function formatNaira(amount: number): string {
  return "₦" + amount.toLocaleString("en-NG");
}

export function PriceTag({
  amount,
  className,
}: {
  amount: number;
  className?: string;
}) {
  return (
    <span className={`font-mono text-[15px] font-semibold text-ink-hi ${className ?? ""}`}>
      {formatNaira(amount)}
    </span>
  );
}