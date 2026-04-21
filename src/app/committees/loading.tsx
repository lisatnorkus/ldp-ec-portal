import { PageHeaderShell, BlockSkeleton, LineSkeleton } from "@/components/LoadingSkeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <PageHeaderShell />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <LineSkeleton width="w-56" className="h-6 mb-6" />
        <LineSkeleton width="w-40" className="mb-3" />
        <div className="grid gap-3 md:grid-cols-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <BlockSkeleton key={i} height="h-28" />
          ))}
        </div>
      </main>
    </div>
  );
}
