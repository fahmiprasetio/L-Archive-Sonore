import { describe, it, expect } from "vitest";
import {
  TAX_RATE,
  SHIPPING_FLAT,
  FREE_SHIPPING_THRESHOLD,
  calcShipping,
  calcTax,
  calcOrderSummary,
} from "./pricing";

describe("calcShipping", () => {
  it("gratis untuk subtotal nol atau negatif", () => {
    expect(calcShipping(0)).toBe(0);
    expect(calcShipping(-100)).toBe(0);
  });

  it("kenakan ongkir flat di bawah ambang gratis ongkir", () => {
    expect(calcShipping(500)).toBe(SHIPPING_FLAT);
    expect(calcShipping(FREE_SHIPPING_THRESHOLD - 1)).toBe(SHIPPING_FLAT);
  });

  it("gratis ongkir pada atau di atas ambang", () => {
    expect(calcShipping(FREE_SHIPPING_THRESHOLD)).toBe(0);
    expect(calcShipping(FREE_SHIPPING_THRESHOLD + 500)).toBe(0);
  });
});

describe("calcTax", () => {
  it("nol untuk subtotal nol atau negatif", () => {
    expect(calcTax(0)).toBe(0);
    expect(calcTax(-50)).toBe(0);
  });

  it("hitung PPN lalu bulatkan ke bilangan bulat", () => {
    expect(calcTax(1000)).toBe(Math.round(1000 * TAX_RATE));
    expect(calcTax(999)).toBe(Math.round(999 * TAX_RATE));
  });
});

describe("calcOrderSummary", () => {
  it("gabungkan subtotal, ongkir, dan pajak", () => {
    const summary = calcOrderSummary(500);
    expect(summary).toEqual({
      subtotal: 500,
      shipping: SHIPPING_FLAT,
      tax: calcTax(500),
      total: 500 + SHIPPING_FLAT + calcTax(500),
    });
  });

  it("clamp subtotal negatif ke nol", () => {
    expect(calcOrderSummary(-100)).toEqual({
      subtotal: 0,
      shipping: 0,
      tax: 0,
      total: 0,
    });
  });

  it("gratis ongkir pada ambang batas", () => {
    const summary = calcOrderSummary(FREE_SHIPPING_THRESHOLD);
    expect(summary.shipping).toBe(0);
    expect(summary.total).toBe(
      FREE_SHIPPING_THRESHOLD + calcTax(FREE_SHIPPING_THRESHOLD),
    );
  });
});
