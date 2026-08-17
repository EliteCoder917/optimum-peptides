import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/sidebar";
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

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <AdminSidebar email={user.email ?? ""} />
      <div className="flex-1">{children}</div>
    </div>
  );
}
