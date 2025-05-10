
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "cashier" | "manager" | "waiter" | "inventory";
  avatar?: string;
}

export interface Business {
  id: string;
  name: string;
  type: "cafe_restaurant" | "hotel_lodge" | "retail_grocery";
  taxRate: number;
  currency: string;
  address?: string;
  logo?: string;
  printerEnabled: boolean;
}

export interface Category {
  id: string;
  name: string;
  parentId?: string;
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  price: number;
  discountedPrice?: number;
  taxRate: number;
  stock: number;
  reorderLevel: number;
  sku?: string;
  barcode?: string;
  isService: boolean;
  image?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  notes?: string;
  modifiers?: string[];
  price: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
  tableId?: string;
  roomId?: string;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: "pending" | "completed" | "canceled";
  paymentMethod?: PaymentMethod;
  createdAt: Date;
  createdBy: string;
}

export type PaymentMethod = "cash" | "card" | "upi" | "wallet" | "split";

export interface SalesReport {
  period: string;
  revenue: number;
  transactions: number;
  averageSale: number;
}

export interface InventoryReport {
  productId: string;
  productName: string;
  startingStock: number;
  currentStock: number;
  reorderLevel: number;
  needsRestock: boolean;
}
