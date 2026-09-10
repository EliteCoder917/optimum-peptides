import NotificationsBell from "@/components/admin/notifications-bell";

export default function AdminTopbar({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <header className="flex items-center justify-between border-b border-gray-200 bg-white px-8 py-5">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>
      </div>

      {/* No global search here on purpose: it was a dead input with no state
          or handler, sitting directly above the working per-page search on
          Products, Orders and Reviews. Two search boxes where only the lower
          one responds is worse than one. */}
      <NotificationsBell />
    </header>
  );
}
