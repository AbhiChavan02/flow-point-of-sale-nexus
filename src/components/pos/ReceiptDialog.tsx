
import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Link, Share } from "lucide-react";
import { toast } from "sonner";

interface ReceiptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  receiptUrl: string;
  onNewOrder: () => void;
}

const ReceiptDialog: React.FC<ReceiptDialogProps> = ({ 
  open, 
  onOpenChange,
  receiptUrl,
  onNewOrder
}) => {
  const handleShareReceipt = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Payment Receipt",
          text: "Your receipt",
          url: receiptUrl,
        });
        toast.success("Receipt shared successfully");
      } catch (error) {
        console.error("Error sharing receipt:", error);
        toast.error("Failed to share receipt");
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      copyReceiptLink();
    }
  };
  
  const copyReceiptLink = () => {
    navigator.clipboard.writeText(receiptUrl);
    toast.success("Receipt link copied to clipboard");
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Payment Successful</DialogTitle>
          <DialogDescription>
            The order has been completed successfully. Share the receipt with the customer.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="border rounded-md p-4 mb-4">
            <h3 className="font-medium mb-1">Receipt Link</h3>
            <div className="flex items-center">
              <Input 
                value={receiptUrl} 
                readOnly 
                className="mr-2 font-mono text-sm"
              />
              <Button 
                variant="outline" 
                size="sm" 
                onClick={copyReceiptLink}
              >
                <Link size={16} />
              </Button>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Button 
              onClick={handleShareReceipt} 
              className="w-full"
            >
              <Share className="mr-2" size={16} />
              Share Receipt
            </Button>
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            onClick={() => {
              onOpenChange(false);
              onNewOrder();
            }}
          >
            New Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReceiptDialog;
