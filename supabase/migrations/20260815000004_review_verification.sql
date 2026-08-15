-- Move reviews from open public submission to verified-purchase only.
-- Each order_item gets an unguessable review_token; customers are emailed
-- a link containing it once their order ships. Submission will go through
-- a server-side route that validates the token and reviewed_at, then
-- inserts using the service role — not a direct client-side insert — so
-- there's no public insert policy on reviews anymore.

alter table order_items
  add column review_token uuid not null default gen_random_uuid() unique,
  add column reviewed_at timestamptz;

create index order_items_review_token_idx on order_items(review_token);

alter table reviews
  drop column reviewer_email,
  add column order_item_id uuid not null references order_items(id) on delete cascade unique;

drop policy "Public can submit reviews" on reviews;
