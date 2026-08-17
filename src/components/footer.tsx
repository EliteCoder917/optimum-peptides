import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card/40">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-[1.2fr_0.6fr_1.2fr]">
        {/* Brand */}
        <div>
          <Link
            href="/"
            className="text-xl font-semibold tracking-tight text-foreground"
          >
            Optimum <span className="text-primary">Peptides</span>
          </Link>

          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Your straightforward source for high-quality peptides, with easy
            ordering and fast, secure shipping.
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
            className="mt-4 inline-flex rounded-md bg-primary px-4 py-2.5 text-sm font-semibold uppercase tracking-[0.16em] text-primary-foreground transition-opacity hover:opacity-90"
          >
            Contact Us
          </Link>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-border px-5 py-6 text-center text-xs text-muted-foreground">
        © {year} Optimum Peptides. All rights reserved.
      </div>
    </footer>
  );
}
