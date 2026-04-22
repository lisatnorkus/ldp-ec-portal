-- Adds contact-email field on candidates (website_url was already present)
-- and an approximate-date flag on events for signature events whose
-- real date isn't confirmed yet (e.g., WDD's late-August window, DatD's
-- post-election Saturday).

ALTER TABLE candidates ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE events ADD COLUMN IF NOT EXISTS date_is_approximate boolean NOT NULL DEFAULT false;
