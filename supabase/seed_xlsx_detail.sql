-- Data extracted from LDP_Org_Chart_2025.xlsx
-- Generated 2026-04-21T01:02:17.751Z

-- Phone numbers from xlsx People Directory + LD Committees sheets
UPDATE ec_members SET phone = COALESCE(phone, 'Phone') WHERE first_name = 'Name' AND last_name = '';
UPDATE ec_members SET phone = COALESCE(phone, '(502) 702-1395') WHERE first_name = 'Rick' AND last_name = 'Adams';
UPDATE ec_members SET phone = COALESCE(phone, '(502) 396-6536') WHERE first_name = 'Almaria' AND last_name = 'Baker';
UPDATE ec_members SET phone = COALESCE(phone, '(202) 957-9292') WHERE first_name = 'Julie' AND last_name = 'Carr';
UPDATE ec_members SET phone = COALESCE(phone, '(859) 585-3994') WHERE first_name = 'Seth' AND last_name = 'Drake';
UPDATE ec_members SET phone = COALESCE(phone, '(502) 999-6395') WHERE first_name = 'Ruth' AND last_name = 'Gao';
UPDATE ec_members SET phone = COALESCE(phone, '(502) 931-6721') WHERE first_name = 'Logan' AND last_name = 'Gatti';
UPDATE ec_members SET phone = COALESCE(phone, '(502) 889-7579') WHERE first_name = 'Blake' AND last_name = 'Gerstner';
UPDATE ec_members SET phone = COALESCE(phone, '(502) 758-1426') WHERE first_name = 'Kathryn' AND last_name = 'Hargraves';
UPDATE ec_members SET phone = COALESCE(phone, '(502) 407-2349') WHERE first_name = 'Charlie' AND last_name = 'Horton';
UPDATE ec_members SET phone = COALESCE(phone, '(502) 262-3728') WHERE first_name = 'Linda' AND last_name = 'Jones';
UPDATE ec_members SET phone = COALESCE(phone, '(502) 608-1324') WHERE first_name = 'Robert' AND last_name = 'Kahne';
UPDATE ec_members SET phone = COALESCE(phone, '(502) 614-9189') WHERE first_name = 'Joi' AND last_name = 'McAtee';
UPDATE ec_members SET phone = COALESCE(phone, '(502) 681-6931') WHERE first_name = 'Stephon' AND last_name = 'Moore';
UPDATE ec_members SET phone = COALESCE(phone, '(502) 432-8338') WHERE first_name = 'Jeff' AND last_name = 'Noble';
UPDATE ec_members SET phone = COALESCE(phone, '(502) 802-6353') WHERE first_name = 'Jason' AND last_name = 'Perkey';
UPDATE ec_members SET phone = COALESCE(phone, '(787) 420-5556') WHERE first_name = 'Ricky' AND last_name = 'Santiago';
UPDATE ec_members SET phone = COALESCE(phone, '(502) 231-9596') WHERE first_name = 'John' AND last_name = 'Stovall';
UPDATE ec_members SET phone = COALESCE(phone, '(314) 495-3517') WHERE first_name = 'Beth' AND last_name = 'Thorpe';
UPDATE ec_members SET phone = COALESCE(phone, '(502) 314-8068') WHERE first_name = 'Mike' AND last_name = 'Ward';
UPDATE ec_members SET phone = COALESCE(phone, '(502) 295-5435') WHERE first_name = 'Roz' AND last_name = 'Welch';
UPDATE ec_members SET phone = COALESCE(phone, '(502) 645-5526') WHERE first_name = 'Allison' AND last_name = 'Wiseman';

