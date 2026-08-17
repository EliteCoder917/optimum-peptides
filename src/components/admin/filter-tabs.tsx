"use client";

export default function FilterTabs({
  options,
  active,
  onChange,
}: {
  options: { label: string; count: number }[];
  active: string;
  onChange: (label: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.label}
          type="button"
          onClick={() => onChange(option.label)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            active === option.label
              ? "bg-gray-900 text-white"
              : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          {option.label} ({option.count})
        </button>
      ))}
    </div>
  );
}
