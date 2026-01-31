"use client";

import { useState } from "react";
import { useProducts } from "@/contexts/ProductContext";
import { useToast } from "@/contexts/ToastContext";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CategoriesPage() {
  const { categories, products, addCategory, updateCategory, deleteCategory } = useProducts();
  const { showToast } = useToast();
  
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#6b7280");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingColor, setEditingColor] = useState("");
  
  // Count products per category
  const getProductCount = (categoryName: string) => {
    return products.filter((p) => p.category === categoryName).length;
  };
  
  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      showToast("Category name is required", "error");
      return;
    }
    
    if (categories.some((c) => c.name.toLowerCase() === newCategoryName.toLowerCase())) {
      showToast("Category already exists", "error");
      return;
    }
    
    addCategory(newCategoryName.trim(), newCategoryColor);
    setNewCategoryName("");
    setNewCategoryColor("#6b7280");
    showToast("Category added successfully", "success");
  };
  
  const handleStartEdit = (category: { id: string; name: string; color?: string }) => {
    setEditingId(category.id);
    setEditingName(category.name);
    setEditingColor(category.color || "#6b7280");
  };
  
  const handleSaveEdit = () => {
    if (!editingName.trim()) {
      showToast("Category name is required", "error");
      return;
    }
    
    if (editingId) {
      updateCategory(editingId, { name: editingName.trim(), color: editingColor });
      showToast("Category updated successfully", "success");
    }
    
    setEditingId(null);
    setEditingName("");
    setEditingColor("");
  };
  
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName("");
    setEditingColor("");
  };
  
  const handleDelete = (category: { id: string; name: string }) => {
    const productCount = getProductCount(category.name);
    
    if (productCount > 0) {
      if (!confirm(`This category has ${productCount} product(s). Are you sure you want to delete it?`)) {
        return;
      }
    }
    
    deleteCategory(category.id);
    showToast("Category deleted successfully", "success");
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Categories</h1>
        <p className="text-muted-foreground">
          Manage product categories ({categories.length} categories)
        </p>
      </div>
      
      {/* Add New Category */}
      <div className="bg-card rounded-2xl border p-6">
        <h2 className="text-lg font-semibold mb-4">Add New Category</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Category name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
            className="flex-1 px-4 py-2 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <div className="flex items-center gap-2">
            <label className="text-sm text-muted-foreground">Color:</label>
            <input
              type="color"
              value={newCategoryColor}
              onChange={(e) => setNewCategoryColor(e.target.value)}
              className="w-10 h-10 rounded-lg border cursor-pointer"
            />
          </div>
          <button
            onClick={handleAddCategory}
            className="flex items-center justify-center gap-2 px-6 py-2 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4" />
            <span>Add</span>
          </button>
        </div>
      </div>
      
      {/* Categories List */}
      <div className="bg-card rounded-2xl border overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-muted/50 text-sm font-medium text-muted-foreground">
          <div className="col-span-1">Color</div>
          <div className="col-span-5">Name</div>
          <div className="col-span-3">Products</div>
          <div className="col-span-3 text-right">Actions</div>
        </div>
        
        <AnimatePresence>
          {categories.map((category) => (
            <motion.div
              key={category.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-12 gap-4 px-6 py-4 border-t items-center"
            >
              {editingId === category.id ? (
                <>
                  {/* Edit Mode */}
                  <div className="col-span-1">
                    <input
                      type="color"
                      value={editingColor}
                      onChange={(e) => setEditingColor(e.target.value)}
                      className="w-8 h-8 rounded border cursor-pointer"
                    />
                  </div>
                  <div className="col-span-5">
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveEdit();
                        if (e.key === "Escape") handleCancelEdit();
                      }}
                      className="w-full px-3 py-1 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                      autoFocus
                    />
                  </div>
                  <div className="col-span-3 text-muted-foreground">
                    {getProductCount(category.name)} products
                  </div>
                  <div className="col-span-3 flex justify-end gap-2">
                    <button
                      onClick={handleSaveEdit}
                      className="p-2 hover:bg-green-100 dark:hover:bg-green-900/30 text-green-600 rounded-lg transition-colors"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 rounded-lg transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* View Mode */}
                  <div className="col-span-1">
                    <div
                      className="w-6 h-6 rounded-full border"
                      style={{ backgroundColor: category.color || "#6b7280" }}
                    />
                  </div>
                  <div className="col-span-5 font-medium">{category.name}</div>
                  <div className="col-span-3 text-muted-foreground">
                    {getProductCount(category.name)} products
                  </div>
                  <div className="col-span-3 flex justify-end gap-2">
                    <button
                      onClick={() => handleStartEdit(category)}
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category)}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {categories.length === 0 && (
          <div className="px-6 py-12 text-center text-muted-foreground">
            No categories yet. Add your first category above.
          </div>
        )}
      </div>
    </div>
  );
}
