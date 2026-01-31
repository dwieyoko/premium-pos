"use client";

import { CartItem } from "@/types";
import { Minus, Plus, Trash2, ReceiptText, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}

export default function Cart({ items, onUpdateQuantity, onRemoveItem, onCheckout }: CartProps) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  return (
    <div className="flex flex-col h-full premium-card rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b bg-gradient-to-r from-primary/5 to-primary/10">
        <h2 className="text-xl font-bold flex items-center gap-3 text-foreground">
          <div className="p-2 rounded-lg bg-primary/10">
            <ReceiptText className="h-5 w-5 text-primary" />
          </div>
          Current Order
          {items.length > 0 && (
            <span className="ml-auto text-sm font-medium px-3 py-1 rounded-full bg-primary text-white">
              {items.length} items
            </span>
          )}
        </h2>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground py-8">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <ShoppingBag className="h-10 w-10 text-primary/50" />
            </div>
            <p className="font-semibold text-foreground">Your cart is empty</p>
            <p className="text-sm text-muted-foreground mt-1">Add items to get started</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-3 bg-white p-4 rounded-xl border border-primary/10 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground leading-tight truncate">{item.name}</h4>
                  <p className="text-primary font-bold text-sm mt-0.5">${item.price.toFixed(2)}</p>
                </div>
                
                {/* Quantity Controls */}
                <div className="flex items-center gap-1 bg-secondary rounded-xl p-1">
                  <button
                    onClick={() => onUpdateQuantity(item.id, -1)}
                    className="p-2 hover:bg-white rounded-lg transition-colors text-primary"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-8 text-center font-bold text-primary">{item.quantity}</span>
                  <button
                    onClick={() => onUpdateQuantity(item.id, 1)}
                    className="p-2 hover:bg-white rounded-lg transition-colors text-primary"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Footer / Checkout */}
      <div className="p-5 bg-gradient-to-b from-secondary/30 to-secondary/50 border-t space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tax (10%)</span>
          <span className="font-medium">${tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-xl font-bold pt-3 border-t border-primary/20">
          <span className="text-foreground">Total</span>
          <span className="gradient-text">${total.toFixed(2)}</span>
        </div>
        
        <button
          onClick={onCheckout}
          disabled={items.length === 0}
          className="w-full btn-gradient py-4 rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all mt-2"
        >
          Checkout & Print
        </button>
      </div>
    </div>
  );
}
