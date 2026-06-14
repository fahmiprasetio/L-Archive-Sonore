// Validasi input ringan tanpa dependency eksternal (pengganti zod).
// Setiap validator mengembalikan { ok: true, value } atau { ok: false, error }.

export type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

export function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

export function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export function isValidEmail(v: unknown): v is string {
  return typeof v === 'string' && EMAIL_RE.test(v.trim());
}

export function isFiniteNumber(v: unknown): v is number {
  return typeof v === 'number' && Number.isFinite(v);
}

export function isPositiveInt(v: unknown): v is number {
  return typeof v === 'number' && Number.isInteger(v) && v > 0;
}

// Bersihkan array URL gambar: hanya string non-kosong, dipangkas, unik, maks 12.
export function sanitizeImageUrls(input: unknown): string[] {
  if (!Array.isArray(input)) return [];
  const urls: string[] = [];
  for (const v of input) {
    if (typeof v !== 'string') continue;
    const s = v.trim().slice(0, 2000);
    if (s) urls.push(s);
    if (urls.length >= 12) break;
  }
  return Array.from(new Set(urls));
}

// ---- Cart items (untuk /api/payment) ----

export interface ValidatedCartItem {
  product: { id: string; name: string; price: number };
  quantity: number;
}

export function validateCartItems(input: unknown): ValidationResult<ValidatedCartItem[]> {
  if (!Array.isArray(input) || input.length === 0) {
    return { ok: false, error: 'Cart must contain at least one item' };
  }
  if (input.length > 100) {
    return { ok: false, error: 'Too many distinct items in cart' };
  }

  const items: ValidatedCartItem[] = [];
  for (const raw of input) {
    if (!isPlainObject(raw)) return { ok: false, error: 'Invalid cart item' };
    const product = raw.product;
    if (!isPlainObject(product)) return { ok: false, error: 'Invalid cart item product' };
    if (!isNonEmptyString(product.id)) return { ok: false, error: 'Cart item is missing a product id' };
    if (!isNonEmptyString(product.name)) return { ok: false, error: 'Cart item is missing a product name' };
    if (!isFiniteNumber(product.price) || product.price < 0) {
      return { ok: false, error: 'Cart item has an invalid price' };
    }
    if (!isPositiveInt(raw.quantity)) return { ok: false, error: 'Cart item has an invalid quantity' };
    if (raw.quantity > 1000) return { ok: false, error: 'Cart item quantity is too large' };

    items.push({
      product: { id: product.id, name: product.name, price: product.price },
      quantity: raw.quantity,
    });
  }
  return { ok: true, value: items };
}

// ---- Customer details (untuk /api/payment) ----

export interface ValidatedCustomer {
  name: string;
  email: string;
  address: string;
}

export function validateCustomerDetails(input: unknown): ValidationResult<ValidatedCustomer> {
  if (!isPlainObject(input)) return { ok: false, error: 'Missing customer details' };
  if (!isNonEmptyString(input.name)) return { ok: false, error: 'Customer name is required' };
  if (!isValidEmail(input.email)) return { ok: false, error: 'A valid email address is required' };
  const address = typeof input.address === 'string' ? input.address : '';
  return {
    ok: true,
    value: {
      name: input.name.trim().slice(0, 200),
      email: input.email.trim().slice(0, 200),
      address: address.slice(0, 500),
    },
  };
}

// ---- Product (untuk /api/admin/products) ----

export interface ValidatedProductInput {
  name: string;
  description: string;
  price: number;
  image_url: string;
  images: string[];
  category: string;
  stock: number;
}

export function validateNewProduct(input: unknown): ValidationResult<ValidatedProductInput> {
  if (!isPlainObject(input)) return { ok: false, error: 'Invalid product payload' };
  if (!isNonEmptyString(input.name)) return { ok: false, error: 'Product name is required' };

  const price = Number(input.price);
  if (!Number.isFinite(price) || price < 0) {
    return { ok: false, error: 'Product price must be a non-negative number' };
  }

  let stock = 0;
  if (input.stock !== undefined && input.stock !== null && input.stock !== '') {
    const n = Number(input.stock);
    if (!Number.isInteger(n) || n < 0) {
      return { ok: false, error: 'Stock must be a non-negative integer' };
    }
    stock = n;
  }

  return {
    ok: true,
    value: {
      name: String(input.name).trim().slice(0, 200),
      description: typeof input.description === 'string' ? input.description.slice(0, 5000) : '',
      price,
      image_url: typeof input.image_url === 'string' ? input.image_url.slice(0, 2000) : '',
      images: sanitizeImageUrls(input.images),
      category: typeof input.category === 'string' ? input.category.slice(0, 100) : '',
      stock,
    },
  };
}

export function validateProductUpdates(
  input: unknown
): ValidationResult<Partial<ValidatedProductInput>> {
  if (!isPlainObject(input)) return { ok: false, error: 'Invalid updates payload' };
  const out: Partial<ValidatedProductInput> = {};

  if ('name' in input) {
    if (!isNonEmptyString(input.name)) return { ok: false, error: 'Name must be a non-empty string' };
    out.name = String(input.name).trim().slice(0, 200);
  }
  if ('description' in input) {
    if (typeof input.description !== 'string') return { ok: false, error: 'Description must be a string' };
    out.description = input.description.slice(0, 5000);
  }
  if ('price' in input) {
    const price = Number(input.price);
    if (!Number.isFinite(price) || price < 0) return { ok: false, error: 'Price must be a non-negative number' };
    out.price = price;
  }
  if ('image_url' in input) {
    if (typeof input.image_url !== 'string') return { ok: false, error: 'image_url must be a string' };
    out.image_url = input.image_url.slice(0, 2000);
  }
  if ('images' in input) {
    if (!Array.isArray(input.images)) return { ok: false, error: 'images must be an array of URLs' };
    out.images = sanitizeImageUrls(input.images);
  }
  if ('category' in input) {
    if (typeof input.category !== 'string') return { ok: false, error: 'Category must be a string' };
    out.category = input.category.slice(0, 100);
  }
  if ('stock' in input) {
    const n = Number(input.stock);
    if (!Number.isInteger(n) || n < 0) return { ok: false, error: 'Stock must be a non-negative integer' };
    out.stock = n;
  }

  if (Object.keys(out).length === 0) {
    return { ok: false, error: 'No valid fields to update' };
  }
  return { ok: true, value: out };
}

// ---- Midtrans notification (untuk /api/payment/notification) ----

export interface ValidatedNotification {
  order_id: string;
  status_code: string;
  gross_amount: string;
  signature_key: string;
  transaction_status: string;
  fraud_status?: string;
}

export function validateMidtransNotification(
  input: unknown
): ValidationResult<ValidatedNotification> {
  if (!isPlainObject(input)) return { ok: false, error: 'Invalid notification body' };
  const { order_id, status_code, gross_amount, signature_key, transaction_status } = input;
  if (
    !isNonEmptyString(order_id) ||
    !isNonEmptyString(status_code) ||
    typeof gross_amount !== 'string' ||
    !isNonEmptyString(signature_key) ||
    !isNonEmptyString(transaction_status)
  ) {
    return { ok: false, error: 'Missing required notification fields' };
  }
  return {
    ok: true,
    value: {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status: typeof input.fraud_status === 'string' ? input.fraud_status : undefined,
    },
  };
}
