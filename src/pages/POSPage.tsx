
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import Header from "@/components/Header";
import ProductsSection from "@/components/pos/ProductsSection";
import OrderSection from "@/components/pos/OrderSection";
import PaymentDialog from "@/components/pos/PaymentDialog";
import ReceiptDialog from "@/components/pos/ReceiptDialog";
import AddProductDialog from "@/components/inventory/AddProductDialog";
import { usePOS } from "@/hooks/usePOS";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const POSPage: React.FC = () => {
  const {
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
  } = usePOS();

  const [showAddProductDialog, setShowAddProductDialog] = useState(false);
  const isMobile = useIsMobile();
  const [activeSection, setActiveSection] = useState<"products" | "order">("products");

  // Start a new order if none exists
  useEffect(() => {
    if (!currentOrder) {
      handleStartNewOrder();
    }
  }, [currentOrder, handleStartNewOrder]);

  return (
    <Layout>
      <Header title="Point of Sale">
        <div className="flex items-center">
          {isMobile && (
            <div className="flex space-x-2 mr-4">
              <Button
                variant={activeSection === "products" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveSection("products")}
              >
                Products
              </Button>
              <Button
                variant={activeSection === "order" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveSection("order")}
              >
                Order
              </Button>
            </div>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowAddProductDialog(true)}
          >
            <PlusCircle className="mr-1" size={16} />
            {isMobile ? "New" : "New Product"}
          </Button>
        </div>
      </Header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 h-[calc(100vh-4rem)]">
        {/* Products Section - Hide on mobile if order section is active */}
        <div className={`${isMobile && activeSection === "order" ? "hidden" : ""} ${isMobile ? "col-span-1" : "lg:col-span-2"}`}>
          <ProductsSection onAddItem={handleAddItem} />
        </div>
        
        {/* Order Section - Hide on mobile if products section is active */}
        <div className={`${isMobile && activeSection === "products" ? "hidden" : ""}`}>
          <OrderSection
            items={currentOrder?.items || []}
            subtotal={currentOrder?.subtotal || 0}
            tax={currentOrder?.tax || 0}
            discount={currentOrder?.discount || 0}
            total={currentOrder?.total || 0}
            onUpdateQuantity={updateItemQuantity}
            onRemoveItem={removeItemFromOrder}
            onApplyDiscount={applyDiscount}
            onCancel={cancelOrder}
            onPayNow={() => setShowPaymentDialog(true)}
          />
        </div>
      </div>
      
      {/* Payment Dialog */}
      <PaymentDialog 
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
        onCompleteOrder={handleCompleteOrder}
        itemCount={currentOrder?.items.length || 0}
        total={currentOrder?.total || 0}
      />
      
      {/* Receipt Sharing Dialog */}
      <ReceiptDialog
        open={showReceiptDialog}
        onOpenChange={setShowReceiptDialog}
        receiptUrl={receiptUrl}
        onNewOrder={handleStartNewOrder}
      />

      {/* Add Product Dialog */}
      <AddProductDialog
        open={showAddProductDialog}
        onOpenChange={setShowAddProductDialog}
      />
    </Layout>
  );
};

export default POSPage;
