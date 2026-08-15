-- Sample data for local development only.

insert into products (id, name, slug, description, image_url) values
  ('00000000-0000-0000-0000-000000000001', 'Sample Peptide', 'sample-peptide', 'Placeholder product for local dev.', '/placeholder.svg');

insert into product_variants (product_id, name, sku, price_cents, stock_quantity) values
  ('00000000-0000-0000-0000-000000000001', '5mg', 'SAMPLE-5MG', 4999, 50),
  ('00000000-0000-0000-0000-000000000001', '10mg', 'SAMPLE-10MG', 8999, 50);
