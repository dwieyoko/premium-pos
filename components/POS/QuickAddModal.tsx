"use client";

import { useState, useRef } from "react";
import { ProductFormData } from "@/types";
import { useProducts } from "@/contexts/ProductContext";
import { useToast } from "@/contexts/ToastContext";
import { generateQRCode } from "@/lib/productStore";
import Modal from "@/components/ui/Modal";
import { Upload, X } from "lucide-react";
import Image from "next/image";

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickAddModal({ isOpen, onClose }: QuickAddModalProps) {
  const { addProduct, categories } = useProducts();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    price: 0,
    category: categories[0]?.name || "",
    image: "",
    qrCode: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 2 * 1024 * 1024) {
      showToast("Image must be less than 2MB", "error");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, image: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      showToast("Product name is required", "error");
      return;
    }
    
    if (formData.price <= 0) {
      showToast("Price must be greater than 0", "error");
      return;
    }
    
    if (!formData.image) {
      showToast("Product image is required", "error");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const finalData = {
        ...formData,
        qrCode: formData.qrCode || generateQRCode(undefined, formData.name),
      };
      
      addProduct(finalData);
      showToast(`"${formData.name}" added successfully`, "success");
      
      // Reset form
      setFormData({
        name: "",
        price: 0,
        category: categories[0]?.name || "",
        image: "",
        qrCode: "",
      });
      
      onClose();
    } catch (error) {
      showToast("Failed to add product", "error");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleClose = () => {
    setFormData({
      name: "",
      price: 0,
      category: categories[0]?.name || "",
      image: "",
      qrCode: "",
    });
    onClose();
  };
  
  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Quick Add Product" size="md">
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Product Image *</label>
          <div className="flex items-center gap-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative w-24 h-24 rounded-xl border-2 border-dashed border-primary/30 cursor-pointer flex items-center justify-center overflow-hidden hover:border-primary hover:bg-primary/5 transition-all"
            >
              {formData.image ? (
                <>
                  <Image
                    src={formData.image}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFormData((prev) => ({ ...prev, image: "" }));
                    }}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full shadow-lg"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </>
              ) : (
                <div className="text-center">
                  <Upload className="h-6 w-6 text-primary/50 mx-auto" />
                  <span className="text-xs text-muted-foreground mt-1">Upload</span>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <input
              type="text"
              placeholder="Or paste image URL..."
              value={formData.image.startsWith("data:") ? "" : formData.image}
              onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value }))}
              className="flex-1 px-4 py-3 rounded-xl border-2 border-primary/10 bg-white text-sm focus:outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/10 transition-all"
            />
          </div>
        </div>
        
        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">Product Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter product name"
            className="w-full px-4 py-3 rounded-xl border-2 border-primary/10 bg-white focus:outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/10 transition-all"
          />
        </div>
        
        {/* Price & Category */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Price *</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-semibold">$</span>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                step="0.01"
                min="0"
                className="w-full pl-8 pr-4 py-3 rounded-xl border-2 border-primary/10 bg-white focus:outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/10 transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border-2 border-primary/10 bg-white focus:outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/10 transition-all"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-4 py-3 rounded-xl border-2 border-primary/20 text-primary font-medium hover:bg-primary/5 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 btn-gradient px-4 py-3 rounded-xl font-medium disabled:opacity-50"
          >
            {isSubmitting ? "Adding..." : "Add Product"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
