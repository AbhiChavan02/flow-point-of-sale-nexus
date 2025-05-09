
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
import { Search, Plus, Edit, Trash2 } from "lucide-react";
import Header from "@/components/Header";
import Layout from "@/components/Layout";

const InventoryPage: React.FC = () => {
  const { products, categories, addProduct, updateProduct, deleteProduct, addCategory, updateCategory, deleteCategory } = useInventory();
  const { business } = useBusiness();

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("products");
  
  // Product form state
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    id: "",
    name: "",
    categoryId: "",
    price: 0,
    discountedPrice: 0,
    taxRate: business.taxRate,
    stock: 0,
    reorderLevel: 0,
    sku: "",
    barcode: "",
    isService: false,
    image: "/placeholder.svg" // Default image
  });
  
  // Category form state
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState({
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
  
  // Handle product form submission
  const handleProductSubmit = () => {
    if (!productForm.name) {
      toast.error("Product name is required");
      return;
    }
    
    if (!productForm.categoryId) {
      toast.error("Category is required");
      return;
    }
    
    if (productForm.price <= 0 && !productForm.isService) {
      toast.error("Price must be greater than zero");
      return;
    }
    
    const productData: Product = {
      ...productForm,
      price: parseFloat(productForm.price.toString()),
      discountedPrice: productForm.discountedPrice ? parseFloat(productForm.discountedPrice.toString()) : undefined,
      taxRate: parseFloat(productForm.taxRate.toString()),
      stock: parseInt(productForm.stock.toString()),
      reorderLevel: parseInt(productForm.reorderLevel.toString())
    };
    
    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
      toast.success("Product updated successfully");
    } else {
      productData.id = `product-${Date.now()}`;
      addProduct(productData);
      toast.success("Product added successfully");
    }
    
    setIsProductDialogOpen(false);
    resetProductForm();
  };
  
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
  const resetProductForm = () => {
    setProductForm({
      id: "",
      name: "",
      categoryId: "",
      price: 0,
      discountedPrice: 0,
      taxRate: business.taxRate,
      stock: 0,
      reorderLevel: 0,
      sku: "",
      barcode: "",
      isService: false,
      image: "/placeholder.svg"
    });
    setEditingProduct(null);
  };
  
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
    setProductForm({
      ...product
    });
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
              <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus size={16} />
                    <span>Add Product</span>
                  </Button>
                </DialogTrigger>
                
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
                    <DialogDescription>
                      {editingProduct ? "Modify product details below" : "Enter product details to add to inventory"}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        value={productForm.name}
                        onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Product name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select 
                        value={productForm.categoryId}
                        onValueChange={(value) => setProductForm(prev => ({ ...prev, categoryId: value }))}
                      >
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="price">Price ({business.currency})</Label>
                      <Input
                        id="price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={productForm.price}
                        onChange={(e) => setProductForm(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                        placeholder="0.00"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="discountedPrice">Discounted Price ({business.currency}) (Optional)</Label>
                      <Input
                        id="discountedPrice"
                        type="number"
                        min="0"
                        step="0.01"
                        value={productForm.discountedPrice || ""}
                        onChange={(e) => setProductForm(prev => ({ 
                          ...prev, 
                          discountedPrice: e.target.value ? parseFloat(e.target.value) : 0
                        }))}
                        placeholder="0.00"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="taxRate">Tax Rate (%)</Label>
                      <Input
                        id="taxRate"
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={productForm.taxRate}
                        onChange={(e) => setProductForm(prev => ({ ...prev, taxRate: parseFloat(e.target.value) }))}
                        placeholder="0"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="stock">Stock Quantity</Label>
                      <Input
                        id="stock"
                        type="number"
                        min="0"
                        step="1"
                        value={productForm.stock}
                        onChange={(e) => setProductForm(prev => ({ ...prev, stock: parseInt(e.target.value) }))}
                        placeholder="0"
                        disabled={productForm.isService}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="reorderLevel">Reorder Level</Label>
                      <Input
                        id="reorderLevel"
                        type="number"
                        min="0"
                        step="1"
                        value={productForm.reorderLevel}
                        onChange={(e) => setProductForm(prev => ({ ...prev, reorderLevel: parseInt(e.target.value) }))}
                        placeholder="0"
                        disabled={productForm.isService}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="sku">SKU (Optional)</Label>
                      <Input
                        id="sku"
                        value={productForm.sku}
                        onChange={(e) => setProductForm(prev => ({ ...prev, sku: e.target.value }))}
                        placeholder="SKU code"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="barcode">Barcode (Optional)</Label>
                      <Input
                        id="barcode"
                        value={productForm.barcode}
                        onChange={(e) => setProductForm(prev => ({ ...prev, barcode: e.target.value }))}
                        placeholder="Barcode"
                      />
                    </div>
                    
                    <div className="col-span-2 flex items-center space-x-2 pt-2">
                      <Switch
                        id="isService"
                        checked={productForm.isService}
                        onCheckedChange={(checked) => setProductForm(prev => ({ 
                          ...prev, 
                          isService: checked,
                          stock: checked ? 999 : prev.stock,
                          reorderLevel: checked ? 0 : prev.reorderLevel
                        }))}
                      />
                      <Label htmlFor="isService">This is a service (not physical product)</Label>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsProductDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleProductSubmit}>{editingProduct ? "Update Product" : "Add Product"}</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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
                            .filter(c => c.id !== categoryForm.id) // Prevent self-reference
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
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
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
    </Layout>
  );
};

export default InventoryPage;
