
import React from "react";
import { CustomerInfo, PaymentMethod } from "@/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { User, Phone, DollarSign, CreditCard } from "lucide-react";
import { useBusiness } from "@/contexts/BusinessContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTheme } from "@/components/ThemeProvider";

const customerSchema = z.object({
  name: z.string().min(1, "Customer name is required"),
  phone: z.string().min(6, "Valid phone number required"),
});

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCompleteOrder: (paymentMethod: PaymentMethod, customerInfo: CustomerInfo) => void;
  itemCount: number;
  total: number;
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({ 
  open, 
  onOpenChange,
  onCompleteOrder,
  itemCount,
  total 
}) => {
  const { business } = useBusiness();
  const { theme } = useTheme();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState<string>("cash");
  
  const form = useForm<z.infer<typeof customerSchema>>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  const handleCompleteOrder = () => {
    form.handleSubmit((data) => {
      // Ensure data conforms to CustomerInfo type (both name and phone are guaranteed to be non-empty strings due to zod validation)
      const customerInfo: CustomerInfo = {
        name: data.name,
        phone: data.phone
      };
      onCompleteOrder(selectedPaymentMethod as PaymentMethod, customerInfo);
    })();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md dark:bg-gray-800 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="dark:text-white">Complete Payment</DialogTitle>
          <DialogDescription className="dark:text-gray-300">
            Enter customer information and select a payment method
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center dark:text-gray-300">
                    <User className="mr-2" size={16} /> Customer Name
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter customer name" 
                      {...field} 
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center dark:text-gray-300">
                    <Phone className="mr-2" size={16} /> Phone Number
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter phone number" 
                      {...field} 
                      className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <div className="py-4">
          <h3 className="font-semibold text-lg mb-1 dark:text-white">
            Total: {business.currency} {total.toFixed(2)}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {itemCount} items
          </p>
          
          <div className="mt-6">
            <RadioGroup 
              value={selectedPaymentMethod} 
              onValueChange={setSelectedPaymentMethod}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3 border rounded-md p-3 dark:border-gray-600 dark:bg-gray-700/50">
                <RadioGroupItem value="cash" id="cash" className="border-gray-400 dark:border-gray-500" />
                <Label htmlFor="cash" className="flex items-center cursor-pointer dark:text-gray-300">
                  <DollarSign className="mr-2" size={18} /> Cash
                </Label>
              </div>
              
              <div className="flex items-center space-x-3 border rounded-md p-3 dark:border-gray-600 dark:bg-gray-700/50">
                <RadioGroupItem value="card" id="card" className="border-gray-400 dark:border-gray-500" />
                <Label htmlFor="card" className="flex items-center cursor-pointer dark:text-gray-300">
                  <CreditCard className="mr-2" size={18} /> Card
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} variant="outline" className="dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">Cancel</Button>
          <Button onClick={handleCompleteOrder}>Complete Order</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
