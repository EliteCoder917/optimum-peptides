import type { Metadata } from "next";
import ResearchNotice from "@/components/research-notice";

export const metadata: Metadata = {
  title: "Terms of Supply — Optimum Peptides",
  description:
    "Terms governing the supply of research chemicals by Optimum Peptides. Research use only; not for human or veterinary consumption.",
};

const SECTIONS = [
  {
    heading: "1. Research use only",
    body: [
      "All products supplied by Optimum Peptides are sold strictly as research chemicals, intended solely for in-vitro laboratory research and analytical work carried out by suitably qualified persons in an appropriate facility.",
      "No product supplied by us is a medicinal product, food, food supplement, cosmetic, or medical device. No product is authorised by the Medicines and Healthcare products Regulatory Agency (MHRA) or any equivalent body for use in humans or animals.",
    ],
  },
  {
    heading: "2. Not for human or animal use",
    body: [
      "Products must not be administered to, ingested by, injected into, or otherwise applied to humans or animals under any circumstances. They must not be used for diagnostic or therapeutic purposes, nor resold or repackaged for any such purpose.",
      "We do not provide dosing schedules, administration routes, cycles, protocols, or any other guidance relating to use in humans or animals, and we will not do so on request.",
    ],
  },
  {
    heading: "3. No medical or therapeutic claims",
    body: [
      "Nothing on this website constitutes a claim that any product treats, prevents, cures, diagnoses, or alleviates any disease, condition, or symptom in humans or animals.",
      "Product descriptions summarise published scientific literature on a compound's molecular class and mechanism of action for research reference only. References to studies, clinical trials, or the regulatory status of a substance elsewhere are factual background, not an offer to supply that substance for that purpose, and not an endorsement of any use.",
    ],
  },
  {
    heading: "4. Prescription-only medicines are not supplied",
    body: [
      "We do not supply licensed prescription-only medicines. Any substance that is the subject of a UK marketing authorisation as a prescription-only medicine falls outside our catalogue entirely, and cannot be ordered from us in any form or under any labelling.",
      "If you are seeking a licensed medicine, you must obtain it from a registered pharmacy against a prescription issued by an appropriate practitioner.",
    ],
  },
  {
    heading: "5. Buyer eligibility and responsibilities",
    body: [
      "By placing an order you confirm that you are at least 18 years of age, that you are acquiring products for legitimate research purposes, and that you are competent to handle research chemicals safely.",
      "You are solely responsible for handling, storage, risk assessment, containment, and disposal in accordance with all applicable health and safety law, and for ensuring that your intended research is lawful in your jurisdiction.",
      "You agree not to resupply any product to any person for human or veterinary use, and not to represent any product as fit for such use.",
    ],
  },
  {
    heading: "6. Orders and pricing",
    body: [
      "Prices are shown in pounds sterling. Placing an order creates a request to purchase; a contract is formed only when we confirm and accept that order.",
      "We may refuse or cancel any order at our discretion, including where we have reason to believe products are intended for human or veterinary use, for resale as medicines, or for any unlawful purpose.",
    ],
  },
  {
    heading: "7. Governing law",
    body: [
      "These terms are governed by the law of England and Wales, and are subject to the exclusive jurisdiction of the courts of England and Wales.",
    ],
  },
];

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <section className="border-b border-border">
        <div className="mx-auto max-w-3xl px-5 py-20">
          <p className="text-[11px] uppercase tracking-[0.24em] text-primary">
            Legal
          </p>
          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
            <span className="text-brand-gradient">Terms of Supply</span>
          </h1>
          <p className="mt-5 text-muted-foreground">
            These terms govern every sale made through this site. Please read
            them before ordering.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-5 py-14">
        <ResearchNotice />

        <div className="mt-12 space-y-10">
          {SECTIONS.map((section) => (
            <section key={section.heading}>
              <h2 className="text-lg font-semibold">{section.heading}</h2>
              {section.body.map((paragraph) => (
                <p
                  key={paragraph}
                  className="mt-3 text-sm leading-relaxed text-muted-foreground"
                >
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </div>

        <p className="mt-14 border-t border-border pt-6 text-xs text-muted-foreground">
          These terms are provided as a plain-language statement of how we
          supply products and do not constitute legal advice. If you have
          questions about them, contact us before ordering.
        </p>
      </div>
    </div>
  );
}
