import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  CheckSquare,
  ClipboardList,
  FileText,
  HelpCircle,
  Home,
  LayoutDashboard,
  ListTodo,
  Mail,
  Map as MapIcon,
  MessageCircle,
  Navigation,
  Target,
  Ticket,
  Users,
} from "lucide-react";
import { HubShell } from "@/components/hub/HubShell";

export const metadata = { title: "Help" };

export default function HelpPage() {
  return (
    <HubShell
      eyebrow="Help & Getting Started"
      title="How the portal works."
      subtitle="Short answers to the questions we expect. If something isn't here, email Communications — every fourth question gets added to this page."
      maxWidthClass="max-w-4xl"
    >
      {/* Quick-start tiles */}
      <section className="mb-10">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
          Start here
        </h2>
        <div className="grid gap-3 md:grid-cols-3">
          <QuickLink
            href="#set-profile"
            icon={<Home className="size-4" />}
            title="Set your profile"
            body="Name, role, and LD — takes 5 seconds."
            color="#0E4C9E"
          />
          <QuickLink
            href="#tasks"
            icon={<ListTodo className="size-4" />}
            title="Add your first task"
            body="Drop in the 9 onboarding tasks or add your own."
            color="#C8102E"
          />
          <QuickLink
            href="#continuity"
            icon={<FileText className="size-4" />}
            title="Why continuity matters"
            body="The whole reason this portal exists."
            color="#64748b"
          />
        </div>
      </section>

      {/* Sections */}
      <div className="space-y-10">
        <Section id="login" icon={<AlertCircle />} title="Logging in">
          <P>
            Right now we&apos;re in preview mode. You got the passphrase in your welcome email from
            Logan or Lisa — enter it once and the browser remembers you for the session. The
            portal will move to per-person email sign-in before we open this up to the full EC,
            but nothing about your data will change.
          </P>
        </Section>

        <Section id="set-profile" icon={<Home />} title="Setting your profile">
          <P>
            On the <Link href="/dashboard" className="underline">dashboard</Link>, hit the
            &ldquo;Edit&rdquo; link on the gray identity strip at the top. Tell the portal:
          </P>
          <Ul>
            <li>
              <strong>Your name</strong> — required. This is how notes, tasks, and interactions
              get attributed to you. It also matches against the committee and LD rosters so the
              &ldquo;assigned to me&rdquo; features work.
            </li>
            <li>
              <strong>Your role</strong> — LD Chair, LD Vice Chair, At-Large, PC, etc.
            </li>
            <li>
              <strong>Your LD</strong> — if your role is LD-scoped. Picking this unlocks the
              tailored tiles on the dashboard.
            </li>
            <li>
              <strong>Your precinct</strong> — only asked for Precinct Captains. Picking yours
              takes you straight to a precinct page with voters, strategy, and PCs on file.
            </li>
          </Ul>
          <P>
            Stored in your browser (localStorage). No account, no password, no tracking beyond the
            portal itself.
          </P>
          <P>
            Once your LD is set, the sidebar&apos;s <strong>My LD</strong> link goes straight to
            your district page — you skip the picker.
          </P>
        </Section>

        <Section id="dashboard" icon={<LayoutDashboard />} title="Dashboard — state of the party">
          <P>
            The <Link href="/dashboard" className="underline">dashboard</Link> is the first thing
            you see. It answers &ldquo;how&apos;s the operation today?&rdquo; in one glance and
            then hands you the things on YOUR plate.
          </P>
          <Ul>
            <li>
              <strong>Six KPIs up top</strong> — days to the next election, priority-precinct captain
              coverage, active volunteers, tasks overdue countywide, EC attendance rate, annual
              raise floor. Color-coded, no tiny type.
            </li>
            <li>
              <strong>Needs attention queue</strong> — concrete action items, not just links.
              Uncovered priority precincts, open vacancies, volunteers gone quiet, new signups to
              review. Each with a one-click CTA. Empty-state is a green &ldquo;nothing urgent&rdquo;
              panel.
            </li>
            <li>
              <strong>Your Week</strong> — every task assigned to you across every LD and
              committee. Overdue / due this week / waiting on your accept, all in one view.
            </li>
            <li>
              <strong>Cycle Timeline + KDP call strip</strong> — where we are in the cycle +
              auto-computed next 3rd-Tuesday KDP monthly Zoom.
            </li>
            <li>
              <strong>Jump to</strong> — 6 tiles (My LD, Targeting, Captains, Events, Volunteers,
              Amplify) for the most-used destinations. Full surface list lives at{" "}
              <Link href="/overview" className="underline">/overview</Link>.
            </li>
            <li>
              <strong>Activity feed</strong> — last 2 weeks of notes, tasks, interactions, new
              volunteers, logged activities. Shows the place is alive.
            </li>
          </Ul>
        </Section>

        <Section id="navigating" icon={<Navigation />} title="Getting around — the sidebar">
          <P>
            The sidebar has one always-open block at the top plus four collapsible groups. The
            group containing your current page auto-expands; everything else collapses until you
            click its header.
          </P>
          <P className="font-semibold text-[var(--color-ldp-navy-900)]">
            Always-open top
          </P>
          <P>
            Dashboard · My LD · This Month · Amplify · Events. The daily/weekly surfaces, one
            click from anywhere.
          </P>
          <P className="font-semibold text-[var(--color-ldp-navy-900)]">
            Collapsible groups
          </P>
          <Ul>
            <li>
              <strong>Campaign &amp; Field</strong> — Plan &amp; Map, Captain Coverage, Canvass
              Tools, Follow-Ups, 2026 Candidates, Voter Registration, Early Voting.
            </li>
            <li>
              <strong>People</strong> — Directory, Committees, Volunteers, Coalitions, Partners.
            </li>
            <li>
              <strong>Governance</strong> — Governance Reference, Endorsement Process,
              Communications, Transitions.
            </li>
            <li>
              <strong>Resources</strong> — What this portal does, Glossary, Drive, Welcome Tour,
              Help &amp; FAQ.
            </li>
          </Ul>
          <P>
            Your expand/collapse choices persist in the browser. <strong>Targeting Explained</strong>{" "}
            is intentionally not in the sidebar — it&apos;s a reference surface, linked from Plan
            &amp; Map, Captains, and My LD headers.
          </P>
        </Section>

        <Section id="tools" icon={<Target />} title="Tools to know">
          <P>
            Ten surfaces to know about on top of the basics (tasks, notes, CRM, continuity). Each
            is a full page with its own workflow; one-liners here to orient you.
          </P>
          <Ul>
            <li>
              <strong>
                <Link href="/amplify" className="underline">Amplify</Link>
              </strong>{" "}
              — when Comms needs the board pushing a message, it lands here pre-filled for
              Facebook / X / Threads / Bluesky / LinkedIn / email / texts. Copy-buttons for
              Instagram and TikTok.
            </li>
            <li>
              <strong>
                <Link href="/captains" className="underline">Captain Coverage</Link>
              </strong>{" "}
              — countywide tile + per-bucket cards + punch list of uncovered precincts with
              one-click Recruit.
            </li>
            <li>
              <strong>
                <Link href="/follow-ups" className="underline">Follow-Ups</Link>
              </strong>{" "}
              — &ldquo;who have I talked to but not touched in 14+ days.&rdquo; DNC Playbook
              layering made actionable.
            </li>
            <li>
              <strong>
                <Link href="/targeting" className="underline">Targeting Explained</Link>
              </strong>{" "}
              — Power Base, Hold the Line, Wake the Vote, Plant the Flag. What each bucket is,
              who&apos;s in it, your standing job, and what matters THIS phase of the cycle.
            </li>
            <li>
              <strong>
                <Link href="/volunteers" className="underline">Volunteers</Link>
              </strong>{" "}
              — Jessica&apos;s working file. Roster, intake, activity log, new-signup queue,
              gone-quiet retention list.
            </li>
            <li>
              <strong>
                <Link href="/coalitions" className="underline">Coalitions</Link>
              </strong>{" "}
              — 6 Louisville constituencies (Black, labor, LGBTQ+, Latino, youth, faith) with
              named partners and year-round engagement notes.
            </li>
            <li>
              <strong>
                <Link href="/voter-registration" className="underline">Voter Registration</Link>
              </strong>{" "}
              — KY rules, deadlines (voter-reg, party-switch, early voting), Jefferson County
              Clerk + online portal links, returning-citizens path, plus any VR drives Events or
              Volunteering have scheduled.
            </li>
            <li>
              <strong>
                <Link href="/governance" className="underline">Governance</Link>
              </strong>{" "}
              — quorum, proxies, finance tiers ($500 / $501–999 / $1000+), vacancy rules, KREF
              2026 filing dates, primary-endorsement bylaw. Every rule cited.
            </li>
            <li>
              <strong>
                <Link href="/glossary" className="underline">Glossary</Link>
              </strong>{" "}
              — 30+ terms defined. Power Base, sleeper Dems, GOTV, D-margin, layering, pipeline,
              JCDEC, KREF, and more. We don&apos;t dumb the copy down; we teach the lingo.
            </li>
            <li>
              <strong>
                <Link href="/overview" className="underline">What this portal does</Link>
              </strong>{" "}
              — role-grouped surface list. Dashboard &amp; weekly tools, LD chair tools, committee
              chair tools, county officer tools, reference surfaces.
            </li>
          </Ul>
          <P>
            Every page has a floating <strong>help button</strong> in the bottom-right. Use it to
            request a change or report a bug — submissions become GitHub issues.
          </P>
        </Section>

        <Section id="tasks" icon={<CheckSquare />} title="Tasks — the onboarding list + your own">
          <P>
            Every LD has its own task list on <code className="rounded bg-[#FAFAFA] px-1 py-0.5 text-xs">/my-ld/[number]</code>.
            Tasks live with the LD, not with you — when a new chair takes over, they inherit the
            full list automatically.
          </P>
          <P className="font-semibold text-[var(--color-ldp-navy-900)]">
            New-chair template
          </P>
          <P>
            If the list is empty, you&apos;ll see a big gold &ldquo;Insert new-chair template &middot;
            9 tasks&rdquo; button. One click drops in the standard onboarding list with reasonable
            due dates:
          </P>
          <Ul>
            <li>Log into the portal and set your profile (3 days)</li>
            <li>Pick 1–2 committees to serve on (2 weeks)</li>
            <li>Confirm your LD&apos;s precinct captain list is current (2 weeks)</li>
            <li>Schedule your first LD meeting (1 month)</li>
            <li>Review past LD notes from prior chair (no due date)</li>
            <li>Contact your top 3 recruiting prospects (3 weeks)</li>
            <li>Connect with your assigned Metro Council candidate (1 month)</li>
            <li>Register on Mobilize for upcoming canvasses (1 week)</li>
            <li>Introduce yourself to the LDP Volunteer Coordinator (2 weeks)</li>
          </Ul>
          <P className="font-semibold text-[var(--color-ldp-navy-900)]">
            Assigning tasks
          </P>
          <P>
            Any task can be assigned. The composer has an &ldquo;Assign to&rdquo; dropdown with
            your LD&apos;s Chair, Vice Chair, and every PC on file. Pick someone and they get a
            gold banner on their task row saying &ldquo;You assigned this to them&rdquo; — plus
            Accept and Decline buttons.
          </P>
          <Ul>
            <li>
              <strong>Accept</strong> — flips the chip to emerald and they&apos;re on the hook.
            </li>
            <li>
              <strong>Decline</strong> — clears the assignment back to you (with an optional note
              explaining why). You can reassign.
            </li>
            <li>
              <strong>Just mine filter</strong> — the pill next to the header narrows the list to
              tasks assigned to you. Useful during rollout when the shared list gets long.
            </li>
          </Ul>
          <P className="font-semibold text-[var(--color-ldp-navy-900)]">
            Groups
          </P>
          <P>
            Tasks are bucketed automatically into <strong>Overdue</strong> (red),{" "}
            <strong>Due this week</strong>, <strong>Due later</strong>, and{" "}
            <strong>No due date</strong>. Completed tasks collapse into a disclosure at the
            bottom — they&apos;re kept, never deleted, so the next chair can see what was done.
          </P>
        </Section>

        <Section id="notes" icon={<MessageCircle />} title="Notes — the memory layer">
          <P>
            Below the task list, any EC member can post a note to an LD. Notes stack newest first
            with an optional pin that floats important ones to the top. The author can edit their
            own notes; archiving hides them but keeps the history.
          </P>
          <P>
            Write the note you wish the last chair had left you.
          </P>
        </Section>

        <Section id="crm" icon={<Users />} title="Recruiting CRM — prospects + interactions">
          <P>
            On <code className="rounded bg-[#FAFAFA] px-1 py-0.5 text-xs">/my-ld/[n]/recruiting</code>,
            the pipeline table sorts by last-contacted ascending — so the people who&apos;ve been
            ghosted longest float to the top. Click any row to open a drawer with the full contact
            + the interaction log.
          </P>
          <P className="font-semibold text-[var(--color-ldp-navy-900)]">Pipeline stages</P>
          <Ul>
            <li>
              <strong>Identified</strong> — someone we&apos;ve heard about but haven&apos;t
              contacted.
            </li>
            <li>
              <strong>Contacted</strong> — we reached out, awaiting response.
            </li>
            <li>
              <strong>Warm</strong> — interested, still deciding.
            </li>
            <li>
              <strong>Committed</strong> — said yes to something specific.
            </li>
            <li>
              <strong>Active</strong> — currently contributing (canvassing, attending, donating).
            </li>
            <li>
              <strong>EC Member</strong> — elected / seated.
            </li>
            <li>
              <strong>Cold / Paused / Not interested</strong> — parking lot; we don&apos;t delete
              contacts.
            </li>
          </Ul>
          <P className="font-semibold text-[var(--color-ldp-navy-900)]">
            Logging an interaction
          </P>
          <P>
            In the drawer, &ldquo;Log interaction&rdquo; captures method (call, text, door, email,
            in person, event), outcome (voicemail, conversation, not home, agreed to, declined),
            a note, an optional stage change, and — powerful — a checkbox for{" "}
            <strong>&ldquo;Create follow-up task&rdquo;</strong> that links a new task in your LD
            queue right back to this contact.
          </P>
          <P className="font-semibold text-[var(--color-ldp-navy-900)]">
            60-day staleness alert
          </P>
          <P>
            If any prospect hasn&apos;t been touched in 60+ days, an amber banner on{" "}
            <code className="rounded bg-[#FAFAFA] px-1 py-0.5 text-xs">/my-ld/[n]</code> surfaces
            the count and links to the pipeline.
          </P>
          <P className="font-semibold text-[var(--color-ldp-navy-900)]">VoteBuilder export</P>
          <P>
            The &ldquo;Export for VoteBuilder&rdquo; button downloads a CSV with columns matched to
            MyCampaign / MyVoters. We&apos;re still working with the state party on API access;
            CSV is the path until that lands.
          </P>
        </Section>

        <Section id="continuity" icon={<FileText />} title="Continuity Package — the handoff document">
          <P>
            This is the reason the portal exists. Every LD Chair writes one before stepping down.
            It lives with the LD forever so the next chair isn&apos;t starting from scratch.
          </P>
          <P className="font-semibold text-[var(--color-ldp-navy-900)]">Lifecycle</P>
          <Ul>
            <li>
              <strong>Draft</strong> — only you can see it. Fill in the 7 sections at your own pace.
            </li>
            <li>
              <strong>Submitted</strong> — pipeline snapshot gets frozen; LDP admin reviews.
            </li>
            <li>
              <strong>Locked</strong> — immutable permanent record. Task dispositions (HAND_OFF /
              CLOSE / ESCALATE) get applied automatically.
            </li>
          </Ul>
          <P className="font-semibold text-[var(--color-ldp-navy-900)]">Seven sections</P>
          <Ul>
            <li>State of the LD (free text — in your voice)</li>
            <li>Key contacts (auto-pulled from the &ldquo;key relationship&rdquo; flag)</li>
            <li>Open tasks — choose disposition for each</li>
            <li>Precinct status (dark / covered / strong + optional note)</li>
            <li>Active recruiting pipeline (snapshot at submit time)</li>
            <li>Resource notes (meeting space, vendors, credentials — no passwords)</li>
            <li>Personal note to your successor</li>
          </Ul>
        </Section>

        <Section id="committees" icon={<ClipboardList />} title="Committees — how to join + how to run one">
          <P>
            On <Link href="/committees" className="underline">/committees</Link> each card shows
            the chair and an &ldquo;Email chair&rdquo; button. One click opens your email client
            with a pre-filled subject line. On the committee detail page, the chair block has a
            larger navy CTA with the same behavior.
          </P>
          <P>
            The expectation for every board member is to serve on one or two committees.
          </P>
          <P className="font-semibold text-[var(--color-ldp-navy-900)]">
            Committee chairs — you have the same workspace tools as LD chairs
          </P>
          <P>
            Click into your committee page and you&apos;ll see notes, tasks, email-all, and a
            continuity-package option scoped to the committee. Same flow as /my-ld, just
            committee-scoped. Write the continuity package before you step down so the next chair
            isn&apos;t starting from scratch.
          </P>
          <P className="font-semibold text-[var(--color-ldp-navy-900)]">
            Note on Endorsement Process Committee
          </P>
          <P>
            Endorsement Process is reclassified as an <strong>ad-hoc</strong> committee (not
            standing). It seats under LJCDP §11.6 and reconvenes after each primary to refine the
            process for the next cycle. The 10 standing committees are Bylaws, Facilities,
            Finance, Events, Volunteering, Youth, Communication, Labor, Training, Candidate
            Recruitment — see <Link href="/governance" className="underline">/governance</Link>.
          </P>
        </Section>

        <Section id="map" icon={<MapIcon />} title="The Strategy Map + the four strategies">
          <P>
            <Link href="/plan-map" className="underline">Plan & Map</Link> shows all Jefferson
            County precincts scored into four strategies. The{" "}
            <a
              href="https://26ldp-strategy-map.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              2026 LDP Strategy Map
            </a>{" "}
            is the interactive version; it accepts <code>?ld=N</code>, <code>?mc=N</code>, and
            <code> ?precinct=CODE</code> so portal deep-links scope automatically.
          </P>
          <Ul>
            <li>
              <strong>Power Base (PRIMARY)</strong> — Dems win by 20+. Keep them voting.
            </li>
            <li>
              <strong>Hold the Line (DEFEND)</strong> — under a 5pt margin. These decide November.
            </li>
            <li>
              <strong>Wake the Vote (ACTIVATE)</strong> — Dem-leaning but skip primaries. The
              biggest lift.
            </li>
            <li>
              <strong>Plant the Flag (GROW)</strong> — R-leaning. Find hidden Dems, build for the
              next cycle.
            </li>
          </Ul>
          <P className="font-semibold text-[var(--color-ldp-navy-900)]">Sleeper Dems</P>
          <P>
            Registered Democrats who show up in November but skip primaries. Often the margin in
            close Metro Council races. Visible on every LD page and precinct detail page.
          </P>
          <P className="font-semibold text-[var(--color-ldp-navy-900)]">Dark precincts</P>
          <P>
            Precincts with zero Precinct Captains on file. Surfaced in red on every LD page so
            they&apos;re recruitment targets.
          </P>
        </Section>

        <Section id="events" icon={<Ticket />} title="Events, ticket links, and the $620 math">
          <P>
            Three signature events fund the party: Wendell Ford Dinner (spring), Women
            Deliver Democracy (late August), and Dems at the Downs (post-election).
          </P>
          <P>
            Every board member gets a personalized ticket-sale link for each event, typically
            ~30 days before. Tickets purchased through your link credit to you — no spreadsheets,
            tracked automatically. Your annual raise target is $500 across all three events.
            Combined with the $120/year $120 Club dues, that&apos;s $620 per member, per year.
          </P>
          <P>
            Links go out automatically from Communications. Watch your email ~30 days before
            each event. If the window is open but you haven&apos;t received yours, there&apos;s a
            direct &ldquo;Email Communications&rdquo; link on the event card.
          </P>
        </Section>

        <Section id="transitions" icon={<Users />} title="Transitions — announced vs vacant">
          <P>
            <Link href="/transitions" className="underline">/transitions</Link> tracks every seat
            change since the June 2025 reorg. It splits into three states:
          </P>
          <Ul>
            <li>
              <strong>Announced</strong> (amber) — a transition has been announced but
              hasn&apos;t taken effect yet. The seat is still held by the current person. Used
              right now for the Chair transition (Logan → Roz interim → June 10 special election).
            </li>
            <li>
              <strong>Vacant now</strong> (red) — seat is actually open and needs filling.
            </li>
            <li>
              <strong>Recently filled</strong> (emerald) — historical record of seats that
              changed hands.
            </li>
          </Ul>
        </Section>

        <Section id="troubleshooting" icon={<HelpCircle />} title="Troubleshooting">
          <Ul>
            <li>
              <strong>&ldquo;My LD data isn&apos;t showing&rdquo;</strong> — check your profile on
              the dashboard. If the LD number is blank, nothing can scope.
            </li>
            <li>
              <strong>&ldquo;I can&apos;t add a task or note&rdquo;</strong> — you need a display
              name set (dashboard → Edit). The portal has to know who the author is so the next
              chair can see who wrote what.
            </li>
            <li>
              <strong>&ldquo;The map loads the default view instead of my LD&rdquo;</strong> — as
              of April 22, 2026 this is fixed on both sides. If you&apos;re still seeing it,
              hard-refresh with Cmd/Ctrl + Shift + R.
            </li>
            <li>
              <strong>&ldquo;A committee member is missing their LD&rdquo;</strong> — committee
              rosters use casual names (&ldquo;Lisa Norkus&rdquo;) but the EC directory uses
              formal names (&ldquo;Lisa Tanner Norkus&rdquo;). The matcher handles common
              variations; if someone&apos;s still missing, email Communications.
            </li>
            <li>
              <strong>&ldquo;I don&apos;t have my ticket link yet&rdquo;</strong> — they go out
              ~30 days before each event. If it&apos;s within 30 days and you don&apos;t have one,
              use the Email Communications link on the event card.
            </li>
          </Ul>
        </Section>

        <section className="rounded-xl border-2 border-[var(--color-ldp-navy-800)] bg-white p-6">
          <div className="flex items-start gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-ldp-navy-800)] text-white">
              <Mail aria-hidden="true" className="size-6" />
            </span>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-[var(--color-ldp-navy-900)]">
                Still stuck?
              </h2>
              <p className="mt-1 text-sm text-[var(--color-ldp-ink-900)]">
                Email{" "}
                <a
                  href="mailto:communications@louisvilledems.com?subject=LDPEC%20Portal%20question"
                  className="font-semibold text-[var(--color-ldp-navy-700)] underline"
                >
                  communications@louisvilledems.com
                </a>
                . Every recurring question gets added back to this page so the next person
                doesn&apos;t have to ask.
              </p>
            </div>
          </div>
        </section>
      </div>
    </HubShell>
  );
}

