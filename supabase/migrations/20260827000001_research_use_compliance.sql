-- Research-use-only compliance (UK).
--
-- Two separate legal problems this addresses:
--
-- 1. Licensed prescription-only medicines (POMs). Supplying a POM without a
--    prescription is an offence under reg 214 of the Human Medicines
--    Regulations 2012, and advertising one to the public is a separate
--    offence under reg 7. A "research use only" label is NOT a defence to
--    either — POM status attaches to the substance, not the labelling. So
--    these products must never reach the public storefront at all.
--
-- 2. Everything else is supplied strictly as a research chemical. That
--    status depends entirely on presentation: no therapeutic claims, no
--    dosing guidance, no human-use framing anywhere on the site.
--
-- regulatory_class drives (1): 'pom' products are filtered out of every
-- public query and rejected at checkout, regardless of is_active.
alter table products
  add column regulatory_class text not null default 'ruo'
    check (regulatory_class in ('ruo', 'pom'));

comment on column products.regulatory_class is
  'ruo = supplied as a research chemical. pom = licensed prescription-only '
  'medicine; cannot be listed or sold publicly. Never expose pom rows to the storefront.';

-- Record that the buyer made the research-use declaration at checkout, and
-- when. This is the evidence that the sale was made on research terms.
alter table orders
  add column research_use_confirmed boolean not null default false,
  add column research_use_confirmed_at timestamptz;
