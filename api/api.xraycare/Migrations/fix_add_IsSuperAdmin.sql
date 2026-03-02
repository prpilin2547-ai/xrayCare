-- Run this once if you get "column u.IsSuperAdmin does not exist".
--
-- From project root (d:\xrayCare):
--   docker compose exec postgres psql -U xrayuser -d postgres -c "ALTER TABLE \"Users\" ADD COLUMN IF NOT EXISTS \"IsSuperAdmin\" boolean NOT NULL DEFAULT false; UPDATE \"Users\" SET \"IsSuperAdmin\" = true WHERE \"Username\" = 'Superadmin';"
--
-- Or paste the two lines below into psql / pgAdmin.

ALTER TABLE "Users" ADD COLUMN IF NOT EXISTS "IsSuperAdmin" boolean NOT NULL DEFAULT false;
UPDATE "Users" SET "IsSuperAdmin" = true WHERE "Username" = 'Superadmin';
