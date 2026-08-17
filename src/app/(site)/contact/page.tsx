"use client";

export default function Contact() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        {/* HERO */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-4xl px-5 py-24 text-center">
            <p className="text-[11px] uppercase tracking-[0.24em] text-primary">
              Contact
            </p>

            <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
              <span className="text-brand-gradient">Get in touch</span>
            </h1>

            <p className="mt-5 text-muted-foreground">
              Have a question about an order, a product, or anything else? Send
              us a message and we will get back to you.
            </p>
          </div>
        </section>

        {/* DETAILS + FORM */}
        <section className="mx-auto max-w-5xl px-5 py-20">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <h2 className="text-lg font-semibold">Contact Details</h2>

              <div className="mt-5">
                <p className="text-[11px] uppercase tracking-[0.18em] text-primary">
                  Email
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  admin@optimum-peptides.com
                </p>
              </div>
            </div>

            <form
              className="panel rounded-2xl p-6"
              onSubmit={(event) => {
                event.preventDefault();
                event.currentTarget.reset();
              }}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="Name"
                  aria-label="Name"
                  required
                  className="h-11 rounded-md border border-border bg-secondary/50 px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
                />

                <input
                  type="email"
                  placeholder="Email"
                  aria-label="Email"
                  required
                  className="h-11 rounded-md border border-border bg-secondary/50 px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
                />
              </div>

              <textarea
                placeholder="Message"
                aria-label="Message"
                required
                className="mt-4 min-h-32 w-full resize-none rounded-md border border-border bg-secondary/50 px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
              />

              <button
                type="submit"
                className="mt-4 w-full rounded-md bg-primary px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-primary-foreground transition-opacity hover:opacity-90"
              >
                Send Message
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
