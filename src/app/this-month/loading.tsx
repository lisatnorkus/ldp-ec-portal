import { PageHeaderShell, BlockSkeleton, LineSkeleton } from "@/components/LoadingSkeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <PageHeaderShell />
      <main className="mx-auto max-w-4xl px-6 py-10">
        <LineSkeleton width="w-48" className="mb-2" />
        <LineSkeleton width="w-72" className="h-8 mb-6" />
        <BlockSkeleton height="h-56" className="mb-6" />
        <BlockSkeleton height="h-32" className="mb-6" />
        <LineSkeleton width="w-40" className="mb-3" />
        <div className="grid gap-2 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <BlockSkeleton key={i} height="h-12" />
          ))}
        </div>
      </main>
    </div>
  );
}
