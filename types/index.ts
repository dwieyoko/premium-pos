export interface Category {
  id: string;
  name: string;
  color?: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  image: string;
  qrCode: string;
  sku?: string;
  stock?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductFormData {
  name: string;
  description?: string;
  price: number;
  category: string;
  image: string;
  qrCode: string;
  sku?: string;
  stock?: number;
}

export interface CartItem extends Product {
  quantity: number;
}
