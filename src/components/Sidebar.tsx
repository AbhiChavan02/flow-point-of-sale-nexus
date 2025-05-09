
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
  BarChart
} from "lucide-react";

const Sidebar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  
  const handleLogout = () => {
    logout();
  };
  
  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "POS", path: "/pos", icon: <Store size={20} /> },
    { name: "Inventory", path: "/inventory", icon: <Package size={20} /> },
    { name: "Payments", path: "/payments", icon: <CreditCard size={20} /> },
    { name: "Reports", path: "/reports", icon: <BarChart size={20} /> },
    { name: "Users", path: "/users", icon: <Users size={20} /> },
    { name: "Settings", path: "/settings", icon: <Settings size={20} /> }
  ];

  return (
    <div className="min-w-60 bg-white border-r h-screen flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold">POS System</h1>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive
                    ? "bg-gray-100 text-gray-900 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`
              }
            >
              <div className="mr-3 text-gray-500">{item.icon}</div>
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
      
      <div className="p-4 border-t">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 rounded-full bg-gray-300 mr-2"></div>
          <div>
            <p className="text-sm font-medium">{currentUser?.name}</p>
            <p className="text-xs text-gray-500">{currentUser?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-3 py-2 text-sm text-red-600 rounded-md hover:bg-red-50 transition-colors"
        >
          <LogOut size={16} className="mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
