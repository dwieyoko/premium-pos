"use client";

import { useState, useCallback } from "react";
import Header from "@/components/POS/Header";
import ProductGrid from "@/components/POS/ProductGrid";
import Cart from "@/components/POS/Cart";
import Scanner from "@/components/POS/Scanner";
import PrintBill from "@/components/POS/PrintBill";
import { Product, CartItem } from "@/types";
import { products } from "@/lib/data";
import { AnimatePresence } from "framer-motion";

export default function POSPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleScanSuccess = useCallback((decodedText: string) => {
    const product = products.find((p) => p.qrCode === decodedText || p.id === decodedText);
    if (product) {
      handleAddToCart(product);
      setIsScannerOpen(false);
      // Optional: Add a toast or sound effect here
    }
  }, []);

  const handleCheckout = () => {
    setTimeout(() => {
      window.print();
      // Optionally clear cart after printing
      // setCartItems([]);
    }, 100);
  };

  return (
    <main className="min-h-screen bg-background">
      <Header 
        onToggleScanner={() => setIsScannerOpen(!isScannerOpen)} 
        isScannerOpen={isScannerOpen} 
      />
      
      <div className="container mx-auto px-4 md:px-8 py-8 lg:grid lg:grid-cols-12 lg:gap-8">
        {/* Left Column - Products */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl font-bold tracking-tight">Products</h2>
            <p className="text-muted-foreground">Select items or scan QR code to add to order.</p>
          </div>
          <ProductGrid onAddToCart={handleAddToCart} />
        </div>

        {/* Right Column - Cart */}
        <div className="lg:col-span-4 mt-8 lg:mt-0 lg:sticky lg:top-24 h-fit max-h-[calc(100vh-8rem)]">
          <Cart 
            items={cartItems} 
            onUpdateQuantity={handleUpdateQuantity} 
            onRemoveItem={handleRemoveItem}
            onCheckout={handleCheckout}
          />
        </div>
      </div>

      <AnimatePresence>
        {isScannerOpen && (
          <Scanner 
            onScanSuccess={handleScanSuccess} 
            onClose={() => setIsScannerOpen(false)} 
          />
        )}
      </AnimatePresence>

      {/* Hidden Print Area */}
      <PrintBill items={cartItems} />
    </main>
  );
}
