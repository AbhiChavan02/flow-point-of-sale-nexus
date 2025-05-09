
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useBusiness } from "@/contexts/BusinessContext";
import {
  BarChart,
  ShoppingCart,
  Package,
  Settings,
  Users,
  LogIn,
  CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";

type SidebarItem = {
  name: string;
  href: string;
  icon: React.ElementType;
  roles: Array<string>;
};

const Sidebar: React.FC = () => {
  const { pathname } = useLocation();
  const { currentUser, logout } = useAuth();
  const { business } = useBusiness();

  // Define navigation items with role-based access
  const navItems: SidebarItem[] = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: BarChart,
      roles: ["admin", "manager", "cashier", "inventory", "waiter"]
    },
    {
      name: "POS / Billing",
      href: "/pos",
      icon: ShoppingCart,
      roles: ["admin", "manager", "cashier", "waiter"]
    },
    {
      name: "Inventory",
      href: "/inventory",
      icon: Package,
      roles: ["admin", "manager", "inventory"]
    },
    {
      name: "Payments",
      href: "/payments",
      icon: CreditCard,
      roles: ["admin", "manager", "cashier"]
    },
    {
      name: "Users",
      href: "/users",
      icon: Users,
      roles: ["admin", "manager"]
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
      roles: ["admin"]
    }
  ];

  // Filter items based on user role
  const filteredNavItems = navItems.filter(
    item => currentUser && item.roles.includes(currentUser.role)
  );

  // Get color based on business type
  const getBusinessColor = () => {
    switch (business.type) {
      case "cafe_restaurant":
        return "bg-red-600";
      case "hotel_lodge":
        return "bg-blue-600";
      case "retail_grocery":
        return "bg-green-600";
      default:
        return "bg-slate-600";
    }
  };

  return (
    <div className="h-screen w-64 border-r bg-white flex flex-col">
      {/* Header */}
      <div className={`${getBusinessColor()} p-4 text-white`}>
        <h2 className="text-lg font-semibold">{business.name}</h2>
        <p className="text-sm opacity-80">
          {business.type.replace("_", " / ").charAt(0).toUpperCase() + business.type.replace("_", " / ").slice(1)}
        </p>
      </div>

      {/* User info */}
      <div className="p-4 border-b">
        {currentUser ? (
          <div>
            <p className="font-medium">{currentUser.name}</p>
            <p className="text-sm text-gray-500 capitalize">{currentUser.role}</p>
          </div>
        ) : (
          <p>Not logged in</p>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {filteredNavItems.map(item => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center p-3 rounded-md text-gray-700 hover:bg-gray-100 gap-3 transition-colors",
              pathname === item.href && "bg-gray-100 font-medium"
            )}
          >
            <item.icon size={18} />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t mt-auto">
        <Button variant="outline" className="w-full flex items-center gap-2" onClick={logout}>
          <LogIn size={16} />
          <span>Log out</span>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
