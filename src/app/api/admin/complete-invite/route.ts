import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

// Reaching this route with a valid session already proves the caller was
// invited by an owner (there's no public sign-up anywhere in this app, so
// the only way to ever get a Supabase session is via an invite link sent
// through the admin API/dashboard). That's the whole authorization check —
// no separate manual admin_users insert needed after this.
export async function POST() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { error } = await supabaseAdmin
    .from("admin_users")
    .upsert({ user_id: user.id }, { onConflict: "user_id" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
