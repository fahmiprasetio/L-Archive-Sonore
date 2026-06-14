import { supabase } from '@/lib/supabase';

export interface OrderItemSnapshot {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_address?: string | null;
  items: OrderItemSnapshot[];
  total: number;
  status: string;
  created_at: string;
}

const TABLE = 'orders';

export async function fetchOrdersDb(): Promise<Order[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as Order[];
}
