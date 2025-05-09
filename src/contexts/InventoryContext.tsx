
import React, { createContext, useState, useContext, useEffect } from "react";
import { Product, Category } from "@/types";
import { DEMO_PRODUCTS, DEMO_CATEGORIES } from "@/config/constants";

interface InventoryContextType {
  products: Product[];
  categories: Category[];
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addCategory: (category: Category) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  useEffect(() => {
    // Load from localStorage if available or use demo data
    const savedProducts = localStorage.getItem("pos_products");
    const savedCategories = localStorage.getItem("pos_categories");
    
    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts));
      } catch (error) {
        console.error("Error parsing saved products:", error);
        setProducts(DEMO_PRODUCTS);
      }
    } else {
      setProducts(DEMO_PRODUCTS);
    }
    
    if (savedCategories) {
      try {
        setCategories(JSON.parse(savedCategories));
      } catch (error) {
        console.error("Error parsing saved categories:", error);
        setCategories(DEMO_CATEGORIES);
      }
    } else {
      setCategories(DEMO_CATEGORIES);
    }
  }, []);
  
  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem("pos_products", JSON.stringify(products));
  }, [products]);
  
  useEffect(() => {
    localStorage.setItem("pos_categories", JSON.stringify(categories));
  }, [categories]);
  
  const addProduct = (product: Product) => {
    setProducts(prev => [...prev, product]);
  };
  
  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => 
      prev.map(product => 
        product.id === id ? { ...product, ...updates } : product
      )
    );
  };
  
  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };
  
  const addCategory = (category: Category) => {
    setCategories(prev => [...prev, category]);
  };
  
  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories(prev => 
      prev.map(category => 
        category.id === id ? { ...category, ...updates } : category
      )
    );
  };
  
  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(category => category.id !== id));
  };
  
  return (
    <InventoryContext.Provider value={{
      products,
      categories,
      addProduct,
      updateProduct,
      deleteProduct,
      addCategory,
      updateCategory,
      deleteCategory
    }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return context;
};
