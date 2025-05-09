
import React, { createContext, useState, useContext, useEffect } from "react";
import { Business } from "@/types";

const defaultBusiness: Business = {
  id: "default",
  name: "Flow POS Nexus",
  type: "retail_grocery",
  taxRate: 10,
  currency: "USD",
  printerEnabled: false
};

interface BusinessContextType {
  business: Business;
  updateBusiness: (updates: Partial<Business>) => void;
  isConfigured: boolean;
  setConfigured: (value: boolean) => void;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export const BusinessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [business, setBusiness] = useState<Business>(defaultBusiness);
  const [isConfigured, setIsConfigured] = useState(false);
  
  useEffect(() => {
    // Load from localStorage if available
    const savedBusiness = localStorage.getItem("pos_business");
    const configured = localStorage.getItem("pos_configured");
    
    if (savedBusiness) {
      try {
        setBusiness(JSON.parse(savedBusiness));
      } catch (error) {
        console.error("Error parsing saved business:", error);
      }
    }
    
    if (configured === "true") {
      setIsConfigured(true);
    }
  }, []);
  
  const updateBusiness = (updates: Partial<Business>) => {
    const updated = { ...business, ...updates };
    setBusiness(updated);
    localStorage.setItem("pos_business", JSON.stringify(updated));
  };
  
  const setConfigured = (value: boolean) => {
    setIsConfigured(value);
    localStorage.setItem("pos_configured", String(value));
  };
  
  return (
    <BusinessContext.Provider value={{ business, updateBusiness, isConfigured, setConfigured }}>
      {children}
    </BusinessContext.Provider>
  );
};

export const useBusiness = () => {
  const context = useContext(BusinessContext);
  if (context === undefined) {
    throw new Error("useBusiness must be used within a BusinessProvider");
  }
  return context;
};
