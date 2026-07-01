-- L'Archive Sonore — Ganti gambar produk ke file lokal (/public/barang)
-- Jalankan di Supabase Dashboard > SQL Editor.
-- Aman dijalankan ulang (idempoten). Hanya 6 produk yang punya file gambar
-- di /public/barang; sisanya dibiarkan. Dicocokkan berdasarkan NAMA.

-- Pastikan kolom galeri ada (DB lama mungkin belum punya kolom ini).
alter table public.products add column if not exists images text[] not null default '{}';

update public.products
  set image_url = '/barang/Gibson%20Les%20Paul%20Standard.png',
      images    = array['/barang/Gibson%20Les%20Paul%20Standard.png']
  where name = 'Gibson Les Paul Standard';

update public.products
  set image_url = '/barang/Yamaha%20U1%20Upright%20Piano.png',
      images    = array['/barang/Yamaha%20U1%20Upright%20Piano.png']
  where name = 'Yamaha U1 Upright Piano';

update public.products
  set image_url = '/barang/Fender%20Custom%20Shop%20Stratocaster.png',
      images    = array['/barang/Fender%20Custom%20Shop%20Stratocaster.png']
  where name = 'Fender Custom Shop Stratocaster';

update public.products
  set image_url = '/barang/Steinway%20%26%20Sons%20Model%20B%20Grand.png',
      images    = array['/barang/Steinway%20%26%20Sons%20Model%20B%20Grand.png']
  where name = 'Steinway & Sons Model B Grand';

update public.products
  set image_url = '/barang/Taylor%20814ce%20Acoustic%20Guitar.png',
      images    = array['/barang/Taylor%20814ce%20Acoustic%20Guitar.png']
  where name = 'Taylor 814ce Acoustic Guitar';

update public.products
  set image_url = '/barang/Nord%20Stage%204%2088%20Keyboard.png',
      images    = array['/barang/Nord%20Stage%204%2088%20Keyboard.png']
  where name = 'Nord Stage 4 88 Keyboard';
