
import React, { useState } from "react";
import { useInventory } from "@/contexts/InventoryContext";
import { useBusiness } from "@/contexts/BusinessContext";
import { Product, Category } from "@/types";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Search, Plus, Edit, Trash2, Image } from "lucide-react";
import Header from "@/components/Header";
import Layout from "@/components/Layout";
import AddProductDialog from "@/components/inventory/AddProductDialog";
import ProductImageUpload from "@/components/pos/ProductImageUpload";

const InventoryPage: React.FC = () => {
  const { products, categories, deleteProduct, addCategory, updateCategory, deleteCategory } = useInventory();
  const { business } = useBusiness();

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("products");
  
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Category form state
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState<{
    id: string;
    name: string;
    parentId?: string;
  }>({
    id: "",
    name: "",
    parentId: ""
  });
  
  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.barcode?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handle category form submission
  const handleCategorySubmit = () => {
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
    
    setIsCategoryDialogOpen(false);
    resetCategoryForm();
  };
  
  // Reset forms
  const resetCategoryForm = () => {
    setCategoryForm({
      id: "",
      name: "",
      parentId: ""
    });
    setEditingCategory(null);
  };
  
  // Edit product
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsProductDialogOpen(true);
  };
  
  // Edit category
  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({
      ...category
    });
    setIsCategoryDialogOpen(true);
  };
  
  // Delete confirmation
  const handleDeleteProduct = (productId: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProduct(productId);
      toast.success("Product deleted successfully");
    }
  };
  
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

  // Close product dialog & reset
  const handleCloseProductDialog = () => {
    setIsProductDialogOpen(false);
    setEditingProduct(null);
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
              <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus size={16} />
                    <span>Add Category</span>
                  </Button>
                </DialogTrigger>
                
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
                        value={categoryForm.parentId || ""}
                        onValueChange={(value) => setCategoryForm(prev => ({ ...prev, parentId: value || undefined }))}
                      >
                        <SelectTrigger id="parentCategory">
                          <SelectValue placeholder="None (Top Level)" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">None (Top Level)</SelectItem>
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
                    <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleCategorySubmit}>{editingCategory ? "Update Category" : "Add Category"}</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
          
          <TabsContent value="products" className="mt-0">
            <div className="flex items-center mb-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price ({business.currency})</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        No products found. Add your first product to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map(product => {
                      // Find category name
                      const category = categories.find(c => c.id === product.categoryId);
                      
                      return (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>
                            {product.image ? (
                              <div className="w-12 h-12 rounded-md border overflow-hidden bg-gray-100">
                                <img 
                                  src={product.image} 
                                  alt={product.name} 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-12 h-12 flex items-center justify-center border rounded-md bg-gray-100 text-gray-400">
                                <Image size={18} />
                              </div>
                            )}
                          </TableCell>
                          <TableCell>{category?.name || "Uncategorized"}</TableCell>
                          <TableCell>
                            {product.discountedPrice ? (
                              <>
                                <span className="font-medium">{product.discountedPrice.toFixed(2)}</span>
                                <span className="text-gray-400 line-through ml-2">{product.price.toFixed(2)}</span>
                              </>
                            ) : (
                              product.price.toFixed(2)
                            )}
                          </TableCell>
                          <TableCell>
                            {product.isService ? (
                              <span className="text-gray-500">N/A</span>
                            ) : (
                              <span className={product.stock <= product.reorderLevel ? "text-red-500 font-medium" : ""}>
                                {product.stock}
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            {product.isService ? "Service" : "Product"}
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEditProduct(product)}>
                              <Edit size={16} />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDeleteProduct(product.id)}>
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
          </TabsContent>
          
          <TabsContent value="categories" className="mt-0">
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
                            <Button variant="ghost" size="icon" onClick={() => handleEditCategory(category)}>
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
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Add/Edit product dialog using the AddProductDialog component */}
      <AddProductDialog
        open={isProductDialogOpen}
        onOpenChange={handleCloseProductDialog}
        initialData={editingProduct || undefined}
      />
    </Layout>
  );
};

export default InventoryPage;
