import { PageHeaderShell, BlockSkeleton, LineSkeleton } from "@/components/LoadingSkeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <PageHeaderShell />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <LineSkeleton width="w-24" className="mb-3" />
        <LineSkeleton width="w-32" className="h-10 mb-6" />
        <BlockSkeleton height="h-28" className="mb-8" />
        <div className="mb-8 grid gap-3 md:grid-cols-2">
          <BlockSkeleton height="h-40" />
          <BlockSkeleton height="h-40" />
        </div>
        <LineSkeleton width="w-40" className="mb-3" />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <BlockSkeleton height="h-32" />
          <BlockSkeleton height="h-32" />
          <BlockSkeleton height="h-32" />
          <BlockSkeleton height="h-32" />
        </div>
      </main>
    </div>
  );
}
