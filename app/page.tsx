"use client";

import { useState, useCallback, useEffect } from "react";
import Header from "@/components/POS/Header";
import ProductGrid from "@/components/POS/ProductGrid";
import Cart from "@/components/POS/Cart";
import Scanner from "@/components/POS/Scanner";
import PrintBill from "@/components/POS/PrintBill";
import QuickAddModal from "@/components/POS/QuickAddModal";
import CheckoutModal from "@/components/POS/CheckoutModal";
import { Product, CartItem } from "@/types";
import { useProducts } from "@/contexts/ProductContext";
import { AnimatePresence } from "framer-motion";
import { initializeCoupons } from "@/lib/discountStore";
import { soundEffects } from "@/lib/sounds";

export default function POSPage() {
  const { products } = useProducts();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Initialize coupons on mount
  useEffect(() => {
    initializeCoupons();
  }, []);

  const handleAddToCart = (product: Product) => {
    soundEffects.addToCart();
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
    }
  }, [products]);

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    setIsCheckoutOpen(true);
  };

  const handleCheckoutComplete = () => {
    // Print receipt
    setTimeout(() => {
      window.print();
    }, 100);
    
    // Clear cart
    setCartItems([]);
  };

  return (
    <main className="min-h-screen bg-background relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-1/2 h-96 bg-gradient-to-bl from-primary/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-96 bg-gradient-to-tr from-primary/5 to-transparent rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10">
        <Header 
          onToggleScanner={() => setIsScannerOpen(!isScannerOpen)} 
          isScannerOpen={isScannerOpen}
          onQuickAdd={() => setIsQuickAddOpen(true)}
        />
        
        <div className="container mx-auto px-4 md:px-8 py-8 lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Left Column - Products */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex flex-col gap-1">
              <h2 className="text-3xl font-bold gradient-text">Products</h2>
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

        {/* Quick Add Modal */}
        <QuickAddModal
          isOpen={isQuickAddOpen}
          onClose={() => setIsQuickAddOpen(false)}
        />

        {/* Checkout Modal */}
        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          items={cartItems}
          onCheckoutComplete={handleCheckoutComplete}
        />

        {/* Hidden Print Area */}
        <PrintBill items={cartItems} />
      </div>
    </main>
  );
}
