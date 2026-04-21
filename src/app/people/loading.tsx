import { PageHeaderShell, BlockSkeleton, LineSkeleton } from "@/components/LoadingSkeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <PageHeaderShell />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <LineSkeleton width="w-56" className="h-6 mb-2" />
        <LineSkeleton width="w-80" className="mb-6" />
        <BlockSkeleton height="h-12" className="mb-6" />
        <LineSkeleton width="w-48" className="mb-3" />
        <div className="mb-6 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <BlockSkeleton height="h-44" />
          <BlockSkeleton height="h-44" />
          <BlockSkeleton height="h-44" />
          <BlockSkeleton height="h-44" />
        </div>
        <LineSkeleton width="w-40" className="mb-3" />
        <BlockSkeleton height="h-96" />
      </main>
    </div>
  );
}
