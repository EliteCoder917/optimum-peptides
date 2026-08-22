-- Products can belong to multiple categories (e.g. BPC-157 is relevant to
-- Recovery, Gut Health, and Joint Pain alike), so this is an array rather
-- than a single category column — same pattern as image_urls.
alter table products
  add column categories text[] not null default '{}';
