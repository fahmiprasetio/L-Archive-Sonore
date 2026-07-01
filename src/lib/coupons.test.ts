import { describe, it, expect } from 'vitest';
import { calcDiscount } from './coupons';

describe('calcDiscount', () => {
  it('menghitung diskon persen', () => {
    expect(calcDiscount(1000, { code: 'X', type: 'percent', value: 10 })).toBe(100);
  });

  it('menghitung diskon nominal tetap', () => {
    expect(calcDiscount(1000, { code: 'X', type: 'fixed', value: 150 })).toBe(150);
  });

  it('clamp diskon agar tidak melebihi subtotal', () => {
    expect(calcDiscount(100, { code: 'X', type: 'fixed', value: 999 })).toBe(100);
  });

  it('menghormati min_subtotal', () => {
    expect(
      calcDiscount(500, { code: 'X', type: 'percent', value: 10, min_subtotal: 1000 })
    ).toBe(0);
  });

  it('persen dibatasi maksimal 100%', () => {
    expect(calcDiscount(200, { code: 'X', type: 'percent', value: 250 })).toBe(200);
  });

  it('nol bila tanpa kupon atau subtotal nol', () => {
    expect(calcDiscount(500, null)).toBe(0);
    expect(calcDiscount(0, { code: 'X', type: 'percent', value: 10 })).toBe(0);
  });
});
