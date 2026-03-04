-- 002_image_urls.sql
-- Replace single image_url with ordered image_urls array

alter table products add column image_urls text[] default '{}';

-- Migrate any existing image_url values into the first slot of the array
update products set image_urls = array[image_url] where image_url is not null and image_url <> '';

-- After running and verifying, you may drop the old column:
-- alter table products drop column image_url;

-- Example: set multiple images per product
-- update products set image_urls = array[
--   'https://dxiievmzsqcxmrmcgtwx.supabase.co/storage/v1/object/public/products/shirt/1.jpg',
--   'https://dxiievmzsqcxmrmcgtwx.supabase.co/storage/v1/object/public/products/shirt/2.jpg'
-- ] where slug = 'shirt';
