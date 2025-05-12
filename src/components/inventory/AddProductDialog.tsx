
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import ProductForm from "./ProductForm";
import { Product } from "@/types";
import { useInventory } from "@/contexts/InventoryContext";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const { addProduct, updateProduct } = useInventory();
  const isMobile = useIsMobile();
  
  const handleSubmit = (data: Partial<Product>) => {
    // Generate an ID if it's a new product
    const productData: Product = {
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
    
    if (initialData?.id) {
      // Update existing product
      updateProduct(initialData.id, productData);
      toast.success("Product updated successfully!");
    } else {
      // Add new product
      addProduct(productData);
      toast.success("Product created successfully!");
    }
    
    onOpenChange(false);
  };
  
  // Render a Sheet on mobile and Dialog on desktop
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="h-[90vh] sm:h-[90vh] p-0 flex flex-col">
          <SheetHeader className="px-6 pt-6">
            <SheetTitle>
              {initialData ? "Edit Product" : "Add New Product"}
            </SheetTitle>
            <SheetDescription>
              {initialData 
                ? "Update the details of your existing product." 
                : "Fill in the details to create a new product in your inventory."}
            </SheetDescription>
          </SheetHeader>
          
          <ScrollArea className="flex-1 px-6 overflow-y-auto">
            <div className="pb-24 pt-2">
              <ProductForm 
                initialData={initialData} 
                onSubmit={handleSubmit}
                onCancel={() => onOpenChange(false)}
              />
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    );
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl lg:max-w-5xl dark:bg-gray-800 dark:border-gray-700 flex flex-col max-h-[90vh] h-[85vh] w-11/12">
        <DialogHeader>
          <DialogTitle className="dark:text-white text-xl">
            {initialData ? "Edit Product" : "Add New Product"}
          </DialogTitle>
          <DialogDescription className="dark:text-gray-400">
            {initialData 
              ? "Update the details of your existing product." 
              : "Fill in the details to create a new product in your inventory."}
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-1 pr-4 -mr-4 overflow-y-auto">
          <div className="pb-24">
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
