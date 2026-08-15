-- Core commerce schema: products, variants, orders. No customer accounts —
-- checkout is guest-only, orders are looked up by email, not a user_id.

create extension if not exists pgcrypto;

create function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- PRODUCTS ---------------------------------------------------------------

create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger products_set_updated_at
  before update on products
  for each row
  execute function set_updated_at();

-- Peptides are typically sold in multiple dosages/vial sizes, each with its
-- own price and stock — so price/stock live on the variant, not the product.
create table product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  name text not null, -- e.g. "5mg", "10mg"
  sku text not null unique,
  price_cents integer not null check (price_cents >= 0),
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index product_variants_product_id_idx on product_variants(product_id);

create trigger product_variants_set_updated_at
  before update on product_variants
  for each row
  execute function set_updated_at();

-- ORDERS -------------------------------------------------------------------

create type order_status as enum ('pending', 'paid', 'fulfilled', 'cancelled');

create table orders (
  id uuid primary key default gen_random_uuid(),
  status order_status not null default 'pending',
  customer_email text not null,
  customer_name text,
  shipping_address jsonb,
  subtotal_cents integer not null check (subtotal_cents >= 0),
  total_cents integer not null check (total_cents >= 0),
  payment_reference text, -- e.g. Stripe PaymentIntent id
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index orders_customer_email_idx on orders(customer_email);

create trigger orders_set_updated_at
  before update on orders
  for each row
  execute function set_updated_at();

-- Snapshot product/variant name and price at purchase time so historical
-- orders stay accurate even if the catalog changes later.
create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_variant_id uuid references product_variants(id) on delete set null,
  product_name text not null,
  variant_name text not null,
  unit_price_cents integer not null check (unit_price_cents >= 0),
  quantity integer not null check (quantity > 0),
  created_at timestamptz not null default now()
);

create index order_items_order_id_idx on order_items(order_id);

-- ROW LEVEL SECURITY ---------------------------------------------------------
-- The Next.js app's public (anon) key is exposed to the browser, so RLS is
-- what stops anyone from reading/writing tables directly via the Supabase
-- client. Catalog is public read-only; orders are only ever touched by our
-- server-side API routes using the service role key, which bypasses RLS.

alter table products enable row level security;
alter table product_variants enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

create policy "Public can read active products"
  on products for select
  using (is_active = true);

create policy "Public can read active product variants"
  on product_variants for select
  using (is_active = true);

-- No policies on orders / order_items: only the service role (server-side)
-- can read or write them until we decide otherwise.
