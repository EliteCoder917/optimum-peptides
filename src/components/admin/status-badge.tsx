const TONES = {
  green: "bg-green-50 text-green-700",
  blue: "bg-blue-50 text-blue-700",
  indigo: "bg-indigo-50 text-indigo-700",
  amber: "bg-amber-50 text-amber-700",
  red: "bg-red-50 text-red-700",
  gray: "bg-gray-100 text-gray-600",
} as const;

export type StatusTone = keyof typeof TONES;

export default function StatusBadge({
  children,
  tone,
}: {
  children: string;
  tone: StatusTone;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${TONES[tone]}`}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}
