
import React, { useState } from "react";
import { useInventory } from "@/contexts/InventoryContext";
import { useBusiness } from "@/contexts/BusinessContext";
import { Product } from "@/types";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Image, Search, Edit, Trash2 } from "lucide-react";
import AddProductDialog from "@/components/inventory/AddProductDialog";

const ProductsList: React.FC = () => {
  const { products, categories, deleteProduct } = useInventory();
  const { business } = useBusiness();

  const [searchTerm, setSearchTerm] = useState("");
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.barcode?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Edit product
  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsProductDialogOpen(true);
  };
  
  // Delete confirmation
  const handleDeleteProduct = (productId: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProduct(productId);
      toast.success("Product deleted successfully");
    }
  };

  // Close product dialog & reset
  const handleCloseProductDialog = () => {
    setIsProductDialogOpen(false);
    setEditingProduct(null);
  };
  
  return (
    <>
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
      
      {/* Add/Edit product dialog using the AddProductDialog component */}
      <AddProductDialog
        open={isProductDialogOpen}
        onOpenChange={handleCloseProductDialog}
        initialData={editingProduct || undefined}
      />
    </>
  );
};

export default ProductsList;
