import Link from "next/link";

/**
 * Persistent site-wide research-use strip. Sits above the header so it is
 * present on every page before any product is seen.
 */
export default function ResearchBanner() {
  return (
    <div className="border-b border-amber-500/25 bg-amber-500/10">
      <p className="mx-auto max-w-7xl px-5 py-2 text-center text-[11px] leading-relaxed tracking-wide text-amber-200/90">
        <span className="font-semibold uppercase tracking-[0.12em] text-amber-400">
          Research use only
        </span>
        <span className="mx-2 text-amber-500/40">|</span>
        All products are supplied for laboratory research only and are not for
        human or veterinary consumption.{" "}
        <Link
          href="/terms"
          className="underline underline-offset-2 hover:text-amber-100"
        >
          Terms of supply
        </Link>
      </p>
    </div>
  );
}