UPDATE ec_members SET phone = COALESCE(phone, 'Chair Phone') WHERE first_name = 'Chair' AND last_name = '';
UPDATE ec_members SET phone = COALESCE(phone, 'VC Phone') WHERE first_name = 'Vice' AND last_name = 'Chair';
UPDATE ec_members SET email = COALESCE(email, 'Chair Email') WHERE first_name = 'Chair' AND last_name = '';
UPDATE ec_members SET email = COALESCE(email, 'VC Email') WHERE first_name = 'Vice' AND last_name = 'Chair';
UPDATE ec_members SET phone = COALESCE(phone, '(502) 396-6536') WHERE first_name = 'Almaria' AND last_name = 'Baker';
UPDATE ec_members SET phone = COALESCE(phone, '(787) 420-5556') WHERE first_name = 'Ricky' AND last_name = 'Santiago';
UPDATE ec_members SET email = COALESCE(email, 'ricardo.santiago21@live.com') WHERE first_name = 'Ricky' AND last_name = 'Santiago';
UPDATE ec_members SET email = COALESCE(email, 'cassie.blausey@gmail.com') WHERE first_name = 'Cassie' AND last_name = 'Blausey';
UPDATE ec_members SET email = COALESCE(email, 'emalee.morley@gmail.com') WHERE first_name = 'Emalee' AND last_name = 'Morley';
UPDATE ec_members SET email = COALESCE(email, 'Jstammer64@aol.com') WHERE first_name = 'Jim' AND last_name = 'Stammerman';
UPDATE ec_members SET phone = COALESCE(phone, '(502) 999-6395') WHERE first_name = 'Ruth' AND last_name = 'Gao';
UPDATE ec_members SET email = COALESCE(email, 'ruth.gao@ruthgao.com') WHERE first_name = 'Ruth' AND last_name = 'Gao';
UPDATE ec_members SET phone = COALESCE(phone, '(202) 957-9292') WHERE first_name = 'Julie' AND last_name = 'Carr';
UPDATE ec_members SET email = COALESCE(email, 'juliejcarr@gmail.com') WHERE first_name = 'Julie' AND last_name = 'Carr';
UPDATE ec_members SET email = COALESCE(email, 'Jennifer@laynewilson.com') WHERE first_name = 'Jennifer' AND last_name = 'Hardin';
UPDATE ec_members SET phone = COALESCE(phone, '(502) 758-1426') WHERE first_name = 'Kathryn' AND last_name = 'Hargraves';
UPDATE ec_members SET phone = COALESCE(phone, '(502) 802-6353') WHERE first_name = 'Jason' AND last_name = 'Perkey';
UPDATE ec_members SET email = COALESCE(email, 'perkey@gmail.com') WHERE first_name = 'Jason' AND last_name = 'Perkey';
UPDATE ec_members SET email = COALESCE(email, 'crbene720@gmail.com') WHERE first_name = 'Carolyn' AND last_name = 'Benedict';
UPDATE ec_members SET email = COALESCE(email, 'secretary@louisvilledems.com') WHERE first_name = 'Brook' AND last_name = 'Benningfield';
UPDATE ec_members SET phone = COALESCE(phone, '(502) 231-9596') WHERE first_name = 'John' AND last_name = 'Stovall';
UPDATE ec_members SET email = COALESCE(email, 'Tyra.Walker71@gmail.com') WHERE first_name = 'Tyra' AND last_name = 'Walker-Thomas';
UPDATE ec_members SET phone = COALESCE(phone, '(314) 495-3517') WHERE first_name = 'Beth' AND last_name = 'Thorpe';
UPDATE ec_members SET email = COALESCE(email, 'beth.thorpe@mac.com') WHERE first_name = 'Beth' AND last_name = 'Thorpe';
UPDATE ec_members SET email = COALESCE(email, 'byron.hoskinson@gmail.com') WHERE first_name = 'Byron' AND last_name = 'Hoskinson';
UPDATE ec_members SET phone = COALESCE(phone, '(502) 889-7579') WHERE first_name = 'Blake' AND last_name = 'Gerstner';
UPDATE ec_members SET email = COALESCE(email, 'bgerstner@ibewlocal369.com') WHERE first_name = 'Blake' AND last_name = 'Gerstner';
UPDATE ec_members SET phone = COALESCE(phone, '(502) 608-1324') WHERE first_name = 'Robert' AND last_name = 'Kahne';
UPDATE ec_members SET email = COALESCE(email, 'rkahne@gmail.com') WHERE first_name = 'Robert' AND last_name = 'Kahne';
UPDATE ec_members SET email = COALESCE(email, 'lisatnorkus@gmail.com') WHERE first_name = 'Lisa' AND last_name = 'Tanner Norkus';
UPDATE ec_members SET phone = COALESCE(phone, '(502) 931-6721') WHERE first_name = 'Logan' AND last_name = 'Gatti';
UPDATE ec_members SET email = COALESCE(email, 'chair@louisvilledems.com') WHERE first_name = 'Logan' AND last_name = 'Gatti';
UPDATE ec_members SET phone = COALESCE(phone, '(502) 614-9189') WHERE first_name = 'Joi' AND last_name = 'McAtee';
UPDATE ec_members SET email = COALESCE(email, 'joidmc@gmail.com') WHERE first_name = 'Joi' AND last_name = 'McAtee';
UPDATE ec_members SET phone = COALESCE(phone, '(502) 295-5435') WHERE first_name = 'Roz' AND last_name = 'Welch';
UPDATE ec_members SET email = COALESCE(email, 'vicechair@louisvilledems.com') WHERE first_name = 'Roz' AND last_name = 'Welch';
UPDATE ec_members SET email = COALESCE(email, 'emily.ball773@gmail.com') WHERE first_name = 'Emily' AND last_name = 'Ball';
UPDATE ec_members SET phone = COALESCE(phone, '(502) 645-5526') WHERE first_name = 'Allison' AND last_name = 'Wiseman';
UPDATE ec_members SET email = COALESCE(email, 'allison.wiseman8@gmail.com') WHERE first_name = 'Allison' AND last_name = 'Wiseman';

