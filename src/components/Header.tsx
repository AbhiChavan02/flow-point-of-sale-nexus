
import React from "react";
import { Button } from "@/components/ui/button";
import { useOrder } from "@/contexts/OrderContext";
import { ShoppingCart, Bell, ChevronRight } from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import ThemeToggle from "@/components/ThemeToggle";

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const { currentOrder, startNewOrder } = useOrder();
  const { currentPlan, isSubscribed, expiryDate } = useSubscription();
  
  const getPlanColorClass = () => {
    if (!currentPlan) return "";
    switch (currentPlan.tier) {
      case "premium": return "bg-purple-100 text-purple-800 dark:bg-purple-800/20 dark:text-purple-300 border-purple-300 dark:border-purple-800";
      case "enterprise": return "bg-amber-100 text-amber-800 dark:bg-amber-800/20 dark:text-amber-300 border-amber-300 dark:border-amber-800";
      case "basic": return "bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-300 border-blue-300 dark:border-blue-800";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-300 border-gray-300 dark:border-gray-700";
    }
  };

  return (
    <header className="flex justify-between items-center h-16 px-6 bg-white dark:bg-gray-900 border-b dark:border-gray-800 shadow-sm fade-in">
      <div className="flex items-center space-x-3">
        <h1 className="text-xl font-semibold dark:text-white">{title}</h1>
        {title !== "Dashboard" && (
          <div className="hidden sm:flex items-center text-sm text-muted-foreground">
            <span>Dashboard</span>
            <ChevronRight className="h-3 w-3 mx-1" />
            <span className="text-foreground">{title}</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-4">
        {/* Theme toggle */}
        <ThemeToggle />
        
        {/* Subscription badge */}
        {isSubscribed && (
          <Popover>
            <PopoverTrigger asChild>
              <Badge 
                variant="outline" 
                className={`cursor-pointer border hover:bg-opacity-80 transition-colors capitalize ${getPlanColorClass()}`}
              >
                {currentPlan?.tier} Plan
              </Badge>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 overflow-hidden">
              <div className={`p-2 ${currentPlan?.tier === "premium" ? "premium-gradient" : "hero-gradient"} text-white`}>
                <h4 className="font-medium">{currentPlan?.name} Subscription</h4>
                <p className="text-sm opacity-90">Unlock the full potential of your business</p>
              </div>
              <div className="p-4 space-y-3">
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
                  className="w-full mt-2 button-shine" 
                  onClick={() => window.location.href = "/subscription"}
                >
                  Manage Subscription
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        )}
        
        {/* Notification icon */}
        <Button variant="ghost" size="icon" className="rounded-full relative">
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </Button>
        
        {/* New order button */}
        <Button
          onClick={startNewOrder}
          className={`flex items-center gap-2 ${currentOrder ? "" : "button-shine"}`}
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
