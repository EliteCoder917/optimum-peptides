import Link from "next/link";

export default function Logo({
  textClassName = "text-lg",
  className = "",
}: {
  textClassName?: string;
  className?: string;
}) {
  return (
    <Link href="/" className={`flex items-center gap-2.5 ${className}`}>
      <img
        src="/images/logo-icon.png"
        alt=""
        className="size-9 shrink-0 rounded-lg"
      />

      <span className={`font-semibold tracking-tight ${textClassName}`}>
        <span className="text-foreground">Optimum </span>
        <span className="text-primary">Peptides</span>
      </span>
    </Link>
  );
}