-- Vacancies / structural gaps from xlsx Vacancies sheet
ALTER TABLE transitions ADD COLUMN IF NOT EXISTS recommended_action text;
INSERT INTO transitions (seat_code, status, notes, recommended_action) VALUES ('LD33_VC_GAP', 'VACANT', 'Chair Jennifer Hardin currently alone', 'Recruit from LD33 precincts') ON CONFLICT DO NOTHING;
INSERT INTO transitions (seat_code, status, notes, recommended_action) VALUES ('LD42_VC_GAP', 'VACANT', 'Chair Logan Gatti (also LDP Chair) needs support', 'Priority — Chair is stretched') ON CONFLICT DO NOTHING;
INSERT INTO transitions (seat_code, status, notes, recommended_action) VALUES ('LD48_CHAIR_GAP', 'VACANT', 'VC Allison Wiseman currently alone', 'Recruit chair from LD48 precincts') ON CONFLICT DO NOTHING;
INSERT INTO transitions (seat_code, status, notes, recommended_action) VALUES ('PRECINCTCAPTAINS_GAP', 'VACANT', 'Per JeffCo precinct map; 0 currently tracked', 'Roll out precinct captain recruitment via LD chairs') ON CONFLICT DO NOTHING;
INSERT INTO transitions (seat_code, status, notes, recommended_action) VALUES ('EVENTSSUBCOMMITTEECHAIRS_GAP', 'VACANT', 'Subcommittee chairs not yet captured', 'Confirm subcommittee leadership with Brook Benningfield (Events Chair)') ON CONFLICT DO NOTHING;

-- Structural template table (seat counts)
CREATE TABLE IF NOT EXISTS structural_template (
  id serial primary key,
  level text not null,
  seat text not null,
  structural_count int,
  currently_filled int,
  gap int,
  display_order int not null default 0,
  updated_at timestamptz not null default now()
);
DELETE FROM structural_template;
INSERT INTO structural_template (level, seat, structural_count, currently_filled, gap, display_order) VALUES ('Countywide Officers', 'LDP Chair / VC / Sec / Treasurer', 4, 4, 0, 1);
INSERT INTO structural_template (level, seat, structural_count, currently_filled, gap, display_order) VALUES ('LD Committees', 'LD Chair (per district)', 18, 17, 1, 2);
INSERT INTO structural_template (level, seat, structural_count, currently_filled, gap, display_order) VALUES ('LD Committees', 'LD Vice Chair (per district)', 18, 16, 2, 3);
INSERT INTO structural_template (level, seat, structural_count, currently_filled, gap, display_order) VALUES ('At-Large', 'At-Large Countywide Chair', 18, 18, 0, 4);
INSERT INTO structural_template (level, seat, structural_count, currently_filled, gap, display_order) VALUES ('Standing Committees', 'Committee Chairs (11 committees)', 11, 11, 0, 5);
INSERT INTO structural_template (level, seat, structural_count, currently_filled, gap, display_order) VALUES ('Standing Committees', 'Committee Members', 104, 104, 0, 6);
INSERT INTO structural_template (level, seat, structural_count, currently_filled, gap, display_order) VALUES ('Events Subcommittees', 'Subcommittee Chairs (Wendell Ford, WDD, Dems at the Downs)', 3, 0, 3, 7);
INSERT INTO structural_template (level, seat, structural_count, currently_filled, gap, display_order) VALUES ('Precinct Captains', 'One per precinct (Jefferson County)', 629, 0, 629, 8);
