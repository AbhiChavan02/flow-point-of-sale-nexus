
import React, { useState } from "react";
import Layout from "@/components/Layout";
import Header from "@/components/Header";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  useSubscription, 
  SubscriptionPlan, 
  SubscriptionPeriod 
} from "@/contexts/SubscriptionContext";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

const SubscriptionPage: React.FC = () => {
  const { 
    allPlans, 
    currentPlan, 
    subscriptionPeriod, 
    setSubscriptionPeriod, 
    expiryDate,
    subscribe,
    cancelSubscription,
    getPeriodPrice 
  } = useSubscription();
  
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  
  const handleChangePeriod = (value: string) => {
    if (value === "monthly" || value === "quarterly" || value === "yearly") {
      setSubscriptionPeriod(value);
    }
  };
  
  const handleSubscribe = () => {
    if (!selectedPlanId) {
      toast.error("Please select a plan first");
      return;
    }
    
    subscribe(selectedPlanId, subscriptionPeriod);
  };
  
  // Calculate savings percentage compared to monthly
  const calculateSavings = (plan: SubscriptionPlan): string => {
    if (plan.tier === "free") return "";
    
    if (subscriptionPeriod === "quarterly") {
      const monthlyCost = plan.price.monthly * 3;
      const quarterlyCost = plan.price.quarterly;
      const savings = ((monthlyCost - quarterlyCost) / monthlyCost) * 100;
      return savings > 0 ? `Save ${Math.round(savings)}%` : "";
    }
    
    if (subscriptionPeriod === "yearly") {
      const monthlyCost = plan.price.monthly * 12;
      const yearlyCost = plan.price.yearly;
      const savings = ((monthlyCost - yearlyCost) / monthlyCost) * 100;
      return savings > 0 ? `Save ${Math.round(savings)}%` : "";
    }
    
    return "";
  };

  return (
    <Layout>
      <Header title="Subscription Plans" />
      
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Manage Your Subscription</h2>
          <p className="text-muted-foreground">
            Choose the plan that works best for your business
          </p>
        </div>
        
        {currentPlan && currentPlan.tier !== "free" && (
          <Card className="mb-8 border-green-500 dark:border-green-700 bg-green-50/30 dark:bg-green-900/10">
            <CardHeader>
              <CardTitle>Current Subscription</CardTitle>
              <CardDescription>
                Your active subscription details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Plan</p>
                  <p className="text-xl">{currentPlan.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Billing Period</p>
                  <p className="text-xl capitalize">{subscriptionPeriod}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Amount</p>
                  <p className="text-xl">${getPeriodPrice(currentPlan).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Expires On</p>
                  <p className="text-xl">
                    {expiryDate ? format(expiryDate, 'MMM dd, yyyy') : 'N/A'}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="destructive" 
                onClick={cancelSubscription}
              >
                Cancel Subscription
              </Button>
            </CardFooter>
          </Card>
        )}

        <div className="flex justify-center mb-8">
          <ToggleGroup 
            type="single" 
            value={subscriptionPeriod} 
            onValueChange={handleChangePeriod} 
            className="border rounded-lg p-1"
          >
            <ToggleGroupItem value="monthly" className="text-sm px-4">
              Monthly
            </ToggleGroupItem>
            <ToggleGroupItem value="quarterly" className="text-sm px-4">
              Quarterly
            </ToggleGroupItem>
            <ToggleGroupItem value="yearly" className="text-sm px-4">
              Yearly
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {allPlans.map((plan) => {
            const isCurrentPlan = currentPlan?.id === plan.id;
            const price = getPeriodPrice(plan);
            const savings = calculateSavings(plan);
            
            return (
              <Card 
                key={plan.id}
                className={`relative overflow-hidden transition-all ${
                  selectedPlanId === plan.id 
                    ? "ring-2 ring-primary" 
                    : ""
                } ${
                  isCurrentPlan 
                    ? "border-green-500 dark:border-green-700" 
                    : ""
                } ${
                  plan.isPopular
                    ? "shadow-lg shadow-blue-100 dark:shadow-blue-900/30"
                    : ""
                }`}
              >
                {plan.isPopular && (
                  <Badge 
                    className="absolute top-0 right-0 rounded-bl-lg rounded-tr-none"
                    variant="default"
                  >
                    Most Popular
                  </Badge>
                )}
                {isCurrentPlan && (
                  <Badge 
                    className="absolute top-0 left-0 rounded-br-lg rounded-tl-none"
                    variant="outline"
                  >
                    Current Plan
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>
                    {plan.tier === "free" ? "Free forever" : "Paid subscription"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <p className="text-3xl font-bold">
                      ${price.toFixed(2)}
                      <span className="text-sm font-normal text-muted-foreground">
                        /{subscriptionPeriod.slice(0, 2)}
                      </span>
                    </p>
                    {savings && (
                      <Badge variant="secondary" className="mt-1">
                        {savings}
                      </Badge>
                    )}
                  </div>
                  <ul className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  {isCurrentPlan ? (
                    <Button variant="outline" className="w-full" disabled>
                      Current Plan
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => setSelectedPlanId(plan.id)} 
                      variant={selectedPlanId === plan.id ? "default" : "outline"}
                      className="w-full"
                    >
                      {selectedPlanId === plan.id ? "Selected" : "Select Plan"}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
        
        {selectedPlanId && selectedPlanId !== currentPlan?.id && (
          <div className="mt-8 flex justify-center">
            <Button 
              size="lg"
              onClick={handleSubscribe}
              className="px-8"
            >
              Subscribe Now
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SubscriptionPage;
