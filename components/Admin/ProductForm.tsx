"use client";

import { useState, useRef } from "react";
import { Product, ProductFormData } from "@/types";
import { useProducts } from "@/contexts/ProductContext";
import { generateQRCode } from "@/lib/productStore";
import { Upload, X, RefreshCw } from "lucide-react";
import Image from "next/image";
import QRCodeDisplay from "@/components/ui/QRCode";

interface ProductFormProps {
  product?: Product | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
  const { addProduct, updateProduct, categories } = useProducts();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || 0,
    category: product?.category || categories[0]?.name || "",
    image: product?.image || "",
    qrCode: product?.qrCode || "",
    sku: product?.sku || "",
    stock: product?.stock || 0,
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
    
    // Clear error when field is edited
    if (errors[name as keyof ProductFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: "Image must be less than 2MB" }));
      return;
    }
    
    // Convert to base64
    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, image: reader.result as string }));
      setErrors((prev) => ({ ...prev, image: undefined }));
    };
    reader.onerror = () => {
      setErrors((prev) => ({ ...prev, image: "Failed to read image" }));
    };
    reader.readAsDataURL(file);
  };
  
  const handleGenerateQR = () => {
    const qr = generateQRCode(formData.sku, formData.name);
    setFormData((prev) => ({ ...prev, qrCode: qr }));
  };
  
  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ProductFormData, string>> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }
    
    if (formData.price <= 0) {
      newErrors.price = "Price must be greater than 0";
    }
    
    if (!formData.category) {
      newErrors.category = "Category is required";
    }
    
    if (!formData.image) {
      newErrors.image = "Product image is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    try {
      // Ensure QR code is set
      const finalFormData = {
        ...formData,
        qrCode: formData.qrCode || generateQRCode(formData.sku, formData.name),
      };
      
      if (product) {
        updateProduct(product.id, finalFormData);
      } else {
        addProduct(finalFormData);
      }
      
      onSuccess();
    } catch (error) {
      console.error("Error saving product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium mb-2">Product Image *</label>
        <div className="flex items-start gap-4">
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`
              relative w-32 h-32 rounded-xl border-2 border-dashed cursor-pointer
              flex items-center justify-center overflow-hidden
              hover:border-primary/50 transition-colors
              ${errors.image ? "border-red-500" : "border-muted"}
            `}
          >
            {formData.image ? (
              <>
                <Image
                  src={formData.image}
                  alt="Product preview"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFormData((prev) => ({ ...prev, image: "" }));
                  }}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"
                >
                  <X className="h-3 w-3" />
                </button>
              </>
            ) : (
              <div className="text-center text-muted-foreground">
                <Upload className="h-8 w-8 mx-auto mb-1" />
                <span className="text-xs">Upload</span>
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
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">
              Click to upload or paste an image URL below.
            </p>
            <input
              type="text"
              name="image"
              value={formData.image.startsWith("data:") ? "" : formData.image}
              onChange={handleChange}
              placeholder="Or paste image URL..."
              className="mt-2 w-full px-3 py-2 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>
        {errors.image && <p className="mt-1 text-sm text-red-500">{errors.image}</p>}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Product Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter product name"
            className={`w-full px-4 py-2 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 ${
              errors.name ? "border-red-500" : ""
            }`}
          />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
        </div>
        
        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter product description"
            rows={3}
            className="w-full px-4 py-2 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
          />
        </div>
        
        {/* Price */}
        <div>
          <label className="block text-sm font-medium mb-2">Price *</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              min="0"
              placeholder="0.00"
              className={`w-full pl-8 pr-4 py-2 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                errors.price ? "border-red-500" : ""
              }`}
            />
          </div>
          {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
        </div>
        
        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-2">Category *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`w-full px-4 py-2 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 ${
              errors.category ? "border-red-500" : ""
            }`}
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
          {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
        </div>
        
        {/* Stock */}
        <div>
          <label className="block text-sm font-medium mb-2">Stock</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            min="0"
            placeholder="0"
            className="w-full px-4 py-2 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        
        {/* SKU */}
        <div>
          <label className="block text-sm font-medium mb-2">SKU</label>
          <input
            type="text"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            placeholder="e.g., BEV-001"
            className="w-full px-4 py-2 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        
        {/* QR Code */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">QR Code</label>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="flex gap-2">
                <input
                  type="text"
                  name="qrCode"
                  value={formData.qrCode}
                  onChange={handleChange}
                  placeholder="Enter or generate QR code"
                  className="flex-1 px-4 py-2 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button
                  type="button"
                  onClick={handleGenerateQR}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border hover:bg-muted transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span className="hidden sm:inline">Generate</span>
                </button>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Auto-generated from SKU or product name if left empty
              </p>
            </div>
            {formData.qrCode && (
              <div className="flex justify-center sm:justify-start">
                <QRCodeDisplay value={formData.qrCode} size={80} />
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 rounded-xl border hover:bg-muted transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : product ? "Update Product" : "Create Product"}
        </button>
      </div>
    </form>
  );
}
