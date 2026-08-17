import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase public environment variables");
}

// Uses the anon key — subject to RLS, safe to import in client components.
// Persists the session via cookies (not localStorage) so middleware and
// server components can read it too.
export const supabaseBrowser = createBrowserClient(
  supabaseUrl,
  supabaseAnonKey,
);
