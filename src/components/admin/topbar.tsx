import { Search } from "lucide-react";
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

      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            aria-label="Search"
            className="h-9 w-56 rounded-full border border-gray-200 bg-gray-50 pl-9 pr-4 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-blue-400"
          />
        </div>

        <NotificationsBell />

        <div className="flex size-9 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
          A
        </div>
      </div>
    </header>
  );
}
