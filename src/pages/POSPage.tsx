
import React, { useState } from "react";
import { useInventory } from "@/contexts/InventoryContext";
import { useOrder } from "@/contexts/OrderContext";
import { useBusiness } from "@/contexts/BusinessContext";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Search, Plus, Minus, X, CreditCard, DollarSign, Package } from "lucide-react";
import Header from "@/components/Header";
import Layout from "@/components/Layout";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const POSPage: React.FC = () => {
  const { products, categories } = useInventory();
  const { currentOrder, startNewOrder, addItemToOrder, removeItemFromOrder, updateItemQuantity, applyDiscount, completeOrder, cancelOrder } = useOrder();
  const { business } = useBusiness();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState("");
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("cash");
  
  // Start a new order if none exists
  React.useEffect(() => {
    if (!currentOrder) {
      startNewOrder();
    }
  }, [currentOrder, startNewOrder]);
  
  // Filter products by search term and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = searchTerm === "" || product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === null || product.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  const handleAddItem = (product: Product) => {
    addItemToOrder(product, 1);
  };
  
  const handleQuantityChange = (itemId: string, quantity: number) => {
    updateItemQuantity(itemId, quantity);
  };
  
  const handleApplyDiscount = () => {
    const amount = parseFloat(discountAmount);
    if (isNaN(amount) || amount < 0) {
      toast.error("Please enter a valid discount amount");
      return;
    }
    applyDiscount(amount);
    toast.success(`Discount of ${business.currency} ${amount.toFixed(2)} applied`);
    setDiscountAmount("");
  };
  
  const handleCompleteOrder = () => {
    completeOrder(selectedPaymentMethod as any);
    setShowPaymentDialog(false);
  };
  
  return (
    <Layout>
      <Header title="Point of Sale" />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 h-[calc(100vh-4rem)]">
        {/* Products Section */}
        <div className="lg:col-span-2 p-6 overflow-y-auto">
          {/* Search and Category Filter */}
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                onClick={() => setSelectedCategory(null)}
                className="whitespace-nowrap"
              >
                All
              </Button>
              
              {categories.map(category => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className="whitespace-nowrap"
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map(product => (
              <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleAddItem(product)}>
                <CardHeader className="p-4 pb-2">
                  <div className="aspect-square bg-gray-100 rounded-md mb-3 flex items-center justify-center">
                    {product.image ? (
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Package size={40} className="text-gray-400" />
                    )}
                  </div>
                  <CardTitle className="text-md leading-tight">{product.name}</CardTitle>
                </CardHeader>
                <CardFooter className="p-4 pt-2 flex justify-between items-center">
                  <div>
                    {product.discountedPrice ? (
                      <>
                        <span className="font-semibold">{business.currency} {product.discountedPrice.toFixed(2)}</span>
                        <span className="text-sm text-gray-400 line-through ml-2">{business.currency} {product.price.toFixed(2)}</span>
                      </>
                    ) : (
                      <span className="font-semibold">{business.currency} {product.price.toFixed(2)}</span>
                    )}
                  </div>
                  {product.isService && <Badge>Service</Badge>}
                </CardFooter>
              </Card>
            ))}
            
            {filteredProducts.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500">
                No products found. Try adjusting your search or category filter.
              </div>
            )}
          </div>
        </div>
        
        {/* Order Section */}
        <div className="bg-white border-l p-6 flex flex-col">
          <div className="mb-4">
            <h2 className="text-xl font-semibold">Current Order</h2>
            <p className="text-sm text-gray-500">
              {currentOrder?.items.length || 0} items
            </p>
          </div>
          
          {/* Order Items */}
          <div className="flex-1 overflow-y-auto mb-4">
            {!currentOrder || currentOrder.items.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <ShoppingCart className="mx-auto mb-2" size={24} />
                <p>No items in the order</p>
                <p className="text-sm">Search or select products to add</p>
              </div>
            ) : (
              <div className="space-y-4">
                {currentOrder.items.map(item => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{item.product.name}</h3>
                          <p className="text-sm text-gray-500">
                            {business.currency} {item.price.toFixed(2)} × {item.quantity} 
                            {item.notes && ` - ${item.notes}`}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{business.currency} {(item.price * item.quantity).toFixed(2)}</div>
                          <div className="flex items-center mt-1">
                            <Button 
                              variant="outline" 
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            >
                              <Minus size={14} />
                            </Button>
                            <span className="mx-2 font-medium">{item.quantity}</span>
                            <Button 
                              variant="outline" 
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            >
                              <Plus size={14} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-7 w-7 ml-2 text-gray-400 hover:text-red-500"
                              onClick={() => removeItemFromOrder(item.id)}
                            >
                              <X size={14} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
          
          {/* Order Summary */}
          <div>
            <Separator className="my-4" />
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>{business.currency} {currentOrder?.subtotal.toFixed(2) || "0.00"}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Tax ({business.taxRate}%)</span>
                <span>{business.currency} {currentOrder?.tax.toFixed(2) || "0.00"}</span>
              </div>
              
              {currentOrder?.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>- {business.currency} {currentOrder.discount.toFixed(2)}</span>
                </div>
              )}
              
              <Separator className="my-2" />
              
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>{business.currency} {currentOrder?.total.toFixed(2) || "0.00"}</span>
              </div>
            </div>
            
            {/* Discount */}
            <div className="mt-4 flex gap-2">
              <Input
                type="number"
                min="0"
                step="0.01"
                placeholder="Discount amount"
                value={discountAmount}
                onChange={(e) => setDiscountAmount(e.target.value)}
              />
              <Button variant="outline" onClick={handleApplyDiscount}>Apply</Button>
            </div>
            
            {/* Actions */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={cancelOrder}
                disabled={!currentOrder || currentOrder.items.length === 0}
              >
                Cancel
              </Button>
              
              <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
                <DialogTrigger asChild>
                  <Button 
                    className="w-full" 
                    disabled={!currentOrder || currentOrder.items.length === 0}
                  >
                    Pay Now
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Complete Payment</DialogTitle>
                    <DialogDescription>
                      Select a payment method to complete the order
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="py-4">
                    <h3 className="font-semibold text-lg mb-1">
                      Total: {business.currency} {currentOrder?.total.toFixed(2) || "0.00"}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {currentOrder?.items.length || 0} items
                    </p>
                    
                    <div className="mt-6">
                      <RadioGroup 
                        value={selectedPaymentMethod} 
                        onValueChange={setSelectedPaymentMethod}
                        className="space-y-3"
                      >
                        <div className="flex items-center space-x-3 border rounded-md p-3">
                          <RadioGroupItem value="cash" id="cash" />
                          <Label htmlFor="cash" className="flex items-center cursor-pointer">
                            <DollarSign className="mr-2" size={18} /> Cash
                          </Label>
                        </div>
                        
                        <div className="flex items-center space-x-3 border rounded-md p-3">
                          <RadioGroupItem value="card" id="card" />
                          <Label htmlFor="card" className="flex items-center cursor-pointer">
                            <CreditCard className="mr-2" size={18} /> Card
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button onClick={() => setShowPaymentDialog(false)} variant="outline">Cancel</Button>
                    <Button onClick={handleCompleteOrder}>Complete Order</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

// Custom Shopping Cart Icon
const ShoppingCart: React.FC<{ className?: string, size: number }> = ({ className, size }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="8" cy="21" r="1"/>
    <circle cx="19" cy="21" r="1"/>
    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
  </svg>
);

export default POSPage;
