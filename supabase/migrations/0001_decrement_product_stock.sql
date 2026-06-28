-- ============================================================================
-- Atomic stock decrement
-- ============================================================================
-- Mengurangi stok produk secara ATOMIK berdasarkan daftar item pesanan.
-- Dipanggil dari webhook pembayaran (/api/payment/notification) saat order
-- berubah menjadi 'paid'.
--
-- Kenapa harus atomik?
--   Pola lama (baca stok lalu tulis stok baru) di kode JS rawan race condition:
--   dua checkout untuk produk yang sama bisa membaca nilai stok yang sama,
--   lalu sama-sama menulis, sehingga terjadi OVERSELLING. Satu statement
--   `UPDATE ... SET stock = stock - qty` mengunci baris (row lock) dan dijamin
--   konsisten walau banyak transaksi berjalan bersamaan.
--
-- Cara pakai dari Supabase JS (server / service role):
--   await supabaseAdmin.rpc('decrement_product_stock', { p_items: order.items })
--   p_items = JSONB array, contoh: [{ "id": "p_1", "quantity": 2 }, ...]
--
-- Cara pasang: jalankan seluruh file ini di Supabase Dashboard -> SQL Editor.
-- ============================================================================

create or replace function public.decrement_product_stock(p_items jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  item jsonb;
begin
  if p_items is null then
    return;
  end if;

  for item in select * from jsonb_array_elements(p_items)
  loop
    update public.products
      set stock = greatest(stock - coalesce((item->>'quantity')::int, 0), 0)
      where id = item->>'id';
  end loop;
end;
$$;

-- Keamanan: cuma service_role (server) yang boleh memanggil function ini.
-- anon/authenticated TIDAK boleh, agar stok tidak bisa diubah dari klien.
revoke all on function public.decrement_product_stock(jsonb) from public;
revoke all on function public.decrement_product_stock(jsonb) from anon;
revoke all on function public.decrement_product_stock(jsonb) from authenticated;
grant execute on function public.decrement_product_stock(jsonb) to service_role;
