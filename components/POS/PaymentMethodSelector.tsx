"use client";

import { PaymentMethodType } from "@/types";
import { motion } from "framer-motion";
import { Banknote, CreditCard, Smartphone } from "lucide-react";

interface PaymentMethodSelectorProps {
  selected: PaymentMethodType | null;
  onSelect: (method: PaymentMethodType) => void;
  disabled?: boolean;
}

const paymentMethods = [
  {
    type: "cash" as PaymentMethodType,
    label: "Cash",
    icon: Banknote,
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-500",
  },
  {
    type: "card" as PaymentMethodType,
    label: "Card",
    icon: CreditCard,
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-500",
  },
  {
    type: "wallet" as PaymentMethodType,
    label: "E-Wallet",
    icon: Smartphone,
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-500",
  },
];

export default function PaymentMethodSelector({ 
  selected, 
  onSelect, 
  disabled = false 
}: PaymentMethodSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {paymentMethods.map((method) => {
        const Icon = method.icon;
        const isSelected = selected === method.type;
        
        return (
          <motion.button
            key={method.type}
            type="button"
            onClick={() => !disabled && onSelect(method.type)}
            disabled={disabled}
            className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
              isSelected 
                ? `${method.bgColor} ${method.borderColor} shadow-lg` 
                : "border-gray-200 hover:border-gray-300 bg-white"
            } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            whileTap={!disabled ? { scale: 0.95 } : undefined}
          >
            <div className={`p-3 rounded-full ${
              isSelected 
                ? `bg-gradient-to-br ${method.color} text-white shadow-md` 
                : "bg-gray-100 text-gray-500"
            }`}>
              <Icon className="h-6 w-6" />
            </div>
            <span className={`text-sm font-semibold ${
              isSelected ? "text-gray-900" : "text-gray-600"
            }`}>
              {method.label}
            </span>
            
            {isSelected && (
              <motion.div
                layoutId="payment-indicator"
                className={`absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br ${method.color} flex items-center justify-center`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </motion.div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
