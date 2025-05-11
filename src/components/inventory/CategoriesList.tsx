
import React, { useState } from "react";
import { useInventory } from "@/contexts/InventoryContext";
import { Category } from "@/types";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import CategoryDialog from "./CategoryDialog";

interface CategoriesListProps {
  onOpenCategoryDialog: (category?: Category) => void;
}

const CategoriesList: React.FC<CategoriesListProps> = ({ onOpenCategoryDialog }) => {
  const { products, categories, deleteCategory } = useInventory();

  // Delete confirmation
  const handleDeleteCategory = (categoryId: string) => {
    // Check if category is in use
    const productsUsingCategory = products.filter(p => p.categoryId === categoryId);
    
    if (productsUsingCategory.length > 0) {
      toast.error(`Cannot delete: Category is used by ${productsUsingCategory.length} products`);
      return;
    }
    
    if (window.confirm("Are you sure you want to delete this category?")) {
      deleteCategory(categoryId);
      toast.success("Category deleted successfully");
    }
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Category Name</TableHead>
            <TableHead>Parent Category</TableHead>
            <TableHead>Products</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                No categories found. Add your first category to get started.
              </TableCell>
            </TableRow>
          ) : (
            categories.map(category => {
              // Find parent category name
              const parentCategory = categories.find(c => c.id === category.parentId);
              
              // Count products in this category
              const productCount = products.filter(p => p.categoryId === category.id).length;
              
              return (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{parentCategory?.name || "None"}</TableCell>
                  <TableCell>{productCount}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => onOpenCategoryDialog(category)}>
                      <Edit size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-red-500"
                      onClick={() => handleDeleteCategory(category.id)}
                      disabled={productCount > 0}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CategoriesList;
