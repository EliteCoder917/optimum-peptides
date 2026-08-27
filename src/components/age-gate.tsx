"use client";

import { useEffect, useState } from "react";
import { TriangleAlert } from "lucide-react";

const STORAGE_KEY = "op-research-ack";

/**
 * Blocks the catalogue until the visitor confirms they are 18+ and are
 * accessing the site for research purposes. Deliberately a hard gate (no
 * dismiss-by-clicking-away) so the acknowledgement is an actual decision.
 *
 * This is an access control, not proof of identity — it records that the
 * terms were put to the visitor before they saw any product.
 */
export default function AgeGate() {
  const [acknowledged, setAcknowledged] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAcknowledged(localStorage.getItem(STORAGE_KEY) === "true");
    } catch {
      // Storage blocked — show the gate rather than silently skipping it.
      setAcknowledged(false);
    }
  }, []);

  function accept() {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // Storage unavailable — still let them through for this session.
    }
    setAcknowledged(true);
  }

  // Render nothing until we know, so the gate never flashes for someone
  // who already accepted.
  if (acknowledged === null || acknowledged) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 p-5 backdrop-blur-sm"
    >
      <div className="panel w-full max-w-lg rounded-2xl p-7">
        <div className="flex items-center gap-3">
          <TriangleAlert className="size-5 shrink-0 text-amber-500" />
          <h2
            id="age-gate-title"
            className="text-sm font-semibold uppercase tracking-[0.14em] text-amber-500"
          >
            Research use only
          </h2>
        </div>

        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
          Everything sold on this site is supplied strictly as a research
          chemical for in-vitro laboratory use by qualified professionals.
        </p>

        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
          {[
            "Not for human or veterinary consumption.",
            "Not a medicine, food, cosmetic, or dietary supplement.",
            "Not for diagnostic, therapeutic, or cosmetic use.",
            "No dosing or administration guidance is provided.",
          ].map((line) => (
            <li key={line} className="flex gap-2.5">
              <span className="mt-1.5 size-1 shrink-0 rounded-full bg-amber-500" />
              {line}
            </li>
          ))}
        </ul>

        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
          By continuing you confirm you are{" "}
          <span className="text-foreground">at least 18 years old</span>, that
          you are accessing this site for legitimate research purposes, and
          that you accept our{" "}
          <a
            href="/terms"
            className="text-primary underline underline-offset-2"
          >
            terms of supply
          </a>
          .
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          {/* Both are flex-centred rather than relying on text-align: the
              row stretches items to equal height, and a block-level <a>
              would keep its single line pinned to the top. */}
          <button
            type="button"
            onClick={accept}
            className="bg-metal-gradient flex flex-1 items-center justify-center rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-primary-foreground transition-opacity hover:opacity-90"
          >
            Confirm &amp; enter
          </button>
          <a
            href="https://www.gov.uk"
            className="flex flex-1 items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-medium uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:bg-white/5"
          >
            Leave
          </a>
        </div>
      </div>
    </div>
  );
}
