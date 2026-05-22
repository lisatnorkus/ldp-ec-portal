"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MapPin } from "lucide-react";
import { useUserProfile } from "@/lib/userContext";

type Props = {
  lds: number[];
  selected_ld: number | null;
};

// LD picker for the ballot page. On first hydrate, if no `?ld=` is in
// the URL but the user has an LD set in their profile, auto-route to
// `/ballot?ld=N`. That way an LD chair lands on their personalized
// ballot without an extra click. Once they manually change the picker
// the URL is the source of truth and we stop auto-routing.
export function BallotLdPicker({ lds, selected_ld }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const { profile, hydrated } = useUserProfile();

  useEffect(() => {
    if (!hydrated) return;
    if (selected_ld != null) return; // user already picked one via URL
    if (params.has("ld")) return; // explicit empty ?ld= means "no LD"
    if (profile.ld_number != null) {
      router.replace(`/ballot?ld=${profile.ld_number}`);
    }
  }, [hydrated, selected_ld, params, profile.ld_number, router]);

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const v = e.target.value;
    if (v === "") router.push("/ballot?ld=");
    else router.push(`/ballot?ld=${v}`);
  }

  return (
    <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border bg-white p-4">
      <MapPin
        aria-hidden
        className="size-4 text-[var(--color-ldp-navy-700)]"
      />
      <div className="text-sm font-semibold text-[var(--color-ldp-navy-900)]">
        Your district
      </div>
      <select
        value={selected_ld ?? ""}
        onChange={onChange}
        className="rounded-md border border-[var(--color-ldp-ink-200,#d8dbe1)] bg-white px-2 py-1.5 text-sm focus:border-[var(--color-ldp-navy-700)] focus:outline-none focus:ring-1 focus:ring-[var(--color-ldp-navy-700)]"
        aria-label="Pick your Legislative District"
      >
        <option value="">Pick an LD…</option>
        {lds.map((n) => (
          <option key={n} value={n}>
            LD{n}
          </option>
        ))}
      </select>
      {selected_ld != null && (
        <span className="text-[11px] text-[var(--color-ldp-ink-700)]">
          Your LD races appear at the top. Countywide and federal races appear below.
        </span>
      )}
    </div>
  );
}
