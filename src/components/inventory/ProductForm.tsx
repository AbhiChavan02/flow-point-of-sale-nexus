
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useForm, Controller } from "react-hook-form";
import { useInventory } from "@/contexts/InventoryContext";
import ProductImageUpload from "@/components/pos/ProductImageUpload";
import { Product } from "@/types";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProductFormProps {
  initialData?: Partial<Product>;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const { categories } = useInventory();
  const isMobile = useIsMobile();
  
  const { register, control, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      name: initialData?.name || "",
      price: initialData?.price || 0,
      categoryId: initialData?.categoryId || (categories[0]?.id || ""),
      stock: initialData?.stock || 0,
      reorderLevel: initialData?.reorderLevel || 5,
      taxRate: initialData?.taxRate || 0,
      isService: initialData?.isService || false,
      sku: initialData?.sku || "",
      barcode: initialData?.barcode || "",
      image: initialData?.image || ""
    }
  });
  
  const imageUrl = watch("image");
  
  const handleImageChange = (image: string) => {
    setValue("image", image);
  };
  
  const handleFormSubmit = (data: any) => {
    // Format numeric values
    const formattedData = {
      ...data,
      price: parseFloat(data.price),
      stock: parseInt(data.stock),
      reorderLevel: parseInt(data.reorderLevel),
      taxRate: parseFloat(data.taxRate)
    };
    
    onSubmit(formattedData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 relative">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-base">Product Name</Label>
            <Input 
              id="name" 
              {...register("name", { required: true })} 
              className="mt-1 p-3" 
              placeholder="Enter product name"
            />
          </div>
          
          <div>
            <Label htmlFor="price" className="text-base">Price</Label>
            <Input 
              id="price" 
              {...register("price", { required: true, min: 0 })} 
              type="number" 
              step="0.01"
              className="mt-1 p-3"
              placeholder="0.00"
            />
          </div>
          
          <div>
            <Label htmlFor="categoryId" className="text-base">Category</Label>
            <Controller
              control={control}
              name="categoryId"
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="mt-1 p-3">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.length ? categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    )) : (
                      <SelectItem value="default">Default Category</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          
          <div>
            <Label htmlFor="taxRate" className="text-base">Tax Rate (%)</Label>
            <Input 
              id="taxRate" 
              {...register("taxRate")} 
              type="number" 
              step="0.01"
              className="mt-1 p-3"
              placeholder="0.00"
            />
          </div>
          
          <div className="flex items-center space-x-2 mt-4">
            <Controller
              control={control}
              name="isService"
              render={({ field }) => (
                <Switch 
                  id="isService" 
                  checked={field.value} 
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label htmlFor="isService" className="text-base">This is a service (not physical product)</Label>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="image" className="text-base">Product Image</Label>
            <div className="mt-1">
              <ProductImageUpload 
                currentImage={imageUrl} 
                onImageChange={handleImageChange} 
              />
            </div>
          </div>
          
          <div className={!watch("isService") ? "block" : "hidden"}>
            <Label htmlFor="stock" className="text-base">Stock Quantity</Label>
            <Input 
              id="stock" 
              {...register("stock")} 
              type="number"
              className="mt-1 p-3"
              placeholder="0"
            />
          </div>
          
          <div className={!watch("isService") ? "block" : "hidden"}>
            <Label htmlFor="reorderLevel" className="text-base">Reorder Level</Label>
            <Input 
              id="reorderLevel" 
              {...register("reorderLevel")} 
              type="number"
              className="mt-1 p-3"
              placeholder="5"
            />
          </div>
          
          <div>
            <Label htmlFor="sku" className="text-base">SKU</Label>
            <Input 
              id="sku" 
              {...register("sku")} 
              className="mt-1 p-3"
              placeholder="Stock Keeping Unit"
            />
          </div>
          
          <div>
            <Label htmlFor="barcode" className="text-base">Barcode</Label>
            <Input 
              id="barcode" 
              {...register("barcode")} 
              className="mt-1 p-3"
              placeholder="Barcode"
            />
          </div>
        </div>
      </div>
      
      {/* Fixed position buttons at the bottom that are always visible */}
      <div className={`flex justify-end space-x-3 pt-4 ${isMobile ? 
        "sticky bottom-0 bg-background pb-4 border-t mt-4 pt-4 px-2 z-10" : 
        "sticky bottom-0 bg-background py-4 border-t mt-6 z-10"}`}>
        <Button type="button" variant="outline" onClick={onCancel} size="lg">
          Cancel
        </Button>
        <Button type="submit" size="lg">
          {initialData ? "Update Product" : "Add Product"}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
