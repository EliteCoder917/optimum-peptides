import Link from "next/link";

export default function Logo({
  textClassName = "text-base sm:text-lg",
  className = "",
}: {
  textClassName?: string;
  className?: string;
}) {
  return (
    <Link href="/" className={`flex min-w-0 items-center gap-2.5 ${className}`}>
      <img
        src="/images/logo-icon.png"
        alt=""
        className="size-9 shrink-0 rounded-lg"
      />

      {/* nowrap: the two words are one wordmark, and letting them break
          across lines squashes the header on narrow screens. */}
      <span
        className={`whitespace-nowrap font-semibold tracking-tight ${textClassName}`}
      >
        <span className="text-foreground">Optimum </span>
        <span className="text-primary">Peptides</span>
      </span>
    </Link>
  );
}
