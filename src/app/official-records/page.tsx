import { HubShell } from "@/components/hub/HubShell";
import { MeetingRecordsList } from "@/components/workspace/MeetingRecordsList";
import { fetchCommittees } from "@/lib/db/members";
import {
  fetchAllMeetingRecords,
  fetchPromotableNotesPosts,
} from "@/lib/db/meeting-records";

export const dynamic = "force-dynamic";
export const metadata = { title: "Official Records" };

export default async function OfficialRecordsPage() {
  const [records, promotable, committees] = await Promise.all([
    fetchAllMeetingRecords(),
    fetchPromotableNotesPosts(),
    fetchCommittees(),
  ]);

  const committeeOptions = committees.map((c) => ({ code: c.code, name: c.name }));

  return (
    <HubShell
      eyebrow="Governance"
      title="Official records."
      subtitle="LDPEC + committee minutes and treasurer reports. Draft → Published at the meeting, Approved when the next meeting ratifies. Anyone on the EC can read; Secretary and Officers publish."
      maxWidthClass="max-w-4xl"
    >
      <div className="mb-6 rounded-lg border border-[var(--color-ldp-line)] bg-white p-4 text-sm text-[var(--color-ldp-ink-900)]">
        <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-ldp-ink-700)]">
          How this works
        </div>
        <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-[13px]">
          <li>
            The Secretary writes minutes as a <strong>NOTES post</strong> in the relevant
            committee workspace (or the LDPEC workspace). Set a meeting date on the post.
          </li>
          <li>
            Come back here and click <strong>Publish record</strong> to promote that
            NOTES post into the official record (status: PUBLISHED).
          </li>
          <li>
            At the next meeting, the body ratifies. Click <strong>Approve</strong> on the
            published row to move it to APPROVED.
          </li>
          <li>
            If a later meeting revises a previously-approved record, click{" "}
            <strong>Amend</strong> to flag the change.
          </li>
        </ol>
      </div>

      <MeetingRecordsList
        records={records}
        promotablePosts={promotable}
        committeeOptions={committeeOptions}
      />
    </HubShell>
  );
}
