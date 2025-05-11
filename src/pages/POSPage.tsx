
import React, { useState } from "react";
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

  // Start a new order if none exists
  React.useEffect(() => {
    if (!currentOrder) {
      handleStartNewOrder();
    }
  }, [currentOrder]);

  return (
    <Layout>
      <Header title="Point of Sale">
        <Button 
          variant="outline" 
          size="sm" 
          className="ml-4" 
          onClick={() => setShowAddProductDialog(true)}
        >
          <PlusCircle className="mr-1" size={16} />
          New Product
        </Button>
      </Header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 h-[calc(100vh-4rem)]">
        {/* Products Section */}
        <ProductsSection onAddItem={handleAddItem} />
        
        {/* Order Section */}
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
