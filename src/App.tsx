
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { BusinessProvider } from "@/contexts/BusinessContext";
import { InventoryProvider } from "@/contexts/InventoryContext";
import { OrderProvider } from "@/contexts/OrderContext";

import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import SetupPage from "./pages/SetupPage";
import DashboardPage from "./pages/DashboardPage";
import POSPage from "./pages/POSPage";
import InventoryPage from "./pages/InventoryPage";
import PaymentsPage from "./pages/PaymentsPage";
import UsersPage from "./pages/UsersPage";
import SettingsPage from "./pages/SettingsPage";
import NotFoundPage from "./pages/NotFoundPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <BusinessProvider>
          <InventoryProvider>
            <OrderProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/setup" element={<SetupPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/pos" element={<POSPage />} />
                  <Route path="/inventory" element={<InventoryPage />} />
                  <Route path="/payments" element={<PaymentsPage />} />
                  <Route path="/users" element={<UsersPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </BrowserRouter>
            </OrderProvider>
          </InventoryProvider>
        </BusinessProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
