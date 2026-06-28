import { describe, it, expect } from "vitest";
import {
  isValidEmail,
  isPositiveInt,
  sanitizeImageUrls,
  validateCartItems,
  validateCustomerDetails,
  validateMidtransNotification,
} from "./validation";

describe("isValidEmail", () => {
  it("terima email valid (termasuk yang perlu di-trim)", () => {
    expect(isValidEmail("user@example.com")).toBe(true);
    expect(isValidEmail("  user@example.com  ")).toBe(true);
  });

  it("tolak email tidak valid", () => {
    expect(isValidEmail("bukan-email")).toBe(false);
    expect(isValidEmail("a@b")).toBe(false);
    expect(isValidEmail(123)).toBe(false);
  });
});

describe("isPositiveInt", () => {
  it("hanya terima bilangan bulat positif", () => {
    expect(isPositiveInt(1)).toBe(true);
    expect(isPositiveInt(0)).toBe(false);
    expect(isPositiveInt(-3)).toBe(false);
    expect(isPositiveInt(1.5)).toBe(false);
    expect(isPositiveInt("2")).toBe(false);
  });
});

describe("sanitizeImageUrls", () => {
  it("buang non-string, pangkas spasi, dan hilangkan duplikat", () => {
    expect(sanitizeImageUrls(["a", "a", " b ", 5, null])).toEqual(["a", "b"]);
  });

  it("kembalikan array kosong untuk input non-array", () => {
    expect(sanitizeImageUrls("x")).toEqual([]);
  });

  it("batasi maksimal 12 URL", () => {
    const many = Array.from({ length: 20 }, (_, i) => `url-${i}`);
    expect(sanitizeImageUrls(many)).toHaveLength(12);
  });
});

describe("validateCartItems", () => {
  it("terima item keranjang yang valid", () => {
    const result = validateCartItems([
      { product: { id: "p1", name: "Guitar", price: 100 }, quantity: 2 },
    ]);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.value).toHaveLength(1);
  });

  it("tolak keranjang kosong", () => {
    expect(validateCartItems([]).ok).toBe(false);
  });

  it("tolak harga negatif", () => {
    const result = validateCartItems([
      { product: { id: "p1", name: "X", price: -1 }, quantity: 1 },
    ]);
    expect(result.ok).toBe(false);
  });

  it("tolak quantity nol", () => {
    const result = validateCartItems([
      { product: { id: "p1", name: "X", price: 1 }, quantity: 0 },
    ]);
    expect(result.ok).toBe(false);
  });
});

describe("validateCustomerDetails", () => {
  it("terima detail valid dan pangkas field", () => {
    const result = validateCustomerDetails({
      name: "  Naufal  ",
      email: "n@example.com",
      address: "Jl. Mawar",
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.name).toBe("Naufal");
      expect(result.value.email).toBe("n@example.com");
    }
  });

  it("tolak email tidak valid", () => {
    expect(validateCustomerDetails({ name: "A", email: "bad" }).ok).toBe(false);
  });

  it("tolak nama kosong", () => {
    expect(
      validateCustomerDetails({ name: "", email: "n@example.com" }).ok,
    ).toBe(false);
  });
});

describe("validateMidtransNotification", () => {
  it("terima notifikasi dengan field lengkap", () => {
    const result = validateMidtransNotification({
      order_id: "ORDER-1",
      status_code: "200",
      gross_amount: "100000.00",
      signature_key: "abc",
      transaction_status: "settlement",
    });
    expect(result.ok).toBe(true);
  });

  it("tolak bila ada field wajib yang hilang", () => {
    const result = validateMidtransNotification({
      order_id: "ORDER-1",
      status_code: "200",
      gross_amount: "100000.00",
      transaction_status: "settlement",
    });
    expect(result.ok).toBe(false);
  });
});
