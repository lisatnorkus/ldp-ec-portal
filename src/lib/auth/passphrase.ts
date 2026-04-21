// Passphrase soft-gate — same mechanism as v1.
// View-source bypasses this; it's friction against casual forwarding, not real auth.
// Google OAuth lands post-test; this retires then.

const STORAGE_KEY = "ldpec_portal_unlocked_v2";

export function checkPassphrase(input: string): boolean {
  const expected = process.env.NEXT_PUBLIC_AUTH_PASSPHRASE ?? "";
  if (!expected) return false;
  return input.trim().toLowerCase() === expected.toLowerCase();
}

export function markUnlocked(): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(STORAGE_KEY, "1");
}

export function isUnlocked(): boolean {
  if (typeof window === "undefined") return false;
  return window.sessionStorage.getItem(STORAGE_KEY) === "1";
}

export function clearUnlock(): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(STORAGE_KEY);
}
