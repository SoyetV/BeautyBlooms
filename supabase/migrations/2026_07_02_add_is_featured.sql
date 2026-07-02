-- ──────────────────────────────────────────────────────────────────────────
-- Migration: Add is_featured column to products table
-- ──────────────────────────────────────────────────────────────────────────
-- Run this in your Supabase SQL Editor if you already have a `products`
-- table from a previous version of the schema and want to add the new
-- `is_featured` column without dropping any data.
--
-- This is safe to run multiple times — the DO block checks if the column
-- already exists before adding it.
-- ──────────────────────────────────────────────────────────────────────────

do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'products'
      and column_name = 'is_featured'
  ) then
    alter table public.products
      add column is_featured boolean not null default false;

    raise notice 'Added is_featured column to public.products';
  else
    raise notice 'is_featured column already exists, skipping';
  end if;
end $$;

-- Index for fast marquee queries (only fetches featured products)
create index if not exists idx_products_featured
  on public.products(is_featured)
  where is_featured = true;

-- ──────────────────────────────────────────────────────────────────────────
-- Optional: mark a few existing products as featured so the marquee
-- isn't empty after migration. Uncomment and adjust the names below.
-- ──────────────────────────────────────────────────────────────────────────
-- update public.products
--   set is_featured = true
--   where name in ('Red Velvet Roses', 'Sunflower Burst', 'Lavender Dreams');
