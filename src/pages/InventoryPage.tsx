
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
import AddProductDialog from "@/components/inventory/AddProductDialog";
import { useIsMobile } from "@/hooks/use-mobile";

const InventoryPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("products");
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const isMobile = useIsMobile();
  
  // Category dialog handlers
  const handleOpenCategoryDialog = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
    } else {
      setEditingCategory(null);
    }
    setIsCategoryDialogOpen(true);
  };

  const handleAddButtonClick = () => {
    if (activeTab === "products") {
      setIsProductDialogOpen(true);
    } else {
      handleOpenCategoryDialog();
    }
  };
  
  return (
    <Layout>
      <Header title="Inventory Management">
        <Button 
          className="ml-4 flex items-center gap-2"
          onClick={handleAddButtonClick}
        >
          <Plus size={16} />
          <span>{isMobile ? "Add" : activeTab === "products" ? "Add Product" : "Add Category"}</span>
        </Button>
      </Header>
      
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
            </TabsList>
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
      
      {/* Product dialog */}
      <AddProductDialog 
        open={isProductDialogOpen}
        onOpenChange={setIsProductDialogOpen}
      />
    </Layout>
  );
};

export default InventoryPage;
