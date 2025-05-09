
export const BUSINESS_TYPES = [
  { id: "cafe_restaurant", name: "Café / Restaurant" },
  { id: "hotel_lodge", name: "Hotel / Lodge" },
  { id: "retail_grocery", name: "Retail / Grocery / Store" }
];

export const USER_ROLES = [
  { id: "admin", name: "Administrator" },
  { id: "manager", name: "Manager" },
  { id: "cashier", name: "Cashier" },
  { id: "waiter", name: "Waiter" },
  { id: "inventory", name: "Inventory Manager" }
];

export const PAYMENT_METHODS = [
  { id: "cash", name: "Cash" },
  { id: "card", name: "Card" },
  { id: "upi", name: "UPI / Mobile Payment" },
  { id: "wallet", name: "Digital Wallet" },
  { id: "split", name: "Split Payment" }
];

export const DEMO_PRODUCTS = [
  { 
    id: "p1", 
    name: "Coffee - Americano", 
    categoryId: "c1", 
    price: 3.99, 
    discountedPrice: 0, 
    taxRate: 5, 
    stock: 100, 
    reorderLevel: 20, 
    isService: false,
    image: "/placeholder.svg"
  },
  { 
    id: "p2", 
    name: "Tea - English Breakfast", 
    categoryId: "c1", 
    price: 2.99, 
    discountedPrice: 0, 
    taxRate: 5, 
    stock: 80, 
    reorderLevel: 15, 
    isService: false,
    image: "/placeholder.svg"
  },
  { 
    id: "p3", 
    name: "Sandwich - Veggie", 
    categoryId: "c2", 
    price: 5.99, 
    discountedPrice: 4.99, 
    taxRate: 5, 
    stock: 20, 
    reorderLevel: 5, 
    isService: false,
    image: "/placeholder.svg"
  },
  { 
    id: "p4", 
    name: "Croissant", 
    categoryId: "c2", 
    price: 2.49, 
    discountedPrice: 0, 
    taxRate: 5, 
    stock: 15, 
    reorderLevel: 5, 
    isService: false,
    image: "/placeholder.svg"
  },
  { 
    id: "p5", 
    name: "Room Cleaning", 
    categoryId: "c3", 
    price: 15.00, 
    discountedPrice: 0, 
    taxRate: 18, 
    stock: 999, 
    reorderLevel: 0, 
    isService: true,
    image: "/placeholder.svg"
  },
];

export const DEMO_CATEGORIES = [
  { id: "c1", name: "Beverages", parentId: null },
  { id: "c2", name: "Food", parentId: null },
  { id: "c3", name: "Services", parentId: null },
];

export const DEMO_USERS = [
  {
    id: "u1",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    password: "admin123" // In a real app, this would be hashed
  },
  {
    id: "u2",
    name: "Cashier User",
    email: "cashier@example.com",
    role: "cashier",
    password: "cashier123" // In a real app, this would be hashed
  },
  {
    id: "u3",
    name: "Manager User",
    email: "manager@example.com",
    role: "manager",
    password: "manager123" // In a real app, this would be hashed
  }
];
