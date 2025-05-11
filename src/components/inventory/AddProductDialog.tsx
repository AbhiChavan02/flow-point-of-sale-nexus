
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import ProductForm from "./ProductForm";
import { Product } from "@/types";
import { useInventory } from "@/contexts/InventoryContext";
import { toast } from "sonner";

interface AddProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: Partial<Product>;
}

const AddProductDialog: React.FC<AddProductDialogProps> = ({ 
  open, 
  onOpenChange, 
  initialData 
}) => {
  const { addProduct } = useInventory();
  
  const handleSubmit = (data: Partial<Product>) => {
    // Generate an ID if it's a new product
    const newProduct: Product = {
      id: initialData?.id || `prod-${Date.now()}`,
      name: data.name || "",
      price: data.price || 0,
      categoryId: data.categoryId || "",
      stock: data.stock || 0,
      reorderLevel: data.reorderLevel || 5,
      taxRate: data.taxRate || 0,
      isService: data.isService || false,
      sku: data.sku || undefined,
      barcode: data.barcode || undefined,
      image: data.image || undefined,
      discountedPrice: data.discountedPrice
    };
    
    addProduct(newProduct);
    onOpenChange(false);
    toast.success(`Product ${initialData ? "updated" : "created"} successfully!`);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl dark:bg-gray-800 dark:border-gray-700 flex flex-col max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="dark:text-white">
            {initialData ? "Edit Product" : "Add New Product"}
          </DialogTitle>
          <DialogDescription className="dark:text-gray-400">
            {initialData 
              ? "Update the details of your existing product." 
              : "Fill in the details to create a new product in your inventory."}
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-1 pr-4 -mr-4">
          <div className="pb-6">
            <ProductForm 
              initialData={initialData} 
              onSubmit={handleSubmit}
              onCancel={() => onOpenChange(false)}
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductDialog;
