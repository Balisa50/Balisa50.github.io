/**
 * One decision, stated as a choice against the thing it replaced.
 *
 * "Used PyTorch" is a fact and tells a reader nothing. "PyTorch from the paper
 * over the library that already ships it, because I needed to be able to
 * explain every piece" is an argument, and an argument can be disagreed with,
 * which is the only reason it is worth reading.
 */
export function TradeOff({
  chose,
  over,
  children
}: {
  chose: string;
  over: string;
  children: React.ReactNode;
}) {
  return (
    <div className="not-prose border-b border-rule py-6 last:border-b-0">
      <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="text-[1.0625rem] font-medium leading-snug text-ink">{chose}</span>
        <span className="font-mono text-[0.6875rem] uppercase tracking-[0.11em] text-text-faint">over</span>
        <span className="text-[1.0625rem] leading-snug text-text-secondary">{over}</span>
      </p>
      <div className="measure mt-3 text-[0.9375rem] leading-relaxed text-text-secondary [&>p+p]:mt-3">
        {children}
      </div>
    </div>
  );
}

export function TradeOffs({ children }: { children: React.ReactNode }) {
  return <div className="not-prose mt-6 border-t border-rule">{children}</div>;
}
