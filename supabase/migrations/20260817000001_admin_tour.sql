-- Tracks whether an admin has completed/dismissed the onboarding tour,
-- so it can auto-flag as a "new" notification for first-time admins
-- without re-notifying everyone on every login.

alter table admin_users
  add column has_seen_tour boolean not null default false;
