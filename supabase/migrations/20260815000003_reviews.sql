-- Product reviews. Guest submissions (no accounts) — anyone can submit a
-- review, but it starts "pending" and only becomes publicly visible once
-- an admin approves it, so the public insert policy forces that status.

create type review_status as enum ('pending', 'approved', 'rejected');

create table reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  reviewer_name text not null,
  reviewer_email text,
  title text not null,
  description text not null,
  rating smallint not null check (rating between 1 and 5),
  image_urls text[] not null default '{}',
  status review_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index reviews_product_id_idx on reviews(product_id);
create index reviews_status_idx on reviews(status);

create trigger reviews_set_updated_at
  before update on reviews
  for each row
  execute function set_updated_at();

alter table reviews enable row level security;

create policy "Public can read approved reviews"
  on reviews for select
  using (status = 'approved');

create policy "Public can submit reviews"
  on reviews for insert
  with check (status = 'pending');

create policy "Admins can read all reviews"
  on reviews for select
  using (is_admin());

create policy "Admins can update reviews"
  on reviews for update
  using (is_admin());

create policy "Admins can delete reviews"
  on reviews for delete
  using (is_admin());
