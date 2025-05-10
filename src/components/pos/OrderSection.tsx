
import React, { useState } from "react";
import { OrderItem, Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Plus, Minus, X } from "lucide-react";
import { useBusiness } from "@/contexts/BusinessContext";
import { ShoppingCart } from "./ShoppingCart";

interface OrderSectionProps {
  items: OrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onApplyDiscount: (amount: number) => void;
  onCancel: () => void;
  onPayNow: () => void;
}

const OrderSection: React.FC<OrderSectionProps> = ({ 
  items, 
  subtotal, 
  tax, 
  discount, 
  total,
  onUpdateQuantity,
  onRemoveItem,
  onApplyDiscount,
  onCancel,
  onPayNow
}) => {
  const { business } = useBusiness();
  const [discountAmount, setDiscountAmount] = useState("");

  const handleApplyDiscount = () => {
    const amount = parseFloat(discountAmount);
    if (isNaN(amount) || amount < 0) {
      return;
    }
    onApplyDiscount(amount);
    setDiscountAmount("");
  };

  return (
    <div className="bg-white border-l p-6 flex flex-col">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Current Order</h2>
        <p className="text-sm text-gray-500">
          {items.length} items
        </p>
      </div>
      
      {/* Order Items */}
      <div className="flex-1 overflow-y-auto mb-4">
        {items.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <ShoppingCart className="mx-auto mb-2" size={24} />
            <p>No items in the order</p>
            <p className="text-sm">Search or select products to add</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map(item => (
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
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus size={14} />
                        </Button>
                        <span className="mx-2 font-medium">{item.quantity}</span>
                        <Button 
                          variant="outline" 
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus size={14} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-7 w-7 ml-2 text-gray-400 hover:text-red-500"
                          onClick={() => onRemoveItem(item.id)}
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
            <span>{business.currency} {subtotal.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Tax ({business.taxRate}%)</span>
            <span>{business.currency} {tax.toFixed(2)}</span>
          </div>
          
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>- {business.currency} {discount.toFixed(2)}</span>
            </div>
          )}
          
          <Separator className="my-2" />
          
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>{business.currency} {total.toFixed(2)}</span>
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
            onClick={onCancel}
            disabled={items.length === 0}
          >
            Cancel
          </Button>
          
          <Button 
            className="w-full" 
            onClick={onPayNow}
            disabled={items.length === 0}
          >
            Pay Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderSection;
