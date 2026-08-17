import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string;
  icon?: LucideIcon;
  iconClassName?: string;
  delta?: { value: string; direction: "up" | "down" };
};

export default function StatCard({
  label,
  value,
  icon: Icon,
  iconClassName,
  delta,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      {(Icon || delta) && (
        <div className="flex items-start justify-between">
          {Icon && (
            <div
              className={`flex size-10 items-center justify-center rounded-xl ${
                iconClassName ?? "bg-blue-50 text-blue-600"
              }`}
            >
              <Icon className="size-5" />
            </div>
          )}

          {delta && (
            <span
              className={`rounded-full px-2 py-1 text-xs font-medium ${
                delta.direction === "up"
                  ? "bg-green-50 text-green-600"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {delta.direction === "up" ? "↗" : "↘"} {delta.value}
            </span>
          )}
        </div>
      )}

      <p className="mt-4 text-2xl font-semibold text-gray-900">{value}</p>
      <p className="mt-1 text-sm text-gray-500">{label}</p>
    </div>
  );
}
