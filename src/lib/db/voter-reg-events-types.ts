export type VoterRegEvent = {
  id: string;
  name: string;
  starts_at: string;
  ends_at: string | null;
  location: string;
  address: string | null;
  ld_number: number | null;
  description: string | null;
  organizer_name: string | null;
  organizer_committee: string | null;
  signup_url: string | null;
  target_populations: string[];
  is_published: boolean;
  author_name: string | null;
  author_role: string | null;
  author_ld: number | null;
  created_at: string;
  updated_at: string;
};

// Target populations the skill flags as the Louisville priorities.
export const VOTER_REG_TARGETS: { key: string; label: string; hint: string }[] = [
  { key: "NEW_MOVERS", label: "New movers", hint: "Residents within 60 days of moving" },
  { key: "AGE_INS", label: "Age-in voters (17 → 18)", hint: "Pre-register at 17 if 18 by Election Day" },
  { key: "COLLEGE", label: "College students", hint: "U of L, Bellarmine, Sullivan, Spalding, JCTC" },
  { key: "RETURNING_CITIZENS", label: "Returning citizens", hint: "Post-felony restoration (see rules panel)" },
  { key: "PARTY_CONVERSION", label: "Party conversion", hint: "Independents who want to vote in Dem primary" },
  { key: "HIGH_SCHOOL_SENIORS", label: "High school seniors", hint: "JCPS senior-year outreach" },
];

export function targetLabel(key: string): string {
  return VOTER_REG_TARGETS.find((t) => t.key === key)?.label ?? key;
}
