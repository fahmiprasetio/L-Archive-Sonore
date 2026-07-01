-- =============================================================
-- Migrasi 0002: Sistem kupon / diskon
-- Jalankan di Supabase SQL Editor (idempoten, aman diulang).
-- =============================================================

-- Tabel kupon
create table if not exists public.coupons (
  code text primary key,
  type text not null check (type in ('percent', 'fixed')),
  value numeric not null check (value >= 0),
  min_subtotal numeric not null default 0,
  active boolean not null default true,
  expires_at timestamptz,
  max_redemptions integer,
  times_redeemed integer not null default 0,
  created_at timestamptz not null default now()
);

-- RLS aktif TANPA policy publik: validasi & redemption hanya lewat server
-- (service_role otomatis bypass RLS). Klien tidak bisa membaca/menebak kupon.
alter table public.coupons enable row level security;

-- Kolom kupon di orders (nullable, idempoten)
alter table public.orders add column if not exists coupon_code text;
alter table public.orders add column if not exists discount numeric not null default 0;

-- Increment redemption secara ATOMIK (dipanggil dari webhook saat order paid).
create or replace function public.increment_coupon_redemption(p_code text)
returns void
language sql
as $$
  update public.coupons
     set times_redeemed = times_redeemed + 1
   where code = p_code;
$$;

-- Seed contoh kupon (aman diulang).
insert into public.coupons (code, type, value, min_subtotal, active) values
  ('WELCOME10', 'percent', 10, 0, true),
  ('SAVE100', 'fixed', 100, 500, true),
  ('GEAR15', 'percent', 15, 1000, true)
on conflict (code) do nothing;
