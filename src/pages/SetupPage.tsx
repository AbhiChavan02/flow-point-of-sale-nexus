
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useBusiness } from "@/contexts/BusinessContext";
import { useAuth } from "@/contexts/AuthContext";
import { BUSINESS_TYPES } from "@/config/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import Layout from "@/components/Layout";

const SetupPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { updateBusiness, setConfigured, business } = useBusiness();
  
  const [businessName, setBusinessName] = useState(business.name);
  const [businessType, setBusinessType] = useState<string>(business.type);
  const [taxRate, setTaxRate] = useState(business.taxRate.toString());
  const [currency, setCurrency] = useState(business.currency);
  
  useEffect(() => {
    // If not logged in, redirect to login
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!businessName) {
      toast.error("Please enter a business name");
      return;
    }
    
    updateBusiness({
      name: businessName,
      type: businessType as "cafe_restaurant" | "hotel_lodge" | "retail_grocery",
      taxRate: parseFloat(taxRate) || 0,
      currency: currency
    });
    
    setConfigured(true);
    toast.success("Business configuration saved!");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Business Setup</h1>
        
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Configure your business</CardTitle>
              <CardDescription>
                Set up your business details to customize the POS system for your needs
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Business Name */}
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name</Label>
                <Input
                  id="businessName"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="My Business"
                />
              </div>
              
              {/* Business Type */}
              <div className="space-y-2">
                <Label>Business Type</Label>
                <RadioGroup 
                  value={businessType} 
                  onValueChange={setBusinessType}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2"
                >
                  {BUSINESS_TYPES.map((type) => (
                    <div key={type.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={type.id} id={type.id} />
                      <Label htmlFor={type.id} className="cursor-pointer">{type.name}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              {/* Tax Rate */}
              <div className="space-y-2">
                <Label htmlFor="taxRate">Default Tax Rate (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                />
              </div>
              
              {/* Currency */}
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Input
                  id="currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  placeholder="USD"
                />
              </div>
            </CardContent>
            
            <CardFooter>
              <Button type="submit" className="w-full">
                Save and Continue
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default SetupPage;
