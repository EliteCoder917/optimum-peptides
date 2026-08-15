const applications = [
  {
    title: "Metabolic Studies",
    body: "Exploring energy balance, glucose handling and nutrient partitioning models.",
  },
  {
    title: "Body Composition",
    body: "Investigating lean-mass preservation and adipose signalling in preclinical models.",
  },
  {
    title: "Receptor Science",
    body: "Mapping receptor interactions across different research models.",
  },
  {
    title: "Recovery Pathways",
    body: "Investigating tissue repair and related pathways across preclinical protocols.",
  },
];

const researchFeatures = [
  {
    title: "High Purity",
    body: "Research materials are analysed for identity and purity.",
  },
  {
    title: "Third-Party Testing",
    body: "Independent testing helps provide greater consistency between batches.",
  },
  {
    title: "Research Grade",
    body: "Products are handled and documented according to laboratory requirements.",
  },
  {
    title: "Expert Support",
    body: "A specialist team is available to answer research-related questions.",
  },
];

const collection = [
  "Collection One",
  "Collection Two",
  "Collection Three",
  "Collection Four",
  "Collection Five",
  "Collection Six",
  "Collection Seven",
  "Collection Eight",
  "Collection Nine",
];

export default function Home() {
  return (
    <div id="top" className="min-h-screen bg-background">
      <main>
        {/* HERO */}
        <section className="relative min-h-[700px] overflow-hidden">
          <img
            src="/images/hero.png"
            alt="Research laboratory visualisation"
            className="absolute inset-0 h-full w-full object-cover opacity-50"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/30" />

          <div className="grid-lines absolute inset-0 opacity-60" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-24 lg:grid-cols-[1.1fr_0.9fr] lg:py-32">
            {/* LEFT SIDE */}
            <div>
              <span className="inline-flex items-center rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-[11px] uppercase tracking-[0.24em] text-primary">
                High Purity Compounds
              </span>

              <h1 className="mt-6 text-5xl font-bold leading-[0.95] sm:text-7xl lg:text-8xl">
                <span className="text-brand-gradient">Premium Peptides</span>
              </h1>

              <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground">
                Optimum Peptides is focused on providing high-quality research
                materials and reliable information for scientific research.
              </p>

              <div className="mt-8 grid max-w-lg grid-cols-2 gap-3 sm:grid-cols-4">
                {["Research", "Quality", "Testing", "Science"].map((chip) => (
                  <div
                    key={chip}
                    className="panel rounded-xl px-3 py-3 text-[11px] uppercase tracking-[0.14em] text-muted-foreground"
                  >
                    {chip}
                  </div>
                ))}
              </div>

              <div className="mt-9">
                <a
                  href="/shop"
                  className="inline-flex items-center rounded-full bg-primary px-7 py-3 text-sm font-medium uppercase tracking-[0.16em] text-primary-foreground transition-opacity hover:opacity-85"
                >
                  Explore Product Range
                  <span className="ml-2">→</span>
                </a>
              </div>
            </div>

            {/* RIGHT SIDE IMAGE */}
            <div className="relative">
              <div className="glow-ring panel relative overflow-hidden rounded-[2rem] p-4 sm:p-5">
                <img
                  src="/images/box.png"
                  alt="Research laboratory packaging"
                  className="w-full rounded-[1.5rem] object-cover"
                />

                <div className="h-2" />
              </div>
            </div>
          </div>
        </section>

        {/* TRUST STRIP */}
        <section className="border-y border-border bg-card/40">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6 px-5 py-6">
            {[
              "Research applications",
              "High purity",
              "Third-party tested",
              "Quality focused",
              "Secure shipping",
            ].map((item) => (
              <div
                key={item}
                className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground"
              >
                <span className="mr-2 text-primary">✦</span>
                {item}
              </div>
            ))}
          </div>
        </section>

        {/* COLLECTION */}
        <section id="collection" className="mx-auto max-w-7xl px-5 py-24">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-primary">
                Our Collection
              </p>

              <h2 className="mt-3 text-4xl font-bold sm:text-5xl">
                Explore our collection
              </h2>
            </div>

            <a
              href="#research"
              className="rounded-full border border-border px-5 py-2.5 text-sm font-medium uppercase tracking-[0.16em] transition-colors hover:bg-white/5"
            >
              Explore More
            </a>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {collection.map((item) => (
              <article
                key={item}
                className="panel group overflow-hidden rounded-2xl transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="p-4">
                  <div className="overflow-hidden rounded-xl">
                    <img
                      src="/images/vial.png"
                      alt="Research material"
                      className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </div>

                <div className="px-6 pb-6 pt-1">
                  <div className="border-t border-border pt-5 text-xs uppercase tracking-[0.18em] text-primary">
                    Popular choices
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* RESEARCH */}
        <section id="research" className="border-b border-border">
          <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-24 lg:grid-cols-2">
            <img
              src="/images/research.png"
              alt="Scientific research visualisation"
              className="glow-ring w-full rounded-3xl object-cover"
            />

            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-primary">
                Targeted Research Areas
              </p>

              <h2 className="mt-3 text-4xl font-bold sm:text-5xl">
                Built For Enhancement
              </h2>

              <p className="mt-5 max-w-lg text-muted-foreground">
                Our focus is on providing consistent research materials,
                transparent information and a reliable experience for scientific
                work.
              </p>

              <div className="mt-9 grid gap-4 sm:grid-cols-2">
                {applications.map((application) => (
                  <div
                    key={application.title}
                    className="panel rounded-2xl p-5"
                  >
                    <h3 className="text-base font-semibold">
                      {application.title}
                    </h3>

                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {application.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* QUALITY */}
        <section className="mx-auto max-w-7xl px-5 py-24">
          <p className="text-[11px] uppercase tracking-[0.24em] text-primary">
            Why Optimum Peptides
          </p>

          <h2 className="mt-3 max-w-2xl text-4xl font-bold sm:text-5xl">
            Quality you can verify
          </h2>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {researchFeatures.map((feature) => (
              <div key={feature.title} className="panel rounded-2xl p-6">
                <div className="text-2xl text-primary">✦</div>

                <h3 className="mt-5 text-lg font-semibold">{feature.title}</h3>

                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="border-t border-border">
          <div className="mx-auto max-w-3xl px-5 py-24 text-center">
            <h2 className="text-4xl font-bold sm:text-5xl">
              Advancing science.
              <br />
              Enriching lives.
            </h2>

            <p className="mt-5 text-muted-foreground">
              Optimum Peptides exists to benefit and enhance the human body.
            </p>

            <a
              href="/contact"
              className="mt-8 inline-flex rounded-full bg-primary px-8 py-3 text-sm font-medium uppercase tracking-[0.16em] text-primary-foreground transition-opacity hover:opacity-85"
            >
              Get in touch
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
