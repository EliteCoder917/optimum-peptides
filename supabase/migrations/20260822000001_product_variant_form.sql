-- Distinguishes delivery format per variant — a peptide is often sold both
-- as a lyophilized vial (reconstitute yourself) and a pre-filled pen, and
-- which one(s) a given product supports varies. Nullable because it doesn't
-- apply to every product (e.g. topical peptides like Matrixyl/Argireline
-- are neither).
alter table product_variants
  add column form text check (form in ('vial', 'pen'));
