# Product Image Upload Template

## Step 1 — Create the Storage Bucket

In Supabase dashboard → Storage → New bucket:
- Name: `products`
- Public: ✅ YES (so images are accessible without auth)

---

## Step 2 — Run the Migration

In Supabase dashboard → SQL Editor, run `supabase/migrations/002_image_urls.sql`.
This adds the `image_urls text[]` column and migrates any existing `image_url` data.

---

## Step 3 — File Naming Convention

Each product gets its own folder named after its slug. Number images in display order.
**Image 1 is shown on the shop card and as the first image on the product page.**

```
products/
├── shirt/
│   ├── 1.jpg   ← primary (shown on card + first on product page)
│   ├── 2.jpg
│   └── 3.jpg
├── shorts/
│   ├── 1.jpg
│   └── 2.jpg
├── hoodie/
│   └── 1.jpg
└── sweats/
    └── 1.jpg
```

Rules:
- Folder name = product slug
- Files named `1.jpg`, `2.jpg`, `3.jpg` etc. in display order
- Format: JPG recommended (smaller file size, faster load)
- Dimensions: 800×1067px minimum (3:4 portrait ratio)
- Max size: 2MB per image

---

## Step 4 — Upload in Dashboard

Supabase dashboard → Storage → products bucket → create folder `shirt` → upload `1.jpg`, `2.jpg`, etc.
Repeat for each product.

---

## Step 5 — Get Your Public URL Base

```
https://dxiievmzsqcxmrmcgtwx.supabase.co/storage/v1/object/public/products/
```

Image URLs follow this pattern:
```
products/shirt/1.jpg → https://dxiievmzsqcxmrmcgtwx.supabase.co/storage/v1/object/public/products/shirt/1.jpg
products/shirt/2.jpg → https://dxiievmzsqcxmrmcgtwx.supabase.co/storage/v1/object/public/products/shirt/2.jpg
```

---

## Step 6 — Attach Images to Products (run in SQL Editor)

Update `image_urls` with an ordered array of all image URLs for each product:

```sql
-- Shirt (example with 2 images)
update products set image_urls = array[
  'https://dxiievmzsqcxmrmcgtwx.supabase.co/storage/v1/object/public/products/shirt/1.jpg',
  'https://dxiievmzsqcxmrmcgtwx.supabase.co/storage/v1/object/public/products/shirt/2.jpg'
] where slug = 'shirt';

-- Shorts
update products set image_urls = array[
  'https://dxiievmzsqcxmrmcgtwx.supabase.co/storage/v1/object/public/products/shorts/1.jpg',
  'https://dxiievmzsqcxmrmcgtwx.supabase.co/storage/v1/object/public/products/shorts/2.jpg'
] where slug = 'shorts';

-- Hoodie
update products set image_urls = array[
  'https://dxiievmzsqcxmrmcgtwx.supabase.co/storage/v1/object/public/products/hoodie/1.jpg'
] where slug = 'hoodie';

-- Sweats
update products set image_urls = array[
  'https://dxiievmzsqcxmrmcgtwx.supabase.co/storage/v1/object/public/products/sweats/1.jpg'
] where slug = 'sweats';
```

---

## Adding New Products in the Future

1. Create folder `products/[slug]/` in Storage, upload `1.jpg`, `2.jpg`, etc.
2. Insert product row in SQL:

```sql
insert into products (slug, name, price_cents, category, sizes, image_urls)
values (
  'new-item',
  'NEW ITEM',
  5000,
  'TOPS',
  '{XS,S,M,L,XL}',
  array['https://dxiievmzsqcxmrmcgtwx.supabase.co/storage/v1/object/public/products/new-item/1.jpg']
);
```

## Adding More Images to an Existing Product

Just append to the array:
```sql
update products set image_urls = array_append(image_urls,
  'https://dxiievmzsqcxmrmcgtwx.supabase.co/storage/v1/object/public/products/shirt/3.jpg'
) where slug = 'shirt';
```
