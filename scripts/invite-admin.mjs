#!/usr/bin/env node
// Sends a real admin invite via the Supabase Admin API, with an explicit
// redirectTo. The Dashboard's "Invite user" button has no way to set this
// and always falls back to the Site URL, so invites sent from there never
// land on /admin/accept-invite. This script is the reliable path.
//
// Usage:
//   node --env-file=.env scripts/invite-admin.mjs someone@example.com
//   node --env-file=.env scripts/invite-admin.mjs someone@example.com https://optimum-peptides.com

import { createClient } from "@supabase/supabase-js";

const email = process.argv[2];
const siteUrl = process.argv[3] ?? "http://localhost:3000";

if (!email) {
  console.error(
    "Usage: node --env-file=.env scripts/invite-admin.mjs <email> [site-url]",
  );
  process.exit(1);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY — make sure to run this with --env-file=.env (or .env.local).",
  );
  process.exit(1);
}

const admin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

const redirectTo = `${siteUrl}/admin/accept-invite`;

const { data, error } = await admin.auth.admin.inviteUserByEmail(email, {
  redirectTo,
});

if (error) {
  console.error("Invite failed:", error.message);
  process.exit(1);
}

console.log(`Invited ${data.user.email}.`);
console.log(`They'll receive an email linking to ${redirectTo}.`);
console.log(
  `Make sure that exact URL is in Authentication -> URL Configuration -> Redirect URLs.`,
);
