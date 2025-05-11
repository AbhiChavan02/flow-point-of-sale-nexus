
import React, { useState } from "react";
import { Category } from "@/types";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import Header from "@/components/Header";
import Layout from "@/components/Layout";
import ProductsList from "@/components/inventory/ProductsList";
import CategoriesList from "@/components/inventory/CategoriesList";
import CategoryDialog from "@/components/inventory/CategoryDialog";

const InventoryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("products");
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  // Category dialog handlers
  const handleOpenCategoryDialog = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
    } else {
      setEditingCategory(null);
    }
    setIsCategoryDialogOpen(true);
  };
  
  return (
    <Layout>
      <Header title="Inventory Management" />
      
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
            </TabsList>
            
            {activeTab === "products" ? (
              <Button 
                className="flex items-center gap-2"
                onClick={() => setIsProductDialogOpen(true)}
              >
                <Plus size={16} />
                <span>Add Product</span>
              </Button>
            ) : (
              <Button 
                className="flex items-center gap-2"
                onClick={() => handleOpenCategoryDialog()}
              >
                <Plus size={16} />
                <span>Add Category</span>
              </Button>
            )}
          </div>
          
          <TabsContent value="products" className="mt-0">
            <ProductsList />
          </TabsContent>
          
          <TabsContent value="categories" className="mt-0">
            <CategoriesList onOpenCategoryDialog={handleOpenCategoryDialog} />
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Category management dialog */}
      <CategoryDialog
        open={isCategoryDialogOpen}
        onOpenChange={setIsCategoryDialogOpen}
        editingCategory={editingCategory}
      />
    </Layout>
  );
};

export default InventoryPage;
