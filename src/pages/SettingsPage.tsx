
import React, { useState } from "react";
import { useBusiness } from "@/contexts/BusinessContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BUSINESS_TYPES } from "@/config/constants";
import { toast } from "sonner";
import Header from "@/components/Header";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, Printer, Save, Lock } from "lucide-react";

const SettingsPage: React.FC = () => {
  const { business, updateBusiness } = useBusiness();
  
  const [businessName, setBusinessName] = useState(business.name);
  const [businessType, setBusinessType] = useState<string>(business.type);
  const [taxRate, setTaxRate] = useState(business.taxRate.toString());
  const [currency, setCurrency] = useState(business.currency);
  const [address, setAddress] = useState(business.address || "");
  const [printerEnabled, setPrinterEnabled] = useState(business.printerEnabled);
  
  const handleSaveBusinessSettings = () => {
    if (!businessName) {
      toast.error("Business name is required");
      return;
    }
    
    updateBusiness({
      name: businessName,
      type: businessType as "cafe_restaurant" | "hotel_lodge" | "retail_grocery",
      taxRate: parseFloat(taxRate) || 0,
      currency,
      address,
      printerEnabled
    });
    
    toast.success("Business settings saved successfully");
  };
  
  const handleResetData = () => {
    // In a real app, this would have additional confirmation
    if (confirm("Are you sure you want to reset all data? This cannot be undone.")) {
      // Clear localStorage
      localStorage.removeItem("pos_products");
      localStorage.removeItem("pos_categories");
      localStorage.removeItem("pos_orders");
      
      toast.success("Data has been reset. Please refresh the page.");
    }
  };

  return (
    <Layout>
      <Header title="Settings" />
      
      <div className="p-6">
        <Tabs defaultValue="business">
          <TabsList className="mb-6">
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="business">
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Building size={20} />
                  <CardTitle>Business Information</CardTitle>
                </div>
                <CardDescription>
                  Configure your basic business details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                      id="businessName"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="Your Business Name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Business Type</Label>
                    <RadioGroup 
                      value={businessType} 
                      onValueChange={setBusinessType}
                      className="grid grid-cols-1 space-y-2"
                    >
                      {BUSINESS_TYPES.map((type) => (
                        <div key={type.id} className="flex items-center space-x-2">
                          <RadioGroupItem value={type.id} id={type.id} />
                          <Label htmlFor={type.id} className="cursor-pointer">{type.name}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Input
                      id="currency"
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      placeholder="USD"
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Business Address</Label>
                    <Input
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="123 Main St, City, Country"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveBusinessSettings} className="flex items-center gap-2">
                  <Save size={16} />
                  <span>Save Changes</span>
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Printer size={20} />
                  <CardTitle>Receipt & Printing</CardTitle>
                </div>
                <CardDescription>
                  Configure receipt settings and printing options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="printerEnabled"
                    checked={printerEnabled}
                    onCheckedChange={setPrinterEnabled}
                  />
                  <Label htmlFor="printerEnabled">Enable Printer</Label>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="receiptTemplate">Receipt Template</Label>
                  <Select value="default" disabled={!printerEnabled}>
                    <SelectTrigger id="receiptTemplate">
                      <SelectValue placeholder="Select template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default Template</SelectItem>
                      <SelectItem value="compact">Compact</SelectItem>
                      <SelectItem value="detailed">Detailed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="receiptFooter">Receipt Footer Message</Label>
                  <Input
                    id="receiptFooter"
                    placeholder="Thank you for your business!"
                    disabled={!printerEnabled}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveBusinessSettings} className="flex items-center gap-2">
                  <Save size={16} />
                  <span>Save Settings</span>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="system">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>
                  Configure system behavior and maintenance options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Data Management</Label>
                  <div className="flex items-center justify-between border p-4 rounded-md">
                    <div>
                      <h3 className="font-medium">Reset All Data</h3>
                      <p className="text-sm text-gray-500">Clear all products, categories, and orders</p>
                    </div>
                    <Button variant="destructive" onClick={handleResetData}>Reset Data</Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Backup & Restore</Label>
                  <div className="flex items-center justify-between border p-4 rounded-md">
                    <div>
                      <h3 className="font-medium">Backup Data</h3>
                      <p className="text-sm text-gray-500">Download a backup of your POS data</p>
                    </div>
                    <Button variant="outline">Download</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Lock size={20} />
                  <CardTitle>Security Settings</CardTitle>
                </div>
                <CardDescription>
                  Manage account security and permissions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" placeholder="Enter current password" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" placeholder="Enter new password" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" placeholder="Confirm new password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Change Password</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default SettingsPage;
