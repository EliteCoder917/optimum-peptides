
const values = [
  {
    title: "Research Use Only",
    body: "Every compound is supplied strictly for in-vitro laboratory research. We make no therapeutic claims and provide no guidance on use in humans or animals.",
  },
  {
    title: "Documented Listings",
    body: "Each listing states the compound's molecular class and published mechanism of action, with the state of the evidence described honestly.",
  },
  {
    title: "Straightforward Ordering",
    body: "Browse by research domain, order without an account, and get tracked dispatch on every shipment.",
  },
  {
    title: "Technical Support",
    body: "Questions about a listing, a specification, or an order? Reach out and a real person will help.",
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        {/* HERO */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-4xl px-5 py-24 text-center">
            <p className="text-[11px] uppercase tracking-[0.24em] text-primary">
              About Us
            </p>

            <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
              <span className="text-brand-gradient">
                A research supply catalogue.
              </span>
            </h1>

            <p className="mt-5 text-muted-foreground">
              Optimum Peptides supplies research chemicals to laboratories and
              qualified researchers. We list what a compound is and what the
              published literature says about how it works — nothing more.
            </p>
          </div>
        </section>

        {/* VALUES */}
        <section className="mx-auto max-w-7xl px-5 py-24">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div key={value.title} className="panel rounded-2xl p-6">
                <div className="text-2xl text-primary">✦</div>

                <h3 className="mt-5 text-lg font-semibold">{value.title}</h3>

                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {value.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border">
          <div className="mx-auto max-w-3xl px-5 py-24 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Questions about a listing?
            </h2>

            <p className="mt-4 text-muted-foreground">
              Reach out and we will get back to you. Please note we cannot
              advise on use in humans or animals.
            </p>

            <a
              href="/contact"
              className="bg-metal-gradient mt-8 inline-flex rounded-full px-8 py-3 text-sm font-medium uppercase tracking-[0.16em] text-primary-foreground transition-opacity hover:opacity-85"
            >
              Contact Us
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
