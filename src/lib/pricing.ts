// Perhitungan harga terpusat agar cart, checkout, dan API Midtrans konsisten.

export const TAX_RATE = 0.11; // PPN 11%
export const SHIPPING_FLAT = 25; // Biaya kirim flat
export const FREE_SHIPPING_THRESHOLD = 1000; // Gratis ongkir untuk subtotal di atas nilai ini

/** Ongkir berdasarkan subtotal (gratis bila keranjang kosong atau lewat ambang batas). */
export function calcShipping(subtotal: number): number {
  if (subtotal <= 0) return 0;
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
}

/** Pajak (PPN) dari subtotal, dibulatkan ke bilangan bulat. */
export function calcTax(subtotal: number): number {
  if (subtotal <= 0) return 0;
  return Math.round(subtotal * TAX_RATE);
}

export interface OrderSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

/** Ringkasan biaya lengkap dari subtotal. */
export function calcOrderSummary(subtotal: number): OrderSummary {
  const safeSubtotal = Math.max(0, subtotal);
  const shipping = calcShipping(safeSubtotal);
  const tax = calcTax(safeSubtotal);
  return {
    subtotal: safeSubtotal,
    shipping,
    tax,
    total: safeSubtotal + shipping + tax,
  };
}
