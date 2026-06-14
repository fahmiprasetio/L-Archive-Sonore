export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  // Galeri gambar (opsional). Bila kosong, UI fallback ke image_url.
  images?: string[];
  category: string;
  stock?: number;
  created_at?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
