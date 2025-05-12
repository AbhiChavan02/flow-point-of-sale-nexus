
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useBusiness } from "@/contexts/BusinessContext";
import Sidebar from "@/components/Sidebar";
import { Navigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, requireAuth = true }) => {
  const { currentUser, isLoading } = useAuth();
  const { isConfigured } = useBusiness();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Handle authentication check
  if (requireAuth && !isLoading && !currentUser) {
    return <Navigate to="/login" />;
  }
  
  // When logged in but business not configured
  if (requireAuth && currentUser && !isConfigured && window.location.pathname !== "/setup") {
    return <Navigate to="/setup" />;
  }
  
  // If still loading, show a loading screen
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background dark:bg-gray-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg dark:text-white">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Main layout with sidebar
  if (requireAuth && currentUser) {
    if (isMobile) {
      return (
        <div className="flex h-screen overflow-hidden">
          {/* Mobile Sidebar in Sheet */}
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="fixed top-3 left-3 z-20"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu size={24} />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72">
              <Sidebar onNavClick={() => setSidebarOpen(false)} />
            </SheetContent>
          </Sheet>
          
          {/* Main Content */}
          <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950 pt-14">
            {children}
          </main>
        </div>
      );
    }
    
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950">
          {children}
        </main>
      </div>
    );
  }
  
  // For non-authenticated pages (like login)
  return <div className="min-h-screen bg-gray-50 dark:bg-gray-950">{children}</div>;
};

export default Layout;
