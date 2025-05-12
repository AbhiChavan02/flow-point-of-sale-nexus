
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  LayoutDashboard, 
  Store, 
  Package, 
  Users, 
  Settings,
  LogOut,
  CreditCard,
  BarChart,
  CreditCard as Subscription,
  UserPlus
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarProps {
  onNavClick?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavClick }) => {
  const { currentUser, logout } = useAuth();
  const { currentPlan } = useSubscription();
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const handleLogout = () => {
    logout();
  };
  
  const handleNavClick = () => {
    if (onNavClick) {
      onNavClick();
    }
  };
  
  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "POS", path: "/pos", icon: <Store size={20} /> },
    { name: "Inventory", path: "/inventory", icon: <Package size={20} /> },
    { name: "Payments", path: "/payments", icon: <CreditCard size={20} /> },
    { name: "Reports", path: "/reports", icon: <BarChart size={20} /> },
    { 
      name: "Subscription", 
      path: "/subscription", 
      icon: <Subscription size={20} />,
      badge: currentPlan?.tier !== "free" ? currentPlan?.tier : undefined
    },
    { name: "Users", path: "/users", icon: <Users size={20} /> },
    { name: "Settings", path: "/settings", icon: <Settings size={20} /> }
  ];

  return (
    <div className="min-w-60 bg-sidebar border-r h-full flex flex-col dark:bg-gray-900 dark:border-gray-800">
      <div className="p-4 border-b dark:border-gray-800 flex justify-between items-center">
        <h1 className="text-xl font-bold dark:text-white">POS System</h1>
        <ThemeToggle />
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground dark:bg-gray-800 dark:text-white font-medium"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 dark:text-gray-300 dark:hover:bg-gray-800/70"
                }`
              }
            >
              <div className="flex items-center">
                <div className="mr-3 text-sidebar-foreground dark:text-gray-400">{item.icon}</div>
                {item.name}
              </div>
              {item.badge && (
                <Badge variant="outline" className="capitalize">
                  {item.badge}
                </Badge>
              )}
            </NavLink>
          ))}
          
          {location.pathname === "/users" && (
            <Button 
              onClick={handleNavClick}
              variant="outline" 
              size="sm" 
              className="w-full mt-2 flex items-center justify-start"
            >
              <UserPlus className="mr-2" size={16} />
              Add New User
            </Button>
          )}
        </nav>
      </div>
      
      <div className="p-4 border-t dark:border-gray-800">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 mr-2"></div>
          <div>
            <p className="text-sm font-medium dark:text-white">{currentUser?.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{currentUser?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-3 py-2 text-sm text-red-600 dark:text-red-400 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <LogOut size={16} className="mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