function QuickLink({
  href,
  icon,
  title,
  body,
  color,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  body: string;
  color: string;
}) {
  return (
    <a
      href={href}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-[var(--color-ldp-line)] bg-white p-5 transition-all motion-safe:hover:-translate-y-0.5 hover:shadow-md"
    >
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1"
        style={{ backgroundColor: color }}
      />
      <div className="flex items-center gap-2">
        <span
          className="flex size-7 shrink-0 items-center justify-center rounded-md text-white"
          style={{ backgroundColor: color }}
        >
          {icon}
        </span>
        <h3 className="text-sm font-bold text-[var(--color-ldp-navy-900)]">{title}</h3>
      </div>
      <p className="mt-2 text-xs text-[var(--color-ldp-ink-700)]">{body}</p>
      <div
        className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-widest"
        style={{ color }}
      >
        Jump in
        <ArrowRight
          aria-hidden="true"
          className="size-3 transition-transform group-hover:translate-x-0.5"
        />
      </div>
    </a>
  );
}

function Section({
  id,
  icon,
  title,
  children,
}: {
  id: string;
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex size-7 items-center justify-center rounded-md bg-[var(--color-ldp-navy-800)] text-white">
          <span aria-hidden="true" className="[&>svg]:size-4">
            {icon}
          </span>
        </span>
        <h2 className="text-lg font-bold tracking-tight text-[var(--color-ldp-navy-900)]">
          {title}
        </h2>
      </div>
      <div className="space-y-3 rounded-lg border border-[var(--color-ldp-line)] bg-white p-5 text-sm leading-relaxed text-[var(--color-ldp-ink-900)]">
        {children}
      </div>
    </section>
  );
}

function P({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={className}>{children}</p>;
}

function Ul({ children }: { children: React.ReactNode }) {
  return (
    <ul className="ml-5 list-disc space-y-1.5 text-sm text-[var(--color-ldp-ink-900)] marker:text-[var(--color-ldp-navy-700)]">
      {children}
    </ul>
  );
}
