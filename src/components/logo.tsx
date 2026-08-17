import Link from "next/link";
import { Dna } from "lucide-react";

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
        <Dna className="size-5" />
      </span>

      <span className={`font-semibold tracking-tight ${textClassName}`}>
        <span className="text-foreground">Optimum </span>
        <span className="text-primary">Peptides</span>
      </span>
    </Link>
  );
}
