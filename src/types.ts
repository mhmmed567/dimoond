export type Category = 'coffee' | 'cold' | 'dessert' | 'extras';
export type UserRole = 'customer' | 'staff' | 'admin';
export type PaymentMethod = 'cash' | 'visa';

export interface Product {
  id: string;
  name: string;
  nameEn: string;
  price: number;
  category: Category;
  image: string; // Emoji or URL
  description?: string;
  available: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface AppSettings {
  logoUrl: string;
  storeName: string;
}

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered';

export interface User {
  id: string;
  phone: string;
  password?: string;
  role: UserRole;
  name?: string;
}

export interface Order {
  id: string;
  orderId?: string; // Human readable
  items: {
    product: Product;
    quantity: number;
  }[];
  total: number;
  status: OrderStatus;
  paymentMethod: 'cash' | 'visa';
  phone: string;
  carPlate: string;
  createdAt: string;
}
