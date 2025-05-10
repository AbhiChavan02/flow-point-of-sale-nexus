
import { useState } from "react";
import { useOrder } from "@/contexts/OrderContext";
import { Product, PaymentMethod, CustomerInfo } from "@/types";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export const usePOS = () => {
  const { 
    currentOrder, 
    startNewOrder, 
    addItemToOrder, 
    removeItemFromOrder, 
    updateItemQuantity, 
    applyDiscount, 
    completeOrder, 
    cancelOrder 
  } = useOrder();
  
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showReceiptDialog, setShowReceiptDialog] = useState(false);
  const [receiptUrl, setReceiptUrl] = useState("");
  
  const form = useForm();
  
  const handleAddItem = (product: Product) => {
    addItemToOrder(product, 1);
  };
  
  const handleCompleteOrder = (paymentMethod: PaymentMethod, customerInfo: CustomerInfo) => {
    completeOrder(paymentMethod, customerInfo);
    
    // Generate a mock receipt URL for demo purposes
    const receiptId = `receipt-${Date.now()}`;
    const mockReceiptUrl = `https://yourapp.com/receipts/${receiptId}`;
    setReceiptUrl(mockReceiptUrl);
    
    setShowPaymentDialog(false);
    setShowReceiptDialog(true);
  };
  
  const handleStartNewOrder = () => {
    form.reset();
    startNewOrder();
  };
  
  return {
    currentOrder,
    showPaymentDialog,
    setShowPaymentDialog,
    showReceiptDialog,
    setShowReceiptDialog,
    receiptUrl,
    handleAddItem,
    handleCompleteOrder,
    handleStartNewOrder,
    removeItemFromOrder,
    updateItemQuantity,
    applyDiscount,
    cancelOrder,
  };
};
