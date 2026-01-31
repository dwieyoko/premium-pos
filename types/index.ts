export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  qrCode: string;
}

export interface CartItem extends Product {
  quantity: number;
}
