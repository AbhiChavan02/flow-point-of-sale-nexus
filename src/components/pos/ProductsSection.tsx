
import React, { useState } from "react";
import { useInventory } from "@/contexts/InventoryContext";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Package } from "lucide-react";
import { useBusiness } from "@/contexts/BusinessContext";

interface ProductsSectionProps {
  onAddItem: (product: Product) => void;
}

const ProductsSection: React.FC<ProductsSectionProps> = ({ onAddItem }) => {
  const { products, categories } = useInventory();
  const { business } = useBusiness();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter products by search term and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = searchTerm === "" || product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === null || product.categoryId === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="lg:col-span-2 p-6 overflow-y-auto">
      {/* Search and Category Filter */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => setSelectedCategory(null)}
            className="whitespace-nowrap"
          >
            All
          </Button>
          
          {categories.map(category => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className="whitespace-nowrap"
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProducts.map(product => (
          <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={() => onAddItem(product)}>
            <CardHeader className="p-4 pb-2">
              <div className="aspect-square bg-gray-100 rounded-md mb-3 flex items-center justify-center dark:bg-gray-800">
                {product.image ? (
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Package size={40} className="text-gray-400" />
                )}
              </div>
              <CardTitle className="text-md leading-tight">{product.name}</CardTitle>
            </CardHeader>
            <CardFooter className="p-4 pt-2 flex justify-between items-center">
              <div>
                {product.discountedPrice ? (
                  <>
                    <span className="font-semibold dark:text-white">{business.currency} {product.discountedPrice.toFixed(2)}</span>
                    <span className="text-sm text-gray-400 line-through ml-2">{business.currency} {product.price.toFixed(2)}</span>
                  </>
                ) : (
                  <span className="font-semibold dark:text-white">{business.currency} {product.price.toFixed(2)}</span>
                )}
              </div>
              {product.isService && <Badge>Service</Badge>}
            </CardFooter>
          </Card>
        ))}
        
        {filteredProducts.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            No products found. Try adjusting your search or category filter.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsSection;
