"use client";

import { Product } from "@/types";
import Image from "next/image";
import { Pencil, Trash2, QrCode } from "lucide-react";
import { useState } from "react";
import Modal from "@/components/ui/Modal";
import QRCodeDisplay from "@/components/ui/QRCode";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export default function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
  const [qrProduct, setQrProduct] = useState<Product | null>(null);
  
  if (products.length === 0) {
    return (
      <div className="bg-card rounded-2xl border p-12 text-center">
        <div className="text-muted-foreground">
          <p className="text-lg font-medium">No products found</p>
          <p className="text-sm">Try adjusting your search or add a new product.</p>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <div className="bg-card rounded-2xl border overflow-hidden">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50 text-left text-sm font-medium text-muted-foreground">
                <th className="px-6 py-3">Product</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Stock</th>
                <th className="px-6 py-3">SKU</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {product.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-muted rounded-md text-sm">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`${(product.stock ?? 0) < 10 ? "text-red-500" : ""}`}>
                      {product.stock ?? "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {product.sku || "-"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setQrProduct(product)}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                        title="View QR Code"
                      >
                        <QrCode className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onEdit(product)}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(product)}
                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Mobile Cards */}
        <div className="md:hidden divide-y">
          {products.map((product) => (
            <div key={product.id} className="p-4">
              <div className="flex items-start gap-3">
                <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.category}</p>
                    </div>
                    <p className="font-bold text-primary">${product.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Stock: {product.stock ?? "N/A"}</span>
                      <span>SKU: {product.sku || "-"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setQrProduct(product)}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                      >
                        <QrCode className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onEdit(product)}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(product)}
                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* QR Code Modal */}
      <Modal
        isOpen={!!qrProduct}
        onClose={() => setQrProduct(null)}
        title={`QR Code - ${qrProduct?.name}`}
        size="sm"
      >
        <div className="p-6 flex flex-col items-center gap-4">
          {qrProduct && (
            <>
              <QRCodeDisplay
                value={qrProduct.qrCode}
                size={200}
                showDownload
                productName={qrProduct.name}
              />
              <p className="text-sm text-muted-foreground text-center">
                QR Code: <span className="font-mono">{qrProduct.qrCode}</span>
              </p>
            </>
          )}
        </div>
      </Modal>
    </>
  );
}
