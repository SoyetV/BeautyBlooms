-- ============================================================
--  Bloom Flower Shop — Supabase PostgreSQL Schema
--  Run this entire file in Supabase → SQL Editor
-- ============================================================

-- ── 0. Extensions ─────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ── 1. PROFILES ───────────────────────────────────────────
-- Mirrors auth.users; role column gates admin access
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  full_name   text,
  role        text not null default 'customer'
                check (role in ('customer', 'admin')),
  created_at  timestamptz not null default now()
);

-- Auto-create a profile row when a new user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── 2. PRODUCTS ───────────────────────────────────────────
create table if not exists public.products (
  id            uuid primary key default uuid_generate_v4(),
  name          text not null,
  description   text,
  price         numeric(10, 2) not null check (price >= 0),
  stock_count   integer not null default 0 check (stock_count >= 0),
  category      text not null default 'Uncategorized',
  image_url     text,
  is_available  boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Auto-bump updated_at on every row update
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at
  before update on public.products
  for each row execute procedure public.set_updated_at();

-- ── 3. ORDERS ─────────────────────────────────────────────
create table if not exists public.orders (
  id                uuid primary key default uuid_generate_v4(),
  customer_id       uuid references public.profiles(id) on delete set null,
  -- Allow guest checkout (nullable customer_id)
  tracking_token    uuid not null default uuid_generate_v4(),
  customer_name     text not null,
  customer_email    text not null,
  customer_phone    text,
  delivery_address  text not null,
  status            text not null default 'Pending'
                      check (status in (
                        'Pending',
                        'Preparing',
                        'Out for Delivery',
                        'Delivered',
                        'Cancelled'
                      )),
  total_amount      numeric(10, 2) not null check (total_amount >= 0),
  notes             text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

drop trigger if exists orders_updated_at on public.orders;
create trigger orders_updated_at
  before update on public.orders
  for each row execute procedure public.set_updated_at();

alter table public.orders add column if not exists tracking_token uuid;
update public.orders set tracking_token = uuid_generate_v4() where tracking_token is null;
alter table public.orders alter column tracking_token set not null;
alter table public.orders alter column tracking_token set default uuid_generate_v4();

-- ── 4. ORDER ITEMS ────────────────────────────────────────
create table if not exists public.order_items (
  id          uuid primary key default uuid_generate_v4(),
  order_id    uuid not null references public.orders(id) on delete cascade,
  product_id  uuid references public.products(id) on delete set null,
  -- Snapshot price + name at order time (product may change later)
  product_name  text not null,
  unit_price    numeric(10, 2) not null,
  quantity      integer not null check (quantity > 0),
  subtotal      numeric(10, 2) generated always as (unit_price * quantity) stored
);

-- ── 5. INDEXES ────────────────────────────────────────────
create index if not exists idx_products_category   on public.products(category);
create index if not exists idx_products_available  on public.products(is_available);
create index if not exists idx_orders_customer     on public.orders(customer_id);
create index if not exists idx_orders_tracking_token on public.orders(tracking_token);
create index if not exists idx_orders_status       on public.orders(status);
create index if not exists idx_order_items_order   on public.order_items(order_id);

-- ── 6. ROW LEVEL SECURITY ─────────────────────────────────

-- Helper: is the current JWT user an admin?
create or replace function public.is_admin()
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ── profiles ──────────────────────────────────────────────
alter table public.profiles enable row level security;

drop policy if exists "Users can read their own profile" on public.profiles;
drop policy if exists "Admins can read all profiles" on public.profiles;
drop policy if exists "Users can update their own profile" on public.profiles;

create policy "Users can read their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Admins can read all profiles"
  on public.profiles for select
  using (public.is_admin());

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- ── products ──────────────────────────────────────────────
alter table public.products enable row level security;

drop policy if exists "Anyone can browse available products" on public.products;
drop policy if exists "Admins can read all products" on public.products;
drop policy if exists "Admins can insert products" on public.products;
drop policy if exists "Admins can update products" on public.products;
drop policy if exists "Admins can delete products" on public.products;

-- Public read (available products only)
create policy "Anyone can browse available products"
  on public.products for select
  using (is_available = true);

-- Admins have full read (including unavailable/draft products)
create policy "Admins can read all products"
  on public.products for select
  using (public.is_admin());

create policy "Admins can insert products"
  on public.products for insert
  with check (public.is_admin());

create policy "Admins can update products"
  on public.products for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can delete products"
  on public.products for delete
  using (public.is_admin());

-- ── orders ────────────────────────────────────────────────
alter table public.orders enable row level security;

drop policy if exists "Customers can read own orders" on public.orders;
drop policy if exists "Anyone can place an order" on public.orders;
drop policy if exists "Admins can read all orders" on public.orders;
drop policy if exists "Admins can update order status" on public.orders;

-- Customers see only their own orders
create policy "Customers can read own orders"
  on public.orders for select
  using (auth.uid() = customer_id);

-- Anyone (incl. guests) can INSERT an order
create policy "Anyone can place an order"
  on public.orders for insert
  with check (true);

-- Admins see and update all orders
create policy "Admins can read all orders"
  on public.orders for select
  using (public.is_admin());

create policy "Admins can update order status"
  on public.orders for update
  using (public.is_admin());

create or replace function public.get_order_status(
  p_order_id uuid,
  p_order_token uuid
)
returns table (
  id uuid,
  customer_id uuid,
  customer_name text,
  customer_email text,
  customer_phone text,
  delivery_address text,
  status text,
  total_amount numeric(10, 2),
  notes text,
  created_at timestamptz,
  updated_at timestamptz,
  tracking_token uuid,
  order_items jsonb
)
language sql security definer stable as $$
  select
    o.id,
    o.customer_id,
    o.customer_name,
    o.customer_email,
    o.customer_phone,
    o.delivery_address,
    o.status,
    o.total_amount,
    o.notes,
    o.created_at,
    o.updated_at,
    o.tracking_token,
    coalesce(jsonb_agg(jsonb_build_object(
      'id', oi.id,
      'order_id', oi.order_id,
      'product_id', oi.product_id,
      'product_name', oi.product_name,
      'unit_price', oi.unit_price,
      'quantity', oi.quantity,
      'subtotal', oi.subtotal
    )) filter (where oi.id is not null), '[]') as order_items
  from public.orders o
  left join public.order_items oi on oi.order_id = o.id
  where o.id = p_order_id and o.tracking_token = p_order_token
  group by o.id;
$$;

-- ── order_items ───────────────────────────────────────────
alter table public.order_items enable row level security;

drop policy if exists "Customers can read own order items" on public.order_items;
drop policy if exists "Anyone can insert order items" on public.order_items;
drop policy if exists "Admins can read all order items" on public.order_items;

-- Customers can view items belonging to their orders
create policy "Customers can read own order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and o.customer_id = auth.uid()
    )
  );

create policy "Anyone can insert order items"
  on public.order_items for insert
  with check (true);

create policy "Admins can read all order items"
  on public.order_items for select
  using (public.is_admin());

-- ── 7. SAMPLE SEED DATA (optional — remove in production) ──
insert into public.products (name, description, price, stock_count, category, image_url)
values
  ('Red Velvet Roses', 'A dozen long-stemmed red roses, a timeless classic.', 850.00, 20, 'Roses', null),
  ('Sunflower Burst', 'Bright arrangement of 6 sunflowers, perfect for birthdays.', 650.00, 15, 'Sunflowers', null),
  ('Lavender Dreams', 'Fragrant dried lavender bundle tied with twine.', 480.00, 30, 'Dried Flowers', null),
  ('White Lily Elegance', 'Pure white Oriental lilies — elegant and long-lasting.', 720.00, 10, 'Lilies', null),
  ('Mixed Pastel Bouquet', 'Seasonal mix of pastel-toned blooms, hand-arranged.', 950.00, 8, 'Mixed', null);
