
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useBusiness } from "@/contexts/BusinessContext";
import Sidebar from "@/components/Sidebar";
import { Navigate } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, requireAuth = true }) => {
  const { currentUser, isLoading } = useAuth();
  const { isConfigured } = useBusiness();
  
  // Handle authentication check
  if (requireAuth && !isLoading && !currentUser) {
    return <Navigate to="/login" />;
  }
  
  // When logged in but business not configured
  if (requireAuth && currentUser && !isConfigured) {
    return <Navigate to="/setup" />;
  }
  
  // If still loading, show a loading screen
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Main layout with sidebar
  if (requireAuth && currentUser) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    );
  }
  
  // For non-authenticated pages (like login)
  return <div className="min-h-screen bg-gray-50">{children}</div>;
};

export default Layout;
