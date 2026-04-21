export function PageHeaderShell() {
  return (
    <header className="border-b border-[var(--color-ldp-line)] bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="h-5 w-28 animate-pulse rounded bg-[var(--color-ldp-line)]" />
        <div className="h-8 w-32 animate-pulse rounded bg-[var(--color-ldp-line)]" />
      </div>
    </header>
  );
}

export function BlockSkeleton({ className = "", height = "h-24" }: { className?: string; height?: string }) {
  return (
    <div
      className={`animate-pulse rounded-xl border border-[var(--color-ldp-line)] bg-white ${height} ${className}`}
    />
  );
}

export function LineSkeleton({ className = "", width = "w-full" }: { className?: string; width?: string }) {
  return <div className={`h-3 animate-pulse rounded bg-[var(--color-ldp-line)] ${width} ${className}`} />;
}
