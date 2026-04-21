import { PageHeaderShell, BlockSkeleton, LineSkeleton } from "@/components/LoadingSkeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      <PageHeaderShell />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <section className="mb-8 grid gap-4 lg:grid-cols-3">
          <BlockSkeleton height="h-40" />
          <BlockSkeleton height="h-40" />
          <BlockSkeleton height="h-40" />
        </section>
        <section className="mb-8 grid gap-3 md:grid-cols-2">
          <BlockSkeleton height="h-48" />
          <BlockSkeleton height="h-48" />
        </section>
        <section className="mb-8">
          <LineSkeleton width="w-40" className="mb-3" />
          <BlockSkeleton height="h-48" />
        </section>
      </main>
    </div>
  );
}
