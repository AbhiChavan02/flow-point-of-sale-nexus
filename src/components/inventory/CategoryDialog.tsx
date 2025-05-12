
import React, { useEffect, useState } from "react";
import { Category } from "@/types";
import { useInventory } from "@/contexts/InventoryContext";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingCategory: Category | null;
}

const CategoryDialog: React.FC<CategoryDialogProps> = ({ 
  open, 
  onOpenChange,
  editingCategory
}) => {
  const { categories, addCategory, updateCategory } = useInventory();
  
  const [categoryForm, setCategoryForm] = useState<{
    id: string;
    name: string;
    parentId?: string;
  }>({
    id: "",
    name: "",
    parentId: ""
  });
  
  // Reset and load category data when the editingCategory changes
  useEffect(() => {
    if (editingCategory) {
      setCategoryForm({
        ...editingCategory
      });
    } else {
      setCategoryForm({
        id: "",
        name: "",
        parentId: ""
      });
    }
  }, [editingCategory, open]);
  
  // Handle form submission
  const handleSubmit = () => {
    if (!categoryForm.name) {
      toast.error("Category name is required");
      return;
    }
    
    const categoryData: Category = {
      ...categoryForm
    };
    
    if (editingCategory) {
      updateCategory(editingCategory.id, categoryData);
      toast.success("Category updated successfully");
    } else {
      categoryData.id = `category-${Date.now()}`;
      addCategory(categoryData);
      toast.success("Category added successfully");
    }
    
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
          <DialogDescription>
            {editingCategory ? "Modify category details below" : "Create a new product category"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="categoryName">Category Name *</Label>
            <Input
              id="categoryName"
              value={categoryForm.name}
              onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Category name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="parentCategory">Parent Category (Optional)</Label>
            <Select 
              value={categoryForm.parentId || "none"}
              onValueChange={(value) => setCategoryForm(prev => ({ 
                ...prev, 
                parentId: value === "none" ? undefined : value 
              }))}
            >
              <SelectTrigger id="parentCategory">
                <SelectValue placeholder="None (Top Level)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None (Top Level)</SelectItem>
                {categories
                  .filter(c => c.id !== categoryForm.id)
                  .map(category => (
                    <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit}>{editingCategory ? "Update Category" : "Add Category"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryDialog;
