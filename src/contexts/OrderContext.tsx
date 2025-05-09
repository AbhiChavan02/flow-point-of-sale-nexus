
import React, { createContext, useState, useContext } from "react";
import { Order, OrderItem, Product, PaymentMethod } from "@/types";
import { useAuth } from "./AuthContext";
import { toast } from "sonner";

interface OrderContextType {
  currentOrder: Order | null;
  orders: Order[];
  startNewOrder: () => void;
  addItemToOrder: (product: Product, quantity: number, notes?: string) => void;
  removeItemFromOrder: (itemId: string) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  applyDiscount: (amount: number) => void;
  completeOrder: (paymentMethod: PaymentMethod) => void;
  cancelOrder: () => void;
}

const createEmptyOrder = (userId: string): Order => ({
  id: `order-${Date.now()}`,
  items: [],
  subtotal: 0,
  tax: 0,
  discount: 0,
  total: 0,
  status: "pending",
  createdAt: new Date(),
  createdBy: userId
});

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  
  const calculateOrderTotals = (items: OrderItem[], discount: number = 0) => {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = items.reduce((sum, item) => {
      const itemTax = (item.price * item.quantity) * (item.product.taxRate / 100);
      return sum + itemTax;
    }, 0);
    
    return {
      subtotal,
      tax,
      discount,
      total: subtotal + tax - discount
    };
  };
  
  const startNewOrder = () => {
    if (!currentUser) return;
    const newOrder = createEmptyOrder(currentUser.id);
    setCurrentOrder(newOrder);
  };
  
  const addItemToOrder = (product: Product, quantity: number, notes?: string) => {
    if (!currentOrder) return;
    
    // Check if product already exists in order
    const existingItemIndex = currentOrder.items.findIndex(item => item.productId === product.id);
    
    let updatedItems: OrderItem[];
    
    if (existingItemIndex >= 0) {
      // Update existing item
      updatedItems = [...currentOrder.items];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + quantity,
        notes: notes || updatedItems[existingItemIndex].notes
      };
    } else {
      // Add new item
      const newItem: OrderItem = {
        id: `item-${Date.now()}-${product.id}`,
        productId: product.id,
        product,
        quantity,
        notes,
        price: product.discountedPrice || product.price
      };
      updatedItems = [...currentOrder.items, newItem];
    }
    
    const totals = calculateOrderTotals(updatedItems, currentOrder.discount);
    
    setCurrentOrder({
      ...currentOrder,
      items: updatedItems,
      ...totals
    });
    
    toast.success(`Added: ${product.name}`);
  };
  
  const removeItemFromOrder = (itemId: string) => {
    if (!currentOrder) return;
    
    const updatedItems = currentOrder.items.filter(item => item.id !== itemId);
    const totals = calculateOrderTotals(updatedItems, currentOrder.discount);
    
    setCurrentOrder({
      ...currentOrder,
      items: updatedItems,
      ...totals
    });
    
    toast.info("Item removed");
  };
  
  const updateItemQuantity = (itemId: string, quantity: number) => {
    if (!currentOrder) return;
    
    // Don't allow quantity less than 1
    if (quantity < 1) {
      return removeItemFromOrder(itemId);
    }
    
    const updatedItems = currentOrder.items.map(item =>
      item.id === itemId ? { ...item, quantity } : item
    );
    
    const totals = calculateOrderTotals(updatedItems, currentOrder.discount);
    
    setCurrentOrder({
      ...currentOrder,
      items: updatedItems,
      ...totals
    });
  };
  
  const applyDiscount = (amount: number) => {
    if (!currentOrder) return;
    
    const totals = calculateOrderTotals(currentOrder.items, amount);
    
    setCurrentOrder({
      ...currentOrder,
      ...totals
    });
  };
  
  const completeOrder = (paymentMethod: PaymentMethod) => {
    if (!currentOrder) return;
    
    const completedOrder: Order = {
      ...currentOrder,
      status: "completed",
      paymentMethod
    };
    
    setOrders(prevOrders => [completedOrder, ...prevOrders]);
    setCurrentOrder(null);
    
    // Save to localStorage
    try {
      const savedOrders = localStorage.getItem("pos_orders");
      let orderHistory: Order[] = [];
      
      if (savedOrders) {
        orderHistory = JSON.parse(savedOrders);
      }
      
      localStorage.setItem("pos_orders", JSON.stringify([completedOrder, ...orderHistory]));
    } catch (error) {
      console.error("Error saving orders to localStorage:", error);
    }
    
    toast.success("Order completed successfully!");
  };
  
  const cancelOrder = () => {
    setCurrentOrder(null);
    toast.info("Order canceled");
  };
  
  return (
    <OrderContext.Provider value={{
      currentOrder,
      orders,
      startNewOrder,
      addItemToOrder,
      removeItemFromOrder,
      updateItemQuantity,
      applyDiscount,
      completeOrder,
      cancelOrder
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
};
