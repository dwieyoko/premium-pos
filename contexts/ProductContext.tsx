"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { Product, Category, ProductFormData } from "@/types";
import * as productStore from "@/lib/productStore";
import * as categoryStore from "@/lib/categoryStore";

interface ProductContextType {
  // Products
  products: Product[];
  addProduct: (data: ProductFormData) => Product;
  updateProduct: (id: string, data: Partial<ProductFormData>) => Product | null;
  deleteProduct: (id: string) => boolean;
  getProductById: (id: string) => Product | null;
  searchProducts: (query: string) => Product[];
  refreshProducts: () => void;
  
  // Categories
  categories: Category[];
  addCategory: (name: string, color?: string) => Category;
  updateCategory: (id: string, data: Partial<Category>) => Category | null;
  deleteCategory: (id: string) => boolean;
  refreshCategories: () => void;
  
  // Import/Export
  importProducts: (data: Product[], replace?: boolean) => void;
  exportProducts: () => string;
  exportProductsCSV: () => string;
  
  // Loading state
  isLoading: boolean;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize data on mount
  useEffect(() => {
    setProducts(productStore.initializeProducts());
    setCategories(categoryStore.initializeCategories());
    setIsLoading(false);
  }, []);
  
  // Product operations
  const addProduct = useCallback((data: ProductFormData): Product => {
    const newProduct = productStore.addProduct(data);
    setProducts(productStore.getProducts());
    return newProduct;
  }, []);
  
  const updateProduct = useCallback((id: string, data: Partial<ProductFormData>): Product | null => {
    const updated = productStore.updateProduct(id, data);
    if (updated) {
      setProducts(productStore.getProducts());
    }
    return updated;
  }, []);
  
  const deleteProduct = useCallback((id: string): boolean => {
    const success = productStore.deleteProduct(id);
    if (success) {
      setProducts(productStore.getProducts());
    }
    return success;
  }, []);
  
  const getProductById = useCallback((id: string): Product | null => {
    return productStore.getProductById(id);
  }, []);
  
  const searchProducts = useCallback((query: string): Product[] => {
    return productStore.searchProducts(query);
  }, []);
  
  const refreshProducts = useCallback(() => {
    setProducts(productStore.getProducts());
  }, []);
  
  // Category operations
  const addCategory = useCallback((name: string, color?: string): Category => {
    const newCategory = categoryStore.addCategory(name, color);
    setCategories(categoryStore.getCategories());
    return newCategory;
  }, []);
  
  const updateCategory = useCallback((id: string, data: Partial<Category>): Category | null => {
    const updated = categoryStore.updateCategory(id, data);
    if (updated) {
      setCategories(categoryStore.getCategories());
    }
    return updated;
  }, []);
  
  const deleteCategory = useCallback((id: string): boolean => {
    const success = categoryStore.deleteCategory(id);
    if (success) {
      setCategories(categoryStore.getCategories());
    }
    return success;
  }, []);
  
  const refreshCategories = useCallback(() => {
    setCategories(categoryStore.getCategories());
  }, []);
  
  // Import/Export
  const importProducts = useCallback((data: Product[], replace: boolean = false) => {
    productStore.importProducts(data, replace);
    setProducts(productStore.getProducts());
  }, []);
  
  const exportProducts = useCallback((): string => {
    return productStore.exportProducts();
  }, []);
  
  const exportProductsCSV = useCallback((): string => {
    return productStore.exportProductsCSV();
  }, []);
  
  const value: ProductContextType = {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    searchProducts,
    refreshProducts,
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    refreshCategories,
    importProducts,
    exportProducts,
    exportProductsCSV,
    isLoading,
  };
  
  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
}
