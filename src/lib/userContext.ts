"use client";

import { useEffect, useState } from "react";
import type { RoleKey } from "@/content/highest-leverage-rules";

const LD_KEY = "ldpec_user_ld";
const ROLE_KEY = "ldpec_user_role";
const PRECINCT_KEY = "ldpec_user_precinct";

export type UserProfile = {
  ld_number: number | null;
  role: RoleKey | null;
  precinct_code: string | null;
};

export function useUserProfile(): {
  profile: UserProfile;
  setProfile: (p: UserProfile) => void;
  clearProfile: () => void;
  hydrated: boolean;
} {
  const [hydrated, setHydrated] = useState(false);
  const [profile, setLocalProfile] = useState<UserProfile>({
    ld_number: null,
    role: null,
    precinct_code: null,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const ld = window.localStorage.getItem(LD_KEY);
      const role = window.localStorage.getItem(ROLE_KEY);
      const precinct = window.localStorage.getItem(PRECINCT_KEY);
      setLocalProfile({
        ld_number: ld ? Number(ld) : null,
        role: (role as RoleKey | null) ?? null,
        precinct_code: precinct || null,
      });
    } catch {
      // localStorage blocked — profile stays null/null
    }
    setHydrated(true);
  }, []);

  function setProfile(p: UserProfile) {
    setLocalProfile(p);
    try {
      if (p.ld_number != null) window.localStorage.setItem(LD_KEY, String(p.ld_number));
      else window.localStorage.removeItem(LD_KEY);
      if (p.role) window.localStorage.setItem(ROLE_KEY, p.role);
      else window.localStorage.removeItem(ROLE_KEY);
      if (p.precinct_code) window.localStorage.setItem(PRECINCT_KEY, p.precinct_code);
      else window.localStorage.removeItem(PRECINCT_KEY);
    } catch {
      // no-op
    }
  }

  function clearProfile() {
    setLocalProfile({ ld_number: null, role: null, precinct_code: null });
    try {
      window.localStorage.removeItem(LD_KEY);
      window.localStorage.removeItem(ROLE_KEY);
      window.localStorage.removeItem(PRECINCT_KEY);
    } catch {
      // no-op
    }
  }

  return { profile, setProfile, clearProfile, hydrated };
}
