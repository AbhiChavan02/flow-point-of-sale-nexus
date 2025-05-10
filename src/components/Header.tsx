
import React from "react";
import { Button } from "@/components/ui/button";
import { useOrder } from "@/contexts/OrderContext";
import { ShoppingCart, Bell } from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const { currentOrder, startNewOrder } = useOrder();
  const { currentPlan, isSubscribed, expiryDate } = useSubscription();
  
  return (
    <header className="flex justify-between items-center h-16 px-6 bg-white dark:bg-gray-900 border-b dark:border-gray-800 shadow-sm">
      <h1 className="text-xl font-semibold dark:text-white">{title}</h1>
      
      <div className="flex items-center gap-4">
        {/* Subscription badge */}
        {isSubscribed && (
          <Popover>
            <PopoverTrigger asChild>
              <Badge 
                variant="outline" 
                className="cursor-pointer border-primary/50 bg-primary/10 hover:bg-primary/20 transition-colors capitalize"
              >
                {currentPlan?.tier} Plan
              </Badge>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-medium">Your Subscription</h4>
                <div className="grid grid-cols-2 gap-1">
                  <div className="text-sm text-muted-foreground">Plan:</div>
                  <div className="text-sm font-medium">{currentPlan?.name}</div>
                  
                  <div className="text-sm text-muted-foreground">Status:</div>
                  <div className="text-sm font-medium flex items-center">
                    <span className="status-indicator status-active"></span>
                    Active
                  </div>
                  
                  <div className="text-sm text-muted-foreground">Expires:</div>
                  <div className="text-sm font-medium">
                    {expiryDate ? format(expiryDate, 'MMM dd, yyyy') : 'N/A'}
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-2" 
                  onClick={() => window.location.href = "/subscription"}
                >
                  Manage Subscription
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        )}
        
        {/* Notification icon */}
        <Button variant="ghost" size="icon" className="rounded-full">
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
