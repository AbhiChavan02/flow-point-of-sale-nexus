
import React from "react";
import { Button } from "@/components/ui/button";
import { useOrder } from "@/contexts/OrderContext";
import { ShoppingCart, Bell } from "lucide-react";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const { currentOrder, startNewOrder } = useOrder();
  
  return (
    <header className="flex justify-between items-center h-16 px-6 bg-white border-b">
      <h1 className="text-xl font-semibold">{title}</h1>
      
      <div className="flex items-center gap-4">
        {/* Notification icon */}
        <Button variant="ghost" size="icon">
          <Bell size={18} />
        </Button>
        
        {/* New order button */}
        <Button
          onClick={startNewOrder}
          className="flex items-center gap-2"
          variant={currentOrder ? "outline" : "default"}
        >
          <ShoppingCart size={18} />
          <span>{currentOrder ? "Order in progress" : "New Order"}</span>
        </Button>
      </div>
    </header>
  );
};

export default Header;
