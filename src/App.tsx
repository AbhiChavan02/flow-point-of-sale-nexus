
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from 'sonner';

// Pages
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import SetupPage from "./pages/SetupPage";
import DashboardPage from "./pages/DashboardPage";
import POSPage from "./pages/POSPage";
import InventoryPage from "./pages/InventoryPage";
import UsersPage from "./pages/UsersPage";
import SettingsPage from "./pages/SettingsPage";
import PaymentsPage from "./pages/PaymentsPage";
import ReportsPage from "./pages/ReportsPage";
import SubscriptionPage from "./pages/SubscriptionPage";
import NotFoundPage from "./pages/NotFoundPage";

// Context Providers
import { AuthProvider } from "./contexts/AuthContext";
import { BusinessProvider } from "./contexts/BusinessContext";
import { InventoryProvider } from "./contexts/InventoryContext";
import { OrderProvider } from "./contexts/OrderContext";
import { ThemeProvider } from "./components/ThemeProvider";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";

import "./App.css";

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <BusinessProvider>
            <InventoryProvider>
              <OrderProvider>
                <SubscriptionProvider>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/setup" element={<SetupPage />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/pos" element={<POSPage />} />
                    <Route path="/inventory" element={<InventoryPage />} />
                    <Route path="/users" element={<UsersPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/payments" element={<PaymentsPage />} />
                    <Route path="/reports" element={<ReportsPage />} />
                    <Route path="/subscription" element={<SubscriptionPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                  <Toaster />
                  <SonnerToaster position="top-right" />
                </SubscriptionProvider>
              </OrderProvider>
            </InventoryProvider>
          </BusinessProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
