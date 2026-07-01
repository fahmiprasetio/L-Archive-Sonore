-- =============================================================
-- Migrasi 0003: Dukungan pelacakan pesanan GUEST (tanpa login)
-- Jalankan di Supabase SQL Editor (idempoten, aman diulang).
-- =============================================================
--
-- Guest checkout menyimpan order dengan user_id NULL. Pelacakan pesanan guest
-- dilakukan lewat endpoint server /api/orders/lookup yang memakai service_role
-- (bypass RLS) TAPI hanya mengembalikan order bila pasangan (id + email) cocok,
-- sehingga order milik orang lain tidak bisa dienumerasi. Tidak ada policy RLS
-- publik yang ditambahkan (klien anon tetap tidak bisa membaca tabel orders).
--
-- Index di bawah mempercepat pencarian/pengurutan order berdasarkan email
-- pemesan (case-insensitive) dan tanggal.

create index if not exists orders_customer_email_idx
  on public.orders (lower(customer_email));

create index if not exists orders_created_at_idx
  on public.orders (created_at desc);
