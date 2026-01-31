"use client";

import { useState } from "react";
import { Ticket, X, Check, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { validateCoupon, calculateCouponDiscount } from "@/lib/discountStore";

interface CouponInputProps {
  subtotal: number;
  onApply: (code: string, discount: number) => void;
  onRemove: () => void;
  appliedCode?: string;
}

export default function CouponInput({ 
  subtotal, 
  onApply, 
  onRemove,
  appliedCode 
}: CouponInputProps) {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [discount, setDiscount] = useState<number>(0);
  
  const handleApply = () => {
    if (!code.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    // Small delay for UX
    setTimeout(() => {
      const result = validateCoupon(code, subtotal);
      
      if (result.valid && result.coupon) {
        const discountAmount = calculateCouponDiscount(result.coupon, subtotal);
        setDiscount(discountAmount);
        onApply(code, discountAmount);
      } else {
        setError(result.error || "Invalid coupon");
      }
      
      setIsLoading(false);
    }, 300);
  };
  
  const handleRemove = () => {
    setCode("");
    setDiscount(0);
    setError(null);
    onRemove();
  };
  
  if (appliedCode) {
    return (
      <motion.div 
        className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-xl"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-green-500 rounded-full">
            <Check className="h-3 w-3 text-white" />
          </div>
          <div>
            <span className="font-semibold text-green-800">{appliedCode}</span>
            <span className="text-green-600 text-sm ml-2">-${discount.toFixed(2)}</span>
          </div>
        </div>
        <button
          onClick={handleRemove}
          className="p-1.5 hover:bg-green-100 rounded-full transition-colors"
        >
          <X className="h-4 w-4 text-green-600" />
        </button>
      </motion.div>
    );
  }
  
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/50" />
          <input
            type="text"
            placeholder="Enter coupon code"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setError(null);
            }}
            onKeyDown={(e) => e.key === "Enter" && handleApply()}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-primary/10 bg-white text-sm focus:outline-none focus:border-primary/30 transition-all uppercase"
          />
        </div>
        <motion.button
          onClick={handleApply}
          disabled={!code.trim() || isLoading}
          className="px-4 py-2.5 bg-primary text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-all"
          whileTap={{ scale: 0.95 }}
        >
          {isLoading ? "..." : "Apply"}
        </motion.button>
      </div>
      
      <AnimatePresence>
        {error && (
          <motion.div 
            className="flex items-center gap-2 text-red-500 text-sm"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
          >
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
