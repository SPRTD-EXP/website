-- Products
create table products (
  id          serial primary key,
  slug        text unique not null,
  name        text not null,
  price_cents integer not null,
  category    text not null,
  sizes       text[] not null,
  image_url   text,
  created_at  timestamptz default now()
);

-- Cart items (logged-in users)
create table cart_items (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade,
  product_id  integer references products(id) on delete cascade,
  size        text not null,
  quantity    integer not null default 1,
  created_at  timestamptz default now(),
  unique(user_id, product_id, size)
);

-- Orders
create table orders (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id),
  total_cents integer not null,
  status      text default 'pending',
  created_at  timestamptz default now()
);

create table order_items (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid references orders(id) on delete cascade,
  product_id  integer references products(id),
  size        text not null,
  quantity    integer not null,
  price_cents integer not null
);

-- RLS
alter table products   enable row level security;
alter table cart_items enable row level security;
alter table orders     enable row level security;
alter table order_items enable row level security;

create policy "products_public_read" on products for select using (true);

create policy "cart_owner_select" on cart_items for select using (auth.uid() = user_id);
create policy "cart_owner_insert" on cart_items for insert with check (auth.uid() = user_id);
create policy "cart_owner_update" on cart_items for update using (auth.uid() = user_id);
create policy "cart_owner_delete" on cart_items for delete using (auth.uid() = user_id);

create policy "orders_owner" on orders using (auth.uid() = user_id);
create policy "order_items_owner" on order_items
  using (exists (select 1 from orders where orders.id = order_id and orders.user_id = auth.uid()));

-- Seed data
insert into products (slug, name, price_cents, category, sizes) values
  ('shirt',  'SHIRT',  3500, 'TOPS',    '{XS,S,M,L,XL}'),
  ('shorts', 'SHORTS', 3500, 'BOTTOMS', '{XS,S,M,L,XL}'),
  ('hoodie', 'HOODIE', 6000, 'TOPS',    '{XS,S,M,L,XL}'),
  ('sweats', 'SWEATS', 6000, 'BOTTOMS', '{XS,S,M,L,XL}');
