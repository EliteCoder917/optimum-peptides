-- Admin access. Credentials are handled entirely by Supabase Auth
-- (auth.users) — this table only marks which authenticated users are
-- allowed into the admin panel. There's no self-signup: new admins are
-- added by inserting a row here manually (SQL editor or service role),
-- after the person is invited/created in Supabase Auth.

create table admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- security definer so this can be called from RLS policies on admin_users
-- itself without recursing back through those same policies.
create function is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from admin_users where user_id = auth.uid()
  );
$$;

alter table admin_users enable row level security;

create policy "Admins can read admin_users"
  on admin_users for select
  using (is_admin());

-- Catalog management
create policy "Admins can insert products"
  on products for insert
  with check (is_admin());

create policy "Admins can update products"
  on products for update
  using (is_admin());

create policy "Admins can delete products"
  on products for delete
  using (is_admin());

create policy "Admins can insert product variants"
  on product_variants for insert
  with check (is_admin());

create policy "Admins can update product variants"
  on product_variants for update
  using (is_admin());

create policy "Admins can delete product variants"
  on product_variants for delete
  using (is_admin());

-- Order management
create policy "Admins can read orders"
  on orders for select
  using (is_admin());

create policy "Admins can update orders"
  on orders for update
  using (is_admin());

create policy "Admins can read order items"
  on order_items for select
  using (is_admin());
