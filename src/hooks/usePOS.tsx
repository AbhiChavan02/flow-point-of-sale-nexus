
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
    try {
      completeOrder(paymentMethod, customerInfo);
      
      // Generate a receipt URL that includes order details
      const orderId = `receipt-${Date.now()}`;
      const mockReceiptUrl = `https://yourapp.com/receipts/${orderId}?customer=${encodeURIComponent(customerInfo.name)}`;
      setReceiptUrl(mockReceiptUrl);
      
      setShowPaymentDialog(false);
      setShowReceiptDialog(true);
    } catch (error) {
      console.error("Error completing order:", error);
      toast.error("Failed to complete order. Please try again.");
    }
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
