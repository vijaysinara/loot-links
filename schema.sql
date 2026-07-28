-- LootLinks database schema
-- Run this once in the Neon SQL Editor (Vercel → Storage → your database → Open in Neon → SQL Editor)

create table if not exists profile (
  id    int primary key default 1,
  name  text default 'Best Loots Deals',
  bio   text default 'Best deals, trending products & amazing finds. Shop smart and save more!',
  logo  text default ''
);

create table if not exists settings (
  id              int primary key default 1,
  seo_title       text default 'Best Loots Deals — Trending Products & Best Deals',
  seo_description text default 'Best deals, trending products & amazing finds. Shop smart and save more!',
  og_image        text default ''
);

create table if not exists social_links (
  id       text primary key,
  platform text not null,
  url      text not null,
  enabled  boolean not null default true
);

create table if not exists products (
  id          text primary key,
  title       text not null,
  description text default '',
  image       text not null,
  url         text not null,
  store       text default 'Other',
  category    text default '',
  featured    boolean default false,
  active      boolean default true,
  sort_order  int not null,
  clicks      int not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists clicks (
  id         serial primary key,
  product_id text references products(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists visits (
  id         serial primary key,
  created_at timestamptz not null default now()
);

-- starter rows so the site isn't empty on first load
insert into profile (id) values (1) on conflict (id) do nothing;
insert into settings (id) values (1) on conflict (id) do nothing;

insert into social_links (id, platform, url, enabled) values
  ('s1', 'instagram', 'https://instagram.com/yourhandle', true),
  ('s2', 'youtube',   'https://youtube.com/@yourhandle', true),
  ('s3', 'telegram',  'https://t.me/yourhandle', true)
on conflict (id) do nothing;

insert into products (id, title, description, image, url, store, category, featured, active, sort_order) values
  ('p1', 'Wireless Bluetooth Headphones', 'Premium over-ear ANC headphones with 40h battery life.',
   'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
   'https://example.com/affiliate/headphones', 'Amazon', 'Audio', true, true, 1),
  ('p2', 'Smart Fitness Watch', 'AMOLED display, heart-rate & SpO2 tracking, 7-day battery.',
   'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
   'https://example.com/affiliate/smartwatch', 'Flipkart', 'Wearables', true, true, 2)
on conflict (id) do nothing;
