"use client";

import { useEffect, useState } from "react";
import type { RoleKey } from "@/content/highest-leverage-rules";

const LD_KEY = "ldpec_user_ld";
const ROLE_KEY = "ldpec_user_role";
const ADDITIONAL_ROLES_KEY = "ldpec_user_additional_roles";
const PRECINCT_KEY = "ldpec_user_precinct";
const NAME_KEY = "ldpec_user_name";

export type UserProfile = {
  ld_number: number | null;
  role: RoleKey | null;
  // Other hats this person wears. `role` is the "currently viewing as"
  // lens; switching the View-as toggle moves an entry from here into
  // `role` and the displaced lens drops back here. Empty for single-hat
  // users — keeps the picker UI clean.
  additional_roles: RoleKey[];
  precinct_code: string | null;
  display_name: string | null;
};

export function useUserProfile(): {
  profile: UserProfile;
  setProfile: (p: UserProfile) => void;
  clearProfile: () => void;
  switchActiveRole: (next: RoleKey) => void;
  hydrated: boolean;
} {
  const [hydrated, setHydrated] = useState(false);
  const [profile, setLocalProfile] = useState<UserProfile>({
    ld_number: null,
    role: null,
    additional_roles: [],
    precinct_code: null,
    display_name: null,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const ld = window.localStorage.getItem(LD_KEY);
      const role = window.localStorage.getItem(ROLE_KEY);
      const addRoles = window.localStorage.getItem(ADDITIONAL_ROLES_KEY);
      const precinct = window.localStorage.getItem(PRECINCT_KEY);
      const name = window.localStorage.getItem(NAME_KEY);
      let parsed_additional: RoleKey[] = [];
      if (addRoles) {
        try {
          const arr = JSON.parse(addRoles);
          if (Array.isArray(arr)) parsed_additional = arr as RoleKey[];
        } catch {
          // Corrupted localStorage; ignore and start fresh.
        }
      }
      setLocalProfile({
        ld_number: ld ? Number(ld) : null,
        role: (role as RoleKey | null) ?? null,
        additional_roles: parsed_additional,
        precinct_code: precinct || null,
        display_name: name || null,
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
      if (p.additional_roles && p.additional_roles.length > 0) {
        window.localStorage.setItem(ADDITIONAL_ROLES_KEY, JSON.stringify(p.additional_roles));
      } else {
        window.localStorage.removeItem(ADDITIONAL_ROLES_KEY);
      }
      if (p.precinct_code) window.localStorage.setItem(PRECINCT_KEY, p.precinct_code);
      else window.localStorage.removeItem(PRECINCT_KEY);
      if (p.display_name) window.localStorage.setItem(NAME_KEY, p.display_name);
      else window.localStorage.removeItem(NAME_KEY);
    } catch {
      // no-op
    }
  }

  function clearProfile() {
    setLocalProfile({
      ld_number: null,
      role: null,
      additional_roles: [],
      precinct_code: null,
      display_name: null,
    });
    try {
      window.localStorage.removeItem(LD_KEY);
      window.localStorage.removeItem(ROLE_KEY);
      window.localStorage.removeItem(ADDITIONAL_ROLES_KEY);
      window.localStorage.removeItem(PRECINCT_KEY);
      window.localStorage.removeItem(NAME_KEY);
    } catch {
      // no-op
    }
  }

  // Swap the active lens with one of the user's other declared roles.
  // The displaced role drops into additional_roles so they can swap
  // back without re-typing. No-op if `next` is already active or not
  // in additional_roles.
  function switchActiveRole(next: RoleKey) {
    setLocalProfile((prev) => {
      if (prev.role === next) return prev;
      if (!prev.additional_roles.includes(next)) return prev;
      const others = prev.additional_roles.filter((r) => r !== next);
      const updated: UserProfile = {
        ...prev,
        role: next,
        additional_roles: prev.role ? [...others, prev.role] : others,
      };
      try {
        window.localStorage.setItem(ROLE_KEY, next);
        if (updated.additional_roles.length > 0) {
          window.localStorage.setItem(
            ADDITIONAL_ROLES_KEY,
            JSON.stringify(updated.additional_roles)
          );
        } else {
          window.localStorage.removeItem(ADDITIONAL_ROLES_KEY);
        }
      } catch {
        // no-op
      }
      return updated;
    });
  }

  return { profile, setProfile, clearProfile, switchActiveRole, hydrated };
}
