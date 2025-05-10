
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

export type SubscriptionTier = "free" | "basic" | "premium" | "enterprise";
export type SubscriptionPeriod = "monthly" | "quarterly" | "yearly";

export interface SubscriptionPlan {
  id: string;
  name: string;
  tier: SubscriptionTier;
  price: {
    monthly: number;
    quarterly: number;
    yearly: number;
  };
  features: string[];
  isPopular?: boolean;
}

interface SubscriptionContextType {
  currentPlan: SubscriptionPlan | null;
  isSubscribed: boolean;
  subscriptionPeriod: SubscriptionPeriod;
  allPlans: SubscriptionPlan[];
  expiryDate: Date | null;
  setSubscriptionPeriod: (period: SubscriptionPeriod) => void;
  subscribe: (planId: string, period: SubscriptionPeriod) => void;
  cancelSubscription: () => void;
  getPeriodPrice: (plan: SubscriptionPlan) => number;
}

const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Free Plan",
    tier: "free",
    price: {
      monthly: 0,
      quarterly: 0,
      yearly: 0
    },
    features: [
      "Basic POS functionality", 
      "Up to 50 products", 
      "Single user account",
      "Daily transaction reports"
    ],
  },
  {
    id: "basic",
    name: "Basic",
    tier: "basic",
    price: {
      monthly: 29.99,
      quarterly: 79.99,
      yearly: 299.99
    },
    features: [
      "Everything in Free",
      "Unlimited products", 
      "Up to 3 user accounts", 
      "Weekly reports",
      "Basic inventory management"
    ],
  },
  {
    id: "premium",
    name: "Premium",
    tier: "premium",
    price: {
      monthly: 49.99,
      quarterly: 134.99,
      yearly: 499.99
    },
    features: [
      "Everything in Basic", 
      "Up to 10 user accounts",
      "Advanced inventory management",
      "Customer management",
      "Advanced analytics and reports",
      "Email support"
    ],
    isPopular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tier: "enterprise",
    price: {
      monthly: 99.99,
      quarterly: 269.99,
      yearly: 999.99
    },
    features: [
      "Everything in Premium",
      "Unlimited user accounts",
      "Multi-location support",
      "Custom reports",
      "API access",
      "Dedicated support",
      "Advanced security features"
    ],
  }
];

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlan | null>(null);
  const [subscriptionPeriod, setSubscriptionPeriod] = useState<SubscriptionPeriod>("monthly");
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);
  
  useEffect(() => {
    // Load saved subscription data from localStorage
    const savedPlanId = localStorage.getItem("subscription_plan_id");
    const savedPeriod = localStorage.getItem("subscription_period") as SubscriptionPeriod;
    const savedExpiryDate = localStorage.getItem("subscription_expiry");
    
    if (savedPeriod && ["monthly", "quarterly", "yearly"].includes(savedPeriod)) {
      setSubscriptionPeriod(savedPeriod);
    }
    
    if (savedPlanId) {
      const plan = SUBSCRIPTION_PLANS.find(p => p.id === savedPlanId) || null;
      setCurrentPlan(plan);
    } else {
      // Default to free plan
      setCurrentPlan(SUBSCRIPTION_PLANS[0]);
    }
    
    if (savedExpiryDate) {
      setExpiryDate(new Date(savedExpiryDate));
    }
  }, []);
  
  const getPeriodPrice = (plan: SubscriptionPlan): number => {
    return plan.price[subscriptionPeriod];
  };
  
  const subscribe = (planId: string, period: SubscriptionPeriod) => {
    const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
    if (!plan) return;
    
    // In a real app, this would connect to Stripe or another payment processor
    // For now, we'll simulate a successful subscription
    setCurrentPlan(plan);
    setSubscriptionPeriod(period);
    
    // Set expiry date based on period
    const expiryDate = new Date();
    if (period === "monthly") {
      expiryDate.setMonth(expiryDate.getMonth() + 1);
    } else if (period === "quarterly") {
      expiryDate.setMonth(expiryDate.getMonth() + 3);
    } else if (period === "yearly") {
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    }
    
    setExpiryDate(expiryDate);
    
    // Save to localStorage
    localStorage.setItem("subscription_plan_id", plan.id);
    localStorage.setItem("subscription_period", period);
    localStorage.setItem("subscription_expiry", expiryDate.toISOString());
    
    toast.success(`Successfully subscribed to ${plan.name} ${period} plan!`);
  };
  
  const cancelSubscription = () => {
    // In a real app, this would connect to your payment processor
    // For now, we'll set back to free plan
    const freePlan = SUBSCRIPTION_PLANS.find(p => p.id === "free") || null;
    setCurrentPlan(freePlan);
    setExpiryDate(null);
    
    // Update localStorage
    localStorage.setItem("subscription_plan_id", "free");
    localStorage.removeItem("subscription_expiry");
    
    toast.success("Subscription canceled successfully");
  };
  
  return (
    <SubscriptionContext.Provider 
      value={{ 
        currentPlan, 
        isSubscribed: currentPlan?.tier !== "free", 
        subscriptionPeriod,
        setSubscriptionPeriod,
        allPlans: SUBSCRIPTION_PLANS,
        expiryDate,
        subscribe,
        cancelSubscription,
        getPeriodPrice
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = (): SubscriptionContextType => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
};
