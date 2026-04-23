// Kentucky election deadline math. Used by /voter-registration to
// render "next deadline" banners that auto-roll without manual edits.
//
// Kentucky law (KRS / State Board of Elections):
//   - Primary: 3rd Tuesday in May (even years for partisan federal/state).
//   - General: 1st Tuesday after the 1st Monday in November.
//   - Voter registration deadline: 29 days before the election (KRS 116.045).
//   - Party change deadline: Dec 31 of the year preceding the primary
//     (KRS 116.055). KY closed primary — cannot change parties to vote
//     in the May primary after Dec 31 of the prior year.
//   - Early voting: Thursday, Friday, Saturday before Election Day
//     (3 days; KRS 117.079). Times set by the County Clerk.
//
// If a deadline falls on a weekend or state holiday, KY law rolls it
// to the next business day — we don't try to approximate that here;
// we surface the statutory date and point people to govoteky.com for
// the authoritative look-up.

export type UpcomingDeadlines = {
  nextPrimary: Date;
  nextPrimaryVoterRegDeadline: Date;
  nextPrimaryEarlyVote: { thursday: Date; saturday: Date };
  nextGeneral: Date;
  nextGeneralVoterRegDeadline: Date;
  nextGeneralEarlyVote: { thursday: Date; saturday: Date };
  nextPartySwitchDeadline: Date;
  nextPartySwitchApplies_to_primary_year: number;
};

function thirdTuesdayOfMay(year: number): Date {
  const first = new Date(year, 4, 1); // May 1
  const offsetToTuesday = (2 - first.getDay() + 7) % 7;
  return new Date(year, 4, 1 + offsetToTuesday + 14);
}

function firstTuesdayAfterFirstMondayInNovember(year: number): Date {
  const first = new Date(year, 10, 1); // Nov 1
  const offsetToMonday = (1 - first.getDay() + 7) % 7;
  const firstMonday = new Date(year, 10, 1 + offsetToMonday);
  return new Date(year, 10, firstMonday.getDate() + 1);
}

function subtractDays(d: Date, days: number): Date {
  const out = new Date(d);
  out.setDate(out.getDate() - days);
  return out;
}

function earlyVoteWindow(electionDay: Date): { thursday: Date; saturday: Date } {
  // Thursday = ED minus 5 days, Saturday = ED minus 3 days.
  const thursday = subtractDays(electionDay, 5);
  const saturday = subtractDays(electionDay, 3);
  return { thursday, saturday };
}

export function getUpcomingDeadlines(now: Date = new Date()): UpcomingDeadlines {
  const y = now.getFullYear();

  // Next primary: this year's if not yet passed, else next year's.
  const primaryThisYear = thirdTuesdayOfMay(y);
  const nextPrimary = now <= primaryThisYear ? primaryThisYear : thirdTuesdayOfMay(y + 1);

  // Next general (federal-cycle). Held every even year; KY also has
  // off-year elections for Governor etc., but the common case is the
  // even-year general. Surface that.
  let nextGeneralYear = y;
  if (nextGeneralYear % 2 !== 0) nextGeneralYear += 1;
  let nextGeneral = firstTuesdayAfterFirstMondayInNovember(nextGeneralYear);
  if (now > nextGeneral) {
    nextGeneralYear += 2;
    nextGeneral = firstTuesdayAfterFirstMondayInNovember(nextGeneralYear);
  }

  // Party-switch deadline: Dec 31 of year preceding the next primary.
  const nextPartySwitchApplies = nextPrimary.getFullYear();
  const nextPartySwitchDeadline = new Date(nextPartySwitchApplies - 1, 11, 31);

  return {
    nextPrimary,
    nextPrimaryVoterRegDeadline: subtractDays(nextPrimary, 29),
    nextPrimaryEarlyVote: earlyVoteWindow(nextPrimary),
    nextGeneral,
    nextGeneralVoterRegDeadline: subtractDays(nextGeneral, 29),
    nextGeneralEarlyVote: earlyVoteWindow(nextGeneral),
    nextPartySwitchDeadline,
    nextPartySwitchApplies_to_primary_year: nextPartySwitchApplies,
  };
}

export function formatMDY(d: Date): string {
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function daysUntil(d: Date, now: Date = new Date()): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfTarget = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  return Math.round((startOfTarget.getTime() - startOfToday.getTime()) / msPerDay);
}
