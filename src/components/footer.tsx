import Link from "next/link";
import Logo from "@/components/logo";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card/40">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-[1.2fr_0.6fr_1.2fr]">
        {/* Brand */}
        <div>
          <Logo textClassName="text-xl" />

          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Research chemicals supplied to laboratories and qualified
            researchers, with documented listings and tracked dispatch.
          </p>
        </div>

        {/* Quick Links */}
        <nav aria-label="Footer" className="text-sm">
          <h3 className="mb-4 text-[12px] uppercase tracking-[0.2em] text-foreground">
            Quick Links
          </h3>

          <ul className="space-y-2 text-muted-foreground">
            <li>
              <Link
                href="/shop"
                className="transition-colors hover:text-primary"
              >
                Browse Catalog
              </Link>
            </li>

            <li>
              <Link
                href="/about"
                className="transition-colors hover:text-primary"
              >
                About Us
              </Link>
            </li>

            <li>
              <Link
                href="/contact"
                className="transition-colors hover:text-primary"
              >
                Contact
              </Link>
            </li>

            <li>
              <Link
                href="/terms"
                className="transition-colors hover:text-primary"
              >
                Terms of Supply
              </Link>
            </li>
          </ul>
        </nav>

        {/* Get in Touch */}
        <div className="panel rounded-2xl p-6">
          <h3 className="mb-2 text-[12px] uppercase tracking-[0.2em]">
            Get in Touch
          </h3>

          <p className="text-sm text-muted-foreground">
            Have a question? Reach out and we will get back to you.
          </p>

          <p className="mt-4 text-sm text-foreground">
            admin@optimum-peptides.com
          </p>

          <Link
            href="/contact"
            className="bg-metal-gradient mt-4 inline-flex rounded-md px-4 py-2.5 text-sm font-semibold uppercase tracking-[0.16em] text-primary-foreground transition-opacity hover:opacity-90"
          >
            Contact Us
          </Link>
        </div>
      </div>

      {/* Research use disclaimer */}
      <div className="border-t border-border px-5 py-7">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-500">
            For laboratory research use only
          </p>
          <p className="mx-auto mt-3 max-w-3xl text-xs leading-relaxed text-muted-foreground">
            All products sold on this site are supplied strictly as research
            chemicals for in-vitro laboratory use by qualified professionals.
            They are not medicines, foods, cosmetics, or supplements, and are
            not for human or veterinary consumption, nor for diagnostic or
            therapeutic use. No statement on this site is a claim that any
            compound treats, prevents, or alleviates any condition. We do not
            supply licensed prescription-only medicines, and we provide no
            dosing or administration guidance. By ordering you confirm you are
            18 or over and accept our{" "}
            <Link href="/terms" className="underline underline-offset-2 hover:text-primary">
              terms of supply
            </Link>
            .
          </p>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-border px-5 py-6 text-center text-xs text-muted-foreground">
        © {year} Optimum Peptides. All rights reserved.
      </div>
    </footer>
  );
}
