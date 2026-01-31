"use client";

import { Product, ProductFormData } from "@/types";
import { defaultProducts } from "./data";

const STORAGE_KEY = "premium-pos-products";

// Generate unique ID
export const generateId = (): string => {
  return `prod-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Generate QR code from SKU or product name
export const generateQRCode = (sku?: string, name?: string): string => {
  if (sku) return sku.toUpperCase();
  if (name)
    return `PROD-${name.replace(/\s+/g, "-").toUpperCase().slice(0, 10)}`;
  return `PROD-${Date.now()}`;
};

// Initialize products from localStorage or default data
export const initializeProducts = (): Product[] => {
  if (typeof window === "undefined") return defaultProducts;

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      console.error("Failed to parse stored products");
    }
  }

  // Initialize with default products
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProducts));
  return defaultProducts;
};

// Get all products
export const getProducts = (): Product[] => {
  if (typeof window === "undefined") return defaultProducts;

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return defaultProducts;
    }
  }
  return defaultProducts;
};

// Save products to localStorage
const saveProducts = (products: Product[]): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
};

// Add a new product
export const addProduct = (data: ProductFormData): Product => {
  const products = getProducts();
  const now = new Date().toISOString();

  const newProduct: Product = {
    ...data,
    id: generateId(),
    qrCode: data.qrCode || generateQRCode(data.sku, data.name),
    createdAt: now,
    updatedAt: now,
  };

  products.push(newProduct);
  saveProducts(products);

  return newProduct;
};

// Update an existing product
export const updateProduct = (
  id: string,
  data: Partial<ProductFormData>,
): Product | null => {
  const products = getProducts();
  const index = products.findIndex((p) => p.id === id);

  if (index === -1) return null;

  const updatedProduct: Product = {
    ...products[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };

  products[index] = updatedProduct;
  saveProducts(products);

  return updatedProduct;
};

// Delete a product
export const deleteProduct = (id: string): boolean => {
  const products = getProducts();
  const filtered = products.filter((p) => p.id !== id);

  if (filtered.length === products.length) return false;

  saveProducts(filtered);
  return true;
};

// Get a single product by ID
export const getProductById = (id: string): Product | null => {
  const products = getProducts();
  return products.find((p) => p.id === id) || null;
};

// Get products by category
export const getProductsByCategory = (category: string): Product[] => {
  const products = getProducts();
  return products.filter((p) => p.category === category);
};

// Search products by name
export const searchProducts = (query: string): Product[] => {
  const products = getProducts();
  const lowerQuery = query.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(lowerQuery) ||
      p.description?.toLowerCase().includes(lowerQuery) ||
      p.sku?.toLowerCase().includes(lowerQuery),
  );
};

// Import products (merge or replace)
export const importProducts = (
  data: Product[],
  replace: boolean = false,
): void => {
  if (replace) {
    saveProducts(data);
  } else {
    const existing = getProducts();
    const merged = [...existing];

    data.forEach((product) => {
      const existingIndex = merged.findIndex((p) => p.id === product.id);
      if (existingIndex >= 0) {
        merged[existingIndex] = product;
      } else {
        merged.push(product);
      }
    });

    saveProducts(merged);
  }
};

// Export products as JSON string
export const exportProducts = (): string => {
  return JSON.stringify(getProducts(), null, 2);
};

// Export products as CSV
export const exportProductsCSV = (): string => {
  const products = getProducts();
  const headers = [
    "id",
    "name",
    "description",
    "price",
    "category",
    "image",
    "qrCode",
    "sku",
    "stock",
  ];

  const rows = products.map((p) =>
    headers
      .map((h) => {
        const value = p[h as keyof Product];
        if (
          typeof value === "string" &&
          (value.includes(",") || value.includes('"'))
        ) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value ?? "";
      })
      .join(","),
  );

  return [headers.join(","), ...rows].join("\n");
};

// Reset to default products
export const resetProducts = (): void => {
  saveProducts(defaultProducts);
};
