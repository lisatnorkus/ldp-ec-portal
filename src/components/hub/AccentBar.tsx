"use client";

import { usePathname } from "next/navigation";
import { accentForPath } from "./nav-groups";

// Thin strip under the masthead whose color matches the section
// you're in. Resolves via pathname so pages don't have to pass
// anything in the common case.

export function AccentBar({ accent }: { accent?: string }) {
  const pathname = usePathname();
  const color = accent ?? accentForPath(pathname ?? "");
  return <div aria-hidden="true" className="relative h-1.5 w-full" style={{ backgroundColor: color }} />;
}
