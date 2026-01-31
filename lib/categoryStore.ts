"use client";

import { Category } from "@/types";
import { defaultCategories } from "./data";

const STORAGE_KEY = "premium-pos-categories";

// Generate unique ID for categories
export const generateCategoryId = (): string => {
  return `cat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Initialize categories from localStorage or default data
export const initializeCategories = (): Category[] => {
  if (typeof window === "undefined") return defaultCategories;

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      console.error("Failed to parse stored categories");
    }
  }

  // Initialize with default categories
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultCategories));
  return defaultCategories;
};

// Get all categories
export const getCategories = (): Category[] => {
  if (typeof window === "undefined") return defaultCategories;

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return defaultCategories;
    }
  }
  return defaultCategories;
};

// Save categories to localStorage
const saveCategories = (categories: Category[]): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
};

// Add a new category
export const addCategory = (name: string, color?: string): Category => {
  const categories = getCategories();

  const newCategory: Category = {
    id: generateCategoryId(),
    name,
    color: color || "#6b7280",
  };

  categories.push(newCategory);
  saveCategories(categories);

  return newCategory;
};

// Update an existing category
export const updateCategory = (
  id: string,
  data: Partial<Category>,
): Category | null => {
  const categories = getCategories();
  const index = categories.findIndex((c) => c.id === id);

  if (index === -1) return null;

  const updatedCategory: Category = {
    ...categories[index],
    ...data,
  };

  categories[index] = updatedCategory;
  saveCategories(categories);

  return updatedCategory;
};

// Delete a category
export const deleteCategory = (id: string): boolean => {
  const categories = getCategories();
  const filtered = categories.filter((c) => c.id !== id);

  if (filtered.length === categories.length) return false;

  saveCategories(filtered);
  return true;
};

// Get a single category by ID
export const getCategoryById = (id: string): Category | null => {
  const categories = getCategories();
  return categories.find((c) => c.id === id) || null;
};

// Get category by name
export const getCategoryByName = (name: string): Category | null => {
  const categories = getCategories();
  return (
    categories.find((c) => c.name.toLowerCase() === name.toLowerCase()) || null
  );
};

// Reset to default categories
export const resetCategories = (): void => {
  saveCategories(defaultCategories);
};
