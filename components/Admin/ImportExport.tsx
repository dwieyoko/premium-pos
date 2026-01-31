"use client";

import { useState, useRef } from "react";
import { useProducts } from "@/contexts/ProductContext";
import { useToast } from "@/contexts/ToastContext";
import { Product } from "@/types";
import { Download, Upload, FileJson, FileSpreadsheet, AlertCircle } from "lucide-react";

interface ImportExportProps {
  onClose: () => void;
}

export default function ImportExport({ onClose }: ImportExportProps) {
  const { products, importProducts, exportProducts, exportProductsCSV } = useProducts();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [importMode, setImportMode] = useState<"merge" | "replace">("merge");
  const [previewData, setPreviewData] = useState<Product[] | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  
  const handleExportJSON = () => {
    const json = exportProducts();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = `products-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    showToast("Products exported as JSON", "success");
  };
  
  const handleExportCSV = () => {
    const csv = exportProductsCSV();
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.download = `products-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    
    URL.revokeObjectURL(url);
    showToast("Products exported as CSV", "success");
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setImportError(null);
    setPreviewData(null);
    
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const content = reader.result as string;
        let data: Product[];
        
        if (file.name.endsWith(".csv")) {
          data = parseCSV(content);
        } else {
          data = JSON.parse(content);
        }
        
        // Validate data
        if (!Array.isArray(data)) {
          throw new Error("Invalid format: expected an array of products");
        }
        
        // Basic validation
        data.forEach((item, index) => {
          if (!item.name) {
            throw new Error(`Product at index ${index} is missing 'name' field`);
          }
          if (typeof item.price !== "number" || item.price < 0) {
            throw new Error(`Product "${item.name}" has invalid price`);
          }
        });
        
        setPreviewData(data);
      } catch (error) {
        setImportError(error instanceof Error ? error.message : "Failed to parse file");
      }
    };
    
    reader.onerror = () => {
      setImportError("Failed to read file");
    };
    
    reader.readAsText(file);
  };
  
  const parseCSV = (content: string): Product[] => {
    const lines = content.trim().split("\n");
    if (lines.length < 2) {
      throw new Error("CSV file must have a header row and at least one data row");
    }
    
    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const requiredHeaders = ["name", "price"];
    
    for (const required of requiredHeaders) {
      if (!headers.includes(required)) {
        throw new Error(`Missing required column: ${required}`);
      }
    }
    
    return lines.slice(1).map((line, lineIndex) => {
      const values = line.split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
      const product: Record<string, string | number> = {};
      
      headers.forEach((header, index) => {
        const value = values[index] || "";
        if (header === "price" || header === "stock") {
          product[header] = parseFloat(value) || 0;
        } else {
          product[header] = value;
        }
      });
      
      // Generate ID if not present
      if (!product.id) {
        product.id = `import-${Date.now()}-${lineIndex}`;
      }
      
      return product as unknown as Product;
    });
  };
  
  const handleImport = () => {
    if (!previewData) return;
    
    importProducts(previewData, importMode === "replace");
    showToast(`${previewData.length} products imported successfully`, "success");
    onClose();
  };
  
  const clearPreview = () => {
    setPreviewData(null);
    setImportError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  return (
    <div className="p-6 space-y-6">
      {/* Export Section */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Export Products</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Download your product catalog ({products.length} products)
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border hover:bg-muted transition-colors"
          >
            <FileJson className="h-4 w-4" />
            <span>Export JSON</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border hover:bg-muted transition-colors"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>
      
      <hr />
      
      {/* Import Section */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Import Products</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Upload a JSON or CSV file to import products
        </p>
        
        {/* Import Mode */}
        <div className="flex items-center gap-4 mb-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="importMode"
              value="merge"
              checked={importMode === "merge"}
              onChange={() => setImportMode("merge")}
              className="accent-primary"
            />
            <span className="text-sm">Merge with existing</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="importMode"
              value="replace"
              checked={importMode === "replace"}
              onChange={() => setImportMode("replace")}
              className="accent-primary"
            />
            <span className="text-sm text-red-500">Replace all</span>
          </label>
        </div>
        
        {/* File Upload */}
        {!previewData && (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
          >
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              JSON or CSV file
            </p>
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,.csv"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        {/* Error */}
        {importError && (
          <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl">
            <div className="flex items-start gap-2 text-red-600">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Import Error</p>
                <p className="text-sm">{importError}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Preview */}
        {previewData && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-3">
              <p className="font-medium">
                Preview: {previewData.length} products found
              </p>
              <button
                onClick={clearPreview}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            </div>
            
            <div className="max-h-48 overflow-y-auto border rounded-xl">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 sticky top-0">
                  <tr>
                    <th className="text-left px-3 py-2">Name</th>
                    <th className="text-left px-3 py-2">Category</th>
                    <th className="text-right px-3 py-2">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {previewData.slice(0, 10).map((product, index) => (
                    <tr key={index}>
                      <td className="px-3 py-2">{product.name}</td>
                      <td className="px-3 py-2 text-muted-foreground">
                        {product.category || "-"}
                      </td>
                      <td className="px-3 py-2 text-right">
                        ${(product.price || 0).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  {previewData.length > 10 && (
                    <tr>
                      <td colSpan={3} className="px-3 py-2 text-center text-muted-foreground">
                        ... and {previewData.length - 10} more
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <button
              onClick={handleImport}
              className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              <Download className="h-4 w-4" />
              <span>
                {importMode === "replace" ? "Replace" : "Import"} {previewData.length} Products
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
