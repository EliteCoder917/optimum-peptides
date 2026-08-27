import { TriangleAlert } from "lucide-react";

/**
 * The research-use statement. Every page that shows a product, a price, or a
 * step toward purchase must carry one of these — the research-chemical
 * status of the catalogue depends on this being unambiguous and everywhere,
 * not buried in a terms page.
 */
export default function ResearchNotice({
  variant = "block",
}: {
  variant?: "block" | "inline";
}) {
  if (variant === "inline") {
    return (
      <p className="text-xs leading-relaxed text-muted-foreground">
        <span className="font-semibold uppercase tracking-[0.1em] text-foreground">
          For laboratory research use only.
        </span>{" "}
        Not for human or veterinary use. Not a medicine, food, or cosmetic.
        Not for diagnostic or therapeutic use.
      </p>
    );
  }

  return (
    <div className="flex gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
      <TriangleAlert className="mt-0.5 size-4 shrink-0 text-amber-500" />
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.1em] text-amber-500">
          For laboratory research use only
        </p>
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
          Products supplied by Optimum Peptides are intended solely for
          in-vitro laboratory research and analytical use by qualified
          professionals. They are not medicines and are{" "}
          <span className="text-foreground">
            not for human or veterinary consumption
          </span>
          , nor for diagnostic, therapeutic, or cosmetic application. We do not
          supply dosing guidance or protocols for use in humans or animals, and
          nothing on this site should be read as a claim that any compound
          treats, prevents, or alleviates any condition.
        </p>
      </div>
    </div>
  );
}
