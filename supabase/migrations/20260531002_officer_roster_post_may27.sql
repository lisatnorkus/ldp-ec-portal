-- Officer roster — post-May-27 state, made idempotent.
--
-- A may_2026_meeting_roster_updates migration was applied directly to
-- Supabase (per commit 54a0358) but never checked into the repo. This
-- migration captures the same end state in version control so future
-- environments come up correct. All updates are idempotent — if the
-- prod DB already matches, they're no-ops.
--
-- Post-May-27 officer state:
--   CHAIR      — Roz Welch (interim, promoted from VICE_CHAIR)
--   VICE_CHAIR — vacant (Roz's old seat)
--   SECRETARY  — Brook Benningfield (also LD36 VC via legislative_districts.vc_id)
--   TREASURER  — Linda Jones (was mis-labeled COMMITTEE_CHAIR_ONLY)
--
-- Logan Gatti stepped down as LDPEC Chair and remains LD42 Chair —
-- already reflected in seed as LD_CHAIR, no change needed.

update ec_members
   set primary_role = 'OFFICER',
       officer_role = 'CHAIR'
 where (email = 'vicechair@louisvilledems.com'
        or (lower(first_name) = 'roz' and lower(last_name) = 'welch'))
   and active
   and (primary_role <> 'OFFICER' or officer_role <> 'CHAIR' or officer_role is null);

update ec_members
   set primary_role = 'OFFICER',
       officer_role = 'SECRETARY'
 where (email = 'secretary@louisvilledems.com'
        or (lower(first_name) = 'brook' and lower(last_name) = 'benningfield'))
   and active
   and (primary_role <> 'OFFICER' or officer_role <> 'SECRETARY' or officer_role is null);

update ec_members
   set primary_role = 'OFFICER',
       officer_role = 'TREASURER'
 where (email = 'treasurer@louisvilledems.com'
        or (lower(first_name) = 'linda' and lower(last_name) = 'jones'))
   and active
   and (primary_role <> 'OFFICER' or officer_role <> 'TREASURER' or officer_role is null);

-- Defensive: Logan Gatti stays LD42 Chair, not officer. If any prior
-- state had him as OFFICER, fix it. Already correct in current seed.
update ec_members
   set primary_role = 'LD_CHAIR',
       officer_role = null
 where (email = 'chair@louisvilledems.com'
        or (lower(first_name) = 'logan' and lower(last_name) = 'gatti'))
   and active
   and (primary_role = 'OFFICER' or officer_role is not null);
