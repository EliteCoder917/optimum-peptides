import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/sidebar";
import { TourProvider } from "@/components/admin/tour-provider";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Admin — Optimum Peptides",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Middleware already enforces this; this is a defensive fallback in case
  // this layout is ever reached without going through it.
  if (!user) {
    redirect("/admin/login");
  }

  const { data: adminRow } = await supabase
    .from("admin_users")
    .select("has_seen_tour")
    .eq("user_id", user.id)
    .maybeSingle();

  return (
    <TourProvider initialHasSeenTour={adminRow?.has_seen_tour ?? false}>
      <div className="flex min-h-screen bg-gray-50 text-gray-900">
        <AdminSidebar email={user.email ?? ""} />
        <div className="flex-1">{children}</div>
      </div>
    </TourProvider>
  );
}
