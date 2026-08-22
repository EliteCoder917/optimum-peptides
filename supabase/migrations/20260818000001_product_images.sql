-- Storage bucket for product images. Public read (product photos need to
-- be visible on the storefront); writes only ever go through the
-- /api/admin/product-images route using the service role key, so there's
-- no need for RLS policies on storage.objects for this bucket — the API
-- route itself checks the caller is an admin before touching storage.
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Up to 5 images per product, ordered (first = cover image shown on
-- cards). Replaces the old single image_url column.
alter table products
  drop column image_url,
  add column image_urls text[] not null default '{}',
  add constraint products_image_urls_max_five
    check (array_length(image_urls, 1) is null or array_length(image_urls, 1) <= 5);
