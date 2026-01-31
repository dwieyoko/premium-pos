"use client";

import { useState } from "react";
import { useProducts } from "@/contexts/ProductContext";
import { useToast } from "@/contexts/ToastContext";
import { Product } from "@/types";
import ProductTable from "@/components/Admin/ProductTable";
import ProductForm from "@/components/Admin/ProductForm";
import ImportExport from "@/components/Admin/ImportExport";
import Modal from "@/components/ui/Modal";
import { Plus, Upload, Search, Package } from "lucide-react";

export default function ProductsPage() {
  const { products, deleteProduct, isLoading } = useProducts();
  const { showToast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isImportExportOpen, setIsImportExportOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Get unique categories from products
  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];
  
  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };
  
  const handleDelete = (product: Product) => {
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      deleteProduct(product.id);
      showToast(`"${product.name}" deleted successfully`, "success");
    }
  };
  
  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };
  
  const handleFormSuccess = () => {
    handleFormClose();
    showToast(
      editingProduct ? "Product updated successfully" : "Product created successfully",
      "success"
    );
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-primary">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          <span className="font-medium">Loading products...</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-primary/10">
            <Package className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold gradient-text">Products</h1>
            <p className="text-muted-foreground">
              Manage your product catalog ({products.length} products)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsImportExportOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/40 transition-all font-medium"
          >
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline">Import/Export</span>
          </button>
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl btn-gradient font-medium"
          >
            <Plus className="h-4 w-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="premium-card rounded-2xl p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/50" />
            <input
              type="text"
              placeholder="Search products by name, SKU, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-primary/10 bg-white focus:outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/10 transition-all"
            />
          </div>
          
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 rounded-xl border-2 border-primary/10 bg-white focus:outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/10 transition-all font-medium text-foreground min-w-[150px]"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Products Table */}
      <ProductTable
        products={filteredProducts}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      
      {/* Product Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={handleFormClose}
        title={editingProduct ? "Edit Product" : "Add New Product"}
        size="lg"
      >
        <ProductForm
          product={editingProduct}
          onSuccess={handleFormSuccess}
          onCancel={handleFormClose}
        />
      </Modal>
      
      {/* Import/Export Modal */}
      <Modal
        isOpen={isImportExportOpen}
        onClose={() => setIsImportExportOpen(false)}
        title="Import / Export Products"
        size="lg"
      >
        <ImportExport onClose={() => setIsImportExportOpen(false)} />
      </Modal>
    </div>
  );
}
