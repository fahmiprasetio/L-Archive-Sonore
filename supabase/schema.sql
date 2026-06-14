-- L'Archive Sonore — Supabase schema (aman dijalankan ulang / idempoten)
-- Jalankan di Supabase Dashboard > SQL Editor.

-- =========================================================
-- PRODUCTS
-- =========================================================
create table if not exists public.products (
  id text primary key,
  name text not null,
  description text not null default '',
  price numeric not null default 0,
  image_url text not null default '',
  category text not null default '',
  created_at timestamptz not null default now()
);

-- Kolom stok (idempoten; baris lama mendapat default 10)
alter table public.products add column if not exists stock integer not null default 10;

alter table public.products enable row level security;

-- Publik hanya boleh MEMBACA produk. Tulis hanya lewat server (service_role,
-- yang otomatis bypass RLS), jadi tidak ada policy write untuk anon.
drop policy if exists "products_all_public" on public.products;
drop policy if exists "products_select_public" on public.products;
create policy "products_select_public" on public.products
  for select using (true);

-- Seed produk awal (idempoten)
insert into public.products (id, name, description, price, image_url, category, stock) values
  ('1','Gibson Les Paul Standard','The legendary solid-body electric guitar with dual humbuckers and mahogany construction.',2499,'https://images.unsplash.com/photo-1550985616-10810253b84d?auto=format&fit=crop&q=80&w=600','Guitar',5),
  ('2','Yamaha U1 Upright Piano','A perennial favorite among discerning pianists, offering outstanding musical performance.',8999,'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&q=80&w=600','Piano',3),
  ('3','Roland TD-17KVX V-Drums','Electronic drum kit with premium snare, hi-hat, and cymbals for professional practice.',1699,'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?auto=format&fit=crop&q=80&w=600','Drums',8),
  ('4','Fender Jazz Bass Professional','The industry-standard electric bass, known for its punchy sound and ergonomic neck.',1799,'https://images.unsplash.com/photo-1564186763535-ebb21ec52744?auto=format&fit=crop&q=80&w=600','Bass',6),
  ('5','Stradivarius Replica Violin','Handcrafted spruce and maple violin offering warm, resonant projection.',1250,'https://images.unsplash.com/photo-1612222869049-d8ec83637a3c?auto=format&fit=crop&q=80&w=600','Violin',4),
  ('6','Moog Subsequent 37 Synthesizer','Analog synthesizer with duo-phonic capabilities, multidrive, and advanced controls.',1899,'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&q=80&w=600','Synthesizer',7),
  ('7','Fender Custom Shop Stratocaster','Hand-selected alder body and vintage-wound pickups for ultimate classic tone.',3899,'https://images.unsplash.com/photo-1564186763535-ebb21ec52744?auto=format&fit=crop&q=80&w=600','Guitar',2),
  ('8','Steinway & Sons Model B Grand','The standard of excellence in concert pianos, offering unparalleled tone and touch.',112000,'https://images.unsplash.com/photo-1552422535-c45813c61732?auto=format&fit=crop&q=80&w=600','Piano',1),
  ('9','Korg Minilogue XD','Four-voice polyphonic analog synthesizer with digital multi-engine and effects.',649,'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?auto=format&fit=crop&q=80&w=600','Synthesizer',10),
  ('10','Taylor 814ce Acoustic Guitar','Taylor flag-ship grand auditorium acoustic-electric guitar with V-Class bracing.',3999,'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&q=80&w=600','Guitar',4),
  ('11','Nord Stage 4 88 Keyboard','The ultimate stage keyboard with triple sensor keybed and physical drawbars.',4899,'https://images.unsplash.com/photo-1552422535-c45813c61732?auto=format&fit=crop&q=80&w=600','Piano',3),
  ('12','Pearl Export EXX Drum Kit','The best-selling drum set of all time, offering legendary sound and durability.',849,'https://images.unsplash.com/photo-1543443374-b6fe10a6ab7b?auto=format&fit=crop&q=80&w=600','Drums',9)
on conflict (id) do nothing;

-- =========================================================
-- ORDERS
-- =========================================================
create table if not exists public.orders (
  id text primary key,
  customer_name text not null,
  customer_email text not null,
  customer_address text,
  items jsonb not null default '[]'::jsonb,
  total numeric not null default 0,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

-- Hubungkan order ke user (nullable untuk guest checkout)
alter table public.orders add column if not exists user_id uuid;

alter table public.orders enable row level security;

-- User hanya boleh membaca pesanannya sendiri.
-- Insert & baca-semua dilakukan server (service_role) — bypass RLS.
drop policy if exists "orders_insert_public" on public.orders;
drop policy if exists "orders_select_public" on public.orders;
drop policy if exists "orders_select_own" on public.orders;
create policy "orders_select_own" on public.orders
  for select using (auth.uid() = user_id);

create index if not exists orders_user_id_idx on public.orders (user_id);
create index if not exists orders_created_at_idx on public.orders (created_at desc);
