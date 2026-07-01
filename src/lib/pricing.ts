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

export interface OrderSummaryWithDiscount extends OrderSummary {
  discount: number;
}

/**
 * Ringkasan biaya dengan potongan kupon.
 * Diskon di-clamp agar tidak melebihi subtotal; ongkir & pajak dihitung dari
 * subtotal SETELAH diskon agar konsisten dengan perhitungan gross_amount di
 * server (src/app/api/payment/route.ts).
 */
export function calcSummaryWithDiscount(
  subtotal: number,
  discount = 0
): OrderSummaryWithDiscount {
  const safeSubtotal = Math.max(0, subtotal);
  const safeDiscount = Math.min(Math.max(0, Math.round(discount)), safeSubtotal);
  const discountedSubtotal = safeSubtotal - safeDiscount;
  const shipping = calcShipping(discountedSubtotal);
  const tax = calcTax(discountedSubtotal);
  return {
    subtotal: safeSubtotal,
    discount: safeDiscount,
    shipping,
    tax,
    total: discountedSubtotal + shipping + tax,
  };
}
