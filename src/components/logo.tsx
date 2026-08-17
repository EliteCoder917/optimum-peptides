import Link from "next/link";

function LogoMark() {
  return (
    <svg
      viewBox="0 0 100 100"
      className="size-6"
      fill="none"
      aria-hidden="true"
    >
      {/* outer crescents */}
      <path
        d="M 50 15 A 35.5 35.5 0 1 0 50 85"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M 50 15 A 35.5 35.5 0 1 1 50 85"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
      />

      {/* helix strands */}
      <path
        d="M 42 24 C 33 31, 33 39, 42 46 C 51 53, 51 61, 42 68 C 34 74, 34 74, 34 76"
        stroke="var(--steel)"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <path
        d="M 58 24 C 67 31, 67 39, 58 46 C 49 53, 49 61, 58 68 C 66 74, 66 74, 66 76"
        stroke="var(--steel)"
        strokeWidth="4.5"
        strokeLinecap="round"
      />

      {/* rungs */}
      <line
        x1="37"
        y1="28"
        x2="63"
        y2="28"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="34"
        y1="38"
        x2="66"
        y2="38"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="42"
        y1="50"
        x2="58"
        y2="50"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="34"
        y1="62"
        x2="66"
        y2="62"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <line
        x1="37"
        y1="72"
        x2="63"
        y2="72"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Logo({
  textClassName = "text-lg",
  className = "",
}: {
  textClassName?: string;
  className?: string;
}) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 ${className}`}>
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-primary/40 bg-primary/10 text-primary">
        <LogoMark />
      </span>

      <span className={`font-semibold tracking-tight ${textClassName}`}>
        <span className="text-foreground">Optimum </span>
        <span className="text-primary">Peptides</span>
      </span>
    </Link>
  );
}
