import type { Metadata } from "next";
import AdminSidebar from "@/components/admin/sidebar";

export const metadata: Metadata = {
  title: "Admin — Optimum Peptides",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      <AdminSidebar />
      <div className="flex-1">{children}</div>
    </div>
  );
}
