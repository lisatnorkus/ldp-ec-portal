-- KDP launched IWillVote.com (find drop boxes / polling locations, check
-- registration, view deadlines) and is awaiting the Final Primary Voter
-- File from SBE for VAN load. Surface both on the April month card so EC
-- members see them on their next portal visit.

UPDATE month_cards
SET content_md = '**April — Full canvass cadence.** Weekly canvass shifts in priority MC precincts. Volunteer pipeline in full motion. Endorsements finalize before May.

**KDP just launched [IWillVote.com](https://iwillvote.com/).** Drop-box and polling-location lookup, registration check, voter-ID rules, and deadlines. KDP is asking us to pressure-test before broad share — flag anything off to communications@louisvilledems.com and we''ll relay.

**Final Primary Voter File update:** KDP has requested it from the SBE. Once received it goes into VAN; LDPEC will be notified when load begins.'
WHERE month = 4 AND year = 2026;
