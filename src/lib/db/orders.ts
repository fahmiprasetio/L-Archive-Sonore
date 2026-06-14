import { supabase } from '@/lib/supabase';

export interface OrderItemSnapshot {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  user_id?: string | null;
  customer_name: string;
  customer_email: string;
  customer_address?: string | null;
  items: OrderItemSnapshot[];
  total: number;
  status: string;
  created_at: string;
}

// Daftar status pesanan yang valid (alur fulfillment).
export const ORDER_STATUSES = [
  'pending',
  'paid',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'failed',
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

async function authHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = {};
  try {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (token) headers.Authorization = `Bearer ${token}`;
  } catch {
    // ignore
  }
  return headers;
}

// Pesanan milik user yang login (RLS membatasi ke auth.uid() = user_id).
export async function fetchMyOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as Order[];
}

// Semua pesanan — khusus admin, via server (service-role).
export async function fetchAllOrdersAdmin(): Promise<Order[]> {
  const res = await fetch('/api/admin/orders', { headers: await authHeaders() });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Gagal memuat pesanan');
  return (json.orders || []) as Order[];
}

// Perbarui status sebuah pesanan — khusus admin, via server (service-role).
export async function updateOrderStatusAdmin(
  id: string,
  status: OrderStatus | string
): Promise<Order> {
  const res = await fetch('/api/admin/orders', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...(await authHeaders()) },
    body: JSON.stringify({ id, status }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Gagal memperbarui status pesanan');
  return json.order as Order;
}
