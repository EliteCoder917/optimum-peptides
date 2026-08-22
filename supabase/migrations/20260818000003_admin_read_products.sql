-- Admins could insert/update/delete products and variants but never had a
-- policy to SELECT anything beyond "is_active = true" (the public policy) —
-- meaning draft/inactive products were invisible even to the admin who
-- created them. Missed when the write policies were added.
create policy "Admins can read all products"
  on products for select
  using (is_admin());

create policy "Admins can read all product variants"
  on product_variants for select
  using (is_admin());
