-- Add structured attendance columns to ec_members.
ALTER TABLE ec_members
  ADD COLUMN IF NOT EXISTS attendance_present int,
  ADD COLUMN IF NOT EXISTS attendance_excused int,
  ADD COLUMN IF NOT EXISTS attendance_absent int,
  ADD COLUMN IF NOT EXISTS attendance_eligible int;

-- Committee detail: workflow steps + linked docs + member roster text.
ALTER TABLE committees
  ADD COLUMN IF NOT EXISTS workflow text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS docs jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS member_codes text[] NOT NULL DEFAULT '{}';

-- Track the number of meetings attendance is tracked over.
INSERT INTO settings (key, value, description)
VALUES ('attendance_meeting_count', '10', 'Number of CEC meetings attendance has been tracked over since June 2025 reorg (denominator for attendance %).')
ON CONFLICT (key) DO NOTHING;
