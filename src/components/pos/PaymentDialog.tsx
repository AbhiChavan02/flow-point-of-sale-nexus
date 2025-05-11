
import React from "react";
import { CustomerInfo, PaymentMethod } from "@/types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { User, Phone, DollarSign, CreditCard } from "lucide-react";
import { useBusiness } from "@/contexts/BusinessContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Payment</DialogTitle>
          <DialogDescription>
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
                  <FormLabel className="flex items-center">
                    <User className="mr-2" size={16} /> Customer Name
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter customer name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <Phone className="mr-2" size={16} /> Phone Number
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter phone number" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>

        <div className="py-4">
          <h3 className="font-semibold text-lg mb-1">
            Total: {business.currency} {total.toFixed(2)}
          </h3>
          <p className="text-gray-500 text-sm">
            {itemCount} items
          </p>
          
          <div className="mt-6">
            <RadioGroup 
              value={selectedPaymentMethod} 
              onValueChange={setSelectedPaymentMethod}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3 border rounded-md p-3">
                <RadioGroupItem value="cash" id="cash" />
                <Label htmlFor="cash" className="flex items-center cursor-pointer">
                  <DollarSign className="mr-2" size={18} /> Cash
                </Label>
              </div>
              
              <div className="flex items-center space-x-3 border rounded-md p-3">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex items-center cursor-pointer">
                  <CreditCard className="mr-2" size={18} /> Card
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} variant="outline">Cancel</Button>
          <Button onClick={handleCompleteOrder}>Complete Order</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
