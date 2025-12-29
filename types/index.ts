export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
}

export interface Promotion {
  id: string;
  productId: string;
  minQuantity: number;
  discountedPrice: number;
  description: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Order {
  id: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    total: number;
  }[];
  totalAmount: number;
  signature: string;
  date: string;
}
