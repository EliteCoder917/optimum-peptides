"use client";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="border-t border-border bg-card/40">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-[1.2fr_0.6fr_1.2fr]">
        {/* Brand */}
        <div>
          <a
            href="/"
            className="text-xl font-semibold tracking-tight text-foreground"
          >
            Optimum <span className="text-primary">Peptides</span>
          </a>

          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Supplying laboratories and independent researchers with high-purity
            research materials, batch-tested and handled according to laboratory
            standards.
          </p>
        </div>

        {/* Quick Links */}
        <nav aria-label="Footer" className="text-sm">
          <h3 className="mb-4 text-[12px] uppercase tracking-[0.2em] text-foreground">
            Quick Links
          </h3>

          <ul className="space-y-2 text-muted-foreground">
            <li>
              <a
                href="/#lineup"
                className="transition-colors hover:text-primary"
              >
                Browse Catalog
              </a>
            </li>

            <li>
              <a
                href="/#quality"
                className="transition-colors hover:text-primary"
              >
                Quality
              </a>
            </li>

            <li>
              <a
                href="/#research"
                className="transition-colors hover:text-primary"
              >
                Research
              </a>
            </li>

            <li>
              <a
                href="/#about"
                className="transition-colors hover:text-primary"
              >
                About Us
              </a>
            </li>

            <li>
              <a
                href="#contact"
                className="transition-colors hover:text-primary"
              >
                Contact
              </a>
            </li>
          </ul>
        </nav>

        {/* Contact */}
        <form
          className="panel rounded-2xl p-6"
          onSubmit={(e) => {
            e.preventDefault();
            e.currentTarget.reset();
          }}
        >
          <h3 className="mb-4 text-[12px] uppercase tracking-[0.2em]">
            Contact Us
          </h3>

          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Name"
              aria-label="Name"
              required
              className="h-10 rounded-md border border-border bg-secondary/50 px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
            />

            <input
              type="email"
              placeholder="Email"
              aria-label="Email"
              required
              className="h-10 rounded-md border border-border bg-secondary/50 px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
            />
          </div>

          <textarea
            placeholder="Message"
            aria-label="Message"
            required
            className="mt-3 min-h-24 w-full resize-none rounded-md border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
          />

          <button
            type="submit"
            className="mt-4 w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold uppercase tracking-[0.16em] text-primary-foreground transition-opacity hover:opacity-90"
          >
            Send Message
          </button>
        </form>
      </div>

      {/* Copyright */}
      <div className="border-t border-border px-5 py-6 text-center text-xs text-muted-foreground">
        © {year} Optimum Peptides. All rights reserved.
      </div>
    </footer>
  );
}
